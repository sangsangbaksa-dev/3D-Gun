// 건물·핵 3D 모델. 프리미티브만으로 만든다 (외부 에셋 없음). 모든 모델은 바닥 중심이 원점이고 앞쪽은 -z.
// 룩: 건메탈 + 벗겨진 도장 + 녹, 붉은 안개 속에서도 읽히는 청록/주황 발광 포인트.
// 팔레트: bg #10141a · 청록 #2EE6D6 · 주황 #FF8A2A · 빨강 #E0303A.
// 지오메트리는 전부 캐시해서 공유한다. 재질은 피격 번쩍임 때문에 건물마다 따로 만든다(mats).
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
  /** 포탑이 쐈을 때 (총구 섬광, 총열 반동, 총열 회전) */
  fire?: () => void;
  /** 매 프레임 호출 (fire 연출 감쇠) */
  tick?: (dt: number) => void;
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
/** 바닥이 y=0 인 삼각 기둥 (텐트·박공). x 폭 w, 높이 h, z 길이 len */
const prism = (w: number, h: number, len: number) => g(`p${w},${h},${len}`, () => {
  const s = new THREE.Shape();
  s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(0, h); s.closePath();
  const e = new THREE.ExtrudeGeometry(s, { depth: len, bevelEnabled: false });
  e.translate(0, 0, -len / 2);
  return e;
});
/** 총구 섬광: 십자 판 두 장 + 앞쪽 원뿔 (모두 같은 지오메트리) */
const flashPlane = () => g('flashPlane', () => new THREE.PlaneGeometry(0.7, 0.7));
const flashCone = () => g('flashCone', () => { const c = new THREE.ConeGeometry(0.16, 0.7, 6, 1, true); c.rotateX(Math.PI / 2); c.translate(0, 0, -0.3); return c; });

export const C = {
  // 구조재
  gunmetal: 0x3d444c, dark: 0x22262b, steel: 0x8a939c, rust: 0x7a3d24, concrete: 0x6d6862, darkConcrete: 0x44413d,
  wood: 0x6e5038, darkWood: 0x45311f, sandbag: 0x8c7b58, canvas: 0x5f5a42, canvasDk: 0x47432f,
  // 도장
  redPaint: 0x8c2e2a, tealPaint: 0x1f5d58, hazard: 0xd9761f, cream: 0xb8ab8c, white: 0xb9bec0,
  // 발광
  teal: 0x2ee6d6, orange: 0xff8a2a, red: 0xe0303a, amber: 0xffb347, green: 0x62ff9a, warm: 0xffc27a,
  gold: 0xf2c14e, blue: 0x4ac8ff, cloth1: 0xc9483c, cloth2: 0xeadfc8,
};

class Builder {
  group = new THREE.Group();
  mats: Lam[] = [];
  glows: Model['glows'] = [];
  mk(color: number, emissive = 0, ei = 0, opts: { opacity?: number } = {}): Lam {
    const m = new THREE.MeshLambertMaterial({ color, emissive, emissiveIntensity: ei });
    if (opts.opacity !== undefined) { m.transparent = true; m.opacity = opts.opacity; m.depthWrite = false; }
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
  /** 효과 전용 메시(빛줄기·섬광): 그림자 없음, 건설 미리보기에서 숨긴다 */
  fx(geom: THREE.BufferGeometry, mat: THREE.Material, x = 0, y = 0, z = 0, parent: THREE.Object3D = this.group, rot: [number, number, number] = [0, 0, 0]) {
    const m = this.add(geom, mat, x, y, z, parent, rot, false);
    m.receiveShadow = false;
    m.userData.fx = true;
    return m;
  }
  done(extra: Partial<Model> = {}): Model {
    return { group: this.group, mats: this.mats, glows: this.glows, ...extra };
  }
}

const additive = (color: number, opacity: number) =>
  new THREE.MeshBasicMaterial({ color, transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, fog: false });

/** 총구 섬광 + 반동 + (선택) 총열 회전. head 기준 muzzle 위치에 붙인다 */
function gunFx(b: Builder, muzzle: THREE.Object3D, barrel: THREE.Object3D, kick: number, size: number, spin?: THREE.Object3D) {
  const flash = new THREE.Group();
  flash.userData.fx = true;
  const mat = additive(0xffc070, 1);
  for (let i = 0; i < 2; i++) b.fx(flashPlane(), mat, 0, 0, -0.15, flash, [0, Math.PI / 2, i * Math.PI / 2 + Math.PI / 4]);
  b.fx(flashPlane(), mat, 0, 0, 0, flash, [0, 0, 0]);
  b.fx(flashCone(), mat, 0, 0, 0, flash);
  flash.visible = false;
  muzzle.add(flash);
  const rest = barrel.position.z;
  let f = 0, r = 0, spinV = 0;
  return {
    fire: () => { f = 1; r = 1; spinV = 26; flash.rotation.z = Math.random() * Math.PI; flash.scale.setScalar(size * (0.8 + Math.random() * 0.45)); },
    tick: (dt: number) => {
      f = Math.max(0, f - dt * 16);
      r = Math.max(0, r - dt * 9);
      flash.visible = f > 0;
      mat.opacity = f;
      barrel.position.z = rest + r * kick;
      if (spin) { spin.rotation.z += spinV * dt; spinV = Math.max(0, spinV - dt * 30); }
    },
  };
}

function sandbags(b: Builder, n: number, radius: number, y = 0.2, mat?: Lam) {
  const m = mat ?? b.mk(C.sandbag);
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    b.add(box(0.62, 0.3, 0.36), m, Math.cos(a) * radius, y, Math.sin(a) * radius, b.group, [0, -a + Math.PI / 2, (i % 2) * 0.06]);
  }
}

