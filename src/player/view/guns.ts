// 무기 3D 모델 (프리미티브 조합). 총구가 -z, 위가 +y, 손잡이(방아쇠 손)가 원점. 단위 m.
// 움직이는 부품(슬라이드/탄창/펌프/볼트/실린더)은 parts 로 돌려줘서 발사·재장전 연출에 쓴다.
import * as THREE from 'three';
import type { GunId } from '../../data';

export type PartName = 'mag' | 'slide' | 'pump' | 'bolt' | 'drum' | 'hammer';
export interface GunPart { obj: THREE.Object3D; rest: THREE.Vector3; restRot: THREE.Euler }
export interface GunModel {
  root: THREE.Group;
  muzzle: THREE.Object3D;
  /** 탄피가 나오는 위치 */
  eject: THREE.Object3D;
  parts: Partial<Record<PartName, GunPart>>;
  /** 조준경으로 보는 총(스코프) */
  scoped: boolean;
}

// ── 재질 (모든 총이 공유) ────────────────────────────────────────────────────────────────
const mat = (color: number, metal = 0.25, rough = 0.5, emissive = 0x000000, ei = 0) =>
  new THREE.MeshStandardMaterial({ color, metalness: metal * 0.45, roughness: rough, emissive, emissiveIntensity: ei });
let MATS: ReturnType<typeof makeMats> | null = null;
function makeMats() {
  return {
    steel: mat(0xa4abb4, 0.7, 0.4),
    dark: mat(0x3a3f47, 0.5, 0.5),
    black: mat(0x1d1f23, 0.3, 0.6),
    poly: mat(0x3d4148, 0.05, 0.8),
    wood: mat(0x7b4a28, 0.0, 0.7),
    woodDk: mat(0x55331b, 0.0, 0.75),
    brass: mat(0xc9a14a, 0.8, 0.3),
    shell: mat(0xc0392b, 0.0, 0.6),
    olive: mat(0x56603f, 0.1, 0.75),
    redDot: mat(0xff2a2a, 0, 0.3, 0xff2020, 1.6),
    lens: mat(0x6fd3ff, 0.2, 0.1, 0x1a6a8a, 0.9),
    white: mat(0xf3f3ee, 0, 0.5, 0xffffff, 0.4),
  };
}

type Geo = THREE.BufferGeometry;
const geoCache = new Map<string, Geo>();
const boxGeo = (w: number, h: number, d: number) => {
  const k = `b${w},${h},${d}`;
  if (!geoCache.has(k)) geoCache.set(k, new THREE.BoxGeometry(w, h, d));
  return geoCache.get(k)!;
};
/** z 축 방향 원통 (총열 등) */
const cylGeo = (r: number, len: number, seg = 10) => {
  const k = `c${r},${len},${seg}`;
  if (!geoCache.has(k)) { const g = new THREE.CylinderGeometry(r, r, len, seg); g.rotateX(Math.PI / 2); geoCache.set(k, g); }
  return geoCache.get(k)!;
};

class Builder {
  root = new THREE.Group();
  parts: Partial<Record<PartName, GunPart>> = {};
  constructor(public M: ReturnType<typeof makeMats>) {}
  private put(o: THREE.Object3D, parent: THREE.Object3D, x: number, y: number, z: number, rx = 0, ry = 0, rz = 0) {
    o.position.set(x, y, z); o.rotation.set(rx, ry, rz);
    parent.add(o);
    return o;
  }
  box(w: number, h: number, d: number, m: THREE.Material, x: number, y: number, z: number, rx = 0, parent: THREE.Object3D = this.root, ry = 0, rz = 0) {
    const mesh = new THREE.Mesh(boxGeo(w, h, d), m);
    mesh.castShadow = w * h * d > 2e-4;
    return this.put(mesh, parent, x, y, z, rx, ry, rz);
  }
  cyl(r: number, len: number, m: THREE.Material, x: number, y: number, z: number, parent: THREE.Object3D = this.root, seg = 10) {
    const mesh = new THREE.Mesh(cylGeo(r, len, seg), m);
    mesh.castShadow = r > 0.015;
    return this.put(mesh, parent, x, y, z);
  }
  /** 움직이는 부품 그룹을 만들어 root 에 붙이고 등록 */
  group(name: PartName, x: number, y: number, z: number, rx = 0): THREE.Group {
    const g = new THREE.Group();
    this.put(g, this.root, x, y, z, rx);
    this.parts[name] = { obj: g, rest: g.position.clone(), restRot: g.rotation.clone() };
    return g;
  }
  node(x: number, y: number, z: number) { return this.put(new THREE.Object3D(), this.root, x, y, z); }
  finish(muzzle: THREE.Object3D, eject: THREE.Object3D, scale: number, scoped = false): GunModel {
    this.root.scale.setScalar(scale);
    return { root: this.root, muzzle, eject, parts: this.parts, scoped };
  }
}

