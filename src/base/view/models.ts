// 건물·핵 3D 모델. 프리미티브만으로 만든다 (외부 에셋 없음). 모든 모델은 바닥 중심이 원점이고 앞쪽은 -z.
import * as THREE from 'three';
import type { BuildingId } from '../../data';

type Lam = THREE.MeshLambertMaterial;

export interface Model {
  group: THREE.Group;
  /** 포탑류의 회전 부분 (aimYaw 를 받는다) */
  head?: THREE.Group;
  /** 총구 월드 오프셋(머리 기준 로컬) */
  muzzle?: THREE.Object3D;
  mats: Lam[];
  /** 시간에 따라 맥동하는 발광 재질 */
  glows: { mat: Lam; base: number; amp: number; speed: number }[];
  /** 매 프레임 호출되는 장식 애니메이션 */
  anim?: (t: number, dt: number) => void;
}

const geo = new Map<string, THREE.BufferGeometry>();
const g = <T extends THREE.BufferGeometry>(key: string, make: () => T): T => {
  let v = geo.get(key);
  if (!v) { v = make(); geo.set(key, v); }
  return v as T;
};
const box = (w: number, h: number, d: number) => g(`b${w},${h},${d}`, () => new THREE.BoxGeometry(w, h, d));
const cyl = (rt: number, rb: number, h: number, seg = 12) => g(`c${rt},${rb},${h},${seg}`, () => new THREE.CylinderGeometry(rt, rb, h, seg));
const cone = (r: number, h: number, seg = 8) => g(`n${r},${h},${seg}`, () => new THREE.ConeGeometry(r, h, seg));
const sph = (r: number, ws = 14, hs = 10) => g(`s${r},${ws},${hs}`, () => new THREE.SphereGeometry(r, ws, hs));
const tor = (r: number, t: number, rs = 8, ts = 24) => g(`t${r},${t},${rs},${ts}`, () => new THREE.TorusGeometry(r, t, rs, ts));

export const C = {
  wood: 0x8b6a45, darkWood: 0x5a4128, metal: 0x4a525c, steel: 0x9aa4ae, stone: 0x8d8f91, darkStone: 0x5f6266,
  olive: 0x5d6b3e, sand: 0xc9b98a, white: 0xdfe6e8, teal: 0x2f9d93, green: 0x62ff9a, amber: 0xffb347,
  red: 0xd9343a, blue: 0x4ac8ff, gold: 0xf2c14e, cloth1: 0xc9483c, cloth2: 0xeadfc8,
};

class Builder {
  group = new THREE.Group();
  mats: Lam[] = [];
  glows: Model['glows'] = [];
  mk(color: number, emissive = 0, ei = 0, opts: { opacity?: number } = {}): Lam {
    const m = new THREE.MeshLambertMaterial({ color, emissive, emissiveIntensity: ei });
    if (opts.opacity !== undefined) { m.transparent = true; m.opacity = opts.opacity; }
    m.userData.baseEmissive = emissive; m.userData.baseEi = ei;
    this.mats.push(m);
    return m;
  }
  glow(color: number, base = 1, amp = 0.4, speed = 3): Lam {
    const m = this.mk(color, color, base);
    this.glows.push({ mat: m, base, amp, speed });
    return m;
  }
  add(geom: THREE.BufferGeometry, mat: THREE.Material, x = 0, y = 0, z = 0, parent: THREE.Object3D = this.group, rot: [number, number, number] = [0, 0, 0], cast = true) {
    const m = new THREE.Mesh(geom, mat);
    m.position.set(x, y, z);
    m.rotation.set(rot[0], rot[1], rot[2]);
    m.castShadow = cast;
    m.receiveShadow = true;
    parent.add(m);
    return m;
  }
  done(extra: Partial<Model> = {}): Model {
    return { group: this.group, mats: this.mats, glows: this.glows, ...extra };
  }
}