/** 주황/검정 경고 줄무늬 띠 (x 방향) */
function hazardStripe(b: Builder, w: number, h: number, x: number, y: number, z: number, n: number, parent: THREE.Object3D = b.group, rotY = 0) {
  const o = b.mk(C.hazard), k = b.mk(C.dark);
  const sw = w / n;
  const holder = new THREE.Group(); holder.position.set(x, y, z); holder.rotation.y = rotY; parent.add(holder);
  for (let i = 0; i < n; i++) b.add(box(sw, h, 0.03), i % 2 ? k : o, -w / 2 + sw * (i + 0.5), 0, 0, holder, [0, 0, 0], false);
}

/** 서치라이트: 받침 + 청록 렌즈 + 안개 속 빛줄기 */
function searchlight(b: Builder, x: number, y: number, z: number, aimDown = 0.45) {
  const dark = b.mk(C.dark);
  const sl = new THREE.Group(); sl.position.set(x, y, z); b.group.add(sl);
  b.add(box(0.08, 0.2, 0.08), dark, 0, -0.1, 0, sl);
  const lamp = new THREE.Group(); lamp.rotation.x = -aimDown; sl.add(lamp);
  b.add(cyl(0.13, 0.11, 0.26, 10), dark, 0, 0, 0, lamp, [Math.PI / 2, 0, 0]);
  b.add(cyl(0.11, 0.11, 0.02, 10), b.glow(C.teal, 1.6, 0.25, 2), 0, 0, -0.135, lamp, [Math.PI / 2, 0, 0], false);
  const beamGeo = g('beam', () => { const c = new THREE.ConeGeometry(0.9, 4.2, 12, 1, true); c.translate(0, -2.1, 0); c.rotateX(Math.PI / 2); return c; });
  b.fx(beamGeo, additive(C.teal, 0.07), 0, 0, -0.14, lamp);
  return sl;
}

function tower(level: number): Model {
  const b = new Builder();
  const metal = b.mk(C.gunmetal), dark = b.mk(C.dark), steel = b.mk(C.steel), rust = b.mk(C.rust), conc = b.mk(C.concrete);
  const paint = b.mk(level >= 3 ? C.hazard : level === 2 ? C.tealPaint : C.redPaint);
  const plate = b.mk(0x4a5058), bag = b.mk(C.sandbag), wood = b.mk(C.darkWood);
  // 콘크리트 기초 + 강철 다리
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    b.add(box(0.44, 0.3, 0.44), conc, sx * 0.72, 0.15, sz * 0.72);
    b.add(box(0.15, 3.2, 0.15), metal, sx * 0.72, 1.9, sz * 0.72);
    b.add(box(0.17, 0.5, 0.17), rust, sx * 0.72, 0.55, sz * 0.72);
  }
  // X 가새 두 단 + 가로대
  const diag = Math.hypot(1.44, 1.5), ang = Math.atan2(1.5, 1.44);
  for (const yc of [1.05, 2.55]) for (const s of [-1, 1]) for (const d of [-1, 1]) {
    b.add(box(diag, 0.06, 0.06), dark, 0, yc, s * 0.72, b.group, [0, 0, d * ang]);
    b.add(box(0.06, 0.06, diag), dark, s * 0.72, yc, 0, b.group, [d * ang, 0, 0]);
  }
  for (const y of [1.8, 3.3]) for (const s of [-1, 1]) {
    b.add(box(1.5, 0.09, 0.09), metal, 0, y, s * 0.72);
    b.add(box(0.09, 0.09, 1.5), metal, s * 0.72, y, 0);
  }
  // 발판 + 장갑 난간 (앞쪽 -z 는 모래주머니)
  b.add(box(2.1, 0.16, 2.1), dark, 0, 3.5, 0);
  b.add(box(2.2, 0.06, 2.2), steel, 0, 3.42, 0);
  for (const s of [-1, 1]) {
    b.add(box(0.08, 0.55, 2.1), plate, s * 1.01, 3.85, 0);
    b.add(box(0.1, 0.12, 2.12), paint, s * 1.01, 4.02, 0);
    b.add(box(0.1, 0.03, 2.12), steel, s * 1.01, 4.11, 0);
  }
  b.add(box(2.1, 0.55, 0.08), plate, 0, 3.85, 1.01);
  b.add(box(2.12, 0.12, 0.1), paint, 0, 4.02, 1.01);
  hazardStripe(b, 1.9, 0.1, 0, 3.7, 1.06, 8);
  for (let i = 0; i < 4; i++) b.add(box(0.5, 0.22, 0.3), bag, -0.75 + i * 0.5, 3.7, -0.92, b.group, [0, (i % 2) * 0.1, 0]);
  for (let i = 0; i < 3; i++) b.add(box(0.5, 0.2, 0.3), bag, -0.5 + i * 0.5, 3.9, -0.94, b.group, [0, (i % 2) * -0.1, 0]);
  // 계급 표시: 레벨만큼 주황 갈매기
  for (let i = 0; i < level; i++) b.add(box(0.26, 0.06, 0.02), b.glow(C.orange, 1.1, 0.25, 2.5), 0.62, 3.7 + i * 0.1, 1.07, b.group, [0, 0, 0], false);
  // 사다리
  b.add(box(0.07, 3.4, 0.07), wood, -0.25, 1.7, 0.84, b.group, [-0.14, 0, 0]);
  b.add(box(0.07, 3.4, 0.07), wood, 0.25, 1.7, 0.84, b.group, [-0.14, 0, 0]);
  for (let i = 0; i < 7; i++) b.add(box(0.5, 0.05, 0.05), steel, 0, 0.35 + i * 0.47, 0.87 - i * 0.065);
  // 골함석 지붕
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) b.add(box(0.08, 1.0, 0.08), metal, sx * 0.98, 4.6, sz * 0.98);
  b.add(box(2.35, 0.06, 2.35), paint, 0, 5.15, 0, b.group, [0.1, 0, 0]);
  for (let i = 0; i < 7; i++) b.add(box(0.06, 0.05, 2.35), i % 3 === 1 ? rust : dark, -1.05 + i * 0.35, 5.2, 0, b.group, [0.1, 0, 0]);
  searchlight(b, 0.85, 5.35, -0.85, 0.5);
  if (level >= 2) {
    b.add(cyl(0.02, 0.02, 1.0, 6), steel, -0.9, 5.7, 0.9);
    b.add(sph(0.08, 8, 6), b.glow(C.red, 1.6, 1.2, 5), -0.9, 6.25, 0.9, b.group, [0, 0, 0], false);
  }
  if (level >= 3) b.add(box(0.5, 0.3, 0.02), b.glow(C.orange, 0.9, 0.3, 2), -0.64, 6.0, 0.9);
  // 포탑 머리
  const head = new THREE.Group();
  head.position.set(0, 3.6, 0);
  b.group.add(head);
  b.add(cyl(0.42, 0.5, 0.18, 12), dark, 0, 0.09, 0, head);
  b.add(box(0.6, 0.42, 0.72), metal, 0, 0.4, 0.05, head);
  b.add(box(0.64, 0.08, 0.76), steel, 0, 0.63, 0.05, head);
  for (const s of [-1, 1]) b.add(box(0.06, 0.34, 0.6), paint, s * 0.33, 0.4, 0.08, head);
  b.add(box(0.26, 0.24, 0.34), b.mk(C.hazard), 0.46, 0.3, 0.1, head);           // 탄약통
  b.add(box(0.28, 0.04, 0.36), dark, 0.46, 0.43, 0.1, head);
  b.add(sph(0.07, 10, 8), b.glow(C.teal, 1.6, 0.5, 4), -0.18, 0.66, -0.25, head, [0, 0, 0], false); // 센서 눈
  b.add(box(0.12, 0.1, 0.12), dark, -0.18, 0.62, -0.18, head);
  const barrel = new THREE.Group(); barrel.position.set(0, 0.42, -0.3); head.add(barrel);
  const L = 0.85 + level * 0.1;
  b.add(box(0.24, 0.24, 0.4), dark, 0, 0, -0.1, barrel);
  b.add(cyl(0.07, 0.07, L, 10), steel, 0, 0, -0.3 - L / 2, barrel, [Math.PI / 2, 0, 0]);
  b.add(cyl(0.1, 0.1, 0.3, 10), metal, 0, 0, -0.45, barrel, [Math.PI / 2, 0, 0]);   // 반동 슬리브
  b.add(box(0.2, 0.2, 0.16), dark, 0, 0, -0.32 - L, barrel);                     // 제동기
  b.add(box(0.22, 0.05, 0.12), b.glow(C.orange, 0.6, 0.4, 6), 0, 0, -0.32 - L, barrel, [0, 0, 0], false);
  const muzzle = new THREE.Object3D(); muzzle.position.set(0, 0, -0.42 - L); barrel.add(muzzle);
  const fx = gunFx(b, muzzle, barrel, 0.14, 1);
  return b.done({ head, muzzle, ...fx });
}

