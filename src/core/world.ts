import * as THREE from 'three';
import { MAP } from '../data/map';
import { buildWorldView } from './worldview';

export const WORLD_HALF = MAP.half;

export interface Obstacle { x: number; z: number; r: number }
export const obstacles: Obstacle[] = [];

export interface World { scene: THREE.Scene; camera: THREE.PerspectiveCamera; renderer: THREE.WebGLRenderer; sun: THREE.DirectionalLight }

export function createWorld(canvas: HTMLCanvasElement): World {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xb8cde0);
  scene.fog = new THREE.Fog(0xb8cde0, 80, 380);
  const camera = new THREE.PerspectiveCamera(70, 1, 0.1, 1200);

  scene.add(new THREE.HemisphereLight(0xcfe3ff, 0x5a5040, 0.9));
  const sun = new THREE.DirectionalLight(0xfff1d0, 1.6);
  sun.position.set(30, 50, 20);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -45, right: 45, top: 45, bottom: -45, near: 1, far: 160 });
  scene.add(sun, sun.target);

  buildWorldView(scene);
  obstacles.length = 0;
  for (const p of MAP.props) obstacles.push({ x: p.x, z: p.z, r: p.r });

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

/** 그림자 카메라와 해를 플레이어 주변으로 옮겨 넓은 맵에서도 가까운 그림자가 선명하게 한다. */
export function followSun(world: World, x: number, z: number) {
  world.sun.target.position.set(x, 0, z);
  world.sun.position.set(x + 30, 50, z + 20);
  world.sun.target.updateMatrixWorld();
}