function sandbags(b: Builder, n: number, radius: number, y = 0.2, color = C.sand) {
  const m = b.mk(color);
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    b.add(box(0.62, 0.34, 0.36), m, Math.cos(a) * radius, y, Math.sin(a) * radius, b.group, [0, -a + Math.PI / 2, 0]);
  }
}

function tower(level: number): Model {
  const b = new Builder();
  const wood = b.mk(C.wood), dark = b.mk(C.darkWood), metal = b.mk(C.metal), steel = b.mk(C.steel);
  const accent = level >= 3 ? C.gold : level === 2 ? C.blue : C.red;
  const cloth = b.mk(accent);
  // 다리 + 가새
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) b.add(box(0.2, 3.5, 0.2), dark, sx * 0.72, 1.75, sz * 0.72);
  for (let i = 0; i < 4; i++) {
    const a = (i * Math.PI) / 2;
    const dx = Math.cos(a), dz = Math.sin(a);
    for (const y of [0.9, 2.3]) {
      b.add(box(1.5, 0.12, 0.12), wood, dx * 0.72, y, dz * 0.72, b.group, [0, -a + Math.PI / 2 + Math.PI / 2, 0]);
    }
    b.add(box(0.1, 1.9, 0.1), wood, dx * 0.72, 1.6, dz * 0.72, b.group, a % Math.PI === 0 ? [0, 0, 0.78 * (dx > 0 ? 1 : -1) * 0] : [0, 0, 0]);
  }
  // 발판 + 난간
  b.add(box(2.05, 0.18, 2.05), wood, 0, 3.5, 0);
  b.add(box(2.15, 0.08, 2.15), dark, 0, 3.4, 0);
  for (const s of [-1, 1]) {
    b.add(box(2.05, 0.1, 0.08), dark, 0, 4.05, s * 1.0);
    b.add(box(0.08, 0.1, 2.05), dark, s * 1.0, 4.05, 0);
    b.add(box(2.05, 0.55, 0.06), wood, 0, 3.8, s * 1.0);
    b.add(box(0.06, 0.55, 2.05), wood, s * 1.0, 3.8, 0);
  }
  // 사다리
  b.add(box(0.08, 3.4, 0.08), dark, -0.25, 1.7, 0.82, b.group, [-0.14, 0, 0]);
  b.add(box(0.08, 3.4, 0.08), dark, 0.25, 1.7, 0.82, b.group, [-0.14, 0, 0]);
  for (let i = 0; i < 7; i++) b.add(box(0.5, 0.05, 0.05), dark, 0, 0.35 + i * 0.47, 0.85 - i * 0.065);
  // 지붕
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) b.add(box(0.1, 0.9, 0.1), dark, sx * 0.98, 4.5, sz * 0.98);
  const roof = b.add(cone(1.75, 0.7, 4), cloth, 0, 5.3, 0, b.group, [0, Math.PI / 4, 0]);
  roof.scale.set(1, 1, 1);
  if (level >= 2) b.add(cyl(0.02, 0.02, 0.9, 6), steel, 0, 5.85, 0), b.add(box(0.5, 0.3, 0.02), cloth, 0.26, 6.15, 0);
  if (level >= 3) b.add(sph(0.16), b.glow(C.gold, 1.2, 0.5, 4), 0, 4.45, 0);
  // 포탑 머리
  const head = new THREE.Group();
  head.position.set(0, 3.6, 0);
  b.group.add(head);
  b.add(cyl(0.42, 0.5, 0.2, 12), metal, 0, 0.1, 0, head);
  b.add(box(0.62, 0.38, 0.8), metal, 0, 0.42, 0.05, head);
  b.add(box(0.16, 0.16, 1.1 + level * 0.12), steel, 0, 0.45, -0.75, head);
  b.add(box(0.22, 0.22, 0.14), dark, 0, 0.45, -1.35 - level * 0.06, head);
  b.add(sph(0.09), b.glow(C.red, 1.4, 0.6, 5), 0, 0.68, -0.15, head);
  const muzzle = new THREE.Object3D(); muzzle.position.set(0, 0.45, -1.5 - level * 0.06); head.add(muzzle);
  return b.done({ head, muzzle });
}