function mgtower(level: number): Model {
  const b = new Builder();
  const metal = b.mk(C.gunmetal), dark = b.mk(C.dark), steel = b.mk(C.steel), conc = b.mk(C.darkConcrete), paint = b.mk(C.redPaint), rust = b.mk(C.rust);
  sandbags(b, 9, 1.0, 0.16);
  sandbags(b, 9, 0.9, 0.45);
  b.add(cyl(0.85, 1.0, 0.35, 10), conc, 0, 0.18, 0);
  b.add(tor(0.86, 0.04, 6, 20), b.glow(C.orange, 1.0, 0.45, 3), 0, 0.4, 0, b.group, [Math.PI / 2, 0, 0], false);
  b.add(cyl(0.36, 0.48, 0.8, 8), metal, 0, 0.75, 0);
  b.add(cyl(0.5, 0.5, 0.08, 12), dark, 0, 1.18, 0);
  const head = new THREE.Group();
  head.position.set(0, 1.25, 0);
  b.group.add(head);
  b.add(box(0.8, 0.46, 0.85), metal, 0, 0.2, 0.08, head);
  b.add(box(0.84, 0.06, 0.88), steel, 0, 0.45, 0.08, head);
  // 경사 방패 (낡은 빨간 도장 + 경고 띠 + 청록 조준창)
  b.add(box(1.12, 0.62, 0.08), paint, 0, 0.32, -0.42, head, [-0.18, 0, 0]);
  b.add(box(1.14, 0.05, 0.1), steel, 0, 0.62, -0.47, head, [-0.18, 0, 0]);
  b.add(box(0.3, 0.12, 0.1), rust, -0.35, 0.12, -0.38, head, [-0.18, 0, 0]);
  hazardStripe(b, 1.0, 0.07, 0, 0.08, -0.45, 7, head);
  b.add(box(0.26, 0.05, 0.04), b.glow(C.teal, 1.5, 0.35, 3), 0.25, 0.48, -0.5, head, [-0.18, 0, 0], false);
  // 탄약통 + 탄띠
  b.add(box(0.3, 0.3, 0.42), b.mk(C.hazard), 0.6, 0.15, 0.1, head);
  b.add(box(0.32, 0.04, 0.44), dark, 0.6, 0.32, 0.1, head);
  const brass = b.mk(0xc9a14a);
  for (let i = 0; i < 5; i++) b.add(box(0.05, 0.03, 0.09), brass, 0.44 - i * 0.06, 0.28 - i * 0.012, -0.08, head);
  // 회전 총열 (레벨 따라 3~5 개)
  const barrel = new THREE.Group(); barrel.position.set(0, 0.26, -0.5); head.add(barrel);
  b.add(cyl(0.13, 0.13, 0.22, 10), dark, 0, 0, -0.05, barrel, [Math.PI / 2, 0, 0]);
  const spin = new THREE.Group(); barrel.add(spin);
  const nb = level + 2;
  for (let i = 0; i < nb; i++) {
    const a = (i / nb) * Math.PI * 2;
    b.add(cyl(0.035, 0.035, 1.0, 6), steel, Math.cos(a) * 0.075, Math.sin(a) * 0.075, -0.65, spin, [Math.PI / 2, 0, 0]);
  }
  for (const z of [-0.4, -1.05]) b.add(cyl(0.12, 0.12, 0.06, 10), metal, 0, 0, z, spin, [Math.PI / 2, 0, 0]);
  b.add(cyl(0.035, 0.035, 0.05, 6), b.glow(C.orange, 0.5, 0.3, 8), 0, 0, -1.14, spin, [Math.PI / 2, 0, 0], false);
  b.add(sph(0.07, 10, 8), b.glow(C.red, 1.6, 0.8, 7), -0.25, 0.52, 0.1, head, [0, 0, 0], false);
  const muzzle = new THREE.Object3D(); muzzle.position.set(0, 0, -1.17); barrel.add(muzzle);
  const fx = gunFx(b, muzzle, barrel, 0.06, 0.75, spin);
  return b.done({ head, muzzle, ...fx });
}

