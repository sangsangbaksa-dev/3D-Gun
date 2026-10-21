// 채집 노드 3D 모델 (Three.js 프리미티브). 표현 계층: Unity 에서는 프리팹으로 다시 만든다.
import * as THREE from 'three';
import type { GatherNode } from '../logic/nodes';
import type { NodeKind } from '../../data';

export interface NodeModel {
  root: THREE.Group;
  /** 고갈되면 사라지고 재생성되면 다시 자라는 부분 */
  ready: THREE.Group;
  /** 항상 남는 부분 (그루터기, 잔해, 폐차 뼈대) */
  always: THREE.Group;
  /** 진행도 막대를 띄울 높이(스케일 반영 전) */
  top: number;
  /** 파편 색 후보 */
  chips: number[];
}

const matCache = new Map<string, THREE.MeshLambertMaterial>();
function mat(color: number, opts: { flat?: boolean; emissive?: number } = {}): THREE.MeshLambertMaterial {
  const key = `${color}|${opts.flat ?? true}|${opts.emissive ?? 0}`;
  let m = matCache.get(key);
  if (!m) {
    m = new THREE.MeshLambertMaterial({ color, flatShading: opts.flat ?? true, emissive: opts.emissive ?? 0 });
    matCache.set(key, m);
  }
  return m;
}

const geoCache = new Map<string, THREE.BufferGeometry>();
function geo<T extends THREE.BufferGeometry>(key: string, make: () => T): T {
  let g = geoCache.get(key);
  if (!g) { g = make(); geoCache.set(key, g); }
  return g as T;
}

function add(parent: THREE.Object3D, g: THREE.BufferGeometry, m: THREE.Material, x = 0, y = 0, z = 0): THREE.Mesh {
  const mesh = new THREE.Mesh(g, m);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

/** 0..1 값 하나로 색을 살짝 흔든다 */
function tint(base: number, v: number, amount = 0.12): number {
  const c = new THREE.Color(base);
  const hsl = { h: 0, s: 0, l: 0 };
  c.getHSL(hsl);
  c.setHSL(hsl.h + (v - 0.5) * 0.04, hsl.s, Math.min(0.9, Math.max(0.05, hsl.l + (v - 0.5) * amount * 2)));
  return c.getHex();
}

/** 정점 위치로 정해지는 흔들림 → 같은 위치의 정점은 같이 움직여 면이 찢어지지 않는다 */
function hash3(x: number, y: number, z: number, seed: number): number {
  const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7 + seed * 19.19) * 43758.5453;
  return s - Math.floor(s);
}

function lumpyRock(radius: number, seed: number, jitter = 0.28, squashY = 0.72): THREE.BufferGeometry {
  const g = new THREE.IcosahedronGeometry(radius, 1);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const k = 1 + (hash3(Math.round(x * 50), Math.round(y * 50), Math.round(z * 50), seed) - 0.5) * 2 * jitter;
    p.setXYZ(i, x * k, y * k * squashY, z * k);
  }
  g.computeVertexNormals();
  return g;
}

function buildTree(n: GatherNode): NodeModel {
  const root = new THREE.Group(), ready = new THREE.Group(), always = new THREE.Group();
  root.add(always, ready);
  const v = n.variant;
  const bark = mat(tint(0x6b4a2b, v));
  // 그루터기 (항상 남음)
  add(always, geo('stump', () => new THREE.CylinderGeometry(0.26, 0.34, 0.42, 8)), bark, 0, 0.21, 0);
  add(always, geo('stumpTop', () => new THREE.CylinderGeometry(0.22, 0.22, 0.04, 8)), mat(0xd2ac72), 0, 0.43, 0);

  const pine = v < 0.62;
  if (pine) {
    const h = 1.7;
    add(ready, geo('pineTrunk', () => new THREE.CylinderGeometry(0.15, 0.27, h, 7)), bark, 0, h / 2, 0);
    const tiers: [number, number, number][] = [[1.55, 1.9, 2.0], [1.22, 1.7, 3.0], [0.88, 1.5, 3.9]];
    tiers.forEach(([r, hh, y], i) => {
      const c = tint(0x2f6b3a, v * 0.8 + i * 0.07, 0.1);
      add(ready, geo(`cone${r}`, () => new THREE.ConeGeometry(r, hh, 8)), mat(c), 0, y, 0).rotation.y = i * 0.6;
    });
    return { root, ready, always, top: 5.2, chips: [0x6b4a2b, 0x2f6b3a, 0xc9a26a] };
  }
  // 활엽수: 둥근 잎 덩어리
  add(ready, geo('oakTrunk', () => new THREE.CylinderGeometry(0.2, 0.32, 2.1, 7)), bark, 0, 1.05, 0);
  const leaf = tint(0x58963f, v, 0.1);
  const blobs: [number, number, number, number][] = [[0, 2.9, 0, 1.35], [0.8, 2.5, 0.3, 0.95], [-0.7, 2.6, -0.4, 1.0], [0.1, 3.5, 0.2, 0.85]];
  blobs.forEach(([x, y, z, r], i) => add(ready, geo(`blob${r}`, () => new THREE.IcosahedronGeometry(r, 1)), mat(tint(leaf, v + i * 0.09, 0.06)), x, y, z));
  return { root, ready, always, top: 4.9, chips: [0x6b4a2b, 0x58963f, 0xc9a26a] };
}

