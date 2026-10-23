// 좀비 3D 모델: core/humanoid 몸통에 종류별 체형·장식을 더한다. (외부 에셋 없음)
// 모델 키는 ZOMBIE_TUNING.height 에 맞춘다 → 머리(키의 78% 위)가 헤드샷 판정 구간과 일치.
// 지오메트리와 장식 재질은 공유 캐시 (userData.shared), 몸 재질 4개 + 눈만 개체별 (피격 번쩍임용).
// Unity: 종류별 프리팹. 장식 메시는 자식 오브젝트.
import * as THREE from 'three';
import { makeHumanoid, sharedGeo, boxesGeo, type Humanoid, type BodyOpts } from '../../core/humanoid';
import { ZOMBIE_TUNING, type ZType } from '../../data';

const CLOTHES = [0x5a4a3a, 0x3d4a5c, 0x6a5a3a, 0x4a3d5c, 0x55603f, 0x6c4040];
const PANTS = [0x2d3340, 0x3a3328, 0x2a2f2a, 0x403a44];
/** 단위 몸의 머리 꼭대기 높이 */
const UNIT_H = 1.88;

export interface ZombieModel {
  h: Humanoid;
  eyes: THREE.MeshBasicMaterial;
  /** 이름 있는 장식 조각 (view 가 애니메이션할 때 찾는다) */
  parts: Record<string, THREE.Object3D>;
  /** 몸 비율 (뷰가 자세를 고를 때 쓴다) */
  hunch: number;
}

// ── 공유 장식 재질 ───────────────────────────
const matCache = new Map<string, THREE.Material>();
function smat(key: string, make: () => THREE.Material) {
  let m = matCache.get(key);
  if (!m) { m = make(); m.userData.shared = true; matCache.set(key, m); }
  return m;
}
const lam = (c: number, e = 0) => () => new THREE.MeshLambertMaterial({ color: c, emissive: e });
const glow = (c: number) => () => new THREE.MeshBasicMaterial({ color: c, fog: false });
const M = {
  steel: () => smat('steel', lam(0x6f767e)),
  steelDk: () => smat('steelDk', lam(0x3a3f46)),
  bone: () => smat('bone', lam(0xcfc6a8)),
  dyn: () => smat('dyn', lam(0xd23a2a, 0x2a0000)),
  rope: () => smat('rope', lam(0x2a2420)),
  gold: () => smat('gold', lam(0xf2c230, 0x6a4a00)),
  acid: () => smat('acid', lam(0x9bff3a, 0x3f9a10)),
  fuse: () => smat('fuse', glow(0xffb030)),
  core: () => smat('core', glow(0xff3322)),
  capeP: () => smat('capeP', lam(0x4a1a5a)),
  capeR: () => smat('capeR', lam(0x6a1020)),
  barrel: () => smat('barrel', lam(0x7a4a22, 0x1a0a00)),
};

const G = {
  box: () => sharedGeo('d-box', () => new THREE.BoxGeometry(1, 1, 1)),
  cone4: () => sharedGeo('d-cone4', () => new THREE.ConeGeometry(1, 1, 4)),
  cone6: () => sharedGeo('d-cone6', () => new THREE.ConeGeometry(1, 1, 6)),
  cyl: () => sharedGeo('d-cyl', () => new THREE.CylinderGeometry(1, 1, 1, 8)),
  ball: () => sharedGeo('d-ball', () => new THREE.IcosahedronGeometry(1, 1)),
  oct: () => sharedGeo('d-oct', () => new THREE.OctahedronGeometry(1, 0)),
};

/** 공유 지오메트리 + 공유 재질 장식 하나. s = [sx, sy, sz] */
function deco(geo: THREE.BufferGeometry, mat: THREE.Material, parent: THREE.Object3D, x: number, y: number, z: number, s: [number, number, number], rot: [number, number, number] = [0, 0, 0], shadow = false) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z); m.scale.set(...s); m.rotation.set(...rot);
  m.castShadow = shadow;
  parent.add(m);
  return m;
}

const EYE: Partial<Record<ZType, number>> = {
  boss: 0xff3322, bossBomb: 0xffa020, bossAcid: 0xb6ff3a, bossLord: 0xff3aff, king: 0xff2a1a,
  spitter: 0xb6ff3a, bomber: 0xff7a2a, screamer: 0xffffff, tank: 0xff5a3a, swarmer: 0xff8a2a, runner: 0xffe066,
};