function mgtower(level: number): Model {
  const b = new Builder();
  const metal = b.mk(C.metal), dark = b.mk(0x30353b), steel = b.mk(C.steel), orange = b.mk(0xd98a2b);
  sandbags(b, 9, 1.0, 0.18);
  sandbags(b, 9, 0.9, 0.5);
  b.add(cyl(0.85, 1.0, 0.35, 10), dark, 0, 0.18, 0);
  b.add(tor(0.86, 0.04, 6, 20), b.glow(C.red, 0.9, 0.4, 3), 0, 0.4, 0, b.group, [Math.PI / 2, 0, 0], false);
  b.add(cyl(0.38, 0.5, 0.8, 8), metal, 0, 0.75, 0);
  const head = new THREE.Group();
  head.position.set(0, 1.25, 0);
  b.group.add(head);
  b.add(box(0.85, 0.5, 0.95), metal, 0, 0.2, 0.05, head);
  b.add(box(1.1, 0.55, 0.1), dark, 0, 0.3, -0.5, head);
  const nb = level + 1;
  for (let i = 0; i < nb; i++) {
    const a = (i / nb) * Math.PI * 2 + Math.PI / 4;
    const bx = nb === 2 ? (i ? 0.13 : -0.13) : Math.cos(a) * 0.14, by = nb === 2 ? 0.25 : Math.sin(a) * 0.14 + 0.28;
    b.add(cyl(0.065, 0.065, 1.25, 8), steel, bx, by, -0.95, head, [Math.PI / 2, 0, 0]);
    b.add(cyl(0.09, 0.09, 0.14, 8), dark, bx, by, -1.55, head, [Math.PI / 2, 0, 0]);
  }
  b.add(box(0.34, 0.3, 0.4), orange, 0.62, 0.15, 0.1, head);
  b.add(sph(0.08), b.glow(C.red, 1.5, 0.7, 7), 0, 0.52, 0.1, head);
  const muzzle = new THREE.Object3D(); muzzle.position.set(0, 0.28, -1.65); head.add(muzzle);
  return b.done({ head, muzzle });
}

function barricade(): Model {
  const b = new Builder();
  const wood = b.mk(C.wood), dark = b.mk(C.darkWood), metal = b.mk(0x3a3f45), steel = b.mk(C.steel);
  for (const s of [-1, 1]) {
    b.add(box(0.2, 1.55, 0.2), dark, s * 0.82, 0.77, 0);
    b.add(cone(0.12, 0.3, 6), dark, s * 0.82, 1.68, 0);
  }
  [0.32, 0.72, 1.12].forEach((y, i) => b.add(box(1.95, 0.24, 0.1), i % 2 ? wood : dark, 0, y, i % 2 ? 0.08 : -0.08));
  b.add(box(0.1, 1.9, 0.07), wood, 0, 0.75, 0.15, b.group, [0, 0, 0.78]);
  b.add(box(0.1, 1.9, 0.07), wood, 0, 0.75, 0.15, b.group, [0, 0, -0.78]);
  for (let i = 0; i < 5; i++) b.add(cone(0.06, 0.24, 5), steel, -0.8 + i * 0.4, 1.38, -0.08);
  b.add(box(1.9, 0.04, 0.04), metal, 0, 1.5, 0.16);
  return b.done();
}

