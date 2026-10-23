import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

/**
 * 프리미티브로 만든 로우폴리 사람형 모델. 플레이어(플레이테스트), 좀비, 아군이 공유한다. 앞쪽은 -z.
 *
 * 구조 (단위 크기에서 머리 꼭대기 = 1.88, 머리 아래 ≈ 1.46 → 키의 78% 위가 머리. 헤드샷 판정과 맞춘다)
 *   group ─ legs[2] (엉덩이 축)
 *         └ torso (엉덩이 축) ─ arms[2] (어깨 축) ─ fore[2] (팔꿈치 축)
 *                              └ head (목 축)
 * 재질은 역할별 4개 [옷, 피부, 바지, 얼룩] 이고 (아군 색 바꾸기가 mats[0]/[1] 을 쓴다),
 * 같은 재질 안의 명암·상처·신발 색은 정점 색 배율로 넣어 메시 수(드로우 콜)를 줄인다.
 * 지오메트리는 모양별로 캐시해 모든 개체가 공유한다 (userData.shared → dispose 하지 않는다).
 */
export interface Humanoid {
  group: THREE.Group;
  mats: THREE.MeshLambertMaterial[];
  legs: THREE.Group[];
  arms: THREE.Group[];
  walk: number;
  /** 팔꿈치 (팔뚝+손). arms[i] 의 자식 */
  fore?: THREE.Group[];
  /** 엉덩이 축 상체. 구부정함·숨쉬기·피격 젖힘에 쓴다 */
  torso?: THREE.Group;
  /** 목 축 머리 */
  head?: THREE.Group;
  /** 눈 (안개 무시 발광) */
  eyes?: THREE.MeshBasicMaterial;
}

export interface BodyOpts {
  /** 0 = 깔끔한 옷 (플레이어·기본 아군), 1 = 찢어진 옷과 상처 */
  torn?: number;
  /** 배 둘레 0..1 */
  belly?: number;
  /** 머리 크기 배율 (머리 꼭대기 높이는 유지) */
  head?: number;
  /** 팔뚝 길이 배율 */
  arm?: number;
  /** 다리 없이 허벅지 끝만 남은 모양 (기어다니는 좀비) */
  stump?: boolean;
  /** 머리카락 덩어리 */
  hair?: boolean;
  pants?: number;
  /** 얼룩(피·때·벨트) 색 */
  grime?: number;
  eye?: number;
  /** 찢어진 모양 변형 번호 */
  variant?: number;
}

type Shade = number | readonly [number, number, number];
/** [w, h, d, x, y, z, 명암, rx, ry, rz] */
export type Piece = readonly [number, number, number, number, number, number, Shade?, number?, number?, number?];

const geoCache = new Map<string, THREE.BufferGeometry>();
const tmpM = new THREE.Matrix4(), tmpQ = new THREE.Quaternion(), tmpE = new THREE.Euler(), tmpV = new THREE.Vector3(), one = new THREE.Vector3(1, 1, 1);

/** 상자 여러 개를 정점 색과 함께 한 지오메트리로 합친다 (키별 캐시) */
export function boxesGeo(key: string, pieces: readonly Piece[]): THREE.BufferGeometry {
  const hit = geoCache.get(key);
  if (hit) return hit;
  const list = pieces.map(([w, h, d, x, y, z, shade = 1, rx = 0, ry = 0, rz = 0]) => {
    const g = new THREE.BoxGeometry(w, h, d);
    tmpQ.setFromEuler(tmpE.set(rx, ry, rz));
    g.applyMatrix4(tmpM.compose(tmpV.set(x, y, z), tmpQ, one));
    const [r, gg, b] = typeof shade === 'number' ? [shade, shade, shade] : shade;
    const n = g.attributes.position.count, col = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      // 위를 향한 면은 조금 밝게, 아래는 어둡게 → 칙칙한 덩어리에 형태감
      const ny = g.attributes.normal.getY(i);
      const k = ny > 0.5 ? 1.08 : ny < -0.5 ? 0.7 : 1;
      col[i * 3] = r * k; col[i * 3 + 1] = gg * k; col[i * 3 + 2] = b * k;
    }
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    return g;
  });
  const merged = mergeGeometries(list, false)!;
  list.forEach((g) => g.dispose());
  merged.userData.shared = true;
  geoCache.set(key, merged);
  return merged;
}

