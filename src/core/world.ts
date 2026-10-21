import * as THREE from 'three';

export const WORLD_HALF = 62;

/** 지형 높이(m). 맵 지형이 생기면 여기서 샘플링한다. */
export function getGroundY(_x: number, _z: number): number {
  return 0;
}

export interface Obstacle { x: number; z: number; r: number }
export const obstacles: Obstacle[] = [];

export interface World { scene: THREE.Scene; camera: THREE.PerspectiveCamera; renderer: THREE.WebGLRenderer; sun: THREE.DirectionalLight }

export function createWorld(canvas: HTMLCanvasElement): World {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x8fa8bc);
  scene.fog = new THREE.Fog(0x8fa8bc, 36, 115);
  const camera = new THREE.PerspectiveCamera(70, 1, 0.1, 300);

  scene.add(new THREE.HemisphereLight(0xd4e8ff, 0x4a4538, 0.95));
  const sun = new THREE.DirectionalLight(0xfff4e0, 1.55);
  sun.position.set(30, 50, 20);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -40, right: 40, top: 40, bottom: -40, near: 1, far: 140 });
  scene.add(sun, sun.target);

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(WORLD_HALF * 2 + 40, WORLD_HALF * 2 + 40), new THREE.MeshLambertMaterial({ color: 0x5f6d48 }));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);
  const dirt = new THREE.Mesh(new THREE.CircleGeometry(14, 40), new THREE.MeshLambertMaterial({ color: 0x8a7656 }));
  dirt.rotation.x = -Math.PI / 2;
  dirt.position.y = 0.01;
  dirt.receiveShadow = true;
  scene.add(dirt);

  const resize = () => {
    renderer.setSize(innerWidth, innerHeight, false);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
  };
  addEventListener('resize', resize);
  resize();
  return { scene, camera, renderer, sun };
}

/** 원형 장애물과의 충돌을 밀어내기로 해결한다. */
export function resolveObstacles(p: { x: number; z: number }, radius: number) {
  for (const o of obstacles) {
    const dx = p.x - o.x, dz = p.z - o.z;
    const min = o.r + radius;
    const d2 = dx * dx + dz * dz;
    if (d2 < min * min && d2 > 1e-6) {
      const d = Math.sqrt(d2);
      p.x = o.x + (dx / d) * min;
      p.z = o.z + (dz / d) * min;
    }
  }
  p.x = Math.max(-WORLD_HALF, Math.min(WORLD_HALF, p.x));
  p.z = Math.max(-WORLD_HALF, Math.min(WORLD_HALF, p.z));
}