// ── 권총 (슬라이드 + 폴리머 프레임) ─────────────────────────────────────────────────────────
function pistol(b: Builder): GunModel {
  const { steel, dark, poly, white, black } = b.M;
  const slide = b.group('slide', 0, 0.055, -0.13);
  b.box(0.056, 0.07, 0.3, steel, 0, 0, 0, 0, slide);
  b.box(0.058, 0.012, 0.3, dark, 0, 0.036, 0, 0, slide);                  // 윗면 띠
  for (let i = 0; i < 4; i++) b.box(0.06, 0.06, 0.008, dark, 0, 0, 0.1 + i * 0.016, 0, slide); // 후방 세로 홈
  b.box(0.01, 0.022, 0.05, black, 0.029, 0.01, -0.04, 0, slide);          // 배출구
  b.box(0.014, 0.014, 0.016, white, 0, 0.044, -0.13, 0, slide);           // 가늠쇠 (앞)
  b.box(0.03, 0.014, 0.014, dark, 0, 0.044, 0.13, 0, slide);              // 가늠쇠 (뒤)
  b.cyl(0.011, 0.04, black, 0, -0.005, -0.165, slide, 8);                 // 총열 끝
  b.box(0.05, 0.038, 0.27, poly, 0, 0.004, -0.115, 0);                    // 프레임
  b.box(0.05, 0.02, 0.07, poly, 0, -0.02, -0.19, 0);                      // 레일부
  b.box(0.052, 0.16, 0.07, poly, 0, -0.085, 0.02, 0.2);                   // 손잡이
  for (let i = 0; i < 4; i++) b.box(0.054, 0.006, 0.062, dark, 0, -0.06 - i * 0.026, 0.012 - i * 0.005, 0.2); // 그립 홈
  b.box(0.05, 0.01, 0.07, poly, 0, -0.025, -0.05, 0);                     // 방아쇠울 윗부분
  b.box(0.012, 0.045, 0.01, poly, 0, -0.05, -0.085, 0);                   // 방아쇠울 앞
  b.box(0.012, 0.01, 0.06, poly, 0, -0.072, -0.058, 0);                   // 방아쇠울 아래
  b.box(0.01, 0.026, 0.01, steel, 0, -0.04, -0.045, 0.3);                 // 방아쇠
  const mag = b.group('mag', 0, 0, 0, 0.2);
  b.box(0.044, 0.11, 0.058, dark, 0, -0.16, 0.02, 0, mag);
  b.box(0.05, 0.014, 0.066, black, 0, -0.222, 0.02, 0, mag);              // 탄창 밑판
  return b.finish(b.node(0, 0.055, -0.3), b.node(0.03, 0.065, -0.1), 1.45);
}

// ── 매그넘 리볼버 (실린더가 돈다) ──────────────────────────────────────────────────────────
function magnum(b: Builder): GunModel {
  const { steel, dark, wood, woodDk, brass, white, black } = b.M;
  b.cyl(0.02, 0.3, steel, 0, 0.045, -0.3, undefined, 12);                  // 총열
  b.box(0.016, 0.014, 0.3, dark, 0, 0.073, -0.3, 0);                      // 윗 리브
  b.box(0.034, 0.03, 0.22, dark, 0, 0.016, -0.26, 0);                     // 총열 아래 러그
  b.cyl(0.016, 0.02, black, 0, 0.045, -0.462, undefined, 8);              // 총구
  b.box(0.012, 0.022, 0.02, white, 0, 0.088, -0.44, 0);                   // 앞가늠쇠
  b.box(0.052, 0.09, 0.15, steel, 0, 0.025, -0.02, 0);                    // 프레임
  b.box(0.032, 0.014, 0.02, dark, 0, 0.078, 0.04, 0);                     // 뒷가늠쇠
  const drum = b.group('drum', 0, 0.04, -0.095);
  b.cyl(0.044, 0.085, steel, 0, 0, 0, drum, 14);
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    b.cyl(0.011, 0.088, black, Math.cos(a) * 0.027, Math.sin(a) * 0.027, 0, drum, 8);
    b.cyl(0.008, 0.01, brass, Math.cos(a) * 0.027, Math.sin(a) * 0.027, 0.046, drum, 8);
  }
  const hammer = b.group('hammer', 0, 0.075, 0.07);
  b.box(0.014, 0.04, 0.016, dark, 0, 0.01, 0.0, -0.5, hammer);
  b.box(0.05, 0.14, 0.085, woodDk, 0, -0.08, 0.05, 0.28);                 // 나무 손잡이
  b.box(0.054, 0.12, 0.012, wood, 0, -0.085, 0.01, 0.28);
  b.box(0.012, 0.012, 0.075, steel, 0, -0.04, -0.06, 0);                  // 방아쇠울
  b.box(0.012, 0.04, 0.012, steel, 0, -0.06, -0.095, 0);
  b.box(0.01, 0.026, 0.01, steel, 0, -0.03, -0.045, 0.25);                // 방아쇠
  return b.finish(b.node(0, 0.045, -0.47), b.node(0.04, 0.04, -0.09), 1.45);
}