function trap(): Model {
  const b = new Builder();
  const dark = b.mk(0x2b2f34), steel = b.mk(C.steel);
  const ring = b.glow(C.amber, 0.9, 0.5, 3);
  b.add(cyl(0.95, 1.0, 0.12, 20), dark, 0, 0.06, 0);
  b.add(tor(0.82, 0.05, 6, 28), ring, 0, 0.14, 0, b.group, [Math.PI / 2, 0, 0], false);
  const spikes = new THREE.Group(); b.group.add(spikes);
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    b.add(cone(0.07, 0.4, 5), steel, Math.cos(a) * 0.55, 0.3, Math.sin(a) * 0.55, spikes);
  }
  b.add(cone(0.1, 0.5, 5), steel, 0, 0.36, 0, spikes);
  b.add(cyl(0.15, 0.15, 0.06, 10), b.glow(C.amber, 1.2, 0.6, 5), 0, 0.14, 0, b.group, [0, 0, 0], false);
  return b.done({ anim: (t) => { spikes.rotation.y = Math.sin(t * 0.8) * 0.2; } });
}

function lab(): Model {
  const b = new Builder();
  const wall = b.mk(C.white), teal = b.mk(C.teal), dark = b.mk(C.darkStone), metal = b.mk(C.metal), steel = b.mk(C.steel);
  const glass = b.mk(0x8fe8d6, 0x3fe0c0, 0.5, { opacity: 0.45 });
  const liquid = b.glow(C.green, 1, 0.35, 2.4);
  b.add(box(3.4, 0.25, 3.4), dark, 0, 0.12, 0);
  b.add(box(3.1, 1.7, 3.1), wall, 0, 1.1, 0);
  b.add(box(3.2, 0.14, 3.2), teal, 0, 1.97, 0);
  b.add(box(3.15, 0.14, 3.15), teal, 0, 0.55, 0);
  // 문 + 유리창
  b.add(box(0.9, 1.3, 0.08), metal, 0, 0.9, -1.58);
  b.add(box(0.7, 0.4, 0.04), b.glow(C.green, 0.6, 0.2, 1.6), 0, 1.2, -1.63);
  for (const s of [-1, 1]) b.add(box(0.06, 0.75, 1.1), b.glow(0x7ff0d4, 0.8, 0.15, 2), s * 1.57, 1.2, 0);
  // 지붕 위 돔 + 플라스크
  b.add(cyl(0.95, 1.05, 0.25, 16), metal, 0, 2.15, 0);
  b.add(sph(0.9, 18, 10), glass, 0, 2.3, 0);
  const flask = new THREE.Group(); flask.position.set(0, 2.45, 0); b.group.add(flask);
  b.add(cyl(0.2, 0.34, 0.8, 12), liquid, 0, 0, 0, flask);
  b.add(sph(0.22), liquid, 0, 0.5, 0, flask);
  b.add(cyl(0.07, 0.07, 0.35, 8), steel, 0, 0.8, 0, flask);
  // 안테나와 굴뚝
  b.add(cyl(0.04, 0.04, 1.4, 6), steel, 1.2, 3.0, 1.1);
  b.add(sph(0.08), b.glow(C.red, 1.4, 0.9, 6), 1.2, 3.7, 1.1);
  b.add(box(0.5, 0.9, 0.5), dark, -1.1, 2.55, 1.0);
  const pad = new THREE.Group(); b.group.add(pad);
  for (let i = 0; i < 3; i++) b.add(sph(0.12), glass, 0, 0, 0, pad);
  return b.done({
    anim: (t) => {
      flask.rotation.y = t * 0.9; flask.position.y = 2.45 + Math.sin(t * 2) * 0.05;
      pad.children.forEach((c, i) => c.position.set(-1.1 + Math.sin(t * 0.8 + i * 2) * 0.12, 3.1 + ((t * 0.6 + i * 0.35) % 1) * 0.8, 1.0));
    },
  });
}