function buildRock(n: GatherNode): NodeModel {
  const root = new THREE.Group(), ready = new THREE.Group(), always = new THREE.Group();
  root.add(always, ready);
  const v = n.variant, seed = Math.floor(v * 1000);
  const stone = tint(0x8d9096, v, 0.08);
  // 잔해: 작은 돌 3개
  for (let i = 0; i < 3; i++) {
    const a = i * 2.1 + v * 6, r = 0.45 + (i % 2) * 0.15;
    add(always, lumpyRock(0.28 + i * 0.05, seed + i, 0.3, 0.7), mat(tint(0x777a80, v + i * 0.1)), Math.cos(a) * r, 0.12, Math.sin(a) * r);
  }
  add(ready, lumpyRock(1.1, seed), mat(stone), 0, 0.62, 0);
  add(ready, lumpyRock(0.65, seed + 7), mat(tint(stone, v + 0.2, 0.08)), 0.85, 0.3, 0.35);
  if (v > 0.45) add(ready, geo('moss', () => new THREE.SphereGeometry(0.5, 8, 5)), mat(0x5c7d3a), -0.15, 1.08, 0.1).scale.set(1, 0.28, 0.9);
  return { root, ready, always, top: 2.3, chips: [0x9a9da3, 0x7d8087, 0xb9bcc2] };
}

function buildIron(n: GatherNode): NodeModel {
  const root = new THREE.Group(), ready = new THREE.Group(), always = new THREE.Group();
  root.add(always, ready);
  const v = n.variant, seed = Math.floor(v * 1000) + 33;
  for (let i = 0; i < 3; i++) {
    const a = i * 2.3 + v * 5;
    add(always, lumpyRock(0.26 + i * 0.04, seed + i, 0.3, 0.7), mat(0x45484f), Math.cos(a) * 0.5, 0.11, Math.sin(a) * 0.5);
  }
  add(ready, lumpyRock(1.05, seed), mat(tint(0x4b4e57, v, 0.05)), 0, 0.58, 0);
  // 녹슨 줄무늬
  for (let i = 0; i < 3; i++) {
    const a = i * 2.1 + v * 3;
    add(ready, geo('rust', () => new THREE.BoxGeometry(0.5, 0.14, 0.32)), mat(0x9a5a2a), Math.cos(a) * 0.82, 0.55 + i * 0.12, Math.sin(a) * 0.82).rotation.set(0.2 * i, -a, 0.4);
  }
  // 푸르스름한 철광 결정
  const crystal = mat(0x9fb8cf, { emissive: 0x1d2c3a });
  const cr: [number, number, number, number, number][] = [[0.15, 1.15, 0.1, 0.9, 0.12], [-0.45, 0.95, 0.35, 0.65, -0.3], [0.5, 0.95, -0.3, 0.7, 0.35], [-0.2, 0.85, -0.55, 0.55, -0.15]];
  for (const [x, y, z, h, tilt] of cr) {
    const c = add(ready, geo(`crys${h}`, () => new THREE.OctahedronGeometry(0.2, 0)), crystal, x, y, z);
    c.scale.set(1, h * 3.2, 1); c.rotation.z = tilt; c.rotation.x = tilt * 0.6;
  }
  return { root, ready, always, top: 2.4, chips: [0x4b4e57, 0xb7c4d0, 0xc2733a] };
}