// ── 기관단총 (접이식 개머리판, 도트 사이트, 긴 탄창) ──────────────────────────────────────
function smg(b: Builder): GunModel {
  const { steel, dark, poly, black, redDot, white } = b.M;
  b.box(0.062, 0.085, 0.32, dark, 0, 0.01, -0.12, 0);                     // 리시버
  b.box(0.066, 0.02, 0.3, poly, 0, 0.058, -0.12, 0);                      // 윗덮개
  b.cyl(0.03, 0.2, steel, 0, 0.012, -0.36, undefined, 12);                // 총열 덮개
  for (let i = 0; i < 4; i++) b.box(0.066, 0.012, 0.022, black, 0, 0.012, -0.29 - i * 0.045, 0); // 냉각 구멍
  b.cyl(0.011, 0.07, black, 0, 0.012, -0.5, undefined, 8);                 // 소염기
  b.box(0.012, 0.03, 0.012, white, 0, 0.068, -0.45, 0);                    // 앞가늠쇠
  // 레드 도트
  b.box(0.04, 0.03, 0.07, black, 0, 0.082, -0.12, 0);
  b.box(0.036, 0.034, 0.008, dark, 0, 0.11, -0.085, 0);
  b.box(0.036, 0.034, 0.008, dark, 0, 0.11, -0.155, 0);
  b.box(0.034, 0.03, 0.002, redDot, 0, 0.11, -0.119, 0);
  b.box(0.05, 0.1, 0.07, poly, 0, -0.065, 0.03, 0.22);                    // 손잡이
  b.box(0.05, 0.1, 0.06, poly, 0, -0.07, -0.34, 0);                       // 앞손잡이
  b.box(0.012, 0.012, 0.07, poly, 0, -0.045, -0.05, 0);                   // 방아쇠울
  b.box(0.012, 0.04, 0.012, poly, 0, -0.06, -0.085, 0);
  b.box(0.012, 0.012, 0.075, poly, 0, -0.08, -0.05, 0);
  b.box(0.01, 0.026, 0.01, steel, 0, -0.045, -0.045, 0.25);
  b.box(0.012, 0.012, 0.045, steel, 0.04, 0.03, -0.01, 0);                // 장전 손잡이
  // 접이식 개머리판: 두 개의 봉 + 어깨받침
  b.box(0.01, 0.01, 0.26, steel, -0.022, 0.03, 0.2, 0);
  b.box(0.01, 0.01, 0.26, steel, 0.022, 0.03, 0.2, 0);
  b.box(0.05, 0.075, 0.028, poly, 0, 0.012, 0.335, 0);
  const mag = b.group('mag', 0, 0, 0);
  b.box(0.042, 0.13, 0.062, dark, 0, -0.14, -0.1, -0.06, mag);
  b.box(0.042, 0.12, 0.062, dark, 0, -0.26, -0.082, -0.12, mag);          // 휘어진 긴 탄창
  b.box(0.046, 0.012, 0.068, black, 0, -0.325, -0.07, -0.12, mag);
  return b.finish(b.node(0, 0.012, -0.54), b.node(0.034, 0.045, -0.09), 1.4);
}

