import * as THREE from 'three';
import { applyChalkboardText } from './chalkboard-text';

describe('applyChalkboardText', () => {
  let fillText: ReturnType<typeof vi.fn>;
  let rect: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fillText = vi.fn();
    rect = vi.fn();
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      fillText,
      rect,
      clearRect: vi.fn(),
      measureText: () => ({ width: 500 }),
      save: vi.fn(),
      restore: vi.fn(),
      beginPath: vi.fn(),
      clip: vi.fn(),
    } as unknown as CanvasRenderingContext2D);
  });

  afterEach(() => vi.restoreAllMocks());

  const makeModel = (name: string) => {
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(), new THREE.MeshBasicMaterial());
    mesh.name = name;
    const root = new THREE.Group();
    root.add(mesh);
    return { root, mesh };
  };

  it.each(['Chalkboard Text', 'Chalkboard_Text'])('replaces the material of "%s"', (name) => {
    const { root, mesh } = makeModel(name);
    applyChalkboardText(root, ['Hello']);

    const material = mesh.material as unknown as THREE.MeshStandardMaterial;
    expect(material).toBeInstanceOf(THREE.MeshStandardMaterial);
    expect(material.map?.flipY).toBe(false);
    expect(material.transparent).toBe(true);
  });

  it('leaves other meshes untouched', () => {
    const { root, mesh } = makeModel('Stop Sign Plate');
    const original = mesh.material;
    expect(applyChalkboardText(root, ['Hello'])).toBeUndefined();
    expect(mesh.material).toBe(original);
  });

  it('writes text progressively, then stops updating', () => {
    const { root } = makeModel('Chalkboard Text');
    // 15 characters at 20 chars/second takes 750 ms plus a short pause.
    const writer = applyChalkboardText(root, ['123456789012345'])!;
    const widthAt = () => rect.mock.calls.at(-1)![2] as number;

    expect(fillText).not.toHaveBeenCalled();

    expect(writer.update(1000)).toBe(true);
    expect(rect).not.toHaveBeenCalled();

    writer.update(1375);
    expect(widthAt()).toBe(250);

    writer.update(2000);
    expect(widthAt()).toBe(500);
    expect(writer.update(3000)).toBe(false);
  });

  it('draws the full text immediately when animation is disabled', () => {
    const { root } = makeModel('Chalkboard Text');
    const writer = applyChalkboardText(root, ['Hello'], false)!;

    expect(rect.mock.calls.at(-1)![2]).toBe(500);
    expect(writer.update(0)).toBe(false);
  });
});
