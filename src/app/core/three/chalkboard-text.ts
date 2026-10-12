import * as THREE from 'three';

// GLTFLoader strips spaces from node names, so accept both spellings.
const CHALKBOARD_TEXT_NAMES: readonly string[] = ['Chalkboard Text', 'Chalkboard_Text'];

export const EXAMPLE_CHALKBOARD_LINES: readonly string[] = [
  "TODAY'S POURS",
  '',
  'Last Stop Lager',
  'Hazy Crossing IPA',
  'Porter Station Stout',
];

const CANVAS_WIDTH = 1024;
const CANVAS_HEIGHT = 1728; // Matches the 0.89 x 1.5 board aspect ratio.
const CHALK_COLOR = '#f4f1e8';
const LINE_HEIGHT = 130;
const FONT = 'bold 96px "Segoe Print", "Bradley Hand", "Comic Sans MS", cursive';
const CHARS_PER_SECOND = 25;
const LINE_PAUSE_MS = 250;

export interface ChalkboardWriter {
  /** Advances the writing animation; returns true while the texture is still changing. */
  update(now: number): boolean;
}

class CanvasChalkboardWriter implements ChalkboardWriter {
  readonly texture: THREE.CanvasTexture;
  private readonly lineStarts: number[] = [];
  private readonly lineDurations: number[] = [];
  private readonly totalMs: number;
  private startTime?: number;
  private finished: boolean;

  constructor(
    canvas: HTMLCanvasElement,
    private readonly context: CanvasRenderingContext2D,
    private readonly lines: readonly string[],
    animate: boolean
  ) {
    let elapsed = 0;
    for (const line of lines) {
      const duration = (line.length / CHARS_PER_SECOND) * 1000;
      this.lineStarts.push(elapsed);
      this.lineDurations.push(duration);
      elapsed += duration + (line.length > 0 ? LINE_PAUSE_MS : 0);
    }
    this.totalMs = elapsed;

    this.texture = new THREE.CanvasTexture(canvas);
    this.texture.colorSpace = THREE.SRGBColorSpace;
    // glTF UVs have a top-left origin, so the canvas must not be flipped.
    this.texture.flipY = false;
    this.texture.anisotropy = 8;

    this.draw(animate ? 0 : this.totalMs);
    this.finished = !animate;
  }

  update(now: number): boolean {
    if (this.finished) {
      return false;
    }
    this.startTime ??= now;
    const elapsed = now - this.startTime;
    this.draw(elapsed);
    this.finished = elapsed >= this.totalMs;
    return true;
  }

  private draw(elapsedMs: number): void {
    const ctx = this.context;
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.fillStyle = CHALK_COLOR;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.font = FONT;

    const maxWidth = CANVAS_WIDTH * 0.9;
    const startY = (CANVAS_HEIGHT - (this.lines.length - 1) * LINE_HEIGHT) / 2;
    this.lines.forEach((line, index) => {
      const written = elapsedMs - this.lineStarts[index];
      if (!line || written <= 0) {
        return;
      }

      const width = Math.min(ctx.measureText(line).width, maxWidth);
      const x = (CANVAS_WIDTH - width) / 2;
      const y = startY + index * LINE_HEIGHT;
      const fraction = Math.min(written / this.lineDurations[index], 1);

      // Reveal left to right, like a hand moving across the line.
      ctx.save();
      ctx.beginPath();
      ctx.rect(x, y - LINE_HEIGHT / 2, width * fraction, LINE_HEIGHT);
      ctx.clip();
      ctx.fillText(line, x, y, maxWidth);
      ctx.restore();
    });

    this.texture.needsUpdate = true;
  }
}

export function applyChalkboardText(
  model: THREE.Object3D,
  lines: readonly string[] = EXAMPLE_CHALKBOARD_LINES,
  animate = true
): ChalkboardWriter | undefined {
  let writer: CanvasChalkboardWriter | undefined;

  model.traverse((object) => {
    if (writer || !CHALKBOARD_TEXT_NAMES.includes(object.name) || !(object instanceof THREE.Mesh)) {
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    writer = new CanvasChalkboardWriter(canvas, context, lines, animate);

    const previous = Array.isArray(object.material) ? object.material : [object.material];
    previous.forEach((material: THREE.Material) => material.dispose());

    object.material = new THREE.MeshStandardMaterial({
      map: writer.texture,
      transparent: true,
      roughness: 1,
      metalness: 0,
      depthWrite: false,
    });
  });

  return writer;
}