// ── 펌프 샷건 (펌프가 앞뒤로 움직인다) ──────────────────────────────────────────────────────
function shotgun(b: Builder): GunModel {
  const { steel, dark, wood, woodDk, shell, brass, black, white } = b.M;
  b.cyl(0.022, 0.66, steel, 0, 0.04, -0.4, undefined, 12);                // 총열
  b.cyl(0.019, 0.5, dark, 0, -0.005, -0.34, undefined, 10);               // 탄창관
  b.box(0.01, 0.012, 0.62, black, 0, 0.066, -0.4, 0);                     // 윗 리브
  b.cyl(0.026, 0.016, black, 0, 0.04, -0.725, undefined, 10);             // 총구 끝
  b.box(0.012, 0.018, 0.012, white, 0, 0.078, -0.7, 0);                   // 구슬 가늠쇠
  b.box(0.064, 0.095, 0.24, dark, 0, 0.02, -0.04, 0);                     // 리시버
  b.box(0.012, 0.03, 0.08, black, 0.034, 0.03, -0.04, 0);                 // 배출구
  const pump = b.group('pump', 0, -0.005, -0.4);
  b.box(0.07, 0.062, 0.2, woodDk, 0, 0, 0, 0, pump);                      // 펌프 손잡이
  for (let i = 0; i < 5; i++) b.box(0.074, 0.05, 0.008, wood, 0, 0, -0.07 + i * 0.035, 0, pump); // 홈
  b.box(0.012, 0.012, 0.07, steel, 0, -0.07, -0.05, 0);                   // 방아쇠울
  b.box(0.012, 0.04, 0.012, steel, 0, -0.05, -0.09, 0);
  b.box(0.01, 0.026, 0.01, steel, 0, -0.045, -0.045, 0.25);
  b.box(0.058, 0.115, 0.34, wood, 0, -0.03, 0.26, -0.13);                 // 개머리판
  b.box(0.06, 0.12, 0.02, black, 0, -0.045, 0.44, -0.13);                 // 패드
  b.box(0.06, 0.1, 0.05, woodDk, 0, -0.055, 0.04, 0.3);                   // 손잡이
  // 옆구리 예비 탄
  for (let i = 0; i < 4; i++) {
    b.cyl(0.011, 0.045, shell, -0.037, 0.03, -0.02 + i * 0.026, undefined, 8);
    b.cyl(0.0115, 0.012, brass, -0.037, 0.03, -0.0 + i * 0.026 + 0.0, undefined, 8).position.z = -0.0 + i * 0.026 + 0.02;
  }
  return b.finish(b.node(0, 0.04, -0.74), b.node(0.04, 0.04, -0.05), 1.3);
}

// ── 돌격소총 (레일 핸드가드, 곡선 탄창, 홀로 사이트) ───────────────────────────────────────
function rifle(b: Builder): GunModel {
  const { steel, dark, poly, black, olive, redDot, white } = b.M;
  b.box(0.058, 0.085, 0.3, dark, 0, 0.02, -0.08, 0);                      // 리시버
  b.box(0.06, 0.07, 0.3, poly, 0, 0.012, -0.4, 0);                        // 핸드가드
  for (let i = 0; i < 6; i++) b.box(0.064, 0.012, 0.014, dark, 0, 0.052, -0.28 - i * 0.045, 0); // 레일 눈금
  for (let i = 0; i < 3; i++) b.box(0.064, 0.016, 0.03, black, 0, -0.016, -0.34 - i * 0.07, 0);  // 통풍구
  b.cyl(0.011, 0.14, steel, 0, 0.02, -0.62, undefined, 8);                // 총열 노출부
  b.cyl(0.018, 0.07, black, 0, 0.02, -0.72, undefined, 8);                // 소염기
  b.box(0.012, 0.045, 0.012, white, 0, 0.065, -0.62, 0);                  // 앞가늠쇠
  // 홀로 사이트
  b.box(0.04, 0.012, 0.09, black, 0, 0.068, -0.05, 0);
  b.box(0.044, 0.045, 0.01, dark, 0, 0.095, -0.09, 0);
  b.box(0.044, 0.045, 0.01, dark, 0, 0.095, -0.01, 0);
  b.box(0.044, 0.01, 0.09, dark, 0, 0.12, -0.05, 0);
  b.box(0.034, 0.03, 0.002, redDot, 0, 0.097, -0.05, 0);
  b.box(0.05, 0.11, 0.07, poly, 0, -0.07, 0.03, 0.25);                    // 손잡이
  b.box(0.012, 0.012, 0.075, poly, 0, -0.045, -0.06, 0);                  // 방아쇠울
  b.box(0.012, 0.04, 0.012, poly, 0, -0.06, -0.1, 0);
  b.box(0.012, 0.012, 0.08, poly, 0, -0.08, -0.06, 0);
  b.box(0.01, 0.026, 0.01, steel, 0, -0.045, -0.055, 0.25);
  b.cyl(0.018, 0.2, dark, 0, 0.03, 0.17, undefined, 8);                   // 버퍼 튜브
  b.box(0.052, 0.11, 0.2, olive, 0, 0.0, 0.34, -0.1);                     // 개머리판
  b.box(0.054, 0.12, 0.016, black, 0, 0.0, 0.445, -0.1);
  const bolt = b.group('bolt', 0.036, 0.04, -0.03);
  b.box(0.01, 0.014, 0.04, steel, 0, 0, 0, 0, bolt);                      // 장전 손잡이
  const mag = b.group('mag', 0, 0, 0);
  b.box(0.042, 0.12, 0.07, dark, 0, -0.105, -0.12, -0.12, mag);           // 곡선 탄창 (두 토막)
  b.box(0.042, 0.1, 0.07, dark, 0, -0.21, -0.1, -0.3, mag);
  b.box(0.046, 0.012, 0.074, black, 0, -0.265, -0.085, -0.3, mag);
  return b.finish(b.node(0, 0.02, -0.76), b.node(0.034, 0.05, -0.05), 1.3);
}