function buildHerb(n: GatherNode): NodeModel {
  const root = new THREE.Group(), ready = new THREE.Group(), always = new THREE.Group();
  root.add(always, ready);
  const v = n.variant;
  // 새싹 (고갈 후)
  for (let i = 0; i < 4; i++) {
    const a = i * 1.6 + v * 6;
    add(always, geo('sprout', () => new THREE.ConeGeometry(0.06, 0.28, 5)), mat(0x7eb35a), Math.cos(a) * 0.22, 0.14, Math.sin(a) * 0.22);
  }
  const leaf = tint(0x4f9a46, v, 0.08);
  const puffs: [number, number, number, number][] = [[0, 0.42, 0, 0.55], [0.38, 0.3, 0.12, 0.38], [-0.34, 0.3, -0.1, 0.4], [0.05, 0.3, -0.38, 0.36], [-0.1, 0.32, 0.4, 0.35]];
  puffs.forEach(([x, y, z, r], i) => add(ready, geo(`puff${r}`, () => new THREE.IcosahedronGeometry(r, 1)), mat(tint(leaf, v + i * 0.12, 0.07)), x, y, z));
  // 꽃/열매 점
  const flowers = v > 0.5 ? [0xffd2e6, 0xffffff, 0xff9ec7] : [0xfff08a, 0xffffff, 0xffc34d];
  for (let i = 0; i < 7; i++) {
    const a = i * 0.9 + v * 4, h = 0.35 + (i % 3) * 0.12;
    add(ready, geo('flower', () => new THREE.SphereGeometry(0.075, 6, 4)), mat(flowers[i % 3], { flat: false }), Math.cos(a) * 0.46, h + 0.18, Math.sin(a) * 0.46);
  }
  return { root, ready, always, top: 1.5, chips: [0x4f9a46, 0x8ed06a, 0xffd2e6] };
}

function buildWreck(n: GatherNode): NodeModel {
  const root = new THREE.Group(), ready = new THREE.Group(), always = new THREE.Group();
  root.add(always, ready);
  const v = n.variant;
  const body = mat(tint([0x8a4a36, 0x5f6f7a, 0x7a6a3a, 0x6b4a5a][Math.floor(v * 4) % 4], v, 0.06));
  const dark = mat(0x23262b);
  const rust = mat(0x6a4a2a);
  always.rotation.z = 0.05; // 약간 기울어진 폐차
  add(always, geo('chassis', () => new THREE.BoxGeometry(3.1, 0.62, 1.45)), body, 0, 0.62, 0);
  add(always, geo('cabin', () => new THREE.BoxGeometry(1.6, 0.62, 1.3)), body, -0.2, 1.22, 0);
  add(always, geo('glass', () => new THREE.BoxGeometry(1.5, 0.4, 1.34)), dark, -0.2, 1.24, 0);
  add(always, geo('roof', () => new THREE.BoxGeometry(1.45, 0.08, 1.2)), body, -0.2, 1.57, 0);
  add(always, geo('rustPatch', () => new THREE.BoxGeometry(0.9, 0.05, 0.6)), rust, 0.8, 0.96, 0.2);
  add(always, geo('axle', () => new THREE.BoxGeometry(2.2, 0.12, 0.2)), dark, 0, 0.3, 0);
  // 남아 있는 바퀴 하나 (항상)
  const wheel = geo('wheel', () => new THREE.CylinderGeometry(0.38, 0.38, 0.28, 10));
  const wm = mat(0x1a1b1e);
  add(always, wheel, wm, -1.0, 0.38, 0.78).rotation.x = Math.PI / 2;
  // 뜯어갈 수 있는 부품들 (재생성 때 다시 붙는다)
  for (const [x, z] of [[1.0, 0.78], [1.0, -0.78], [-1.0, -0.78]] as const) add(ready, wheel, wm, x, 0.38, z).rotation.x = Math.PI / 2;
  const hood = add(ready, geo('hood', () => new THREE.BoxGeometry(1.1, 0.07, 1.3)), mat(tint(0x7a7f85, v, 0.05)), 1.0, 1.1, 0);
  hood.rotation.z = -0.5; hood.position.x = 1.25;
  add(ready, geo('door', () => new THREE.BoxGeometry(0.9, 0.55, 0.07)), body, -0.2, 0.9, 0.8).rotation.x = -0.4;
  // 엔진/부품 더미
  add(ready, geo('engine', () => new THREE.BoxGeometry(0.7, 0.4, 0.7)), mat(0x4a4f57), 1.0, 0.98, 0);
  add(ready, geo('pipe', () => new THREE.CylinderGeometry(0.07, 0.07, 0.9, 6)), mat(0x9aa2ab), 0.55, 1.0, -0.4).rotation.z = 1.3;
  add(ready, geo('gear', () => new THREE.CylinderGeometry(0.22, 0.22, 0.08, 8)), mat(0xb7a24a, { flat: false }), 1.35, 1.06, 0.35);
  return { root, ready, always, top: 2.6, chips: [0x6a4a2a, 0x8a8f96, 0x2b2d31] };
}

const BUILDERS: Record<NodeKind, (n: GatherNode) => NodeModel> = {
  tree: buildTree, rock: buildRock, iron: buildIron, herb: buildHerb, wreck: buildWreck,
};

export function buildNodeModel(n: GatherNode): NodeModel {
  const m = BUILDERS[n.kind](n);
  m.root.position.set(n.x, 0, n.z);
  m.root.rotation.y = n.yaw;
  m.root.scale.setScalar(n.scale);
  return m;
}
