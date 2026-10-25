import * as THREE from 'three';
import { MAP } from '../data/map';
import { buildWorldView } from './worldview';
import { terrainY } from './terrain';
import { addScenery } from './scenery';
import { Atmosphere } from './atmosphere';

/** 플레이어·좀비가 나갈 수 없는 반경. 가장자리 장벽 안쪽과 맞춘다 */
export const WORLD_HALF = MAP.half;
export const BOUNDARY_INSET = 2.2;
export const PLAY_HALF = MAP.half - BOUNDARY_INSET;

/** 지형 높이(m). 기지는 평평하고 바깥은 언덕이다. */
export function getGroundY(x: number, z: number): number {
  return terrainY(x, z);
}

export interface Obstacle { x: number; z: number; r: number }
export const obstacles: Obstacle[] = [];

export interface World { scene: THREE.Scene; camera: THREE.PerspectiveCamera; renderer: THREE.WebGLRenderer; sun: THREE.DirectionalLight }

export function createWorld(canvas: HTMLCanvasElement): World {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  const scene = new THREE.Scene();
  // 색·강도는 Atmosphere 가 페이즈(준비/전투/종료)에 맞춰 매 프레임 덮어쓴다
  scene.background = new THREE.Color(0x10141a);
  scene.fog = new THREE.Fog(0x8a4a2a, 40, 140);
  const camera = new THREE.PerspectiveCamera(70, 1, 0.1, 1200);

  const hemi = new THREE.HemisphereLight(0x2ee6d6, 0x3a332c, 1);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xff8a2a, 1.6);
  sun.position.set(30, 50, 20);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -45, right: 45, top: 45, bottom: -45, near: 1, far: 160 });
  scene.add(sun, sun.target);

  addScenery(scene, obstacles);
  buildWorldView(scene);
  new Atmosphere(scene, sun, hemi);
  for (const p of MAP.props) obstacles.push({ x: p.x, z: p.z, r: p.r });
  registerBoundaryObstacles(obstacles);

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
  p.x = Math.max(-PLAY_HALF, Math.min(PLAY_HALF, p.x));
  p.z = Math.max(-PLAY_HALF, Math.min(PLAY_HALF, p.z));
}

/** 맵 가장자리 장벽 충돌(원형 근사). createWorld 에서 obstacles 에 등록한다 */
export function registerBoundaryObstacles(out: Obstacle[]) {
  const H = MAP.half;
  const step = 14;
  const wallR = 2.4;
  for (let x = -H; x <= H; x += step) {
    out.push({ x, z: H - BOUNDARY_INSET * 0.5, r: wallR });
    out.push({ x, z: -H + BOUNDARY_INSET * 0.5, r: wallR });
  }
  for (let z = -H; z <= H; z += step) {
    out.push({ x: H - BOUNDARY_INSET * 0.5, z, r: wallR });
    out.push({ x: -H + BOUNDARY_INSET * 0.5, z, r: wallR });
  }
  // 모서리를 더 촘촘히 막는다
  const c = H - BOUNDARY_INSET * 0.5;
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    out.push({ x: sx * c, z: sz * c, r: wallR * 1.35 });
  }
}

/** 그림자 카메라와 해를 플레이어 주변으로 옮겨 넓은 맵에서도 가까운 그림자가 선명하게 한다. */
export function followSun(world: World, x: number, z: number) {
  world.sun.target.position.set(x, 0, z);
  world.sun.position.set(x + 30, 50, z + 20);
  world.sun.target.updateMatrixWorld();
}
