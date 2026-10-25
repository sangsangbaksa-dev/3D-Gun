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
export interface BoxObstacle { x: number; z: number; hx: number; hz: number; rot?: number }
export const obstacles: Obstacle[] = [];
export const boxObstacles: BoxObstacle[] = [];

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

  obstacles.length = 0;
  boxObstacles.length = 0;
  addScenery(scene, obstacles, boxObstacles);
  buildWorldView(scene);
  new Atmosphere(scene, sun, hemi);
  registerPropObstacles(obstacles, boxObstacles);
  registerBoundaryObstacles(obstacles);
  registerMountainObstacles(obstacles);

  const resize = () => {
    renderer.setSize(innerWidth, innerHeight, false);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
  };
  addEventListener('resize', resize);
  resize();
  return { scene, camera, renderer, sun };
}

/** 직사각형(OBB)·원형 장애물과의 충돌을 밀어내기로 해결한다. */
export function resolveObstacles(p: { x: number; z: number }, radius: number) {
  for (const b of boxObstacles) {
    const rot = b.rot ?? 0;
    const cos = Math.cos(rot), sin = Math.sin(rot);
    const dx = p.x - b.x, dz = p.z - b.z;
    const lx = dx * cos - dz * sin;
    const lz = dx * sin + dz * cos;
    const cx = Math.max(-b.hx, Math.min(b.hx, lx));
    const cz = Math.max(-b.hz, Math.min(b.hz, lz));
    const ox = lx - cx, oz = lz - cz;
    const d2 = ox * ox + oz * oz;
    if (d2 < radius * radius) {
      let nlx = lx, nlz = lz;
      if (d2 > 1e-8) {
        const d = Math.sqrt(d2);
        nlx = cx + (ox / d) * radius;
        nlz = cz + (oz / d) * radius;
      } else {
        const px = b.hx - Math.abs(lx), pz = b.hz - Math.abs(lz);
        if (px < pz) nlx = (lx >= 0 ? 1 : -1) * (b.hx + radius);
        else nlz = (lz >= 0 ? 1 : -1) * (b.hz + radius);
      }
      p.x = b.x + nlx * cos + nlz * sin;
      p.z = b.z - nlx * sin + nlz * cos;
    }
  }
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

/** 건물·바리케이드·폐차의 실제 상자 치수(w × d, rot)에 맞춘 정밀 충돌 등록 */
export function registerPropObstacles(out: Obstacle[], boxes: BoxObstacle[]) {
  for (const p of MAP.props) {
    const rot = p.rot ?? 0;
    const cos = Math.cos(rot), sin = Math.sin(rot);
    if (p.kind === 'building' && p.w && p.d) {
      const hx = p.w / 2 + 0.16, hz = p.d / 2 + 0.16;
      boxes.push({ x: p.x, z: p.z, hx, hz, rot });
      const r = Math.min(hx, hz) * 0.96;
      if (hx >= hz) {
        const off = hx - r;
        for (const s of [-1, 1]) out.push({ x: p.x + s * off * cos, z: p.z - s * off * sin, r });
      } else {
        const off = hz - r;
        for (const s of [-1, 1]) out.push({ x: p.x + s * off * sin, z: p.z + s * off * cos, r });
      }
    } else if (p.kind === 'wall' && p.w && p.d) {
      const hx = p.w / 2, hz = (p.d * 1.2) / 2;
      boxes.push({ x: p.x, z: p.z, hx, hz, rot });
      const r = hz;
      const span = Math.max(0, hx - r);
      const steps = Math.max(2, Math.ceil((span * 2) / 1.1) + 1);
      for (let i = 0; i < steps; i++) {
        const lx = steps === 1 ? 0 : -span + (span * 2 * i) / (steps - 1);
        out.push({ x: p.x + lx * cos, z: p.z - lx * sin, r });
      }
    } else if (p.kind === 'car' && p.w && p.d) {
      const hx = p.w / 2, hz = p.d / 2;
      boxes.push({ x: p.x, z: p.z, hx, hz, rot });
      const r = hz * 0.95;
      const off = Math.max(0, hx - r);
      for (const s of [-1, 1]) out.push({ x: p.x + s * off * cos, z: p.z - s * off * sin, r });
    } else {
      out.push({ x: p.x, z: p.z, r: p.r });
    }
  }
}

/** 맵 가장자리 장벽 충돌. worldview 가시 벽 안쪽 면(H - 1.8)과 정확히 맞춘다 */
export function registerBoundaryObstacles(out: Obstacle[]) {
  const H = MAP.half;
  const edge = H - 0.6;
  const step = 4;
  const wallR = 1.2;
  for (let x = -H; x <= H; x += step) {
    out.push({ x, z: edge, r: wallR });
    out.push({ x, z: -edge, r: wallR });
  }
  for (let z = -H; z <= H; z += step) {
    out.push({ x: edge, z, r: wallR });
    out.push({ x: -edge, z, r: wallR });
  }
}

/** 배경 산맥(능선) 메시와 동일한 시드·위치·스케일에 맞춘 충돌 원을 둔다 */
export function registerMountainObstacles(out: Obstacle[]) {
  const H = MAP.half;
  let s = 5;
  const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  for (let i = 0; i < 96; i++) {
    const a = (i / 96) * Math.PI * 2 + (rnd() - 0.5) * 0.03;
    const sq = H / Math.max(Math.abs(Math.cos(a)), Math.abs(Math.sin(a)));
    const span = rnd(), _h = 15 + rnd() * 22, rad = 26 + rnd() * 18, _yaw = rnd();
    void _h; void _yaw;
    const d = sq + rad * 0.62 + 8 + span * 14;
    out.push({ x: Math.cos(a) * d, z: Math.sin(a) * d, r: rad * 0.58 });
  }
  for (let i = 0; i < 72; i++) {
    const a = (i / 72) * Math.PI * 2 + (rnd() - 0.5) * 0.04;
    const sq = H / Math.max(Math.abs(Math.cos(a)), Math.abs(Math.sin(a)));
    const span = rnd(), _h = 28 + rnd() * 36, rad = 38 + rnd() * 26, _yaw = rnd();
    void _h; void _yaw;
    const d = sq + rad * 0.68 + 34 + span * 24;
    out.push({ x: Math.cos(a) * d, z: Math.sin(a) * d, r: rad * 0.65 });
  }
}

/** 그림자 카메라와 해를 플레이어 주변으로 옮겨 넓은 맵에서도 가까운 그림자가 선명하게 한다. */
export function followSun(world: World, x: number, z: number) {
  world.sun.target.position.set(x, 0, z);
  world.sun.position.set(x + 30, 50, z + 20);
  world.sun.target.updateMatrixWorld();
}
