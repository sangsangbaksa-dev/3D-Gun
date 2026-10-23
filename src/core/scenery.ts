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
    const r = Math.hypot(x, z);
    const road = Math.min(Math.abs(x), Math.abs(z)) < 3.2 && r > 15;
    const n = Math.sin(x * 0.73) * Math.cos(z * 0.61);
    if (r < 15) c.setHex(0x7c6a4c);
    else if (road) c.setHex(0x8d7b5c);
    else if (y < -0.7) c.setHex(0xa08a62);
    else if (y > 1.7) c.setHex(0x8b8478);
    else c.setHex(0x5c7242).offsetHSL(n * 0.02, 0, n * 0.05);
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
];

function scatterRocks(scene: THREE.Scene) {
  let a = 0x51ed1234;
  const rnd = () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  for (let i = 0; i < 36; i++) {
    const x = (rnd() * 2 - 1) * (HALF - 4);
    const z = (rnd() * 2 - 1) * (HALF - 4);
    if (Math.hypot(x, z) < 18) continue;
    if (Math.min(Math.abs(x), Math.abs(z)) < 4) continue;
    const g = new THREE.Group();
    const s = 0.35 + rnd() * 0.7;
    cyl(g, s * 0.6, s, s * (0.5 + rnd() * 0.6), rnd() > 0.5 ? 0x7a756c : 0x6a6358, 0, 0, 0, 5);
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
