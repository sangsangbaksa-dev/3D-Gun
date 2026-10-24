// 맵을 채우는 지형 메시와 조형물. 규칙은 없고, 큰 조형물만 원형 장애물이 된다.
import * as THREE from 'three';
import type { Obstacle } from './world';
import { MAP } from '../data/map';
import { terrainY } from './terrain';

const HALF = MAP.half;

const matCache = new Map<number, THREE.MeshLambertMaterial>();
const mat = (color: number) => {
  let m = matCache.get(color);
  if (!m) { m = new THREE.MeshLambertMaterial({ color }); matCache.set(color, m); }
  return m;
};
const box = (parent: THREE.Object3D, w: number, h: number, d: number, color: number, x: number, y: number, z: number) => {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(color));
  m.position.set(x, y + h / 2, z);
  m.castShadow = m.receiveShadow = true;
  parent.add(m);
  return m;
};
const cyl = (parent: THREE.Object3D, rt: number, rb: number, h: number, color: number, x: number, y: number, z: number, seg = 10) => {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat(color));
  m.position.set(x, y + h / 2, z);
  m.castShadow = m.receiveShadow = true;
  parent.add(m);
  return m;
};

// 지면 색: 어두운 잿빛 사막 바탕에 구역별 색을 번지게 섞고, 레인은 마른 흙길로 칠한다.
const hash = (x: number, z: number) => { const v = Math.sin(x * 127.1 + z * 311.7) * 43758.5453; return v - Math.floor(v); };
function vnoise(x: number, z: number) {
  const ix = Math.floor(x), iz = Math.floor(z), fx = x - ix, fz = z - iz;
  const u = fx * fx * (3 - 2 * fx), v = fz * fz * (3 - 2 * fz);
  const a = hash(ix, iz), b = hash(ix + 1, iz), c = hash(ix, iz + 1), d = hash(ix + 1, iz + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
const fbm = (x: number, z: number) => vnoise(x, z) * 0.5 + vnoise(x * 2.1, z * 2.1) * 0.3 + vnoise(x * 4.3, z * 4.3) * 0.2;
const sstep = (a: number, b: number, t: number) => { const k = Math.max(0, Math.min(1, (t - a) / (b - a))); return k * k * (3 - 2 * k); };
const rgb = (h: number): [number, number, number] => [((h >> 16) & 255) / 255, ((h >> 8) & 255) / 255, (h & 255) / 255];
const mix3 = (p: number[], q: number[], t: number): [number, number, number] => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t, p[2] + (q[2] - p[2]) * t];
const ZONE_TONE: Record<string, number> = { base: 0x22303a, forest: 0x2c4a24, quarry: 0x5a5248, mine: 0x26201e, field: 0x5c4a26, ruins: 0x343240, wasteland: 0x4a3226, boss: 0x4a1e24 };
const ZONE_LIGHT: Record<string, number> = { base: 1.08, field: 1.12, forest: 0.92, quarry: 1.06, boss: 0.9, mine: 0.94, ruins: 1, wasteland: 1.04 };
const GROUND = 0x33291f, TRAIL = 0x7a6242, SHOULDER = 0x241c14;
function laneDist(x: number, z: number) {
  let best = 1e9;
  for (const l of MAP.lanes) for (let i = 0; i < l.waypoints.length - 1; i++) {
    const a = l.waypoints[i], b = l.waypoints[i + 1], dx = b.x - a.x, dz = b.z - a.z;
    const t = Math.max(0, Math.min(1, ((x - a.x) * dx + (z - a.z) * dz) / (dx * dx + dz * dz || 1)));
    best = Math.min(best, Math.hypot(x - a.x - dx * t, z - a.z - dz * t));
  }
  return best;
}
function groundTone(x: number, z: number, y: number): [number, number, number] {
  const e = fbm(x * 0.08, z * 0.08);
  let col = rgb(GROUND), light = 1;
  for (const q of MAP.zones) {
    const w = 1 - sstep(q.r - 5, q.r + 5, Math.hypot(x - q.x, z - q.z) + (e - 0.5) * 6);
    if (w > 0) { col = mix3(col, rgb(ZONE_TONE[q.kind] ?? GROUND), w); light += ((ZONE_LIGHT[q.kind] ?? 1) - light) * w; }
  }
  const cross = Math.min(Math.abs(x), Math.abs(z)) + (Math.hypot(x, z) < 15 ? 99 : 0);
  const ld = Math.min(laneDist(x, z), cross);
  // 길 어깨: 흙길 가장자리를 어둡게 눌러 길의 윤곽이 멀리서도 읽히게 한다
  col = mix3(col, rgb(SHOULDER), (1 - sstep(3.2, 7.5, ld + (e - 0.5) * 3)) * 0.55);
  col = mix3(col, rgb(TRAIL), 1 - sstep(1.8, 5.2, ld + (e - 0.5) * 3));
  col = mix3(col, y > 0 ? rgb(0x3b3222) : rgb(0x14181a), Math.min(0.25, Math.abs(y) * 0.15));
  const patch = sstep(0.55, 0.75, fbm(x * 0.025 + 17, z * 0.025 - 9)) * 0.16;
  const grain = (fbm(x * 0.9, z * 0.9) - 0.5) * 0.08;
  const k = (0.82 + e * 0.36) * 2.2 * light * (1 - patch + grain);
  return [col[0] * k, col[1] * k, col[2] * k];
}

function addTerrain(scene: THREE.Scene) {
  const span = HALF * 2 + 40;
  const seg = 220;
  const geo = new THREE.PlaneGeometry(span, span, seg, seg);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  const c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), z = pos.getZ(i);
    const y = terrainY(x, z);
    pos.setY(i, y);
    const [r, g, b] = groundTone(x, z, y);
    c.setRGB(r, g, b, THREE.SRGBColorSpace);
    colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geo.computeVertexNormals();
  const mesh = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ vertexColors: true }));
  mesh.receiveShadow = true;
  scene.add(mesh);
}

