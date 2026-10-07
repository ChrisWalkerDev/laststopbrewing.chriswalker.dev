import { NgZone } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HomeSceneService } from './home-scene.service';

const threeMocks = vi.hoisted(() => ({
  loadAsync: vi.fn(),
  intersectObjects: vi.fn((): { object: { name: string } }[] => []),
  renderers: [] as {
    domElement: HTMLCanvasElement;
    setPixelRatio: ReturnType<typeof vi.fn>;
    setSize: ReturnType<typeof vi.fn>;
    render: ReturnType<typeof vi.fn>;
    dispose: ReturnType<typeof vi.fn>;
  }[],
  cameras: [] as {
    aspect: number;
    updateProjectionMatrix: ReturnType<typeof vi.fn>;
  }[],
}));

vi.mock('three', () => {
  class Scene {
    background?: unknown;
    add = vi.fn();
  }

  class PerspectiveCamera {
    aspect = 1;
    fov = 45;
    position = { set: vi.fn(), add: vi.fn(), distanceTo: vi.fn(() => 1) };
    matrixWorld = {};
    lookAt = vi.fn();
    updateMatrixWorld = vi.fn();
    updateProjectionMatrix = vi.fn();

    constructor() {
      threeMocks.cameras.push(this);
    }
  }

  class WebGLRenderer {
    domElement = document.createElement('canvas');
    setPixelRatio = vi.fn();
    setSize = vi.fn();
    render = vi.fn();
    dispose = vi.fn();

    constructor() {
      threeMocks.renderers.push(this);
    }
  }

  class Vector2 {
    set = vi.fn();
  }

  class Vector3 {
    x = 0;
    y = 0;
    z = 0;
    clone = () => this;
    project = () => this;
    add = () => this;
    multiplyScalar = () => this;
    setFromMatrixColumn = () => this;
    fromBufferAttribute = () => this;
    applyMatrix4 = () => this;
  }

  class Box3 {
    min = Object.assign(new Vector3(), { x: 0, y: 0, z: 0 });
    max = Object.assign(new Vector3(), { x: 2, y: 4, z: 1 });
    setFromObject = vi.fn(() => this);
    isEmpty = vi.fn(() => false);
    getCenter = vi.fn(() => Object.assign(new Vector3(), { x: 1, y: 2, z: 3 }));
    getSize = vi.fn(() => Object.assign(new Vector3(), { x: 2, y: 4, z: 1 }));
  }

  class Raycaster {
    setFromCamera = vi.fn();
    intersectObjects = threeMocks.intersectObjects;
  }

  class Light {
    position = { set: vi.fn() };
  }

  return {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    Vector2,
    Vector3,
    Box3,
    Raycaster,
    MathUtils: { degToRad: (degrees: number) => (degrees * Math.PI) / 180 },
    HemisphereLight: Light,
    DirectionalLight: Light,
    Color: class {},
    Mesh: class {},
    Texture: class {},
    SRGBColorSpace: 'srgb',
    ACESFilmicToneMapping: 1,
  };
});

vi.mock('three/addons/controls/OrbitControls.js', () => ({
  OrbitControls: class {
    target = { set: vi.fn(), copy: vi.fn() };
    enabled = true;
    enableDamping = false;
    minDistance = 0;
    maxDistance = 0;
    update = vi.fn();
    dispose = vi.fn();
  },
}));

vi.mock('three/addons/loaders/DRACOLoader.js', () => ({
  DRACOLoader: class {
    setDecoderPath = vi.fn();
    dispose = vi.fn();
  },
}));

vi.mock('three/addons/loaders/GLTFLoader.js', () => ({
  GLTFLoader: class {
    loadAsync = threeMocks.loadAsync;
    setDRACOLoader = vi.fn();
  },
}));