export function buildZombieModel(type: ZType, id: number, wave: number, elite = false): ZombieModel {
  const cloth = CLOTHES[id % CLOTHES.length];
  const parts: Record<string, THREE.Object3D> = {};
  const base: BodyOpts = { torn: 1, variant: id, hair: id % 3 !== 0, pants: PANTS[id % PANTS.length], eye: EYE[type] ?? 0xffd23a };
  // 종류별: 피부, 옷, 몸 옵션, 가로 배율, 깊이 배율, 구부정함
  let skin = 0x7f9a6a, shirt = cloth, opts: BodyOpts = {}, wx = 1, wz = 1, hunch = 0.22;
  switch (type) {
    case 'runner': skin = 0xa3b07a; shirt = 0x7a2f2f; opts = { arm: 1.15 }; wx = 0.84; hunch = 0.3; break;
    case 'fatty': skin = 0x8fae7a; opts = { belly: 1, head: 0.9, hair: false }; wx = 1.4; wz = 1.3; hunch = 0.08; break;
    case 'crawler': skin = 0x8aa86a; shirt = 0x4a4036; opts = { stump: true, arm: 1.25 }; break;
    case 'swarmer': skin = 0xb7c97a; shirt = 0xb0402a; opts = { head: 1.15 }; hunch = 0.35; break;
    case 'leaper': skin = 0x6fa08a; shirt = 0x23302c; opts = { arm: 1.35, hair: false }; wx = 0.9; hunch = 0.4; break;
    case 'spitter': skin = 0x9ad04a; shirt = 0x3d5a2a; break;
    case 'bomber': skin = 0xa88a5a; shirt = 0x7a2a22; wx = 1.12; hunch = 0.12; break;
    case 'screamer': skin = 0xc9d6c0; shirt = 0x5a3a7a; opts = { arm: 1.15 }; wx = 0.85; hunch = 0.05; break;
    case 'tank': skin = 0x7f8f6f; shirt = 0x4a4f55; opts = { hair: false }; wx = 1.25; wz = 1.15; hunch = 0.15; break;
    case 'boss': skin = 0x6a8f5c; shirt = [0x7a1f1f, 0x1f4f7a, 0x5a1f7a, 0x7a5a1f][Math.max(0, Math.min(3, Math.floor(wave / 10) - 1))]; opts = { arm: 1.2, hair: false }; wx = 1.3; wz = 1.15; hunch = 0.28; break;
    case 'bossBomb': skin = 0x8a7a5a; shirt = 0xd9822b; opts = { belly: 0.5 }; wx = 1.3; wz = 1.2; hunch = 0.15; break;
    case 'bossAcid': skin = 0x8fd04a; shirt = 0x2f4a2a; opts = { belly: 0.6, hair: false, arm: 1.15 }; wx = 1.4; wz = 1.25; hunch = 0.3; break;
    case 'bossLord': skin = 0x7f8f7a; shirt = 0x3a3f4a; opts = { hair: false }; wx = 1.25; wz = 1.15; hunch = 0.06; break;
    case 'king': skin = 0x5a7f55; shirt = 0x3a1030; opts = { arm: 1.2, hair: false }; wx = 1.2; wz = 1.1; hunch = 0.1; break;
    default:
  }
  const h = makeHumanoid(skin, shirt, 1, { ...base, ...opts });
  const torso = h.torso!, head = h.head!;
  // 키를 판정 키에 맞춘다 (crawler 는 기어다니므로 서 있는 몸 기준 0.9)
  const k = type === 'crawler' ? 0.9 : ZOMBIE_TUNING[type].height / UNIT_H;
  h.group.scale.set(k * wx, k, k * wz);

  const steel = M.steel(), bone = M.bone();
  switch (type) {
    case 'leaper':
      for (let i = 0; i < 4; i++) deco(G.cone4(), bone, torso, 0, 0.62 - i * 0.16, 0.2, [0.06, 0.26, 0.06], [-1.0, 0, 0]); // 등 가시
      for (const f of h.fore!) for (const sx of [-0.05, 0.05]) deco(G.cone4(), bone, f, sx, -0.62, -0.02, [0.03, 0.2, 0.03], [Math.PI, 0, 0]); // 긴 발톱
      break;
    case 'spitter':
      parts.sac = deco(G.ball(), M.acid(), torso, 0, 0.62, -0.16, [0.17, 0.15, 0.15]); // 부푼 산성 목주머니
      deco(G.box(), M.acid(), head, 0.03, -0.06, -0.19, [0.05, 0.16, 0.03]);         // 흘러내리는 침
      for (const [x, y] of [[0.18, 0.4], [-0.2, 0.25]]) deco(G.ball(), M.acid(), torso, x, y, -0.17, [0.06, 0.06, 0.04]); // 산성 물집
      break;
    case 'bomber': {
      const dyn = M.dyn(), rope = M.rope();
      for (let i = 0; i < 5; i++) deco(G.cyl(), dyn, torso, -0.24 + i * 0.12, 0.34, -0.2, [0.045, 0.3, 0.045]); // 다이너마이트 조끼
      deco(G.box(), rope, torso, 0, 0.34, -0.2, [0.66, 0.06, 0.06]);
      deco(G.box(), rope, torso, 0, 0.46, -0.2, [0.66, 0.05, 0.06]);
      deco(G.box(), M.steelDk(), torso, 0.12, 0.56, -0.21, [0.14, 0.1, 0.05]);    // 기폭 장치
      parts.fuse = deco(G.ball(), M.fuse(), torso, 0.12, 0.63, -0.22, [0.05, 0.05, 0.05]);
      break;
    }
    case 'screamer':
      parts.mouth = deco(G.box(), M.rope(), head, 0, 0.1, -0.205, [0.2, 0.16, 0.02]); // 쩍 벌린 입
      for (const sx of [-1, 1]) deco(G.box(), M.rope(), head, sx * 0.17, 0.12, 0.08, [0.06, 0.4, 0.2], [0.15, 0, sx * 0.08]); // 늘어진 머리카락
      break;
    case 'tank':
      deco(G.box(), steel, torso, 0, 0.42, -0.02, [0.7, 0.55, 0.42], [0, 0, 0], true);   // 흉갑
      deco(G.box(), M.steelDk(), torso, 0, 0.42, -0.24, [0.5, 0.06, 0.02]);               // 리벳 줄
      for (const a of h.arms) deco(G.box(), steel, a, 0, 0.0, 0, [0.3, 0.14, 0.32], [0, 0, 0], true); // 어깨 갑옷
      deco(G.box(), steel, head, 0, 0.37, 0, [0.46, 0.14, 0.46], [0, 0, 0], true);         // 투구
      deco(G.box(), steel, head, 0, 0.31, -0.22, [0.46, 0.05, 0.06]);                      // 챙
      deco(G.box(), M.steelDk(), head, 0, 0.12, -0.21, [0.44, 0.09, 0.05]);                // 면갑 (눈 아래)
      break;
    case 'boss':
      for (const a of h.arms) deco(G.cone6(), bone, a, 0, 0.12, 0, [0.12, 0.45, 0.12], [0, 0, a.position.x < 0 ? 0.7 : -0.7]); // 어깨 뼈뿔
      for (let i = 0; i < 3; i++) deco(G.box(), bone, torso, -0.18 + i * 0.18, 0.06, -0.2, [0.1, 0.1, 0.06]); // 해골 벨트 장식
      for (let i = 0; i < 3; i++) deco(G.box(), bone, torso, 0, 0.32 + i * 0.09, -0.19, [0.36 - i * 0.04, 0.03, 0.03]); // 드러난 갈비뼈
      break;
    case 'bossBomb': {
      const dyn = M.dyn();
      for (let i = 0; i < 6; i++) deco(G.cyl(), dyn, torso, -0.28 + i * 0.11, 0.38, 0.24, [0.06, 0.5, 0.06]); // 등짐 다이너마이트
      deco(G.cyl(), M.barrel(), torso, -0.48, 0.82, 0, [0.22, 0.42, 0.22], [0, 0, 0.3], true); // 어깨 화약통
      deco(G.box(), M.rope(), torso, 0, 0.5, 0, [0.7, 0.06, 0.4], [0, 0, 0.6]);           // 멜빵
      parts.fuse = deco(G.ball(), M.fuse(), torso, 0.28, 0.72, 0.26, [0.08, 0.08, 0.08]);
      break;
    }
    case 'bossAcid':
      for (const sx of [-0.18, 0.18]) deco(G.cyl(), M.acid(), torso, sx, 0.42, 0.28, [0.15, 0.7, 0.15], [0, 0, 0], true); // 등 산성 탱크
      for (const [x, y, z, r] of [[-0.36, 0.62, -0.05, 0.13], [0.34, 0.5, 0.1, 0.11], [0.05, 0.22, -0.28, 0.1]] as const) deco(G.ball(), M.acid(), torso, x, y, z, [r, r, r]); // 산성 혹
      deco(G.ball(), M.acid(), head, 0.14, 0.32, 0.05, [0.09, 0.09, 0.09]);
      parts.tanks = h.group;
      break;
    case 'bossLord':
      deco(G.box(), steel, torso, 0, 0.44, -0.02, [0.72, 0.6, 0.42], [0, 0, 0], true);
      for (const a of h.arms) deco(G.box(), steel, a, 0, 0.02, 0, [0.36, 0.2, 0.4], [0, 0, 0], true);
      deco(G.box(), steel, head, 0, 0.37, 0, [0.48, 0.14, 0.48], [0, 0, 0], true);
      for (const sx of [-1, 1]) deco(G.cone6(), bone, head, sx * 0.24, 0.5, 0, [0.08, 0.38, 0.08], [0, 0, -sx * 0.45]); // 투구 뿔
      deco(G.box(), M.capeP(), torso, 0, 0.2, 0.24, [0.78, 1.2, 0.05], [0.12, 0, 0], true).name = 'cape';
      break;
    case 'king': {
      const gold = M.gold();
      deco(G.cyl(), gold, head, 0, 0.42, 0, [0.24, 0.08, 0.24]);                           // 왕관 띠
      for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2; deco(G.cone4(), gold, head, Math.cos(a) * 0.21, 0.54, Math.sin(a) * 0.21, [0.05, 0.18, 0.05]); }
      deco(G.oct(), M.core(), head, 0, 0.44, -0.24, [0.05, 0.06, 0.03]);                  // 왕관 보석
      deco(G.box(), M.capeR(), torso, 0, 0.2, 0.24, [0.8, 1.25, 0.05], [0.12, 0, 0], true).name = 'cape';
      for (const a of h.arms) deco(G.cone6(), bone, a, 0, 0.14, 0, [0.14, 0.6, 0.14], [0, 0, a.position.x < 0 ? 0.8 : -0.8]);
      for (let i = 0; i < 3; i++) deco(G.box(), bone, torso, 0, 0.3 + i * 0.1, -0.19, [0.4 - i * 0.05, 0.035, 0.03]);
      parts.core = deco(G.oct(), M.core(), torso, 0, 0.5, -0.2, [0.09, 0.12, 0.05]);   // 가슴의 붉은 핵
      break;
    }
    default:
  }
  if (elite) {
    // 엘리트: 금빛 견장과 머리 위에 떠 있는 보석
    const gold = M.gold();
    for (const a of h.arms) deco(G.box(), gold, a, 0, 0.02, 0, [0.3, 0.09, 0.34]);
    parts.gem = deco(G.oct(), gold, h.group, 0, 2.3, 0, [0.14, 0.14, 0.14]);
  }
  h.group.rotation.order = 'YXZ';
  return { h, eyes: h.eyes!, parts, hunch };
}

/** 개체 전용 지오메트리·재질만 버린다 (공유 캐시는 남긴다) */
export function disposeModel(group: THREE.Object3D) {
  group.traverse((o) => {
    const m = o as THREE.Mesh;
    if (m.geometry && !m.geometry.userData.shared) m.geometry.dispose();
    const mat = m.material as THREE.Material | THREE.Material[] | undefined;
    const drop = (x: THREE.Material) => { if (!x.userData.shared) x.dispose(); };
    if (Array.isArray(mat)) mat.forEach(drop); else if (mat) drop(mat);
  });
}

// 미리 쓰는 지오메트리 하나를 만들어 둬 첫 스폰 때 끊김을 줄인다
boxesGeo('warm', [[0.1, 0.1, 0.1, 0, 0, 0]]);