type Kind = 'obelisk' | 'arch' | 'statue' | 'tank' | 'crane' | 'bus' | 'containers' | 'billboard' | 'shrine' | 'well' | 'antenna' | 'wall' | 'rocks' | 'cart' | 'totem';

function buildProp(kind: Kind, g: THREE.Group) {
  if (kind === 'obelisk') {
    box(g, 1.4, 0.35, 1.4, 0x9a9286, 0, 0, 0);
    cyl(g, 0.28, 0.45, 4.2, 0xc8bfb0, 0, 0.35, 0, 6);
    box(g, 0.55, 0.2, 0.55, 0x6e665c, 0, 4.5, 0);
  } else if (kind === 'arch') {
    box(g, 0.55, 3.2, 0.7, 0x8d8478, -1.5, 0, 0);
    box(g, 0.55, 2.4, 0.7, 0x8d8478, 1.5, 0, 0);
    box(g, 3.6, 0.45, 0.75, 0xa39888, 0, 2.7, 0);
    box(g, 0.7, 0.5, 0.7, 0x6a6258, 1.7, 0, 0.4);
  } else if (kind === 'statue') {
    cyl(g, 0.7, 0.85, 0.4, 0x6e675c, 0, 0, 0);
    cyl(g, 0.22, 0.28, 1.5, 0xd7d0c4, 0, 0.4, 0);
    cyl(g, 0.22, 0.22, 0.28, 0xe6dfd2, 0, 1.9, 0, 8);
    box(g, 0.7, 0.12, 0.18, 0xb7aa96, 0, 1.55, 0);
  } else if (kind === 'tank') {
    cyl(g, 0.12, 0.16, 2.4, 0x5c656c, -0.7, 0, -0.7, 6);
    cyl(g, 0.12, 0.16, 2.4, 0x5c656c, 0.7, 0, 0.7, 6);
    cyl(g, 1.15, 1.15, 1.5, 0x8a5a3a, 0, 2.4, 0, 14);
    cyl(g, 0.35, 0.35, 0.5, 0x6a6e72, 0, 3.9, 0, 8);
  } else if (kind === 'crane') {
    box(g, 1.2, 0.3, 1.2, 0x4a4036, 0, 0, 0);
    box(g, 0.28, 5.5, 0.28, 0xc2a24a, 0, 0.3, 0);
    box(g, 3.4, 0.16, 0.16, 0xd0b45a, 1.2, 5.5, 0);
    box(g, 0.08, 1.6, 0.08, 0x222222, 2.6, 3.9, 0);
  } else if (kind === 'bus') {
    box(g, 3.6, 1.15, 1.25, 0xb23a32, 0, 0.35, 0);
    box(g, 1.1, 0.45, 1.28, 0x8fd0e8, 0.9, 1.15, 0);
    cyl(g, 0.28, 0.28, 0.2, 0x222222, -1.2, 0.15, 0.55, 8).rotation.z = Math.PI / 2;
    cyl(g, 0.28, 0.28, 0.2, 0x222222, 1.15, 0.15, -0.55, 8).rotation.z = Math.PI / 2;
  } else if (kind === 'containers') {
    box(g, 2.4, 1.15, 1.05, 0x2f6f8a, -0.3, 0, 0);
    box(g, 2.2, 1.05, 1.0, 0xc45a2a, 0.5, 1.15, 0.15);
    box(g, 1.4, 0.9, 0.9, 0x3d6b45, 1.5, 0, 1.1);
  } else if (kind === 'billboard') {
    cyl(g, 0.08, 0.1, 3.2, 0x666666, -0.8, 0, 0, 6);
    cyl(g, 0.08, 0.1, 3.2, 0x666666, 0.8, 0, 0, 6);
    box(g, 2.6, 1.3, 0.08, 0xd8d2c4, 0, 3.15, 0);
    box(g, 2.2, 0.9, 0.02, 0xc4483a, 0, 3.2, 0.05);
  } else if (kind === 'shrine') {
    cyl(g, 1.3, 1.45, 0.25, 0x6a6358, 0, 0, 0, 8);
    box(g, 0.22, 2.2, 0.22, 0x8a3a32, -0.7, 0.25, 0);
    box(g, 0.22, 2.2, 0.22, 0x8a3a32, 0.7, 0.25, 0);
    box(g, 2.0, 0.18, 0.28, 0x222222, 0, 2.45, 0);
    cyl(g, 0.18, 0.22, 0.7, 0xd9d3c6, 0, 0.25, 0, 6);
  } else if (kind === 'well') {
    cyl(g, 0.7, 0.85, 0.9, 0x8a8174, 0, 0, 0, 10);
    cyl(g, 0.42, 0.42, 0.2, 0x1c2428, 0, 0.75, 0, 8);
    box(g, 0.1, 1.5, 0.1, 0x6b5340, -0.55, 0.9, 0);
    box(g, 0.1, 1.5, 0.1, 0x6b5340, 0.55, 0.9, 0);
    box(g, 1.3, 0.1, 0.1, 0x6b5340, 0, 2.35, 0);
  } else if (kind === 'antenna') {
    cyl(g, 0.35, 0.5, 0.3, 0x555555, 0, 0, 0, 6);
    cyl(g, 0.06, 0.12, 6.5, 0xc5c8cc, 0, 0.3, 0, 6);
    box(g, 1.4, 0.06, 0.06, 0xdddddd, 0, 4.2, 0);
    box(g, 0.9, 0.05, 0.05, 0xdddddd, 0, 5.2, 0);
  } else if (kind === 'wall') {
    box(g, 3.2, 1.6, 0.4, 0x8a8176, 0, 0, 0);
    box(g, 0.8, 0.7, 0.45, 0x6e675e, 1.4, 0, 0.3);
    box(g, 0.35, 0.9, 0.35, 0x7a736a, -1.2, 1.6, 0);
  } else if (kind === 'rocks') {
    cyl(g, 0.9, 1.15, 1.1, 0x7d7870, -0.3, 0, 0.1, 6);
    cyl(g, 0.55, 0.7, 0.8, 0x918b82, 0.8, 0, -0.3, 5);
    cyl(g, 0.4, 0.5, 0.55, 0x6a6560, -0.7, 0, -0.7, 5);
  } else if (kind === 'cart') {
    box(g, 1.5, 0.45, 0.9, 0x6b4a2e, 0, 0.35, 0);
    cyl(g, 0.28, 0.28, 0.12, 0x333333, -0.45, 0.1, 0.42, 8).rotation.z = Math.PI / 2;
    cyl(g, 0.28, 0.28, 0.12, 0x333333, 0.45, 0.1, -0.42, 8).rotation.z = Math.PI / 2;
    box(g, 0.35, 0.35, 0.35, 0xc2a15a, -0.3, 0.8, 0);
    box(g, 0.3, 0.3, 0.3, 0x8a8f86, 0.25, 0.8, 0.1);
  } else {
    cyl(g, 0.35, 0.45, 0.4, 0x5c564c, 0, 0, 0, 6);
    box(g, 0.35, 1.6, 0.35, 0x6e4a32, 0, 0.4, 0);
    box(g, 0.9, 0.22, 0.22, 0xc4553a, 0, 1.7, 0);
    box(g, 0.22, 0.7, 0.22, 0xd7c7a2, 0, 2.0, 0);
  }
}