function barracks(): Model {
  const b = new Builder();
  const wall = b.mk(C.olive), wood = b.mk(C.wood), dark = b.mk(C.darkWood), roofM = b.mk(0x6b3f2e), stone = b.mk(C.darkStone), cloth = b.mk(C.cloth1);
  b.add(box(3.5, 0.3, 3.1), stone, 0, 0.15, 0);
  b.add(box(3.2, 1.6, 2.8), wall, 0, 1.1, 0);
  for (let i = -1; i <= 1; i++) b.add(box(0.12, 1.65, 2.9), dark, i * 1.6 * 0.95, 1.1, 0);
  // 박공지붕: 반으로 기울인 두 판
  for (const s of [-1, 1]) b.add(box(3.7, 0.14, 1.9), roofM, 0, 2.3, s * 0.88, b.group, [s * 0.55, 0, 0]);
  b.add(box(3.7, 0.12, 0.2), dark, 0, 2.75, 0);
  b.add(box(3.2, 0.9, 0.06), wall, 0, 2.15, -1.38);
  b.add(box(0.85, 1.25, 0.08), dark, -0.7, 0.9, -1.45);
  b.add(box(0.6, 0.5, 0.06), b.glow(0xffd27a, 0.9, 0.12, 2), 0.75, 1.35, -1.45);
  b.add(box(0.7, 0.06, 0.1), dark, 0.75, 1.1, -1.46);
  for (const s of [-1, 1]) b.add(box(0.06, 0.5, 0.6), b.glow(0xffd27a, 0.8, 0.12, 2.2), s * 1.62, 1.35, 0);
  // 깃발
  b.add(cyl(0.035, 0.035, 1.5, 6), b.mk(C.steel), 1.55, 3.3, -1.3);
  const flag = b.add(box(0.7, 0.45, 0.03), cloth, 1.9, 3.8, -1.3);
  // 침대 장식(문 옆 상자)
  b.add(box(0.5, 0.45, 0.5), wood, 1.25, 0.5, -1.7);
  b.add(box(0.4, 0.35, 0.4), dark, 0.75, 0.47, -1.78);
  return b.done({ anim: (t) => { flag.rotation.y = Math.sin(t * 3) * 0.2; flag.position.x = 1.9 + Math.sin(t * 3) * 0.04; } });
}

function shop(): Model {
  const b = new Builder();
  const wood = b.mk(C.wood), dark = b.mk(C.darkWood), stone = b.mk(C.darkStone), red = b.mk(C.cloth1), cream = b.mk(C.cloth2), gold = b.glow(C.gold, 0.9, 0.3, 2.5);
  b.add(box(3.5, 0.22, 3.1), stone, 0, 0.11, 0);
  b.add(box(3.1, 1.2, 1.1), dark, 0, 0.8, 0.8);          // 뒤 창고
  b.add(box(3.2, 0.12, 1.3), wood, 0, 1.45, 0.8);
  b.add(box(2.7, 0.9, 0.7), wood, 0, 0.65, -0.55);        // 카운터
  b.add(box(2.9, 0.1, 0.9), dark, 0, 1.12, -0.55);
  for (const s of [-1, 1]) b.add(box(0.14, 2.3, 0.14), dark, s * 1.45, 1.25, -1.2);
  // 줄무늬 차양
  for (let i = 0; i < 7; i++) b.add(box(0.43, 0.08, 1.7), i % 2 ? cream : red, -1.29 + i * 0.43, 2.28 - 0.01 * i * 0 , -0.7, b.group, [0.28, 0, 0]);
  b.add(cyl(0.45, 0.45, 0.08, 20), gold, 0, 2.95, -1.2, b.group, [Math.PI / 2, 0, 0]);
  b.add(box(0.06, 0.55, 0.06), dark, 0, 2.55, -1.2);
  for (let i = 0; i < 3; i++) b.add(box(0.5, 0.45, 0.5), i % 2 ? wood : dark, -1.1 + i * 0.35, 1.5 + (i % 2) * 0.0, 1.0, b.group, [0, i * 0.4, 0]);
  b.add(box(0.55, 0.5, 0.55), wood, 1.1, 0.5, 1.1, b.group, [0, 0.3, 0]);
  b.add(sph(0.12), b.glow(0xffd27a, 1.2, 0.3, 4), -1.45, 2.45, -1.2);
  return b.done();
}