function barricade(): Model {
  const b = new Builder();
  const wood = b.mk(C.wood), dark = b.mk(C.darkWood), metal = b.mk(C.gunmetal), steel = b.mk(C.steel), rust = b.mk(C.rust), paint = b.mk(C.redPaint);
  // 강철 기둥 (콘크리트 블록에 박힘)
  const conc = b.mk(C.darkConcrete);
  for (const s of [-1, 1]) {
    b.add(box(0.36, 0.26, 0.4), conc, s * 0.84, 0.13, 0);
    b.add(box(0.14, 1.5, 0.14), metal, s * 0.84, 0.95, 0);
    b.add(cone(0.1, 0.28, 4), steel, s * 0.84, 1.84, 0);
  }
  // 판자 (앞뒤 엇갈림) + 함석판 패치
  [0.36, 0.72, 1.08].forEach((y, i) => b.add(box(1.95, 0.26, 0.08), i % 2 ? wood : dark, 0, y, i % 2 ? 0.07 : -0.07, b.group, [0, 0, (i - 1) * 0.03]));
  b.add(box(0.8, 0.7, 0.03), rust, -0.4, 0.62, -0.13, b.group, [0, 0, 0.06]);
  b.add(box(0.6, 0.5, 0.03), paint, 0.48, 0.85, -0.13, b.group, [0, 0, -0.08]);
  for (let i = 0; i < 4; i++) b.add(box(0.03, 0.66, 0.035), metal, -0.72 + i * 0.12, 0.62, -0.15, b.group, [0, 0, 0.06]); // 골
  hazardStripe(b, 0.9, 0.12, 0.45, 0.3, -0.13, 6);
  // 뒤 버팀목
  b.add(box(0.1, 1.9, 0.07), wood, 0, 0.75, 0.15, b.group, [0, 0, 0.78]);
  b.add(box(0.1, 1.9, 0.07), wood, 0, 0.75, 0.15, b.group, [0, 0, -0.78]);
  // 꼭대기 철조망 (고리 + 가시)
  const wire = b.mk(0x5a5f66);
  for (let i = 0; i < 5; i++) b.add(tor(0.13, 0.012, 4, 10), wire, -0.8 + i * 0.4, 1.38, 0, b.group, [0, Math.PI / 2, 0], false);
  b.add(box(1.9, 0.02, 0.02), wire, 0, 1.38, 0);
  for (let i = 0; i < 5; i++) b.add(cone(0.05, 0.22, 4), steel, -0.8 + i * 0.4, 1.32, -0.12, b.group, [-0.9, 0, 0]);
  // 경고등
  b.add(cyl(0.06, 0.06, 0.08, 8), dark, 0.84, 2.0, 0);
  b.add(sph(0.065, 8, 6), b.glow(C.orange, 1.4, 1.0, 4), 0.84, 2.07, 0, b.group, [0, 0, 0], false);
  return b.done();
}

function trap(): Model {
  const b = new Builder();
  const dark = b.mk(0x262a2f), steel = b.mk(C.steel), metal = b.mk(C.gunmetal);
  const ring = b.glow(C.orange, 1.0, 0.55, 3);
  b.add(cyl(0.95, 1.0, 0.12, 16), dark, 0, 0.06, 0);
  // 테두리 경고 줄무늬 (주황/검정 번갈아)
  const o = b.mk(C.hazard);
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    b.add(box(0.36, 0.04, 0.12), i % 2 ? dark : o, Math.cos(a) * 0.9, 0.12, Math.sin(a) * 0.9, b.group, [0, -a + Math.PI / 2, 0], false);
  }
  b.add(tor(0.72, 0.04, 6, 24), ring, 0, 0.15, 0, b.group, [Math.PI / 2, 0, 0], false);
  // 회전 톱날 고리
  const spikes = new THREE.Group(); b.group.add(spikes);
  b.add(cyl(0.6, 0.6, 0.05, 16), metal, 0, 0.14, 0, spikes);
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    b.add(cone(0.07, 0.4, 4), steel, Math.cos(a) * 0.5, 0.33, Math.sin(a) * 0.5, spikes, [0, 0, 0.15]);
  }
  // 중앙 방전 코일 (청록)
  b.add(cyl(0.16, 0.2, 0.2, 10), dark, 0, 0.22, 0);
  b.add(cone(0.09, 0.42, 6), steel, 0, 0.53, 0);
  const coil = b.glow(C.teal, 1.3, 0.8, 9);
  b.add(tor(0.12, 0.02, 4, 14), coil, 0, 0.36, 0, b.group, [Math.PI / 2, 0, 0], false);
  b.add(tor(0.09, 0.018, 4, 12), coil, 0, 0.46, 0, b.group, [Math.PI / 2, 0, 0], false);
  return b.done({ anim: (t) => { spikes.rotation.y = t * 0.8; } });
}