const PROPS: { kind: Kind; x: number; z: number; yaw: number; r: number }[] = [
  { kind: 'obelisk', x: 18, z: -36, yaw: 0.4, r: 1.1 },
  { kind: 'arch', x: -16, z: 40, yaw: 0.15, r: 1.7 },
  { kind: 'statue', x: -40, z: 14, yaw: 1.1, r: 0.9 },
  { kind: 'tank', x: 46, z: 18, yaw: 0.6, r: 1.6 },
  { kind: 'crane', x: 28, z: -34, yaw: -0.5, r: 1.3 },
  { kind: 'bus', x: 24, z: 32, yaw: 0.7, r: 1.6 },
  { kind: 'containers', x: -30, z: 34, yaw: 0.35, r: 2.1 },
  { kind: 'billboard', x: 16, z: 46, yaw: -0.2, r: 0.5 },
  { kind: 'shrine', x: -38, z: -36, yaw: 0.8, r: 1.5 },
  { kind: 'well', x: -22, z: 20, yaw: 0.2, r: 1.1 },
  { kind: 'antenna', x: 42, z: 40, yaw: 0, r: 0.7 },
  { kind: 'wall', x: -26, z: -16, yaw: 0.9, r: 1.4 },
  { kind: 'rocks', x: 50, z: -16, yaw: 0.4, r: 1.5 },
  { kind: 'cart', x: 22, z: -30, yaw: 1.4, r: 0.9 },
  { kind: 'totem', x: -14, z: -44, yaw: 0.3, r: 0.7 },
  // 구역 랜드마크: 먼 구역마다 실루엣이 다른 조형물을 둬 길찾기와 구역 인지를 돕는다 (레인에서 비켜 배치)
  { kind: 'totem', x: -104, z: -70, yaw: 0.5, r: 0.7 },      // 북서 숲
  { kind: 'shrine', x: -50, z: 124, yaw: 1.2, r: 1.5 },      // 남서 숲
  { kind: 'crane', x: 120, z: -66, yaw: -0.4, r: 1.3 },      // 채석장
  { kind: 'well', x: -124, z: 46, yaw: 0.2, r: 1.1 },        // 약초 들판
  { kind: 'billboard', x: 86, z: 114, yaw: -0.3, r: 0.5 },   // 폐허 도시
  { kind: 'statue', x: -50, z: -130, yaw: 1.0, r: 0.9 },     // 북쪽 시가지
  { kind: 'antenna', x: 164, z: -136, yaw: 0, r: 0.7 },      // 폐광
  { kind: 'tank', x: 156, z: 70, yaw: 0.6, r: 1.6 },         // 황무지
  { kind: 'obelisk', x: 18, z: -170, yaw: 0.4, r: 1.1 },     // 보스 둥지 입구
  { kind: 'containers', x: 108, z: 86, yaw: 0.35, r: 2.1 },  // 폐허 도시 창고
  { kind: 'bus', x: -104, z: 88, yaw: 0.9, r: 1.6 },         // 남서 길목
  { kind: 'arch', x: 58, z: -96, yaw: 0.15, r: 1.7 },        // 북동 길목
];