// ── 저격총 (스코프, 소염 제동기, 볼트 핸들, 양각대) ────────────────────────────────────────
function sniper(b: Builder): GunModel {
  const { steel, dark, poly, black, olive, lens, woodDk, wood } = b.M;
  b.box(0.06, 0.09, 0.34, dark, 0, 0.02, -0.06, 0);                       // 리시버
  b.cyl(0.018, 0.75, steel, 0, 0.03, -0.6, undefined, 12);                // 긴 총열
  b.cyl(0.026, 0.1, dark, 0, 0.03, -1.0, undefined, 10);                  // 제동기
  for (let i = 0; i < 3; i++) b.box(0.06, 0.008, 0.014, black, 0, 0.03, -0.97 - i * 0.03, 0); // 제동기 홈
  b.box(0.062, 0.065, 0.36, poly, 0, 0.005, -0.4, 0);                     // 핸드가드
  // 스코프
  b.cyl(0.026, 0.34, black, 0, 0.115, -0.12, undefined, 12);              // 경통
  b.cyl(0.037, 0.07, black, 0, 0.115, -0.3, undefined, 12);               // 앞 대물부
  b.cyl(0.034, 0.06, black, 0, 0.115, 0.06, undefined, 12);               // 뒤 접안부
  b.cyl(0.031, 0.004, lens, 0, 0.115, -0.337, undefined, 12);             // 렌즈 (앞)
  b.cyl(0.028, 0.004, lens, 0, 0.115, 0.092, undefined, 12);              // 렌즈 (뒤)
  b.cyl(0.012, 0.03, dark, 0, 0.156, -0.12, undefined, 8).rotation.set(0, 0, 0); // 조정 포탑
  b.box(0.03, 0.04, 0.03, dark, 0, 0.07, -0.2, 0);                         // 마운트
  b.box(0.03, 0.04, 0.03, dark, 0, 0.07, -0.02, 0);
  const bolt = b.group('bolt', 0.04, 0.045, 0.0);
  b.cyl(0.007, 0.07, steel, 0.03, 0, 0, bolt, 6).rotation.set(0, 0, Math.PI / 2);
  b.cyl(0.014, 0.02, black, 0.07, 0, 0, bolt, 8);                         // 볼트 손잡이 구슬
  // 썸홀 스톡
  b.box(0.056, 0.12, 0.18, olive, 0, -0.01, 0.2, 0);
  b.box(0.056, 0.05, 0.26, olive, 0, 0.04, 0.38, 0.0);                    // 볼 받침
  b.box(0.058, 0.06, 0.2, olive, 0, -0.1, 0.34, -0.05);
  b.box(0.06, 0.15, 0.02, black, 0, -0.01, 0.5, 0);
  b.box(0.05, 0.1, 0.06, olive, 0, -0.07, 0.04, 0.3);                     // 손잡이
  b.box(0.012, 0.012, 0.07, steel, 0, -0.045, -0.06, 0);
  b.box(0.012, 0.035, 0.012, steel, 0, -0.06, -0.1, 0);
  // 접힌 양각대
  b.cyl(0.006, 0.18, steel, -0.025, -0.05, -0.5, undefined, 6).rotation.set(0.1, 0, 0);
  b.cyl(0.006, 0.18, steel, 0.025, -0.05, -0.5, undefined, 6).rotation.set(0.1, 0, 0);
  const mag = b.group('mag', 0, 0, 0);
  b.box(0.04, 0.07, 0.1, dark, 0, -0.09, -0.07, 0, mag);
  void woodDk; void wood;
  return b.finish(b.node(0, 0.03, -1.06), b.node(0.034, 0.05, 0.0), 1.2, true);
}

const BUILDERS: Record<GunId, (b: Builder) => GunModel> = { pistol, magnum, smg, shotgun, rifle, sniper };

export function buildGun(id: GunId): GunModel {
  const b = new Builder((MATS ??= makeMats()));
  return BUILDERS[id](b);
}
