import { isDevMode, DestroyRef, Injectable, NgZone, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { frameModel } from './frame-model';

const HOTSPOT_ROUTES: Readonly<Record<string, string>> = {
  hotspot_about: '/about',
  hotspot_beer: '/beer',
  hotspot_food: '/food',
  hotspot_contact: '/contact',
  hotspot_location: '/location',
  'Beer Stave': '/beer',
  Beer_Stave: '/beer',
  'Food Stave': '/food',
  Food_Stave: '/food',
};

function getHotspotRoute(name: string): string | undefined {
  return HOTSPOT_ROUTES[name];
}

@Injectable({
  providedIn: 'root',
})
export class HomeSceneService {
  readonly initialized = signal(false);
  readonly error = signal<string | null>(null);
  readonly hoveredHotspot = signal<string | null>(null);

  private readonly router = inject(Router);
  private readonly zone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);

  private scene?: THREE.Scene;
  private camera?: THREE.PerspectiveCamera;
  private renderer?: THREE.WebGLRenderer;
  private controls?: OrbitControls;
  private model?: THREE.Object3D;
  private readonly raycaster = new THREE.Raycaster();
  private readonly pointer = new THREE.Vector2();
  private readonly hotspots: THREE.Object3D[] = [];
  private initializationPromise?: Promise<void>;
  private container?: HTMLElement;
  private resizeObserver?: ResizeObserver;
  private animationFrameId?: number;
  private destroyed = false;
  private framed = false;

  private readonly introDurationMs = 5000;
  private readonly introOrbitRadians = Math.PI * 2;
  // Distances are multiples of the framed (final) camera distance.
  private readonly introStartDistanceScale = 3;
  // Polar angle (from straight up) is reduced by this much at the start, i.e. the camera begins high.
  private readonly introStartPolarOffset = THREE.MathUtils.degToRad(30);
  private readonly introMinPolar = THREE.MathUtils.degToRad(12);
  private introActive = false;
  private introStartTime?: number;
  private readonly introTarget = new THREE.Vector3();
  private readonly introEnd = new THREE.Spherical();
  private readonly introCurrent = new THREE.Spherical();
  private readonly introOffset = new THREE.Vector3();

  private readonly onPointerMove = (event: PointerEvent): void => {
    if (this.introActive) {
      return;
    }
    const intersection = this.findHotspot(event);
    this.hoveredHotspot.set(intersection?.name ?? null);
    if (this.renderer) {
      this.renderer.domElement.style.cursor = intersection ? 'pointer' : '';
    }
  };

  private readonly onPointerDown = (event: PointerEvent): void => {
    if (this.introActive || event.button !== 0) {
      return;
    }

    const hotspot = this.findHotspot(event);
    const route = hotspot ? getHotspotRoute(hotspot.name) : undefined;
    if (route) {
      void this.router.navigateByUrl(route).catch((error: unknown) => {
        if (isDevMode()) {
          console.error('Failed to navigate from a home-scene hotspot.', error);
        }
      });
    }
  };

  private readonly onResize = (): void => {
    this.resizeRenderer();
  };

  constructor() {
    this.destroyRef.onDestroy(() => this.destroy());
  }

  async attach(container: HTMLElement): Promise<void> {
    if (this.destroyed) {
      throw new Error('HomeSceneService has been destroyed.');
    }

    this.container = container;
    await this.ensureInitialized();

    if (!this.initialized() || this.container !== container) {
      return;
    }

    const renderer = this.renderer;
    if (!renderer) {
      return;
    }

    if (renderer.domElement.parentElement !== container) {
      container.appendChild(renderer.domElement);
    }

    renderer.domElement.addEventListener('pointermove', this.onPointerMove);
    renderer.domElement.addEventListener('pointerdown', this.onPointerDown);
    this.observeContainer(container);
    this.resizeRenderer();
    if (!this.framed && this.model && this.camera) {
      this.controls?.target.copy(frameModel(this.model, this.camera));
      this.framed = true;
      this.prepareIntro();
    }
    if (this.controls) {
      this.controls.enabled = !this.introActive;
    }
    this.startRenderLoop();
  }

  detach(): void {
    this.container = undefined;
    this.stopRenderLoop();
    this.stopObservingContainer();

    const canvas = this.renderer?.domElement;
    if (canvas) {
      canvas.removeEventListener('pointermove', this.onPointerMove);
      canvas.removeEventListener('pointerdown', this.onPointerDown);
      canvas.style.cursor = '';
      canvas.remove();
    }

    this.hoveredHotspot.set(null);
    this.introStartTime = undefined;
    if (this.controls) {
      this.controls.enabled = false;
    }
  }

  destroy(): void {
    if (this.destroyed) {
      return;
    }
    this.destroyed = true;
    this.detach();
    this.controls?.dispose();
    this.disposeModel();
    this.renderer?.dispose();
    this.renderer = undefined;
    this.camera = undefined;
    this.scene = undefined;
    this.controls = undefined;
    this.model = undefined;
    this.hotspots.length = 0;
    this.initialized.set(false);
  }

  private ensureInitialized(): Promise<void> {
    if (this.initialized()) {
      return Promise.resolve();
    }
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.error.set(null);
    const initialization = this.initialize().catch((error: unknown) => {
      this.disposeFailedInitialization();
      this.error.set('The 3D home scene could not be loaded. Use the navigation links instead.');
      if (isDevMode()) {
        console.error('Failed to initialize the 3D home scene.', error);
      }
    });
    this.initializationPromise = initialization;
    void initialization.finally(() => {
      if (this.initializationPromise === initialization) {
        this.initializationPromise = undefined;
      }
    });
    return initialization;
  }

  private async initialize(): Promise<void> {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x171310);

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 1.7, 7);
    camera.lookAt(0, 1.7, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(globalThis.devicePixelRatio || 1, 2));
    // Angular's scoped styles can't reach this canvas, so size it to the container inline.
    Object.assign(renderer.domElement.style, { display: 'block', width: '100%', height: '100%' });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;

    scene.add(new THREE.HemisphereLight(0xfff1d5, 0x34251c, 2));
    const keyLight = new THREE.DirectionalLight(0xffffff, 3);
    keyLight.position.set(-3, 6, 5);
    scene.add(keyLight);

    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.controls = new OrbitControls(camera, renderer.domElement);
    this.controls.target.set(0, 1.7, 0);
    this.controls.enableDamping = true;
    this.controls.minDistance = 2;
    this.controls.maxDistance = 14;
    // Keep the camera at or above the focal point's height.
    this.controls.maxPolarAngle = Math.PI / 2;

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');
    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);
    const gltf = await gltfLoader
      .loadAsync('/blender/home.glb')
      .finally(() => dracoLoader.dispose());

    if (this.destroyed) {
      this.model = gltf.scene;
      this.disposeModel();
      this.model = undefined;
      return;
    }

    this.model = gltf.scene;
    gltf.scene.traverse((object) => {
      if (getHotspotRoute(object.name)) {
        this.registerHotspot(object);
      }
    });
    scene.add(gltf.scene);
    this.initialized.set(true);
  }

  private registerHotspot(root: THREE.Object3D): void {
    root.traverse((object) => {
      if (!this.hotspots.includes(object)) {
        this.hotspots.push(object);
      }
    });
  }

  private findHotspot(event: PointerEvent): THREE.Object3D | undefined {
    const canvas = this.renderer?.domElement;
    const camera = this.camera;
    if (!canvas || !camera || this.hotspots.length === 0) {
      return undefined;
    }

    const bounds = canvas.getBoundingClientRect();
    if (bounds.width === 0 || bounds.height === 0) {
      return undefined;
    }

    this.pointer.set(
      ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
      -((event.clientY - bounds.top) / bounds.height) * 2 + 1
    );
    this.raycaster.setFromCamera(this.pointer, camera);
    const hit = this.raycaster.intersectObjects(this.hotspots, false)[0]?.object;
    return hit ? this.findMappedHotspot(hit) : undefined;
  }

  private findMappedHotspot(object: THREE.Object3D): THREE.Object3D | undefined {
    let current: THREE.Object3D | null = object;
    while (current) {
      if (getHotspotRoute(current.name)) {
        return current;
      }
      current = current.parent;
    }

    return undefined;
  }

  private observeContainer(container: HTMLElement): void {
    this.stopObservingContainer();

    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(this.onResize);
      this.resizeObserver.observe(container);
      return;
    }

    globalThis.addEventListener('resize', this.onResize);
  }

  private stopObservingContainer(): void {
    this.resizeObserver?.disconnect();
    this.resizeObserver = undefined;
    globalThis.removeEventListener('resize', this.onResize);
  }

  private resizeRenderer(): void {
    if (!this.container || !this.renderer || !this.camera) {
      return;
    }

    const { width, height } = this.container.getBoundingClientRect();
    const safeWidth = Math.max(width, 1);
    const safeHeight = Math.max(height, 1);
    this.renderer.setSize(safeWidth, safeHeight, false);
    this.camera.aspect = safeWidth / safeHeight;
    this.camera.updateProjectionMatrix();
  }

  private startRenderLoop(): void {
    if (this.animationFrameId !== undefined) {
      return;
    }

    this.zone.runOutsideAngular(() => {
      const render = (now: number): void => {
        this.animationFrameId = undefined;
        if (!this.container || !this.renderer || !this.scene || !this.camera) {
          return;
        }
        if (this.introActive) {
          this.updateIntro(now);
        } else {
          this.controls?.update();
        }
        this.renderer.render(this.scene, this.camera);
        this.animationFrameId = requestAnimationFrame(render);
      };
      this.animationFrameId = requestAnimationFrame(render);
    });
  }

  private prepareIntro(): void {
    const camera = this.camera;
    const controls = this.controls;
    if (!camera || !controls || globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    // The framed camera pose is the final pose; the intro is derived from it.
    this.introTarget.copy(controls.target);
    this.introOffset.copy(camera.position).sub(this.introTarget);
    this.introEnd.setFromVector3(this.introOffset);
    this.introStartTime = undefined;
    this.introActive = true;
    controls.enabled = false;
    this.applyIntroPose(0);
  }

  private updateIntro(now: number): void {
    this.introStartTime ??= now;
    const progress = THREE.MathUtils.clamp((now - this.introStartTime) / this.introDurationMs, 0, 1);
    this.applyIntroPose(progress);

    if (progress >= 1) {
      this.introActive = false;
      if (this.controls) {
        this.controls.enabled = true;
        this.controls.update();
      }
    }
  }

  private applyIntroPose(progress: number): void {
    const camera = this.camera;
    if (!camera) {
      return;
    }

    // Smootherstep ease-in-out: zero velocity at both ends.
    const eased = progress * progress * progress * (progress * (progress * 6 - 15) + 10);
    const end = this.introEnd;
    const startPhi = Math.max(end.phi - this.introStartPolarOffset, this.introMinPolar);
    const remaining = 1 - eased;

    this.introCurrent.set(
      THREE.MathUtils.lerp(end.radius * this.introStartDistanceScale, end.radius, eased),
      end.phi + (startPhi - end.phi) * remaining,
      end.theta + this.introOrbitRadians * remaining
    );
    camera.position.copy(this.introOffset.setFromSpherical(this.introCurrent)).add(this.introTarget);
    camera.lookAt(this.introTarget);
  }

  private stopRenderLoop(): void {
    if (this.animationFrameId !== undefined) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = undefined;
    }
  }

  private disposeFailedInitialization(): void {
    this.controls?.dispose();
    this.controls = undefined;
    this.disposeModel();
    this.renderer?.dispose();
    this.renderer?.domElement.remove();
    this.renderer = undefined;
    this.camera = undefined;
    this.scene = undefined;
    this.hotspots.length = 0;
    this.initialized.set(false);
  }

  private disposeModel(): void {
    this.model?.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) {
        return;
      }
      object.geometry.dispose();
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      for (const material of materials) {
        for (const value of Object.values(material)) {
          if (value instanceof THREE.Texture) {
            value.dispose();
          }
        }
        material.dispose();
      }
    });
  }
}