function scatterRocks(scene: THREE.Scene) {
  let a = 0x51ed1234;
  const rnd = () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  for (let i = 0; i < 54; i++) {
    const x = (rnd() * 2 - 1) * (HALF - 4);
    const z = (rnd() * 2 - 1) * (HALF - 4);
    if (Math.hypot(x, z) < 18) continue;
    if (Math.min(Math.abs(x), Math.abs(z)) < 4) continue;
    if (laneDist(x, z) < 3.5) continue; // 돌이 길 한복판에 솟지 않게
    const g = new THREE.Group();
    const s = 0.35 + rnd() * 0.85;
    cyl(g, s * 0.6, s, s * (0.5 + rnd() * 0.6), rnd() > 0.6 ? 0x8a7a5c : rnd() > 0.5 ? 0x7a756c : 0x6a6358, 0, 0, 0, 5);
    g.position.set(x, terrainY(x, z), z);
    g.rotation.y = rnd() * 6;
    scene.add(g);
  }
}

export function addScenery(scene: THREE.Scene, obstacles: Obstacle[]) {
  addTerrain(scene);
  for (const p of PROPS) {
    const g = new THREE.Group();
    buildProp(p.kind, g);
    g.position.set(p.x, terrainY(p.x, p.z), p.z);
    g.rotation.y = p.yaw;
    scene.add(g);
    obstacles.push({ x: p.x, z: p.z, r: p.r });
  }
  scatterRocks(scene);
}