function lab(): Model {
  const b = new Builder();
  const wall = b.mk(C.white), panel = b.mk(0x8f9698), teal = b.mk(C.tealPaint), dark = b.mk(C.dark), metal = b.mk(C.gunmetal), steel = b.mk(C.steel), conc = b.mk(C.darkConcrete), rust = b.mk(C.rust);
  const glass = b.mk(0x6fd8cc, 0x2ee6d6, 0.35, { opacity: 0.38 });
  const liquid = b.glow(C.green, 1.1, 0.35, 2.4);
  const vialT = b.glow(C.teal, 1.2, 0.3, 3), vialO = b.glow(C.orange, 1.1, 0.3, 2.6);
  // 기초 + 컨테이너형 실험동
  b.add(box(3.4, 0.25, 3.4), conc, 0, 0.12, 0);
  b.add(box(3.1, 1.7, 3.1), wall, 0, 1.1, 0);
  for (let i = 0; i < 9; i++) b.add(box(0.05, 1.7, 3.14), panel, -1.4 + i * 0.35, 1.1, 0);    // 패널 이음
  b.add(box(3.2, 0.14, 3.2), teal, 0, 1.97, 0);
  b.add(box(3.15, 0.18, 3.15), teal, 0, 0.42, 0);
  b.add(box(0.9, 0.5, 0.02), rust, 1.0, 0.7, -1.56);                               // 녹 얼룩
  // 정면: 문 + 큰 유리 진열창 (안에 빛나는 약병 선반)
  b.add(box(0.8, 1.3, 0.08), metal, -0.85, 0.9, -1.58);
  b.add(box(0.5, 0.25, 0.04), b.glow(C.green, 0.8, 0.2, 1.6), -0.85, 1.3, -1.63);
  b.add(box(1.5, 0.95, 0.04), dark, 0.55, 1.2, -1.57);                             // 창 안쪽 어둠
  for (const y of [0.85, 1.25]) {
    b.add(box(1.4, 0.04, 0.2), steel, 0.55, y, -1.5);
    for (let i = 0; i < 6; i++) b.add(cyl(0.045, 0.045, 0.2, 6), i % 3 === 1 ? vialO : i % 2 ? liquid : vialT, 0.0 + i * 0.22, y + 0.12, -1.5, b.group, [0, 0, 0], false);
  }
  b.add(box(1.5, 0.95, 0.03), glass, 0.55, 1.2, -1.6, b.group, [0, 0, 0], false);
  b.add(box(1.6, 0.06, 0.08), steel, 0.55, 1.7, -1.6);
  b.add(box(1.6, 0.06, 0.08), steel, 0.55, 0.7, -1.6);
  // 생물재해 표지 (주황)
  b.add(box(0.5, 0.5, 0.03), b.mk(C.hazard), -0.85, 1.78, -1.6, b.group, [0, 0, Math.PI / 4]);
  b.add(sph(0.1, 8, 6), dark, -0.85, 1.78, -1.62);
  for (const s of [-1, 1]) b.add(box(0.05, 0.7, 1.1), b.glow(0x7ff0d4, 0.8, 0.15, 2), s * 1.57, 1.2, 0.2);
  // 옆 가스통
  for (let i = 0; i < 3; i++) {
    b.add(cyl(0.16, 0.16, 1.1, 10), i === 1 ? b.mk(C.redPaint) : metal, 1.75, 0.8, -0.7 + i * 0.4);
    b.add(cyl(0.06, 0.06, 0.12, 6), steel, 1.75, 1.41, -0.7 + i * 0.4);
  }
  // 배관
  b.add(cyl(0.05, 0.05, 2.6, 6), steel, -1.62, 1.1, 0, b.group, [Math.PI / 2, 0, 0]);
  b.add(cyl(0.05, 0.05, 1.0, 6), steel, -1.62, 1.6, 1.3);
  // 지붕 위 유리 돔 + 배양 플라스크
  b.add(cyl(0.95, 1.05, 0.25, 16), metal, 0, 2.15, 0);
  b.add(tor(0.98, 0.04, 6, 24), b.glow(C.teal, 1.2, 0.4, 2), 0, 2.28, 0, b.group, [Math.PI / 2, 0, 0], false);
  b.add(sph(0.9, 18, 10), glass, 0, 2.3, 0, b.group, [0, 0, 0], false);
  for (let i = 0; i < 4; i++) b.add(box(0.04, 0.9, 0.04), steel, Math.cos(i * 1.57) * 0.62, 2.6, Math.sin(i * 1.57) * 0.62, b.group, [Math.sin(i * 1.57) * 0.75, 0, -Math.cos(i * 1.57) * 0.75]);
  const flask = new THREE.Group(); flask.position.set(0, 2.45, 0); b.group.add(flask);
  b.add(cyl(0.2, 0.34, 0.8, 12), liquid, 0, 0, 0, flask);
  b.add(sph(0.22), liquid, 0, 0.5, 0, flask);
  b.add(cyl(0.07, 0.07, 0.35, 8), steel, 0, 0.8, 0, flask);
  // 안테나와 굴뚝
  b.add(cyl(0.04, 0.04, 1.4, 6), steel, 1.2, 3.0, 1.1);
  b.add(sph(0.08), b.glow(C.red, 1.4, 0.9, 6), 1.2, 3.7, 1.1);
  b.add(box(0.5, 0.9, 0.5), dark, -1.1, 2.55, 1.0);
  b.add(box(0.56, 0.08, 0.56), steel, -1.1, 3.0, 1.0);
  const pad = new THREE.Group(); b.group.add(pad);
  for (let i = 0; i < 3; i++) b.add(sph(0.12), glass, 0, 0, 0, pad, [0, 0, 0], false);
  return b.done({
    anim: (t) => {
      flask.rotation.y = t * 0.9; flask.position.y = 2.45 + Math.sin(t * 2) * 0.05;
      pad.children.forEach((c, i) => c.position.set(-1.1 + Math.sin(t * 0.8 + i * 2) * 0.12, 3.1 + ((t * 0.6 + i * 0.35) % 1) * 0.8, 1.0));
    },
  });
}