export function buildModel(kind: BuildingId, level = 1): Model {
  switch (kind) {
    case 'tower': return tower(level);
    case 'mgtower': return mgtower(level);
    case 'barricade': return barricade();
    case 'trap': return trap();
    case 'lab': return lab();
    case 'barracks': return barracks();
    case 'shop': return shop();
  }
}

/** 핵: 돌 받침, 네 기둥, 떠 있는 수정, 보호막. level 이 오르면 고리가 늘어난다 */
export function buildCoreModel(level: number): Model & { crystal: THREE.Mesh; shield: THREE.Mesh; rings: THREE.Mesh[]; crystalMat: Lam } {
  const b = new Builder();
  const stone = b.mk(C.stone), dark = b.mk(C.darkStone), metal = b.mk(0x30353b);
  const cm = b.mk(0x66e0ff, 0x33bbff, 1.3);
  b.add(cyl(3.0, 3.3, 0.35, 8), dark, 0, 0.17, 0);
  b.add(cyl(2.5, 2.8, 0.35, 8), stone, 0, 0.5, 0);
  b.add(cyl(1.5, 1.8, 0.4, 8), metal, 0, 0.88, 0);
  const rune = b.glow(0x66e0ff, 0.9, 0.35, 2);
  b.add(tor(2.55, 0.05, 6, 40), rune, 0, 0.7, 0, b.group, [Math.PI / 2, 0, 0], false);
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    const px = Math.cos(a) * 2.25, pz = Math.sin(a) * 2.25;
    b.add(box(0.45, 1.8, 0.45), stone, px, 1.4, pz, b.group, [0, -a, 0]);
    b.add(box(0.55, 0.2, 0.55), dark, px, 2.35, pz, b.group, [0, -a, 0]);
    b.add(cone(0.22, 0.45, 4), b.glow(0x66e0ff, 1.2, 0.5, 3 + i * 0.4), px, 2.7, pz, b.group, [0, Math.PI / 4, 0]);
  }
  const crystal = b.add(g('oct', () => new THREE.OctahedronGeometry(1, 0)), cm, 0, 2.9, 0);
  crystal.scale.set(0.85, 1.4, 0.85);
  const inner = b.add(g('oct', () => new THREE.OctahedronGeometry(1, 0)), b.mk(0xffffff, 0xffffff, 0.9), 0, 2.9, 0, b.group, [0, 0, 0], false);
  inner.scale.set(0.35, 0.6, 0.35);
  const rings: THREE.Mesh[] = [];
  for (let i = 0; i <= level; i++) {
    const r = b.add(tor(1.35 + i * 0.3, 0.035, 6, 36), b.glow(i % 2 ? 0xa8f0ff : 0x66e0ff, 1.1, 0.4, 2 + i), 0, 2.9, 0, b.group, [Math.PI / 2 + i * 0.5, i * 0.7, 0], false);
    rings.push(r);
  }
  const shieldMat = new THREE.MeshBasicMaterial({ color: 0x66e0ff, transparent: true, opacity: 0.08, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending });
  const shield = new THREE.Mesh(g('shield', () => new THREE.SphereGeometry(3.4, 24, 14, 0, Math.PI * 2, 0, Math.PI / 2)), shieldMat);
  shield.position.y = 0.4;
  b.group.add(shield);
  const light = new THREE.PointLight(0x66ccff, 2.2, 22, 1.6);
  light.position.set(0, 3.2, 0);
  b.group.add(light);
  b.group.userData.light = light;
  return Object.assign(b.done(), { crystal, shield, rings, crystalMat: cm });
}
