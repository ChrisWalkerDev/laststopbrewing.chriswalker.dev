import * as THREE from 'three';

/**
 * Positions the camera so the model fits the current viewport aspect and its projected
 * bounds are centered on screen. Returns the point the camera looks at.
 */
export function frameModel(model: THREE.Object3D, camera: THREE.PerspectiveCamera): THREE.Vector3 {
  const bounds = new THREE.Box3().setFromObject(model);
  const center = bounds.getCenter(new THREE.Vector3());
  if (bounds.isEmpty()) {
    return center;
  }

  const size = bounds.getSize(new THREE.Vector3());
  const margin = 1.15;
  const tanV = Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
  const tanH = tanV * camera.aspect;
  const distance = Math.max(size.y / 2 / tanV, size.x / 2 / tanH) * margin + size.z / 2;

  camera.position.set(center.x, center.y, center.z + distance);
  camera.lookAt(center);
  camera.updateMatrixWorld(true);

  // Real vertices give the visible silhouette; the box corners overestimate with perspective.
  const points: THREE.Vector3[] = [];
  model.updateMatrixWorld(true);
  model.traverse((object) => {
    const position = (object as THREE.Mesh).isMesh
      ? (object as THREE.Mesh).geometry.getAttribute('position')
      : undefined;
    for (let i = 0; position && i < position.count; i++) {
      points.push(
        new THREE.Vector3().fromBufferAttribute(position, i).applyMatrix4(object.matrixWorld)
      );
    }
  });
  if (points.length === 0) {
    return center;
  }
  const target = center.clone();
  for (let i = 0; i < 3; i++) {
    const ndc = points.map((point) => point.clone().project(camera));
    const midX = (ndcMin(ndc, 'x') + ndcMax(ndc, 'x')) / 2;
    const midY = (ndcMin(ndc, 'y') + ndcMax(ndc, 'y')) / 2;
    const planeDistance = camera.position.distanceTo(target);
    const right = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0);
    const up = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 1);
    const pan = right
      .multiplyScalar(midX * tanH * planeDistance)
      .add(up.multiplyScalar(midY * tanV * planeDistance));
    camera.position.add(pan);
    target.add(pan);
    camera.lookAt(target);
    camera.updateMatrixWorld(true);
  }

  return target;
}

function ndcMin(points: THREE.Vector3[], axis: 'x' | 'y'): number {
  return points.reduce((min, p) => Math.min(min, p[axis]), Infinity);
}

function ndcMax(points: THREE.Vector3[], axis: 'x' | 'y'): number {
  return points.reduce((max, p) => Math.max(max, p[axis]), -Infinity);
}