/** 숙소: 나무 바닥 위 군용 A형 텐트 두 동 + 모래주머니 + 랜턴 + 깃발 */
function barracks(): Model {
  const b = new Builder();
  const deck = b.mk(C.wood), dark = b.mk(C.darkWood), canvas = b.mk(C.canvas), canvasDk = b.mk(C.canvasDk), metal = b.mk(C.gunmetal), steel = b.mk(C.steel);
  const bag = b.mk(C.sandbag), inside = b.mk(0x15120e), cot = b.mk(0x4d5a3a), cloth = b.mk(C.red);
  b.add(box(3.5, 0.2, 3.1), dark, 0, 0.1, 0);
  for (let i = 0; i < 7; i++) b.add(box(0.46, 0.04, 3.05), deck, -1.5 + i * 0.5, 0.22, 0);
  // 텐트 두 동 (앞쪽 -z 로 입구), 큰 것과 작은 것
  const tent = (x: number, w: number, h: number, len: number) => {
    b.add(prism(w, h, len), canvas, x, 0.24, 0.1);
    b.add(prism(w * 0.98, h * 0.98, 0.05), canvasDk, x, 0.24, 0.1 + len / 2 + 0.01);    // 뒷면
    b.add(prism(w * 0.62, h * 0.62, 0.04), inside, x, 0.24, 0.1 - len / 2 - 0.005);     // 열린 입구 (어둠)
    for (const s of [-1, 1]) b.add(prism(w * 0.24, h * 0.62, 0.03), canvasDk, x + s * w * 0.2, 0.24, 0.1 - len / 2 - 0.06, b.group, [0, s * 0.5, 0]); // 걷어 올린 자락
    b.add(box(0.06, 0.06, len + 0.2), metal, x, 0.24 + h, 0.1);                           // 용마루 봉
    for (const s of [-1, 1]) b.add(box(0.05, h + 0.1, 0.05), metal, x, 0.24 + h / 2, 0.1 + s * (len / 2 + 0.05));
    for (let i = 0; i < 3; i++) b.add(box(w + 0.02, 0.04, 0.05), canvasDk, x, 0.24 + h * 0.5, 0.1 - len / 2 + (i + 0.5) * (len / 3), b.group, [0, 0, 0], false);
    b.add(box(w * 0.4, 0.1, 0.5), cot, x, 0.4, 0.1 - len / 2 + 0.6);                  // 입구로 보이는 야전침대
    for (const s of [-1, 1]) b.add(box(0.03, 0.03, 0.9), steel, x + s * (w / 2 + 0.25), 0.3, 0.1, b.group, [0, 0, s * 0.9]); // 줄
  };
  tent(-0.75, 1.8, 1.75, 2.6);
  tent(0.95, 1.3, 1.3, 2.2);
  // 모래주머니 담 (뒤·옆)
  for (let i = 0; i < 6; i++) b.add(box(0.55, 0.26, 0.32), bag, -1.4 + i * 0.56, 0.36, 1.42, b.group, [0, (i % 2) * 0.12, 0]);
  // 랜턴 (따뜻한 주황)
  b.add(box(0.06, 1.4, 0.06), dark, 0.2, 0.9, -1.35);
  b.add(box(0.3, 0.05, 0.05), dark, 0.32, 1.58, -1.35);
  b.add(box(0.14, 0.2, 0.14), b.glow(C.warm, 1.4, 0.25, 5), 0.45, 1.45, -1.35);
  // 보급 상자
  const crate = b.mk(0x5b5a3c);
  b.add(box(0.5, 0.4, 0.4), crate, 1.45, 0.44, -1.25, b.group, [0, 0.2, 0]);
  b.add(box(0.52, 0.06, 0.42), b.mk(C.hazard), 1.45, 0.5, -1.25, b.group, [0, 0.2, 0]);
  // 깃발 (빨강 + 청록 띠)
  b.add(cyl(0.035, 0.035, 2.6, 6), steel, -1.55, 1.5, -1.3);
  const flag = new THREE.Group(); flag.position.set(-1.55, 2.55, -1.3); b.group.add(flag);
  b.add(box(0.7, 0.42, 0.03), cloth, 0.36, 0, 0, flag);
  b.add(box(0.7, 0.08, 0.035), b.glow(C.teal, 0.8, 0.2, 2), 0.36, -0.08, 0, flag);
  return b.done({ anim: (t) => { flag.rotation.y = Math.sin(t * 3) * 0.25; } });
}

