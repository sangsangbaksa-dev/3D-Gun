// 무기 3D 모델 (프리미티브 조합). 총구가 -z, 위가 +y, 손잡이(방아쇠 손)가 원점. 단위 m.
// 움직이는 부품(슬라이드/탄창/펌프/볼트/실린더)은 parts 로 돌려줘서 발사·재장전 연출에 쓴다.
// 룩: 건메탈 + 벗겨진 도장 + 청록/주황 발광 포인트 (팔레트: 청록 #2EE6D6 · 주황 #FF8A2A · 빨강 #E0303A).
// 조준(ADS)은 playerView 가 모델 경계 상자의 맨 위(max.y)를 시선에 맞춘다.
// 그래서 각 총에서 가장 높은 점은 반드시 가늠쇠/도트 높이여야 하고, x=0 에 있어야 한다.
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
  const glass = new THREE.MeshStandardMaterial({ color: 0x2ee6d6, metalness: 0, roughness: 0.05, emissive: 0x0d4a46, emissiveIntensity: 0.6, transparent: true, opacity: 0.22, depthWrite: false });
  return {
    gunmetal: mat(0x353b42, 0.75, 0.42),     // 기본 금속 (푸른 기 도는 건메탈)
    steel: mat(0x9aa3ad, 0.85, 0.32),        // 닳아서 드러난 맨 금속 (모서리·총열)
    dark: mat(0x262b31, 0.6, 0.5),
    black: mat(0x131518, 0.3, 0.65),
    poly: mat(0x2c3036, 0.05, 0.82),
    wood: mat(0x744022, 0.0, 0.7),
    woodDk: mat(0x4a2715, 0.0, 0.78),
    brass: mat(0xc9a14a, 0.85, 0.3),
    shell: mat(0xb3302a, 0.0, 0.6),
    olive: mat(0x4c573a, 0.1, 0.8),
    sand: mat(0x8a7656, 0.05, 0.85),          // 벗겨진 사막색 도장
    rust: mat(0x6e3820, 0.2, 0.92),           // 녹 / 벗겨진 붉은 도장
    paint: mat(0x7c2a2a, 0.15, 0.7),          // 낡은 빨간 도장
    tape: mat(0x3b3631, 0.0, 0.96),           // 그립 테이프
    teal: mat(0x2ee6d6, 0, 0.4, 0x2ee6d6, 1.5), // 발광 포인트
    orange: mat(0xff8a2a, 0, 0.4, 0xff8a2a, 1.5),
    redDot: mat(0xff3a3a, 0, 0.3, 0xe0303a, 2.4),
    lens: mat(0x2ee6d6, 0.2, 0.1, 0x1a8a84, 1.1),
    white: mat(0xf3f3ee, 0, 0.5, 0xffffff, 0.4),
    glass,
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
/** z 축 방향 원뿔대 (소염기·대물렌즈 몸통) */
const coneGeo = (rFront: number, rBack: number, len: number, seg = 10) => {
  const k = `n${rFront},${rBack},${len},${seg}`;
  if (!geoCache.has(k)) { const g = new THREE.CylinderGeometry(rFront, rBack, len, seg); g.rotateX(-Math.PI / 2); geoCache.set(k, g); }
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
  cone(rFront: number, rBack: number, len: number, m: THREE.Material, x: number, y: number, z: number, parent: THREE.Object3D = this.root, seg = 10) {
    const mesh = new THREE.Mesh(coneGeo(rFront, rBack, len, seg), m);
    mesh.castShadow = rBack > 0.015;
    return this.put(mesh, parent, x, y, z);
  }
  /** 같은 단면의 덩어리를 z 방향으로 여러 개 (톱니 홈·레일 눈금) */
  row(n: number, step: number, fn: (i: number, z: number) => void, z0: number) { for (let i = 0; i < n; i++) fn(i, z0 + i * step); }
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

/**
 * 오픈형 리플렉스(도트) 사이트. 위가 트여 있어 조준하면 도트가 십자선 위에 보인다.
 * top: 양 옆 기둥 꼭대기 높이 = 총 전체의 최고점 (ADS 기준선). 도트는 그보다 살짝 아래.
 */
function reflexSight(b: Builder, z: number, top: number, w = 0.04) {
  const { dark, black, glass, redDot, teal } = b.M;
  const base = top - 0.033;
  b.box(w * 0.75, 0.014, 0.06, black, 0, base, z, 0);                       // 레일 마운트
  b.box(w, 0.01, 0.05, dark, 0, base + 0.012, z, 0);                         // 바닥판
  for (const s of [-1, 1]) {
    b.box(0.006, top - base - 0.017, 0.024, dark, s * (w / 2 - 0.003), (top + base + 0.017) / 2, z - 0.012, 0); // 렌즈 테 기둥
    b.box(0.006, 0.01, 0.03, dark, s * (w / 2 - 0.003), base + 0.02, z + 0.008, 0);
  }
  b.box(w - 0.012, top - base - 0.02, 0.002, glass, 0, (top + base + 0.012) / 2, z - 0.016, 0.12); // 기울어진 렌즈
  b.box(0.0045, 0.0045, 0.002, redDot, 0, top - 0.006, z - 0.018, 0);        // 도트 (렌즈에 맺힘)
  b.box(0.008, 0.006, 0.012, teal, w / 2 + 0.001, base + 0.016, z + 0.012, 0); // 전원 LED
}

// ── 권총 (슬라이드 + 폴리머 프레임, 트리튬 가늠쇠, 전술 라이트) ───────────────────────────────
function pistol(b: Builder): GunModel {
  const { gunmetal, steel, dark, poly, black, tape, teal, orange, paint } = b.M;
  const slide = b.group('slide', 0, 0.055, -0.13);
  b.box(0.056, 0.064, 0.3, gunmetal, 0, -0.003, 0, 0, slide);
  b.box(0.048, 0.014, 0.3, gunmetal, 0, 0.034, 0, 0, slide);              // 윗면 (모따기 느낌)
  for (const s of [-1, 1]) b.box(0.004, 0.012, 0.3, steel, s * 0.026, 0.028, 0, 0, slide); // 닳은 모서리
  b.box(0.05, 0.004, 0.12, black, 0, 0.042, -0.07, 0, slide);              // 경량화 홈
  b.row(5, 0.014, (_, z) => b.box(0.06, 0.05, 0.006, dark, 0, -0.002, z, 0, slide), 0.08);  // 후방 톱니
  b.row(3, 0.014, (_, z) => b.box(0.06, 0.04, 0.006, dark, 0, -0.004, z, 0, slide), -0.13); // 전방 톱니
  b.box(0.008, 0.024, 0.05, black, 0.028, 0.01, -0.04, 0, slide);           // 배출구
  b.box(0.059, 0.02, 0.04, paint, 0, -0.016, 0.03, 0, slide);               // 벗겨진 빨간 띠
  b.box(0.012, 0.014, 0.016, dark, 0, 0.044, -0.13, 0, slide);              // 가늠쇠 (앞)
  b.box(0.005, 0.005, 0.002, teal, 0, 0.046, -0.1215, 0, slide);            // 트리튬 점 (청록)
  b.box(0.032, 0.014, 0.014, dark, 0, 0.044, 0.13, 0, slide);               // 가늠자 (뒤)
  for (const s of [-1, 1]) b.box(0.004, 0.004, 0.002, orange, s * 0.009, 0.046, 0.1225, 0, slide); // 뒤 점 (주황)
  b.cyl(0.011, 0.04, black, 0, -0.005, -0.165, slide, 8);                   // 총열 끝
  b.cyl(0.006, 0.042, dark, 0, -0.005, -0.166, slide, 6);                   // 총구 구멍
  b.box(0.05, 0.036, 0.27, poly, 0, 0.004, -0.115, 0);                      // 프레임
  b.box(0.046, 0.014, 0.09, poly, 0, -0.02, -0.19, 0);                      // 레일
  b.row(3, 0.022, (_, z) => b.box(0.05, 0.006, 0.008, black, 0, -0.03, z, 0), -0.22);
  // 레일 라이트 (청록 렌즈가 안개 속에서도 보인다)
  b.box(0.04, 0.034, 0.075, dark, 0, -0.045, -0.21, 0);
  b.cyl(0.015, 0.006, teal, 0, -0.045, -0.249, undefined, 10);
  b.box(0.042, 0.006, 0.03, steel, 0, -0.028, -0.19, 0);
  b.box(0.052, 0.16, 0.07, poly, 0, -0.085, 0.02, 0.2);                     // 손잡이
  b.box(0.056, 0.09, 0.066, tape, 0, -0.095, 0.022, 0.2);                   // 감은 테이프
  for (let i = 0; i < 3; i++) b.box(0.058, 0.004, 0.068, black, 0, -0.07 - i * 0.026, 0.017 - i * 0.005, 0.2);
  b.box(0.05, 0.01, 0.07, poly, 0, -0.025, -0.05, 0);                       // 방아쇠울 윗부분
  b.box(0.012, 0.045, 0.01, poly, 0, -0.05, -0.085, 0);                     // 방아쇠울 앞
  b.box(0.012, 0.01, 0.06, poly, 0, -0.072, -0.058, 0);                     // 방아쇠울 아래
  b.box(0.01, 0.026, 0.01, steel, 0, -0.04, -0.045, 0.3);                   // 방아쇠
  b.box(0.008, 0.012, 0.03, dark, 0.027, -0.006, -0.02, 0);                 // 슬라이드 멈치
  b.box(0.044, 0.022, 0.024, poly, 0, 0.0, 0.05, 0);                        // 비버테일
  const mag = b.group('mag', 0, 0, 0, 0.2);
  b.box(0.044, 0.11, 0.058, dark, 0, -0.16, 0.02, 0, mag);
  b.box(0.05, 0.016, 0.066, black, 0, -0.222, 0.02, 0, mag);                // 탄창 밑판
  b.box(0.006, 0.008, 0.03, orange, 0.026, -0.222, 0.02, 0, mag);           // 표식
  return b.finish(b.node(0, 0.05, -0.3), b.node(0.03, 0.065, -0.1), 1.45);
}

// ── 매그넘 리볼버 (실린더가 돈다, 환기 리브, 주황 인서트) ───────────────────────────────────
function magnum(b: Builder): GunModel {
  const { gunmetal, steel, dark, wood, woodDk, brass, black, orange, rust, teal } = b.M;
  b.cyl(0.02, 0.3, steel, 0, 0.045, -0.3, undefined, 12);                   // 총열
  b.box(0.036, 0.034, 0.3, gunmetal, 0, 0.04, -0.3, 0);                     // 총열 덮개 (상자형)
  b.box(0.018, 0.012, 0.3, dark, 0, 0.064, -0.3, 0);                        // 윗 리브
  b.row(6, 0.045, (_, z) => b.box(0.02, 0.006, 0.018, black, 0, 0.073, z, 0), -0.415); // 리브 환기구
  b.box(0.034, 0.03, 0.22, gunmetal, 0, 0.012, -0.27, 0);                   // 이젝터 러그
  b.box(0.036, 0.008, 0.05, rust, 0, 0.0, -0.36, 0);                        // 벗겨진 자국
  b.cyl(0.016, 0.02, black, 0, 0.045, -0.462, undefined, 8);                // 총구
  b.cyl(0.0085, 0.022, dark, 0, 0.045, -0.463, undefined, 6);
  b.box(0.01, 0.034, 0.022, dark, 0, 0.087, -0.44, 0);                      // 앞가늠쇠 (최고점 0.104)
  b.box(0.011, 0.012, 0.006, orange, 0, 0.096, -0.43, 0);                   // 주황 인서트
  b.box(0.052, 0.09, 0.15, gunmetal, 0, 0.025, -0.02, 0);                   // 프레임
  b.box(0.054, 0.012, 0.15, steel, 0, 0.068, -0.02, 0);                     // 닳은 윗면
  b.box(0.034, 0.014, 0.024, dark, 0, 0.078, 0.04, 0);                      // 뒷가늠자
  b.box(0.012, 0.006, 0.004, teal, 0, 0.08, 0.0275, 0);
  const drum = b.group('drum', 0, 0.04, -0.095);
  b.cyl(0.044, 0.085, steel, 0, 0, 0, drum, 12);
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2, c = Math.cos(a), s = Math.sin(a);
    b.cyl(0.011, 0.088, black, c * 0.027, s * 0.027, 0, drum, 8);
    b.cyl(0.008, 0.01, brass, c * 0.027, s * 0.027, 0.046, drum, 8);
    const fl = a + Math.PI / 6;                                              // 실린더 홈
    b.box(0.006, 0.012, 0.06, dark, Math.cos(fl) * 0.042, Math.sin(fl) * 0.042, 0, 0, drum, 0, fl + Math.PI / 2);
  }
  const hammer = b.group('hammer', 0, 0.075, 0.07);
  b.box(0.014, 0.04, 0.016, dark, 0, 0.01, 0.0, -0.5, hammer);
  b.box(0.018, 0.008, 0.02, steel, 0, 0.026, 0.012, -0.5, hammer);
  b.box(0.05, 0.14, 0.085, woodDk, 0, -0.08, 0.05, 0.28);                   // 나무 손잡이
  b.box(0.056, 0.12, 0.06, wood, 0, -0.085, 0.045, 0.28);
  for (let i = 0; i < 4; i++) b.box(0.058, 0.004, 0.05, woodDk, 0, -0.05 - i * 0.025, 0.04 + i * 0.007, 0.28); // 체커링
  for (const s of [-1, 1]) b.cyl(0.009, 0.004, brass, s * 0.029, -0.07, 0.04).rotation.set(0, Math.PI / 2, 0); // 메달
  b.box(0.052, 0.014, 0.09, steel, 0, -0.152, 0.07, 0.28);                  // 손잡이 밑 쇠
  b.box(0.012, 0.012, 0.075, gunmetal, 0, -0.04, -0.06, 0);                 // 방아쇠울
  b.box(0.012, 0.04, 0.012, gunmetal, 0, -0.06, -0.095, 0);
  b.box(0.01, 0.026, 0.01, steel, 0, -0.03, -0.045, 0.25);                  // 방아쇠
  return b.finish(b.node(0, 0.045, -0.47), b.node(0.04, 0.04, -0.09), 1.45);
}

// ── 기관단총 (접이식 개머리판, 리플렉스 사이트, 긴 탄창, 청록 탄수 표시) ───────────────────
function smg(b: Builder): GunModel {
  const { gunmetal, steel, dark, poly, black, white, sand, teal, orange, tape } = b.M;
  b.box(0.062, 0.085, 0.32, gunmetal, 0, 0.01, -0.12, 0);                   // 리시버
  b.box(0.064, 0.03, 0.2, sand, 0, 0.0, -0.17, 0);                          // 벗겨진 사막색 도장
  b.box(0.066, 0.006, 0.12, steel, 0, 0.05, -0.2, 0);                       // 닳은 모서리
  b.box(0.066, 0.016, 0.3, poly, 0, 0.058, -0.12, 0);                       // 윗덮개
  b.row(8, 0.036, (_, z) => b.box(0.05, 0.006, 0.012, black, 0, 0.068, z, 0), -0.25); // 레일 눈금
  b.cyl(0.03, 0.2, gunmetal, 0, 0.012, -0.36, undefined, 12);               // 총열 덮개
  b.row(4, 0.045, (_, z) => { b.box(0.066, 0.012, 0.022, black, 0, 0.012, z, 0); }, -0.425); // 냉각 구멍
  b.cone(0.016, 0.014, 0.07, dark, 0, 0.012, -0.5, undefined, 8);           // 소염기
  b.row(3, 0.018, (_, z) => b.box(0.034, 0.004, 0.008, black, 0, 0.012, z, 0), -0.52);
  b.box(0.012, 0.03, 0.012, dark, 0, 0.068, -0.45, 0);                      // 앞가늠쇠
  b.box(0.004, 0.006, 0.002, white, 0, 0.08, -0.443, 0);
  reflexSight(b, -0.12, 0.127, 0.042);                                       // 최고점 0.127
  b.box(0.008, 0.026, 0.05, black, 0.033, 0.0, -0.02, 0);                   // 배출구
  b.box(0.004, 0.016, 0.04, teal, -0.033, 0.02, -0.1, 0);                   // 탄수 표시 (청록 띠)
  b.box(0.004, 0.006, 0.008, orange, -0.033, 0.02, -0.065, 0);
  b.box(0.05, 0.1, 0.07, poly, 0, -0.065, 0.03, 0.22);                      // 손잡이
  b.box(0.054, 0.05, 0.072, tape, 0, -0.075, 0.033, 0.22);
  b.box(0.05, 0.1, 0.06, poly, 0, -0.07, -0.34, 0);                         // 앞손잡이
  b.row(3, 0.02, (_, z) => b.box(0.054, 0.08, 0.006, black, 0, -0.07, z, 0), -0.36);
  b.box(0.012, 0.012, 0.07, poly, 0, -0.045, -0.05, 0);                     // 방아쇠울
  b.box(0.012, 0.04, 0.012, poly, 0, -0.06, -0.085, 0);
  b.box(0.012, 0.012, 0.075, poly, 0, -0.08, -0.05, 0);
  b.box(0.01, 0.026, 0.01, steel, 0, -0.045, -0.045, 0.25);
  b.box(0.012, 0.012, 0.045, steel, 0.04, 0.03, -0.01, 0);                  // 장전 손잡이
  b.box(0.016, 0.016, 0.012, orange, 0.048, 0.03, 0.01, 0);
  // 접이식 개머리판: 두 개의 봉 + 어깨받침
  b.box(0.01, 0.01, 0.26, steel, -0.022, 0.03, 0.2, 0);
  b.box(0.01, 0.01, 0.26, steel, 0.022, 0.03, 0.2, 0);
  b.box(0.05, 0.016, 0.02, dark, 0, 0.03, 0.08, 0);
  b.box(0.05, 0.075, 0.028, poly, 0, 0.012, 0.335, 0);
  b.box(0.052, 0.06, 0.008, black, 0, 0.012, 0.352, 0);
  const mag = b.group('mag', 0, 0, 0);
  b.box(0.042, 0.13, 0.062, dark, 0, -0.14, -0.1, -0.06, mag);
  b.box(0.042, 0.12, 0.062, dark, 0, -0.26, -0.082, -0.12, mag);            // 휘어진 긴 탄창
  b.box(0.044, 0.03, 0.064, tape, 0, -0.2, -0.09, -0.09, mag);
  b.box(0.046, 0.014, 0.068, black, 0, -0.325, -0.07, -0.12, mag);
  return b.finish(b.node(0, 0.012, -0.54), b.node(0.034, 0.045, -0.09), 1.4);
}

// ── 펌프 샷건 (펌프가 앞뒤로 움직인다, 열차폐, 주황 구슬 가늠쇠) ───────────────────────────
function shotgun(b: Builder): GunModel {
  const { gunmetal, steel, dark, wood, woodDk, shell, brass, black, orange, rust, tape, teal } = b.M;
  b.cyl(0.022, 0.66, steel, 0, 0.04, -0.4, undefined, 12);                  // 총열
  b.cyl(0.019, 0.5, gunmetal, 0, -0.005, -0.34, undefined, 10);             // 탄창관
  b.box(0.05, 0.022, 0.34, dark, 0, 0.05, -0.28, 0);                        // 열차폐
  b.row(6, 0.05, (_, z) => b.box(0.052, 0.012, 0.022, black, 0, 0.05, z, 0), -0.4); // 차폐 구멍
  b.box(0.01, 0.012, 0.62, black, 0, 0.066, -0.4, 0);                       // 윗 리브
  b.cyl(0.026, 0.016, black, 0, 0.04, -0.725, undefined, 10);               // 총구 끝
  b.cyl(0.016, 0.018, dark, 0, 0.04, -0.726, undefined, 8);
  b.box(0.03, 0.012, 0.03, gunmetal, 0, -0.005, -0.6, 0);                   // 총열 고정쇠
  b.box(0.012, 0.012, 0.012, orange, 0, 0.081, -0.7, 0);                    // 구슬 가늠쇠 (최고점 0.087)
  b.box(0.064, 0.095, 0.24, gunmetal, 0, 0.02, -0.04, 0);                   // 리시버
  b.box(0.066, 0.03, 0.16, rust, 0, -0.01, -0.06, 0);                       // 벗겨진 도장
  b.box(0.066, 0.006, 0.24, steel, 0, 0.066, -0.04, 0);                     // 닳은 윗모서리
  b.box(0.012, 0.03, 0.08, black, 0.034, 0.03, -0.04, 0);                   // 배출구
  b.box(0.004, 0.01, 0.03, teal, -0.033, 0.045, -0.12, 0);                  // 장전 표시
  const pump = b.group('pump', 0, -0.005, -0.4);
  b.box(0.07, 0.062, 0.2, woodDk, 0, 0, 0, 0, pump);                        // 펌프 손잡이
  for (let i = 0; i < 5; i++) b.box(0.074, 0.05, 0.008, wood, 0, 0, -0.07 + i * 0.035, 0, pump); // 홈
  b.box(0.074, 0.03, 0.04, tape, 0, 0, 0.085, 0, pump);
  b.box(0.012, 0.012, 0.07, steel, 0, -0.07, -0.05, 0);                     // 방아쇠울
  b.box(0.012, 0.04, 0.012, steel, 0, -0.05, -0.09, 0);
  b.box(0.01, 0.026, 0.01, steel, 0, -0.045, -0.045, 0.25);
  b.box(0.058, 0.115, 0.34, wood, 0, -0.03, 0.26, -0.13);                   // 개머리판
  b.box(0.06, 0.04, 0.12, woodDk, 0, 0.0, 0.2, -0.13);                      // 뺨받침 결
  b.box(0.06, 0.12, 0.02, black, 0, -0.045, 0.44, -0.13);                   // 패드
  b.box(0.06, 0.1, 0.05, woodDk, 0, -0.055, 0.04, 0.3);                     // 손잡이
  // 옆구리 예비 탄 (탄띠)
  b.box(0.006, 0.04, 0.12, black, -0.035, 0.03, 0.02, 0);
  for (let i = 0; i < 4; i++) {
    b.cyl(0.011, 0.045, shell, -0.041, 0.03, -0.02 + i * 0.026, undefined, 8).rotation.set(Math.PI / 2, 0, 0);
    b.cyl(0.0115, 0.012, brass, -0.041, 0.006, -0.02 + i * 0.026, undefined, 8).rotation.set(Math.PI / 2, 0, 0);
  }
  return b.finish(b.node(0, 0.04, -0.74), b.node(0.04, 0.04, -0.05), 1.3);
}

// ── 돌격소총 (레일 핸드가드, 곡선 탄창, 리플렉스 사이트, 사막색 도장) ──────────────────────
function rifle(b: Builder): GunModel {
  const { gunmetal, steel, dark, poly, black, olive, sand, white, teal, orange, tape } = b.M;
  b.box(0.058, 0.085, 0.3, gunmetal, 0, 0.02, -0.08, 0);                    // 리시버
  b.box(0.06, 0.03, 0.12, sand, 0, 0.0, -0.13, 0);                          // 벗겨진 도장
  b.box(0.06, 0.006, 0.3, steel, 0, 0.06, -0.08, 0);                        // 닳은 모서리
  b.box(0.06, 0.012, 0.3, dark, 0, 0.068, -0.08, 0);                        // 상부 레일
  b.row(8, 0.034, (_, z) => b.box(0.05, 0.006, 0.012, black, 0, 0.076, z, 0), -0.2);
  b.box(0.06, 0.07, 0.3, sand, 0, 0.012, -0.4, 0);                          // 핸드가드 (사막색)
  b.box(0.062, 0.02, 0.26, dark, 0, 0.012, -0.4, 0);                        // 옆 레일
  for (let i = 0; i < 6; i++) b.box(0.064, 0.012, 0.014, dark, 0, 0.052, -0.28 - i * 0.045, 0); // 레일 눈금
  for (let i = 0; i < 3; i++) b.box(0.064, 0.016, 0.03, black, 0, -0.016, -0.34 - i * 0.07, 0);  // 통풍구
  b.box(0.04, 0.03, 0.06, dark, 0, -0.03, -0.5, 0);                         // 레이저 모듈
  b.cyl(0.008, 0.004, teal, 0, -0.03, -0.531, undefined, 8);
  b.cyl(0.011, 0.14, steel, 0, 0.02, -0.62, undefined, 8);                  // 총열 노출부
  b.cone(0.016, 0.019, 0.07, black, 0, 0.02, -0.72, undefined, 8);          // 소염기
  b.row(3, 0.02, (_, z) => b.box(0.04, 0.004, 0.008, dark, 0, 0.02, z, 0), -0.74);
  b.box(0.01, 0.045, 0.012, dark, 0, 0.065, -0.62, 0);                      // 앞가늠쇠
  b.box(0.004, 0.006, 0.002, teal, 0, 0.08, -0.613, 0);
  reflexSight(b, -0.05, 0.1246, 0.046);                                      // 최고점 0.1246
  b.box(0.008, 0.026, 0.06, black, 0.03, 0.025, -0.06, 0);                  // 배출구
  b.box(0.004, 0.018, 0.04, teal, -0.03, 0.03, -0.17, 0);                   // 탄수 표시
  b.box(0.004, 0.008, 0.008, orange, -0.03, 0.03, -0.14, 0);
  b.box(0.05, 0.11, 0.07, poly, 0, -0.07, 0.03, 0.25);                      // 손잡이
  b.box(0.054, 0.05, 0.072, tape, 0, -0.08, 0.033, 0.25);
  b.box(0.012, 0.012, 0.075, poly, 0, -0.045, -0.06, 0);                    // 방아쇠울
  b.box(0.012, 0.04, 0.012, poly, 0, -0.06, -0.1, 0);
  b.box(0.012, 0.012, 0.08, poly, 0, -0.08, -0.06, 0);
  b.box(0.01, 0.026, 0.01, steel, 0, -0.045, -0.055, 0.25);
  b.cyl(0.018, 0.2, dark, 0, 0.03, 0.17, undefined, 8);                     // 버퍼 튜브
  b.box(0.052, 0.11, 0.2, olive, 0, 0.0, 0.34, -0.1);                       // 개머리판
  b.box(0.054, 0.03, 0.12, sand, 0, 0.045, 0.32, -0.1);
  b.box(0.054, 0.12, 0.016, black, 0, 0.0, 0.445, -0.1);
  const bolt = b.group('bolt', 0.036, 0.04, -0.03);
  b.box(0.01, 0.014, 0.04, steel, 0, 0, 0, 0, bolt);                        // 장전 손잡이
  b.box(0.014, 0.018, 0.012, orange, 0.006, 0, 0.016, 0, bolt);
  const mag = b.group('mag', 0, 0, 0);
  b.box(0.042, 0.12, 0.07, dark, 0, -0.105, -0.12, -0.12, mag);             // 곡선 탄창 (두 토막)
  b.box(0.042, 0.1, 0.07, dark, 0, -0.21, -0.1, -0.3, mag);
  b.box(0.044, 0.02, 0.072, sand, 0, -0.15, -0.115, -0.2, mag);
  b.box(0.046, 0.012, 0.074, black, 0, -0.265, -0.085, -0.3, mag);
  return b.finish(b.node(0, 0.02, -0.76), b.node(0.034, 0.05, -0.05), 1.3);
}

// ── 저격총 (스코프, 소염 제동기, 볼트 핸들, 양각대, 위장 도장) ────────────────────────────
function sniper(b: Builder): GunModel {
  const { gunmetal, steel, dark, poly, black, olive, sand, lens, teal, orange, tape } = b.M;
  b.box(0.06, 0.09, 0.34, gunmetal, 0, 0.02, -0.06, 0);                     // 리시버
  b.box(0.062, 0.006, 0.34, steel, 0, 0.062, -0.06, 0);
  b.cyl(0.018, 0.75, steel, 0, 0.03, -0.6, undefined, 12);                  // 긴 총열
  b.row(6, 0.04, (_, z) => b.box(0.006, 0.03, 0.02, dark, 0, 0.03, z, 0), -0.88); // 총열 홈 (플루팅)
  b.cyl(0.026, 0.1, dark, 0, 0.03, -1.0, undefined, 10);                    // 제동기
  for (let i = 0; i < 3; i++) b.box(0.06, 0.008, 0.014, black, 0, 0.03, -0.97 - i * 0.03, 0); // 제동기 홈
  b.box(0.062, 0.065, 0.36, poly, 0, 0.005, -0.4, 0);                       // 핸드가드
  b.box(0.064, 0.03, 0.14, olive, 0, 0.0, -0.45, 0);                        // 위장 도장 얼룩
  b.box(0.064, 0.02, 0.08, sand, 0, 0.018, -0.33, 0);
  b.box(0.064, 0.012, 0.3, tape, 0, -0.024, -0.4, 0);
  // 스코프
  b.cyl(0.026, 0.34, black, 0, 0.115, -0.12, undefined, 12);                // 경통
  b.cone(0.037, 0.028, 0.08, black, 0, 0.115, -0.3, undefined, 12);         // 앞 대물부
  b.cyl(0.039, 0.012, dark, 0, 0.115, -0.335, undefined, 12);
  b.cone(0.028, 0.034, 0.06, black, 0, 0.115, 0.06, undefined, 12);         // 뒤 접안부
  b.cyl(0.034, 0.004, lens, 0, 0.115, -0.342, undefined, 12);               // 렌즈 (앞, 청록 반사)
  b.cyl(0.028, 0.004, lens, 0, 0.115, 0.092, undefined, 12);                // 렌즈 (뒤)
  b.cyl(0.012, 0.03, dark, 0, 0.156, -0.12, undefined, 8);                  // 조정 포탑 (최고점 0.168)
  b.box(0.012, 0.004, 0.004, orange, 0, 0.163, -0.105, 0);
  b.cyl(0.012, 0.03, dark, 0.04, 0.115, -0.12, undefined, 8).rotation.set(0, Math.PI / 2, 0);
  b.box(0.004, 0.006, 0.006, teal, 0.056, 0.115, -0.12, 0);
  b.box(0.03, 0.04, 0.03, dark, 0, 0.07, -0.2, 0);                          // 마운트
  b.box(0.03, 0.04, 0.03, dark, 0, 0.07, -0.02, 0);
  const bolt = b.group('bolt', 0.04, 0.045, 0.0);
  b.cyl(0.007, 0.07, steel, 0.03, 0, 0, bolt, 6).rotation.set(0, Math.PI / 2, 0);
  b.cyl(0.014, 0.02, black, 0.07, 0, 0, bolt, 8);                           // 볼트 손잡이 구슬
  // 썸홀 스톡
  b.box(0.056, 0.12, 0.18, olive, 0, -0.01, 0.2, 0);
  b.box(0.056, 0.05, 0.26, olive, 0, 0.04, 0.38, 0.0);                      // 볼 받침
  b.box(0.058, 0.03, 0.1, sand, 0, 0.04, 0.42, 0.0);
  b.box(0.058, 0.06, 0.2, olive, 0, -0.1, 0.34, -0.05);
  b.box(0.06, 0.15, 0.02, black, 0, -0.01, 0.5, 0);
  b.box(0.05, 0.1, 0.06, olive, 0, -0.07, 0.04, 0.3);                       // 손잡이
  b.box(0.012, 0.012, 0.07, steel, 0, -0.045, -0.06, 0);
  b.box(0.012, 0.035, 0.012, steel, 0, -0.06, -0.1, 0);
  // 접힌 양각대
  b.box(0.04, 0.02, 0.03, dark, 0, -0.035, -0.58, 0);
  b.cyl(0.006, 0.18, steel, -0.025, -0.05, -0.5, undefined, 6).rotation.set(0.1, 0, 0);
  b.cyl(0.006, 0.18, steel, 0.025, -0.05, -0.5, undefined, 6).rotation.set(0.1, 0, 0);
  const mag = b.group('mag', 0, 0, 0);
  b.box(0.04, 0.07, 0.1, dark, 0, -0.09, -0.07, 0, mag);
  b.box(0.042, 0.012, 0.102, black, 0, -0.125, -0.07, 0, mag);
  return b.finish(b.node(0, 0.03, -1.06), b.node(0.034, 0.05, 0.0), 1.2, true);
}

const BUILDERS: Record<GunId, (b: Builder) => GunModel> = { pistol, magnum, smg, shotgun, rifle, sniper };

export function buildGun(id: GunId): GunModel {
  const b = new Builder((MATS ??= makeMats()));
  return BUILDERS[id](b);
}