/** 아무 지오메트리나 키별로 한 번만 만든다 (공유) */
export function sharedGeo<T extends THREE.BufferGeometry>(key: string, make: () => T): T {
  let g = geoCache.get(key) as T | undefined;
  if (!g) { g = make(); g.userData.shared = true; geoCache.set(key, g); }
  return g;
}

function mesh(geo: THREE.BufferGeometry, mat: THREE.Material, parent: THREE.Object3D, shadow = true) {
  const m = new THREE.Mesh(geo, mat);
  m.castShadow = shadow;
  parent.add(m);
  return m;
}

const SKIN_TEAR = [0.55, 0.42, 0.4] as const; // 상처 부위 피부 (검붉게)

export function makeHumanoid(skin: number, cloth: number, scale = 1, o: BodyOpts = {}): Humanoid {
  const torn = o.torn ?? 0, belly = o.belly ?? 0, hs = o.head ?? 1, al = o.arm ?? 1, v = (o.variant ?? 0) % 3;
  const group = new THREE.Group();
  const mats: THREE.MeshLambertMaterial[] = [];
  const mat = (c: number) => { const m = new THREE.MeshLambertMaterial({ color: c, vertexColors: true }); mats.push(m); return m; };
  const clothM = mat(cloth), skinM = mat(skin), pantsM = mat(o.pants ?? 0x2d3340), grimeM = mat(o.grime ?? 0x3a1512);
  const T = torn > 0 ? `t${v}` : 'c';

  // ── 다리 ─────────────────────────────
  const legs: THREE.Group[] = [];
  const legGeo = o.stump
    ? boxesGeo(`legS`, [[0.25, 0.36, 0.27, 0, -0.17, 0], [0.2, 0.08, 0.22, 0, -0.38, 0, [0.55, 0.2, 0.18]]])
    : boxesGeo(`leg${T}`, [
      [0.24, 0.42, 0.26, 0, -0.2, 0],                      // 허벅지
      [0.22, 0.34, 0.24, 0, -0.55, 0.01, 0.92],            // 정강이
      [0.26, 0.12, 0.36, 0, -0.72, -0.05, 0.32],           // 신발
      ...(torn ? [[0.25, 0.1, 0.27, 0, -0.38, 0, 0.75], [0.1, 0.12, 0.04, v ? 0.06 : -0.06, -0.47, -0.13, 0.7]] as Piece[] : []),
    ]);
  for (const s of [-1, 1]) {
    const leg = new THREE.Group();
    leg.position.set(s * 0.15, 0.78, 0);
    mesh(legGeo, pantsM, leg);
    group.add(leg); legs.push(leg);
  }

  // ── 상체 ─────────────────────────────
  const torso = new THREE.Group();
  torso.position.y = 0.78;
  group.add(torso);
  const bw = 1 + belly * 0.35;
  const shirt: Piece[] = [
    [0.54 * bw, 0.32, 0.3 + belly * 0.22, 0, 0.2, -belly * 0.08],   // 배
    [0.64, 0.36, 0.36, 0, 0.5, 0],                                  // 가슴
    [0.34, 0.06, 0.3, 0, 0.7, 0, 0.8],                              // 목깃
  ];
  if (torn) {
    // 찢어진 셔츠 자락 (앞뒤로 늘어진 조각)
    shirt.push([0.14, 0.16, 0.03, -0.18, 0.0, -0.15 - belly * 0.15, 0.85, 0.15, 0, 0.12]);
    shirt.push([0.12, 0.2, 0.03, v === 1 ? 0.2 : 0.06, -0.02, -0.15 - belly * 0.15, 0.8, 0.1, 0, -0.1]);
    shirt.push([0.18, 0.14, 0.03, 0.12, 0.0, 0.16, 0.8, -0.2]);
  }
  mesh(boxesGeo(`shirt${T}b${belly}`, shirt), clothM, torso);
  const skinT: Piece[] = [[0.18, 0.12, 0.18, 0, 0.74, 0]];        // 목
  if (torn) skinT.push([0.2, 0.14, 0.04, v === 2 ? 0.1 : -0.08, 0.24, -0.16 - belly * 0.19, SKIN_TEAR]); // 찢긴 틈으로 보이는 살
  if (belly > 0.3) skinT.push([0.5 * bw, 0.26, 0.12, 0, 0.16, -0.2 - belly * 0.18, 0.92]);              // 불룩 튀어나온 맨살 배
  mesh(boxesGeo(`skinT${T}b${belly}`, skinT), skinM, torso, false);
  const grime: Piece[] = [[0.56 * bw, 0.07, 0.32 + belly * 0.22, 0, 0.06, -belly * 0.08, [0.45, 0.42, 0.42]]]; // 허리띠
  if (torn) {
    grime.push([0.22, 0.18, 0.02, v === 1 ? -0.12 : 0.14, 0.45, -0.185]);           // 핏자국
    grime.push([0.1, 0.24, 0.02, v === 1 ? -0.04 : 0.2, 0.3, -0.185, 0.85]);         // 흘러내린 피
    grime.push([0.16, 0.1, 0.02, v === 2 ? -0.2 : 0.18, 0.56, 0.185, 0.8]);          // 등 얼룩
  }
  if (belly > 0.3) grime.push([0.04, 0.2, 0.02, 0.06, 0.16, -0.27 - belly * 0.18, 0.7], [0.12, 0.03, 0.02, 0.06, 0.16, -0.27 - belly * 0.18, 0.7]); // 꿰맨 자국
  mesh(boxesGeo(`grimeT${T}b${belly}`, grime), grimeM, torso, false);

  // ── 머리 ─────────────────────────────
  const head = new THREE.Group();
  head.position.y = 0.7;
  torso.add(head);
  const hsz = 0.4 * hs, top = 0.4, cy = top - hsz / 2;
  mesh(boxesGeo(`head${hs}`, [
    [hsz, hsz * 0.92, hsz, 0, cy + hsz * 0.04, 0],                       // 두개골
    [hsz * 0.78, 0.1, hsz * 0.78, 0, cy - hsz * 0.5, -0.03, 0.88],       // 늘어진 턱
    [hsz * 1.04, 0.06, 0.08, 0, cy + hsz * 0.18, -hsz * 0.45, 0.82],     // 툭 튀어나온 이마뼈
    [0.06, 0.08, 0.06, 0, cy + 0.0, -hsz * 0.52, 0.9],                   // 코
    [0.05, 0.1, 0.08, -hsz * 0.52, cy + 0.02, 0, 0.85],                  // 귀
    [0.05, 0.1, 0.08, hsz * 0.52, cy + 0.02, 0, 0.85],
  ]), skinM, head);
  const hg: Piece[] = [
    [hsz * 0.74, 0.08, 0.02, 0, cy + 0.07 * hs, -hsz * 0.5 - 0.004, 0.5],    // 퀭한 눈두덩
    [hsz * 0.5, 0.05, 0.02, 0, cy - hsz * 0.3, -hsz * 0.5 - 0.004, 0.35],    // 입
  ];
  if (o.hair) hg.push([hsz * 0.8, 0.06, hsz * 0.6, -0.03, top + 0.02, 0.04, [0.45, 0.4, 0.38]], [hsz * 0.4, 0.1, 0.06, 0.08, top - 0.05, hsz * 0.48, [0.45, 0.4, 0.38]]);
  if (torn) hg.push([0.03, hsz * 0.4, hsz * 0.3, v === 1 ? hsz * 0.51 : -hsz * 0.51, cy + 0.05, 0.03]);  // 머리 옆 상처
  mesh(boxesGeo(`headG${hs}${o.hair ? 'h' : ''}${T}`, hg), grimeM, head, false);
  const eyes = new THREE.MeshBasicMaterial({ color: o.eye ?? 0x10141a, fog: o.eye === undefined });
  mesh(boxesGeo(`eyes${hs}`, [[0.085, 0.05, 0.03, -0.09 * hs, cy + 0.07 * hs, -hsz * 0.5 - 0.012], [0.085, 0.05, 0.03, 0.09 * hs, cy + 0.07 * hs, -hsz * 0.5 - 0.012]]), eyes, head, false);

  // ── 팔 ───────────────────────────────
  const arms: THREE.Group[] = [], fore: THREE.Group[] = [];
  const upper = boxesGeo(`upper${T}`, torn
    ? [[0.19, 0.3, 0.19, 0, -0.13, 0], [0.2, 0.07, 0.2, 0, -0.3, 0, 0.75], [0.08, 0.1, 0.03, 0.03, -0.36, -0.08, 0.7]]
    : [[0.19, 0.36, 0.19, 0, -0.16, 0]]);
  const upperSkin = torn ? boxesGeo('upperS', [[0.16, 0.08, 0.16, 0, -0.36, 0, SKIN_TEAR]]) : null;
  const foreGeo = boxesGeo(`fore${al}${torn ? 'c' : ''}`, [
    [0.16, 0.3 * al, 0.16, 0, -0.15 * al, 0],
    [0.17, 0.13, 0.12, 0, -0.3 * al - 0.07, -0.01, 0.92],                // 손
    ...(torn ? [[0.04, 0.09, 0.04, -0.05, -0.3 * al - 0.17, -0.03, 0.8], [0.04, 0.1, 0.04, 0.0, -0.3 * al - 0.18, -0.04, 0.8], [0.04, 0.09, 0.04, 0.05, -0.3 * al - 0.17, -0.03, 0.8]] as Piece[] : []), // 갈고리 손가락
  ]);
  for (const s of [-1, 1]) {
    const arm = new THREE.Group();
    arm.position.set(s * 0.41, 0.62, 0);
    mesh(upper, clothM, arm);
    if (upperSkin) mesh(upperSkin, skinM, arm, false);
    const el = new THREE.Group();
    el.position.y = -0.34;
    mesh(foreGeo, skinM, el);
    arm.add(el);
    torso.add(arm); arms.push(arm); fore.push(el);
  }

  group.scale.setScalar(scale);
  return { group, mats, legs, arms, walk: 0, fore, torso, head, eyes };
}

/** 걷기: 다리·팔 흔들기 + 걸음마다 상체가 살짝 오르내린다 */
export function animateWalk(h: Humanoid, dt: number, speed: number) {
  h.walk += dt * speed * 2.2;
  const amp = Math.min(1, speed / 3);
  const s = Math.sin(h.walk) * amp * 0.7;
  h.legs[0].rotation.x = s; h.legs[1].rotation.x = -s;
  if (h.arms[0]) h.arms[0].rotation.x = -s * 0.85;
  if (h.arms[1]) h.arms[1].rotation.x = s * 0.85;
  if (h.torso) h.torso.position.y = 0.78 + Math.abs(Math.cos(h.walk)) * 0.035 * amp;
  if (h.fore) { h.fore[0].rotation.x = 0.2 + Math.max(0, -s) * 0.5; h.fore[1].rotation.x = 0.2 + Math.max(0, s) * 0.5; }
}