/** 교환소: 골함석 차양 노점 + 쌓인 상자 + 빛나는 교환 간판 */
function shop(): Model {
  const b = new Builder();
  const wood = b.mk(C.wood), dark = b.mk(C.darkWood), conc = b.mk(C.darkConcrete), metal = b.mk(C.gunmetal), steel = b.mk(C.steel), red = b.mk(C.redPaint), cream = b.mk(C.cream), rust = b.mk(C.rust);
  const crate = b.mk(0x6b5a3a), crateG = b.mk(0x4f5a3a), hz = b.mk(C.hazard);
  b.add(box(3.5, 0.22, 3.1), conc, 0, 0.11, 0);
  // 뒤 창고 (컨테이너)
  b.add(box(3.1, 1.3, 1.1), metal, 0, 0.85, 0.8);
  for (let i = 0; i < 10; i++) b.add(box(0.05, 1.3, 1.12), i % 4 === 2 ? rust : steel, -1.4 + i * 0.31, 0.85, 0.8);
  b.add(box(3.2, 0.12, 1.3), dark, 0, 1.55, 0.8);
  // 카운터 (판자 + 금속 상판)
  b.add(box(2.7, 0.9, 0.7), wood, 0, 0.65, -0.55);
  for (let i = 0; i < 3; i++) b.add(box(2.72, 0.04, 0.72), dark, 0, 0.35 + i * 0.25, -0.55);
  b.add(box(2.9, 0.08, 0.9), steel, 0, 1.12, -0.55);
  hazardStripe(b, 2.6, 0.1, 0, 0.98, -0.92, 14);
  // 카운터 위 물건: 저울 + 상자 + 청록 약병
  b.add(box(0.4, 0.05, 0.3), metal, -0.8, 1.19, -0.55);
  b.add(cyl(0.12, 0.12, 0.02, 10), steel, -0.8, 1.32, -0.55);
  b.add(cyl(0.02, 0.02, 0.14, 6), steel, -0.8, 1.24, -0.55);
  b.add(box(0.3, 0.22, 0.25), crateG, 0.2, 1.27, -0.5, b.group, [0, 0.3, 0]);
  for (let i = 0; i < 3; i++) b.add(cyl(0.05, 0.05, 0.18, 6), b.glow(C.teal, 1.2, 0.3, 2 + i), 0.75 + i * 0.14, 1.25, -0.6, b.group, [0, 0, 0], false);
  for (const s of [-1, 1]) b.add(box(0.14, 2.3, 0.14), metal, s * 1.45, 1.25, -1.2);
  // 골함석 차양 (빨강/크림 줄무늬, 녹슨 끝)
  for (let i = 0; i < 7; i++) b.add(box(0.43, 0.06, 1.7), i % 2 ? cream : red, -1.29 + i * 0.43, 2.28, -0.7, b.group, [0.28, 0, 0]);
  for (let i = 0; i < 8; i++) b.add(box(0.04, 0.05, 1.72), dark, -1.5 + i * 0.43, 2.32, -0.7, b.group, [0.28, 0, 0]);
  b.add(box(3.05, 0.08, 0.08), rust, 0, 2.06, -1.5);
  // 교환 간판: 판 + 청록 네온 테 + 주황 화살표 두 개 (서로 반대 방향)
  const sign = new THREE.Group(); sign.position.set(0, 2.98, -1.25); b.group.add(sign);
  b.add(box(0.06, 0.5, 0.06), metal, 0, -0.42, 0.02);
  b.add(box(1.3, 0.62, 0.08), dark, 0, 0, 0, sign);
  const neon = b.glow(C.teal, 1.6, 0.35, 3);
  b.add(box(1.36, 0.05, 0.06), neon, 0, 0.32, -0.03, sign, [0, 0, 0], false);
  b.add(box(1.36, 0.05, 0.06), neon, 0, -0.32, -0.03, sign, [0, 0, 0], false);
  for (const s of [-1, 1]) b.add(box(0.05, 0.68, 0.06), neon, s * 0.67, 0, -0.03, sign, [0, 0, 0], false);
  const arrow = b.glow(C.orange, 1.7, 0.5, 4);
  for (const [y, d] of [[0.1, 1], [-0.12, -1]] as const) {
    b.add(box(0.6, 0.07, 0.04), arrow, -d * 0.05, y, -0.06, sign, [0, 0, 0], false);
    b.add(box(0.2, 0.07, 0.04), arrow, d * 0.24, y + 0.05, -0.06, sign, [0, 0, -d * 0.7], false);
    b.add(box(0.2, 0.07, 0.04), arrow, d * 0.24, y - 0.05, -0.06, sign, [0, 0, d * 0.7], false);
  }
  // 쌓인 상자 + 드럼통
  for (let i = 0; i < 3; i++) {
    b.add(box(0.5, 0.45, 0.5), i % 2 ? crate : crateG, -1.1 + i * 0.4, 1.83, 0.95, b.group, [0, i * 0.4, 0]);
    b.add(box(0.52, 0.06, 0.52), hz, -1.1 + i * 0.4, 1.9, 0.95, b.group, [0, i * 0.4, 0]);
  }
  b.add(box(0.55, 0.5, 0.55), crate, 1.1, 0.5, 1.1, b.group, [0, 0.3, 0]);
  b.add(box(0.45, 0.4, 0.45), crateG, 1.15, 0.95, 1.12, b.group, [0, -0.2, 0]);
  b.add(cyl(0.24, 0.24, 0.7, 10), red, 1.55, 0.57, -0.3);
  b.add(cyl(0.25, 0.25, 0.05, 10), steel, 1.55, 0.75, -0.3);
  b.add(cyl(0.24, 0.24, 0.7, 10), metal, 1.5, 0.57, 0.25);
  b.add(sph(0.12, 8, 6), b.glow(C.warm, 1.3, 0.3, 4), -1.45, 2.45, -1.2, b.group, [0, 0, 0], false);
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

/**
 * 핵: 육각 콘크리트 받침, 케이블로 이어진 네 발전 기둥, 떠 있는 맥동 수정, 떠도는 파편, 육각 격자 보호막.
 * level 이 오르면 고리가 늘어난다.
 */
export function buildCoreModel(level: number): Model & { crystal: THREE.Mesh; shield: THREE.Mesh; lattice: THREE.Mesh; rings: THREE.Mesh[]; crystalMat: Lam; innerMat: Lam } {
  const b = new Builder();
  const conc = b.mk(C.concrete), dark = b.mk(C.darkConcrete), metal = b.mk(C.gunmetal), steel = b.mk(C.steel), black = b.mk(C.dark), hz = b.mk(C.hazard);
  const cm = b.mk(0x66e0ff, 0x33bbff, 1.3);
  b.add(cyl(3.0, 3.3, 0.35, 6), dark, 0, 0.17, 0);
  b.add(cyl(2.5, 2.8, 0.35, 6), conc, 0, 0.5, 0);
  // 받침 가장자리 경고 줄무늬
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2;
    b.add(box(0.5, 0.06, 0.12), i % 2 ? black : hz, Math.cos(a) * 2.62, 0.36, Math.sin(a) * 2.62, b.group, [0, -a + Math.PI / 2, 0], false);
  }
  b.add(cyl(1.5, 1.8, 0.4, 8), metal, 0, 0.88, 0);
  b.add(cyl(1.2, 1.5, 0.12, 8), steel, 0, 1.12, 0);
  const rune = b.glow(C.teal, 1.0, 0.45, 2);
  b.add(tor(2.55, 0.05, 6, 40), rune, 0, 0.7, 0, b.group, [Math.PI / 2, 0, 0], false);
  b.add(tor(1.25, 0.05, 6, 32), rune, 0, 1.2, 0, b.group, [Math.PI / 2, 0, 0], false);
  // 수정 아래 투사 렌즈
  b.add(cyl(0.6, 0.8, 0.3, 8), black, 0, 1.3, 0);
  b.add(cyl(0.45, 0.45, 0.04, 12), b.glow(C.teal, 1.8, 0.6, 2.4), 0, 1.47, 0, b.group, [0, 0, 0], false);
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    const px = Math.cos(a) * 2.25, pz = Math.sin(a) * 2.25;
    b.add(box(0.5, 1.8, 0.5), metal, px, 1.4, pz, b.group, [0, -a, 0]);
    b.add(box(0.54, 0.3, 0.54), hz, px, 0.8, pz, b.group, [0, -a, 0]);
    for (let k = 0; k < 3; k++) b.add(box(0.56, 0.05, 0.56), black, px, 1.3 + k * 0.3, pz, b.group, [0, -a, 0]); // 방열 핀
    b.add(box(0.6, 0.2, 0.6), black, px, 2.35, pz, b.group, [0, -a, 0]);
    b.add(cone(0.22, 0.45, 4), b.glow(C.teal, 1.3, 0.6, 3 + i * 0.4), px, 2.7, pz, b.group, [0, Math.PI / 4, 0], false);
    // 기둥 → 중심 케이블
    const cx = Math.cos(a) * 1.45, cz = Math.sin(a) * 1.45;
    b.add(cyl(0.06, 0.06, 1.6, 6), black, cx, 0.82, cz, b.group, [0, -a, Math.PI / 2]);
    b.add(box(0.1, 0.04, 0.5), b.glow(C.teal, 1.0, 0.8, 4 + i), cx, 0.9, cz, b.group, [0, -a + Math.PI / 2, 0], false);
  }
  const oct = g('oct', () => new THREE.OctahedronGeometry(1, 0));
  const crystal = b.add(oct, cm, 0, 2.9, 0);
  crystal.scale.set(0.85, 1.4, 0.85);
  const innerMat = b.mk(0xffffff, 0xffffff, 0.9);
  const inner = b.add(oct, innerMat, 0, 0, 0, crystal, [0, 0.4, 0], false);
  inner.scale.setScalar(0.45);
  // 떠도는 파편
  const shards = new THREE.Group(); shards.position.y = 2.9; b.group.add(shards);
  for (let i = 0; i < 5; i++) {
    const s = b.add(oct, cm, 0, 0, 0, shards, [0, 0, 0], false);
    s.scale.set(0.14, 0.26, 0.14);
    s.userData.a = (i / 5) * Math.PI * 2; s.userData.r = 1.15 + (i % 2) * 0.25;
  }
  const rings: THREE.Mesh[] = [];
  for (let i = 0; i <= level; i++) {
    const r = b.add(tor(1.55 + i * 0.3, 0.035, 6, 36), b.glow(i % 2 ? 0xa8f0ff : C.teal, 1.1, 0.4, 2 + i), 0, 2.9, 0, b.group, [Math.PI / 2 + i * 0.5, i * 0.7, 0], false);
    rings.push(r);
  }
  const shieldMat = new THREE.MeshBasicMaterial({ color: 0x66e0ff, transparent: true, opacity: 0.08, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending });
  const shield = new THREE.Mesh(g('shield', () => new THREE.SphereGeometry(3.4, 24, 14, 0, Math.PI * 2, 0, Math.PI / 2)), shieldMat);
  shield.position.y = 0.4;
  shield.userData.fx = true;
  b.group.add(shield);
  // 보호막 격자 (낮은 면수 구의 와이어프레임 = 육각/삼각 격자 느낌)
  const latMat = new THREE.MeshBasicMaterial({ color: 0x66e0ff, wireframe: true, transparent: true, opacity: 0.12, depthWrite: false, blending: THREE.AdditiveBlending });
  const lattice = new THREE.Mesh(g('lattice', () => new THREE.SphereGeometry(3.42, 18, 7, 0, Math.PI * 2, 0, Math.PI / 2)), latMat);
  lattice.userData.fx = true;
  shield.add(lattice);
  const light = new THREE.PointLight(0x66ccff, 2.2, 22, 1.6);
  light.position.set(0, 3.2, 0);
  b.group.add(light);
  b.group.userData.light = light;
  const anim = (t: number) => {
    shards.rotation.y = -t * 0.5;
    shards.children.forEach((s, i) => {
      const a = s.userData.a as number, r = s.userData.r as number;
      s.position.set(Math.cos(a) * r, Math.sin(t * 1.4 + i * 1.3) * 0.35, Math.sin(a) * r);
      s.rotation.y = t * 1.5 + i;
    });
    inner.rotation.y = -t * 1.6;
    lattice.rotation.y = t * 0.05;
  };
  return Object.assign(b.done({ anim }), { crystal, shield, lattice, rings, crystalMat: cm, innerMat });
}