describe('HomeSceneService', () => {
  let service: HomeSceneService;
  let navigateByUrl: ReturnType<typeof vi.fn>;
  let frameCallbacks: Map<number, FrameRequestCallback>;
  let resizeObservers: {
    observe: ReturnType<typeof vi.fn>;
    disconnect: ReturnType<typeof vi.fn>;
    trigger: () => void;
  }[];
  let nextFrameId: number;

  const makeModel = (names: string[]) => {
    const hotspots = names.map((name) => ({ name }));
    return {
      hotspots,
      scene: {
        name: 'root',
        updateMatrixWorld: vi.fn(),
        traverse: (callback: (object: { name: string }) => void) => {
          callback({ name: 'root' });
          hotspots.forEach(callback);
        },
      },
    };
  };

  const makeContainer = (width = 800, height = 400): HTMLElement => {
    const container = document.createElement('div');
    Object.defineProperty(container, 'getBoundingClientRect', {
      value: () => ({ left: 0, top: 0, width, height, right: width, bottom: height }),
      configurable: true,
    });
    document.body.appendChild(container);
    return container;
  };

  beforeEach(() => {
    threeMocks.renderers.length = 0;
    threeMocks.cameras.length = 0;
    threeMocks.intersectObjects.mockReset().mockReturnValue([]);
    threeMocks.loadAsync.mockReset();
    threeMocks.loadAsync.mockResolvedValue(makeModel(['hotspot_about']));
    frameCallbacks = new Map();
    nextFrameId = 0;
    resizeObservers = [];

    vi.stubGlobal(
      'requestAnimationFrame',
      vi.fn((callback: FrameRequestCallback) => {
        const id = ++nextFrameId;
        frameCallbacks.set(id, callback);
        return id;
      })
    );
    vi.stubGlobal(
      'cancelAnimationFrame',
      vi.fn((id: number) => {
        frameCallbacks.delete(id);
      })
    );
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe = vi.fn();
        disconnect = vi.fn();
        callback: ResizeObserverCallback;

        constructor(callback: ResizeObserverCallback) {
          this.callback = callback;
          resizeObservers.push(this);
        }

        trigger(): void {
          this.callback([], this as unknown as ResizeObserver);
        }
      }
    );

    navigateByUrl = vi.fn().mockResolvedValue(true);
    TestBed.configureTestingModule({
      providers: [
        HomeSceneService,
        { provide: Router, useValue: { navigateByUrl } },
        { provide: NgZone, useValue: { runOutsideAngular: (callback: () => void) => callback() } },
      ],
    });
    service = TestBed.inject(HomeSceneService);
  });

  afterEach(() => {
    service.destroy();
    document.body.replaceChildren();
    vi.unstubAllGlobals();
    TestBed.resetTestingModule();
  });

  it('creates without initializing Three.js', () => {
    expect(service).toBeTruthy();
    expect(service.initialized()).toBe(false);
    expect(threeMocks.renderers).toHaveLength(0);
  });

  it('loads the GLB once and reuses the scene, renderer, and render loop', async () => {
    const container = makeContainer();
    await Promise.all([service.attach(container), service.attach(container)]);

    expect(threeMocks.loadAsync).toHaveBeenCalledOnce();
    expect(threeMocks.loadAsync).toHaveBeenCalledWith('/blender/home.glb');
    expect(threeMocks.renderers).toHaveLength(1);
    expect(requestAnimationFrame).toHaveBeenCalledOnce();
    expect(frameCallbacks.size).toBe(1);
  });

  it('centers the camera on the loaded model', async () => {
    await service.attach(makeContainer());

    const camera = threeMocks.cameras[0] as unknown as {
      position: { set: ReturnType<typeof vi.fn> };
      lookAt: ReturnType<typeof vi.fn>;
    };
    const [x, y, z] = camera.position.set.mock.calls.at(-1) as number[];
    expect(x).toBe(1);
    expect(y).toBe(2);
    expect(z).toBeGreaterThan(3);
    expect(camera.lookAt).toHaveBeenLastCalledWith(expect.objectContaining({ x: 1, y: 2, z: 3 }));
  });

  it('preserves the loaded scene and renderer across detach and reattach', async () => {
    const firstContainer = makeContainer();
    await service.attach(firstContainer);
    service.detach();

    expect(service.initialized()).toBe(true);
    expect(threeMocks.renderers[0].dispose).not.toHaveBeenCalled();

    const secondContainer = makeContainer();
    await service.attach(secondContainer);

    expect(threeMocks.loadAsync).toHaveBeenCalledOnce();
    expect(threeMocks.renderers).toHaveLength(1);
    expect(threeMocks.renderers[0].domElement.parentElement).toBe(secondContainer);
  });

  it('navigates only through the explicit route mapping for discovered hotspots', async () => {
    const model = makeModel(['hotspot_about', 'hotspot_untrusted', 'Beer Stave']);
    threeMocks.loadAsync.mockResolvedValue(model);
    const container = makeContainer();
    await service.attach(container);
    const canvas = threeMocks.renderers[0].domElement;
    Object.defineProperty(canvas, 'getBoundingClientRect', {
      value: () => ({ left: 0, top: 0, width: 100, height: 100 }),
    });

    threeMocks.intersectObjects.mockReturnValue([{ object: model.hotspots[0] }]);
    canvas.dispatchEvent(new MouseEvent('pointerdown', { button: 0, clientX: 50, clientY: 50 }));
    expect(navigateByUrl).toHaveBeenCalledWith('/about');

    navigateByUrl.mockClear();
    threeMocks.intersectObjects.mockReturnValue([{ object: model.hotspots[2] }]);
    canvas.dispatchEvent(new MouseEvent('pointerdown', { button: 0, clientX: 50, clientY: 50 }));
    expect(navigateByUrl).toHaveBeenCalledWith('/beer');

    navigateByUrl.mockClear();
    threeMocks.intersectObjects.mockReturnValue([{ object: model.hotspots[1] }]);
    canvas.dispatchEvent(new MouseEvent('pointerdown', { button: 0, clientX: 50, clientY: 50 }));
    expect(navigateByUrl).not.toHaveBeenCalled();

    threeMocks.intersectObjects.mockReturnValue([]);
    canvas.dispatchEvent(new MouseEvent('pointerdown', { button: 0, clientX: 50, clientY: 50 }));
    expect(navigateByUrl).not.toHaveBeenCalled();
  });

  it('updates the hover signal and cursor for a hotspot', async () => {
    const model = makeModel(['hotspot_about']);
    threeMocks.loadAsync.mockResolvedValue(model);
    await service.attach(makeContainer());
    const canvas = threeMocks.renderers[0].domElement;
    Object.defineProperty(canvas, 'getBoundingClientRect', {
      value: () => ({ left: 0, top: 0, width: 100, height: 100 }),
    });
    threeMocks.intersectObjects.mockReturnValue([{ object: model.hotspots[0] }]);

    canvas.dispatchEvent(new MouseEvent('pointermove', { clientX: 50, clientY: 50 }));

    expect(service.hoveredHotspot()).toBe('hotspot_about');
    expect(canvas.style.cursor).toBe('pointer');
  });

  it('surfaces load failures and allows initialization to be retried', async () => {
    threeMocks.loadAsync
      .mockRejectedValueOnce(new Error('load failed'))
      .mockResolvedValueOnce(makeModel(['hotspot_food']));

    await service.attach(makeContainer());
    expect(service.error()).toContain('could not be loaded');
    expect(service.initialized()).toBe(false);

    await service.attach(makeContainer());
    expect(threeMocks.loadAsync).toHaveBeenCalledTimes(2);
    expect(service.error()).toBeNull();
    expect(service.initialized()).toBe(true);
  });

  it('resizes the renderer and camera to match the container', async () => {
    await service.attach(makeContainer(800, 400));
    const renderer = threeMocks.renderers[0];
    const camera = threeMocks.cameras[0];
    expect(renderer.setSize).toHaveBeenLastCalledWith(800, 400, false);
    expect(camera.aspect).toBe(2);

    Object.defineProperty(serviceContainer(renderer.domElement), 'getBoundingClientRect', {
      value: () => ({ left: 0, top: 0, width: 600, height: 400 }),
      configurable: true,
    });
    resizeObservers[0].trigger();

    expect(renderer.setSize).toHaveBeenLastCalledWith(600, 400, false);
    expect(camera.aspect).toBe(1.5);
    expect(camera.updateProjectionMatrix).toHaveBeenCalledTimes(2);
  });

  it('disconnects listeners and observers on detach, then disposes on destruction', async () => {
    const container = makeContainer();
    await service.attach(container);
    const canvas = threeMocks.renderers[0].domElement;
    const observer = resizeObservers[0];
    const raycastCalls = threeMocks.intersectObjects.mock.calls.length;

    service.detach();
    canvas.dispatchEvent(new MouseEvent('pointermove', { clientX: 50, clientY: 50 }));
    expect(threeMocks.intersectObjects).toHaveBeenCalledTimes(raycastCalls);
    expect(observer.disconnect).toHaveBeenCalledOnce();
    expect(frameCallbacks.size).toBe(0);
    expect(threeMocks.renderers[0].dispose).not.toHaveBeenCalled();

    service.destroy();
    expect(threeMocks.renderers[0].dispose).toHaveBeenCalledOnce();
  });
});

function serviceContainer(canvas: HTMLCanvasElement): HTMLElement {
  return canvas.parentElement as HTMLElement;
}
