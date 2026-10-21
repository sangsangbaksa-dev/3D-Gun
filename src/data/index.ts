// 모든 밸런스 수치는 여기서 조정한다.

export const FINAL_WAVE = 50;

export type ResKey = 'wood' | 'stone' | 'iron' | 'herb' | 'parts';
export const RES_KEYS: ResKey[] = ['wood', 'stone', 'iron', 'herb', 'parts'];
export const RES_LABEL: Record<ResKey, string> = { wood: '나무', stone: '돌', iron: '철', herb: '약초', parts: '부품' };
export const RES_PRICE: Record<ResKey, number> = { wood: 2, stone: 3, iron: 8, herb: 4, parts: 10 };
/** 코인으로 자원을 살 때. 판매가의 3배라 팔고 다시 사면 코인이 늘지 않는다 */
export const RES_BUY_PRICE: Record<ResKey, number> = { wood: 6, stone: 9, iron: 24, herb: 12, parts: 30 };

/** 교환소 판매 단가 = 기본가 + 보너스. 항상 구매가보다 낮게 캡한다 (차익거래 방지) */
export function exchangeSellUnit(res: ResKey, sellBonus = 0): number {
  const cap = Math.max(0, RES_BUY_PRICE[res] - RES_PRICE[res] - 1);
  return RES_PRICE[res] + Math.min(Math.max(0, sellBonus), cap);
}

// ── 채집 (소유: gathering) ─────────────────────────────────────────────
// NodeKind 는 data/map.ts 의 ResNodeKind 와 같은 이름을 쓴다.
export type NodeKind = 'tree' | 'rock' | 'iron' | 'herb' | 'wreck';
export const NODE_KINDS: NodeKind[] = ['tree', 'rock', 'iron', 'herb', 'wreck'];
export interface GatherNodeDef {
  name: string;
  /** 안내 문구 동사 (예: 'E 길게 눌러 나무 베기') */
  verb: string;
  res: ResKey;
  /** 속도 1.0 기준 채집에 걸리는 초 (state.stats.gatherSpeed 로 나눈다) */
  work: number;
  yieldMin: number; yieldMax: number;
  /** 고갈 뒤 재생성까지 걸리는 초 (기획: 60~180초) */
  respawnMin: number; respawnMax: number;
  /** 충돌 반경(m). 개체마다 scale 이 곱해진다 */
  radius: number;
  /** 고갈된 뒤 남는 충돌 비율 (그루터기, 잔해) */
  depletedBlock: number;
}
export const GATHER_NODES: Record<NodeKind, GatherNodeDef> = {
  tree:  { name: '나무', verb: '나무 베기', res: 'wood', work: 2.2, yieldMin: 3, yieldMax: 5, respawnMin: 80, respawnMax: 120, radius: 0.7, depletedBlock: 0.4 },
  rock:  { name: '바위', verb: '바위 깨기', res: 'stone', work: 2.8, yieldMin: 2, yieldMax: 4, respawnMin: 90, respawnMax: 140, radius: 1.1, depletedBlock: 0.35 },
  iron:  { name: '철광석', verb: '철광석 캐기', res: 'iron', work: 4.0, yieldMin: 1, yieldMax: 2, respawnMin: 150, respawnMax: 180, radius: 1.0, depletedBlock: 0.35 },
  herb:  { name: '약초 덤불', verb: '약초 뜯기', res: 'herb', work: 1.0, yieldMin: 2, yieldMax: 3, respawnMin: 60, respawnMax: 90, radius: 0.55, depletedBlock: 0 },
  wreck: { name: '폐차', verb: '부품 뜯기', res: 'parts', work: 3.2, yieldMin: 1, yieldMax: 2, respawnMin: 150, respawnMax: 180, radius: 1.5, depletedBlock: 0.8 },
};

/**
 * MAP.resourceNodes 가 비어 있을 때 절차적으로 채우는 밀도: 구역 종류별, 100㎡당 노드 수.
 * 키는 data/map.ts 의 ZoneKind. 없는 종류(base, boss)는 비어 있다.
 */
export const GATHER_ZONE_DENSITY: Record<string, Partial<Record<NodeKind, number>>> = {
  forest:    { tree: 3.2, herb: 0.4 },
  quarry:    { rock: 1.6, iron: 0.7 },
  mine:      { iron: 1.4, rock: 1.0 },
  field:     { herb: 1.2, tree: 0.3 },
  ruins:     { wreck: 0.9, rock: 0.3, herb: 0.2 },
  wasteland: { wreck: 0.25, rock: 0.3 },
};
/** 구역 밖 빈 땅에 흩뿌리는 밀도: 맵 10,000㎡당 노드 수 (약초와 폐차가 구역이 없어도 어디서든 보이게) */
export const GATHER_OPEN_DENSITY: Partial<Record<NodeKind, number>> = { tree: 6, rock: 3, iron: 1.2, herb: 12, wreck: 4 };
export const GATHER_LAYOUT = {
  seed: 20240607,
  /** 기지 건설 반경 바깥으로 더 띄울 거리 */
  baseMargin: 2,
  /** 좀비 레인(경로) 양옆으로 비울 반폭(m) */
  laneHalfWidth: 4,
  /** 노드 사이 최소 간격(m) */
  gap: 1.4,
  /** 맵 가장자리에서 띄울 거리 */
  edgeMargin: 4,
  /** 플레이어 시작 위치 주변 */
  startClear: 6,
  /** 구역 안에서 노드를 놓을 때 중심 쪽으로 몰리는 정도 (0 = 균등, 클수록 가운데에 몰림) */
  zoneBias: 0.35,
  /** 시도 횟수 상한 (노드 1개당) */
  tries: 30,
};
/** 화면에서 이 거리(m) 넘게 떨어진 노드는 그리기/애니메이션을 건너뛴다 (넓은 맵 성능) */
export const GATHER_VIEW_DIST = 95;
/** 노드까지 이 거리(노드 반경 + 값) 안이면 E 를 쓸 수 있다 */
export const GATHER_REACH = 2.2;
/** 채집 중 이 시간(초) 안에 다시 누르지 않으면 진행도가 줄기 시작한다 */
export const GATHER_IDLE_GRACE = 0.6;
/** 진행도가 줄어드는 속도 (초당 비율) */
export const GATHER_DECAY = 0.9;

/** 좀비 처치 샘플 드롭. special=true 면 특수 샘플(state.samplesSp). type 은 ZType 문자열 */
export interface SampleDropDef { chance: number; min: number; max: number; special: boolean }
export const SAMPLE_DROPS: Record<string, SampleDropDef> = {
  normal: { chance: 0.3, min: 1, max: 1, special: false },
  runner: { chance: 0.25, min: 1, max: 1, special: false },
  fatty:  { chance: 0.6, min: 1, max: 2, special: false },
  boss:   { chance: 1, min: 2, max: 3, special: true },
  king:   { chance: 1, min: 5, max: 5, special: true },
};

export type WeaponId = 'pistol' | 'shotgun' | 'smg';
export interface WeaponDef {
  name: string; dmg: number; rate: number; mag: number; reload: number; pellets: number; spread: number; range: number;
  /** 한 발마다 카메라가 튀는 정도(라디안) */
  recoil: number;
  /** 발사 시 퍼짐이 커지는 양(연사할수록 벌어짐) */
  bloom: number;
  /** 최대 사거리에서 피해가 줄어드는 비율 (0.5 = 절반) */
  falloff: number;
  /** 트레이서 색 (0xRRGGBB) */
  tracer: number;
}
export const WEAPON_ORDER: WeaponId[] = ['pistol', 'shotgun', 'smg'];
export const WEAPONS: Record<WeaponId, WeaponDef> = {
  pistol: { name: '권총', dmg: 14, rate: 0.34, mag: 12, reload: 1.5, pellets: 1, spread: 0.004, range: 80, recoil: 0.035, bloom: 0.6, falloff: 0.2, tracer: 0xffe6a0 },
  shotgun: { name: '샷건', dmg: 9, rate: 0.85, mag: 6, reload: 2.3, pellets: 7, spread: 0.075, range: 28, recoil: 0.11, bloom: 0.15, falloff: 0.6, tracer: 0xffb060 },
  smg: { name: '기관총', dmg: 7, rate: 0.085, mag: 35, reload: 2.0, pellets: 1, spread: 0.035, range: 60, recoil: 0.018, bloom: 0.12, falloff: 0.35, tracer: 0xa8e0ff },
};

// ── 총기 전체 표 (소유: player). WEAPONS/WeaponId 는 기존 모듈(loot, playtest)이 쓰므로 그대로 두고,
// W1 은 새 총기까지 포함한 GUNS 를 쓴다. 권총은 기본 지급이고, 나머지 총기는 강화창에서 코인으로 산다.
export type GunId = WeaponId | 'magnum' | 'rifle' | 'sniper';
export type GunKind = 'pistol' | 'revolver' | 'smg' | 'shotgun' | 'rifle' | 'sniper';
export interface GunDef extends WeaponDef {
  kind: GunKind;
  /** true 면 버튼을 누르고 있는 동안 연사, false 면 한 번 누를 때 한 발 */
  auto: boolean;
  /** 한 발이 뚫고 지나가 맞히는 좀비 수 (2 = 첫 대상 + 한 마리 더). 관통할 때마다 피해 70% */
  pierce: number;
  /** 우클릭 조준 시 시야각(작을수록 확대). 70 이 기본 */
  adsFov: number;
  /** 조준경(스코프) 오버레이를 띄운다 */
  scope: boolean;
  /** 흔들림 정도 배율 (무거운 총일수록 작다) */
  sway: number;
  /** 합성 효과음 파라미터: 피치(Hz), 길이(s), 잡음 비율 0~1, 저음 쿵 세기 0~1 */
  snd: { pitch: number; len: number; noise: number; thump: number };
  /** 설명 (강화창 등에 표시) */
  desc: string;
}
export const GUN_ORDER: GunId[] = ['pistol', 'magnum', 'smg', 'shotgun', 'rifle', 'sniper'];
export const GUNS: Record<GunId, GunDef> = {
  pistol: { ...WEAPONS.pistol, kind: 'pistol', auto: true, pierce: 1, adsFov: 58, scope: false, sway: 1, snd: { pitch: 170, len: 0.16, noise: 0.6, thump: 0.5 }, desc: '가볍고 안정적인 기본 권총' },
  shotgun: { ...WEAPONS.shotgun, kind: 'shotgun', auto: false, pierce: 1, adsFov: 62, scope: false, sway: 0.7, snd: { pitch: 95, len: 0.3, noise: 0.85, thump: 1 }, desc: '근거리에서 압도적인 산탄' },
  smg: { ...WEAPONS.smg, kind: 'smg', auto: true, pierce: 1, adsFov: 56, scope: false, sway: 1.2, snd: { pitch: 220, len: 0.11, noise: 0.7, thump: 0.35 }, desc: '빠른 연사, 탄이 퍼진다' },
  magnum: { name: '매그넘', dmg: 42, rate: 0.55, mag: 6, reload: 2.2, pellets: 1, spread: 0.006, range: 95, recoil: 0.1, bloom: 0.9, falloff: 0.15, tracer: 0xffd070,
    kind: 'revolver', auto: false, pierce: 2, adsFov: 54, scope: false, sway: 0.8, snd: { pitch: 120, len: 0.26, noise: 0.65, thump: 0.9 }, desc: '한 방이 묵직하고 관통한다' },
  rifle: { name: '돌격소총', dmg: 12, rate: 0.105, mag: 30, reload: 2.3, pellets: 1, spread: 0.014, range: 110, recoil: 0.024, bloom: 0.1, falloff: 0.25, tracer: 0xffe29a,
    kind: 'rifle', auto: true, pierce: 1, adsFov: 50, scope: false, sway: 0.8, snd: { pitch: 150, len: 0.14, noise: 0.7, thump: 0.6 }, desc: '정확한 연사, 만능 주력 무기' },
  sniper: { name: '저격총', dmg: 130, rate: 1.25, mag: 5, reload: 2.9, pellets: 1, spread: 0.0004, range: 220, recoil: 0.17, bloom: 0.5, falloff: 0, tracer: 0xbfe8ff,
    kind: 'sniper', auto: false, pierce: 3, adsFov: 24, scope: true, sway: 0.45, snd: { pitch: 75, len: 0.42, noise: 0.55, thump: 1 }, desc: '조준경으로 멀리서 관통 저격' },
};

/** 총기 강화 (골드+부품). 레벨마다 아래 보너스가 누적된다. */
export const GUN_UPGRADE = {
  maxLv: 5,
  // 피해 +12%, 연사 간격 -5%, 탄창 +10%, 재장전 -6%, 퍼짐 -6%, 산탄(pellets>1)은 pelletEvery 레벨마다 +1발
  perLevel: { dmg: 0.12, rate: 0.05, mag: 0.1, reload: 0.06, spread: 0.06, pelletEvery: 2 },
  /** 레벨 n → n+1 비용 (배열 인덱스 = 현재 레벨) */
  gold: [60, 120, 220, 380, 600],
  parts: [1, 2, 3, 5, 8],
};
/** 미보유 총기 구매가(코인). 권총은 시작 지급.
 *  매그넘 120·소총 600 = 강화 비용, 샷건 400·기관총/저격 1200 = 타이쿤 시작 보유 골드. */
export const GUN_UNLOCK_GOLD: Partial<Record<GunId, number>> = {
  magnum: 120,
  shotgun: 400,
  rifle: 600,
  smg: 1200,
  sniper: 1200,
};

// 플레이어 이동/전투 공통 수치 (소유: player)
export const PLAYER = {
  hp: 100,
  speed: 6.5,          // m/s
  aimSpeedMul: 0.65,   // 우클릭 조준 중 이동 속도 배율
  dashSpeed: 17,
  dashTime: 0.18,
  dashIframes: 0.3,
  hurtIframes: 0.15,   // 피격 직후 짧은 무적 (한 프레임에 여러 마리가 겹쳐 맞는 것 방지)
  radius: 0.4,
  sens: 0.0025,        // 마우스 감도 (라디안/픽셀)
  respawnDelay: 3,     // 사망 후 아무도 되살리지 않을 때 자동 부활까지 (초)
  headshotMul: 1.8,    // 머리(키의 78% 이상) 명중 배율
  aimAssist: 0.15,     // 조준 보정: 판정 반경에 더하는 여유(m)
  /** 비행 거리 t(m)마다 y -= bulletDrop * t² (아주 약한 낙차) */
  bulletDrop: 0.00005,
};

export type BuildingId = 'lab' | 'barracks' | 'barricade' | 'tower' | 'shop' | 'mgtower' | 'trap';
type Cost = Partial<Record<ResKey, number>>;
/** 포탑 한 단계의 능력. 1단계가 기본, 이후는 업그레이드 */
export interface TurretLevel { dmg: number; rate: number; range: number; upCost: Cost; upGold: number }
export interface BuildingDef {
  name: string; cost: Cost; radius: number; hp: number; desc: string;
  /** 사격 판정용 원기둥 높이(m) */
  height: number;
  /** 포탑류: 탄약 수, 보충 비용(한 번에 가득), 단계별 능력 */
  turret?: { ammo: number; refill: Cost; levels: TurretLevel[] };
  /** 함정류: 범위 안의 좀비를 느리게 하고 지속 피해 */
  trap?: { radius: number; slow: number; dps: number };
}
export const BUILDING_ORDER: BuildingId[] = ['tower', 'mgtower', 'barricade', 'trap', 'lab', 'barracks', 'shop'];
export const BUILDINGS: Record<BuildingId, BuildingDef> = {
  lab: { name: '연구소', cost: { wood: 8, stone: 8, parts: 2 }, radius: 1.8, hp: 300, height: 3.2, desc: 'E: 백신 제작 · 준비 중 핵에서도 제작 가능' },
  barracks: { name: '숙소', cost: { wood: 12, stone: 4 }, radius: 1.8, hp: 300, height: 2.6, desc: '아군 상한 +3' },
  barricade: { name: '바리케이드', cost: { wood: 4 }, radius: 1, hp: 200, height: 1.5, desc: '좀비가 먼저 부순다' },
  tower: {
    name: '감시탑', cost: { wood: 10, stone: 8 }, radius: 1, hp: 300, height: 5, desc: '자동 사격, 업그레이드',
    turret: {
      ammo: 40, refill: { wood: 2, stone: 1 },
      levels: [
        { dmg: 9, rate: 0.7, range: 15, upCost: {}, upGold: 0 },
        { dmg: 14, rate: 0.6, range: 17, upCost: { wood: 10, stone: 10, iron: 2 }, upGold: 0 },
        { dmg: 22, rate: 0.5, range: 19, upCost: { stone: 14, iron: 6, parts: 2 }, upGold: 30 },
      ],
    },
  },
  shop: { name: '상점', cost: { wood: 15, stone: 10, iron: 5 }, radius: 1.8, hp: 300, height: 3, desc: 'E: 자원 교환' },
  mgtower: {
    name: '기관포탑', cost: { wood: 10, stone: 10, iron: 8, parts: 4 }, radius: 1, hp: 350, height: 2.4, desc: '빠른 연사, 탄약 소모 큼',
    turret: {
      ammo: 240, refill: { iron: 2, parts: 1 },
      levels: [
        { dmg: 4, rate: 0.11, range: 13, upCost: {}, upGold: 0 },
        { dmg: 6, rate: 0.09, range: 14.5, upCost: { iron: 8, parts: 3 }, upGold: 0 },
        { dmg: 9, rate: 0.08, range: 16, upCost: { iron: 14, parts: 6 }, upGold: 40 },
      ],
    },
  },
  trap: {
    name: '슬로우 트랩', cost: { wood: 6, iron: 2 }, radius: 1, hp: 120, height: 0.4, desc: '범위 안 좀비 감속 + 지속 피해',
    trap: { radius: 3.2, slow: 0.45, dps: 7 },
  },
};

// ---- 기지 / 핵 (소유: base). 핵 위치·건설 반경·레인은 data/map.ts 의 MAP 을 읽는다 ----
export const GRID = 2;                 // 건설 격자 간격(m)
export const CORE_CLEARANCE = 4.2;     // 핵 중심에서 이 거리 안은 건설 불가
export const DEMOLISH_REFUND = 0.5;    // 철거 환급 비율
export const BARRACKS_CAP = 3;         // 숙소 1채당 아군 상한
/** 핵. hp 는 업그레이드 단계별 최대 체력 */
export const CORE = { radius: 2.2, height: 4, hp: [500, 800, 1200, 1800] };
/** 핵 수리 1회: 최대 체력의 pct 만큼 회복 */
export const CORE_REPAIR = { pct: 0.2, cost: { wood: 8, stone: 6 } as Cost };
/** 핵 강화(다음 단계로). 준비 단계에만. */
export const CORE_UPGRADES: { cost: Cost; gold: number }[] = [
  { cost: { stone: 20, iron: 6 }, gold: 50 },
  { cost: { stone: 40, iron: 14, parts: 5 }, gold: 150 },
  { cost: { stone: 80, iron: 30, parts: 12 }, gold: 400 },
];
/** 핵이 파괴된 뒤 체크포인트에서 복구되는 체력 비율 */
export const CORE_REBUILD_PCT = 0.6;
/** 상점 열쇠 가격(골드) */
export const KEY_PRICE = { iron: 80, gold: 260 };

export type Branch = '생존' | '채집' | '연구' | '사령';
export interface SkillDef { id: string; branch: Branch; name: string; desc: string; max: number }
export const SKILLS: SkillDef[] = [
  { id: 'hp', branch: '생존', name: '튼튼한 몸', desc: '최대 체력 +20', max: 5 },
  { id: 'dash', branch: '생존', name: '날쌘 발', desc: '대시 쿨타임 -0.3초', max: 4 },
  { id: 'dmg', branch: '생존', name: '화력 강화', desc: '공격력 +10%', max: 5 },
  { id: 'reload', branch: '생존', name: '빠른 손', desc: '재장전 시간 -13%', max: 4 },
  { id: 'gspeed', branch: '채집', name: '채집 속도', desc: '채집 속도 +25% (아군 포함)', max: 4 },
  { id: 'gextra', branch: '채집', name: '풍작', desc: '추가 획득 확률 +12%', max: 5 },
  { id: 'mag', branch: '채집', name: '대용량 탄창', desc: '탄창 +20%', max: 3 },
  { id: 'vrate', branch: '연구', name: '백신 개량', desc: '아군화 성공률 +8%', max: 5 },
  { id: 'vcost', branch: '연구', name: '재료 절약', desc: '백신 재료 -10%', max: 3 },
  { id: 'stun', branch: '연구', name: '기절 사격', desc: '기절 확률 +10%', max: 4 },
  { id: 'cap', branch: '사령', name: '사령관', desc: '아군 상한 +2', max: 5 },
  { id: 'adm', branch: '사령', name: '아군 강화', desc: '아군 공격력 +20%', max: 5 },
  { id: 'ahp', branch: '사령', name: '아군 맷집', desc: '아군 체력 +25%', max: 4 },
];

export interface Stats {
  maxHp: number; dmgMul: number; dashCd: number; reloadMul: number; magMul: number;
  gatherSpeed: number; gatherExtra: number; vacBonus: number; vacCostMul: number; stunBonus: number;
  allyCap: number; allyDmg: number; allyHp: number;
}
export function calcStats(l: Record<string, number>): Stats {
  const v = (id: string) => l[id] || 0;
  return {
    maxHp: 100 + 20 * v('hp'),
    dmgMul: 1 + 0.1 * v('dmg'),
    dashCd: 2 - 0.3 * v('dash'),
    reloadMul: 1 - 0.13 * v('reload'),
    magMul: 1 + 0.2 * v('mag'),
    gatherSpeed: 1 + 0.25 * v('gspeed'),
    gatherExtra: 0.12 * v('gextra'),
    vacBonus: 0.08 * v('vrate'),
    vacCostMul: 1 - 0.1 * v('vcost'),
    stunBonus: 0.1 * v('stun'),
    allyCap: 2 + 2 * v('cap'),
    allyDmg: 1 + 0.2 * v('adm'),
    allyHp: 1 + 0.25 * v('ahp'),
  };
}

export interface VaccineDef { name: string; herb: number; sample: number; sampleSp: number; parts: number; iron: number; rate: number }
export const VACCINES: VaccineDef[] = [
  { name: '초급 백신', herb: 2, sample: 1, sampleSp: 0, parts: 0, iron: 0, rate: 0.4 },
  { name: '중급 백신', herb: 5, sample: 3, sampleSp: 0, parts: 1, iron: 0, rate: 0.6 },
  { name: '고급 백신', herb: 8, sample: 0, sampleSp: 2, parts: 0, iron: 2, rate: 0.8 },
];

// ── 백신/아군 (소유: allies). 직렬화 가능한 값만 둔다. ──
export type AllyRole = 'fighter' | 'gatherer' | 'guard' | 'researcher';
export const ALLY_ROLE_ORDER: AllyRole[] = ['fighter', 'guard', 'gatherer', 'researcher'];
export interface AllyRoleDef { name: string; desc: string; color: number; max: number }
export const ALLY_ROLES: Record<AllyRole, AllyRoleDef> = {
  fighter: { name: '전투병', desc: '플레이어를 따라다니며 함께 싸운다 (최대 3)', color: 0xe5483f, max: 3 },
  guard: { name: '경비병', desc: '핵 주변을 순찰하며 다가오는 좀비를 막는다', color: 0x3f8be5, max: 99 },
  gatherer: { name: '채집병', desc: '자원을 캐서 기지로 가져온다', color: 0xe5a53f, max: 99 },
  researcher: { name: '연구 보조', desc: '연구소 백신 제작 속도 증가', color: 0xa56be5, max: 99 },
};
/** 아군 기본 능력. 최종값 = 기본 * state.stats.allyDmg / allyHp */
export const ALLY = { hp: 60, speed: 5, dmg: 9, atkRate: 0.8, atkRange: 1.7, radius: 0.45, height: 1.9, regenDelay: 5, regen: 2, aggro: 12, leash: 16 };
/** 주사: 시간(초), 체력이 낮을수록 더해지는 성공률(최대), 보스 감산 */
export const INJECT = { time: 1.5, range: 2.2, lowHpBonus: 0.2, bossPenalty: 0.3, minRate: 0.05, maxRate: 0.95 };
/** 백신 제작: 1개당 기본 시간(초)과 연구 보조 1명당 가속 비율 */
export const CRAFT = { time: 3, perResearcher: 0.35 };
export const GATHER = { time: 3, carryRange: 2.5 };
/** 아군 동시 상한의 절대 천장 */
export const ALLY_HARD_CAP = 30;

// 상자 등급: 0 나무(무료), 1 철(열쇠), 2 황금(황금 열쇠)
export const CHEST_NAMES = ['나무 상자', '철 상자', '황금 상자'];
export const REWARD_NAMES = ['일반', '고급', '희귀', '전설'];
// 보상 등급 확률 (%): [일반, 고급, 희귀, 전설]
export const CHEST_TABLE: number[][] = [
  [70, 25, 5, 0],
  [45, 40, 13, 2],
  [10, 45, 35, 10],
];
export const PITY_LIMIT = 10; // 철/황금 상자에서 희귀 미만이 10번 연속이면 다음은 희귀 이상 확정

// ---- 보물상자 세부 수치 (loot 소유) ----
export const RARITY_COLORS = [0xcfd3d8, 0x66cc66, 0x66aaff, 0xffcc33]; // 일반/고급/희귀/전설 (hex 숫자)
/** 상자 등급별 열기 비용. 사용 열쇠 필드 이름(없으면 무료) */
export const CHEST_KEY: (string | null)[] = [null, 'keys', 'goldKeys'];
export const CHEST_INTERACT_RANGE = 2.4;
export const CHEST_ODDS_RANGE = 6; // 이 거리 안에 들어오면 확률표를 띄운다
/** 열기 연출 타임라인(초): 흔들림 → 뚜껑 터짐(보상 지급) → 빛기둥 → 사라짐 */
export const CHEST_ANIM = { burst: 1.15, total: 3.8 };
/** 열린 뒤 다시 생기기까지 초 (등급별) */
export const CHEST_RESPAWN = [120, 240, 420];
/** 맵에 정적 상자(MAP.chests)가 비어 있을 때 구역 위험도(danger)별로 절차 배치하는 개수 */
export const ZONE_CHEST_RULE: Record<number, { wood: number; iron: number }> = {
  1: { wood: 1, iron: 0 }, 2: { wood: 2, iron: 0 }, 3: { wood: 2, iron: 1 }, 4: { wood: 1, iron: 2 }, 5: { wood: 1, iron: 2 },
};
/** 구역 밖 흩뿌림: 면적 areaPer(㎡)마다 나무 상자 1개, 최대 max개 */
export const CHEST_SCATTER = { areaPer: 4000, max: 40 };
/** 황금 상자 희귀 스폰: 간격마다 (없을 때만) 위험도 minDanger 이상 구역 안에 나타나고 ttl 뒤 사라진다 */
export const GOLD_SPAWN = { interval: 360, ttl: 150, minDanger: 4 };
/** 좀비 처치 드롭 확률(0~1). 상자는 ttl 초 뒤 사라진다 */
export const CHEST_DROP = { woodChance: 0.04, keyChance: 0.02, ttl: 90 };
/** 웨이브 보상: 클리어마다 나무 상자, ironEvery 웨이브마다 철 상자 추가. 핵 둘레 buildRadius×(ringMinK~ringMaxK) 위치 */
export const WAVE_CHEST = { ironEvery: 5, ringMinK: 0.5, ringMaxK: 0.85 }; // ring 은 MAP.buildRadius 에 대한 비율
export const CHEST_MAX = 14; // 동시에 존재하는 최대 수 (넘치면 가장 오래된 드롭/웨이브 상자 제거)
export const GOLD_KEY_PER_BOSS = 1;

// 보상 표: 상자 보상 등급(0~3)마다 가중치 목록. 함수 없이 직렬화 가능한 데이터만 둔다.
export type RewardDef =
  | { kind: 'res'; w: number; res: ResKey; min: number; max: number }
  | { kind: 'gold'; w: number; min: number; max: number }
  | { kind: 'key'; w: number; n: number }
  | { kind: 'goldKey'; w: number; n: number }
  | { kind: 'sample'; w: number; min: number; max: number }
  | { kind: 'sampleSp'; w: number; min: number; max: number }
  | { kind: 'vaccine'; w: number; tier: number; n: number } // tier 0 초급 / 1 중급 / 2 고급
  | { kind: 'skillPoint'; w: number; n: number }
  | { kind: 'weapon'; w: number; id: GunId }
  | { kind: 'costume'; w: number };
export const COSTUMES = ['작업모', '파티 고깔', '요리사 모자', '해적 두건', '황금 왕관'];
export const DUPLICATE_WEAPON_GOLD = 150; // 이미 가진 무기가 나오면 골드로 전환
export const COSTUME_DUPLICATE_GOLD = 60;
export const REWARD_TABLE: RewardDef[][] = [
  [ // 일반
    { kind: 'res', w: 30, res: 'wood', min: 6, max: 12 },
    { kind: 'res', w: 22, res: 'stone', min: 4, max: 8 },
    { kind: 'res', w: 16, res: 'herb', min: 3, max: 6 },
    { kind: 'gold', w: 24, min: 15, max: 30 },
    { kind: 'sample', w: 8, min: 1, max: 1 },
  ],
  [ // 고급
    { kind: 'res', w: 18, res: 'iron', min: 3, max: 6 },
    { kind: 'res', w: 14, res: 'parts', min: 2, max: 3 },
    { kind: 'res', w: 12, res: 'herb', min: 6, max: 10 },
    { kind: 'gold', w: 22, min: 40, max: 80 },
    { kind: 'sample', w: 14, min: 2, max: 3 },
    { kind: 'key', w: 10, n: 1 },
    { kind: 'vaccine', w: 10, tier: 0, n: 1 },
    { kind: 'weapon', w: 4, id: 'magnum' },
  ],
  [ // 희귀
    { kind: 'vaccine', w: 20, tier: 1, n: 1 },
    { kind: 'res', w: 14, res: 'parts', min: 4, max: 6 },
    { kind: 'res', w: 12, res: 'iron', min: 8, max: 12 },
    { kind: 'sampleSp', w: 12, min: 1, max: 1 },
    { kind: 'gold', w: 16, min: 100, max: 180 },
    { kind: 'key', w: 8, n: 2 },
    { kind: 'skillPoint', w: 8, n: 1 },
    { kind: 'weapon', w: 5, id: 'shotgun' },
    { kind: 'weapon', w: 6, id: 'magnum' },
    { kind: 'weapon', w: 4, id: 'smg' },
    { kind: 'weapon', w: 3, id: 'rifle' },
    { kind: 'costume', w: 4 },
  ],
  [ // 전설
    { kind: 'weapon', w: 12, id: 'smg' },
    { kind: 'weapon', w: 8, id: 'shotgun' },
    { kind: 'weapon', w: 8, id: 'magnum' },
    { kind: 'weapon', w: 14, id: 'rifle' },
    { kind: 'weapon', w: 14, id: 'sniper' },
    { kind: 'vaccine', w: 16, tier: 2, n: 1 },
    { kind: 'skillPoint', w: 14, n: 2 },
    { kind: 'goldKey', w: 10, n: 1 },
    { kind: 'gold', w: 12, min: 400, max: 600 },
    { kind: 'sampleSp', w: 8, min: 3, max: 3 },
    { kind: 'costume', w: 6 },
  ],
];

export type ZType =
  | 'normal' | 'runner' | 'fatty' | 'crawler' | 'swarmer' | 'leaper' | 'spitter' | 'bomber' | 'screamer' | 'tank'
  | 'boss' | 'bossBomb' | 'bossAcid' | 'bossLord' | 'king';
export interface ZStats { hp: number; speed: number; dmg: number; scale: number }
export function zombieStats(wave: number, t: ZType): ZStats {
  const baseHp = 30 + wave * 9 + wave * wave * 0.5;
  const baseDmg = 10 + wave * 0.6;
  const baseSpeed = 2.1 + Math.min(1, wave * 0.02);
  switch (t) {
    case 'runner': return { hp: baseHp * 0.55, speed: 4.4, dmg: baseDmg * 0.8, scale: 0.95 };
    case 'fatty': return { hp: baseHp * 2.6, speed: 1.35, dmg: baseDmg * 1.4, scale: 1.5 };
    case 'crawler': return { hp: baseHp * 0.45, speed: baseSpeed * 1.25, dmg: baseDmg * 0.7, scale: 0.9 };
    case 'swarmer': return { hp: baseHp * 0.22, speed: 5.3, dmg: baseDmg * 0.45, scale: 0.6 };
    case 'leaper': return { hp: baseHp * 0.8, speed: 3.0, dmg: baseDmg * 1.1, scale: 1.05 };
    case 'spitter': return { hp: baseHp * 0.6, speed: 2.0, dmg: baseDmg * 0.9, scale: 1 };
    case 'bomber': return { hp: baseHp * 0.7, speed: 3.4, dmg: baseDmg * 3.2, scale: 1.15 };
    case 'screamer': return { hp: baseHp * 0.75, speed: 2.2, dmg: baseDmg * 0.5, scale: 1.05 };
    case 'tank': return { hp: baseHp * 3.4, speed: 1.5, dmg: baseDmg * 1.5, scale: 1.45 };
    case 'boss': return { hp: baseHp * 14, speed: 2.4, dmg: baseDmg * 2.2, scale: 2.2 };
    case 'bossBomb': return { hp: baseHp * 12, speed: 2.6, dmg: baseDmg * 2.0, scale: 2.3 };
    case 'bossAcid': return { hp: baseHp * 13, speed: 2.0, dmg: baseDmg * 1.9, scale: 2.4 };
    case 'bossLord': return { hp: baseHp * 16, speed: 2.4, dmg: baseDmg * 2.4, scale: 2.6 };
    case 'king': return { hp: 14000, speed: 2.8, dmg: 55, scale: 3.2 };
    default: return { hp: baseHp, speed: baseSpeed, dmg: baseDmg, scale: 1 };
  }
}
export const MAX_ALIVE = 40;
export const waveCount = (w: number) => Math.floor(6 + w * 1.6);

// ── W2 enemies 구역: 웨이브/좀비 수치 (직렬화 가능한 표와 순수 함수만) ──
export const CHECKPOINT_EVERY = 5;
export const ENEMY_RULES = {
  prep: 30,               // 웨이브 사이 준비 시간(초). 첫 웨이브도 동일
  stunHpRatio: 0.3,       // 체력이 이 비율 이하일 때 기절 판정
  stunBase: 0.35,         // 기본 기절 확률 (+ stats.stunBonus)
  stunTime: 8,            // 기절 유지 시간
  rageSpeed: 1.3,         // 기절에서 깨어난 좀비 속도 배수
  fallbackRestart: 4,     // run:over 뒤 아무도 run:start 를 내지 않고 창(modal)도 안 열렸을 때 스스로 새 런을 시작하기까지(초)
  aggroPlayer: 16, aggroAlly: 11, aggroStructure: 7,
  reach: 0.9,             // 근접 공격 여유 거리
  windup: 0.45,           // 공격 준비 동작
  waveClearGold: 10,      // 웨이브 클리어 골드 = 이 값 + 웨이브 × 2
  gasRadius: 3.2, gasTime: 4, gasDps: 7, // 뚱보 사망 독가스
  roamAggro: 14, roamPerDanger: 1.25, roamRespawn: 45, // 구역 배회 좀비: 위험도×이 값 ≈ 구역 최대 마리 (웨이브 스폰과 별개)
  laneSpread: 3,          // 레인 경유점 좌우 흩어짐(m)
};

/** 종류별 체형과 능력. 능력 필드가 있는 종류만 그 행동을 한다 (모두 숫자 데이터). */
export interface ZTune {
  name: string;
  atkCd: number; radius: number; height: number; reach: number;
  /** 받는 피해 감소 (0.5 = 절반). 기절 중에는 무시 */
  armor?: number;
  /** 원거리 유닛이 유지하려는 거리 [가까이 오면 물러남, 사격 최대 거리] */
  keep?: [number, number];
  /** 점프 공격: 거리 range 안에서 cd 마다, windup 동안 웅크린 뒤 time 동안 날아 착지 범위 피해 */
  leap?: { range: number; cd: number; windup: number; time: number; radius: number; dmgMul: number };
  /** 산성 침: time 동안 날아가 착지, radius 범위 피해 후 pool 초 동안 웅덩이(초당 dps) */
  spit?: { cd: number; windup: number; time: number; radius: number; dmgMul: number; pool: number; dps: number };
  /** 자폭: 목표에 range 안으로 오면 fuse 초 뒤 폭발. 죽어도 deathRadius 로 터진다 */
  bomb?: { range: number; fuse: number; radius: number; dmgMul: number; deathRadius: number; deathMul: number };
  /** 비명: cd 마다 windup 뒤 radius 안 좀비를 time 초 동안 buff 배 빠르게 하고 count 마리를 부른다 */
  scream?: { cd: number; windup: number; radius: number; buff: number; time: number; summon: ZType; count: number };
}
export const ZOMBIE_TUNING: Record<ZType, ZTune> = {
  normal: { name: '좀비', atkCd: 1.1, radius: 0.45, height: 1.9, reach: 0 },
  runner: { name: '달리기 좀비', atkCd: 0.8, radius: 0.4, height: 1.8, reach: 0 },
  fatty: { name: '뚱보 좀비', atkCd: 1.6, radius: 0.75, height: 2.2, reach: 0.3 },
  crawler: { name: '기어다니는 좀비', atkCd: 0.9, radius: 0.4, height: 0.85, reach: 0 },
  swarmer: { name: '떼거리 좀비', atkCd: 0.7, radius: 0.28, height: 1.15, reach: 0 },
  leaper: { name: '도약 좀비', atkCd: 1.0, radius: 0.45, height: 1.9, reach: 0,
    leap: { range: 12, cd: 4.5, windup: 0.55, time: 0.6, radius: 1.8, dmgMul: 1.3 } },
  spitter: { name: '산성 좀비', atkCd: 1.0, radius: 0.45, height: 1.9, reach: 0, keep: [6, 15],
    spit: { cd: 2.6, windup: 0.5, time: 0.8, radius: 1.7, dmgMul: 1.0, pool: 3, dps: 6 } },
  bomber: { name: '폭탄 좀비', atkCd: 1.0, radius: 0.55, height: 2.0, reach: 0,
    bomb: { range: 2.8, fuse: 0.8, radius: 5, dmgMul: 1, deathRadius: 3.5, deathMul: 0.6 } },
  screamer: { name: '비명 좀비', atkCd: 1.5, radius: 0.45, height: 1.95, reach: 0, keep: [8, 12],
    scream: { cd: 9, windup: 0.9, radius: 28, buff: 1.4, time: 6, summon: 'normal', count: 2 } },
  tank: { name: '장갑 좀비', atkCd: 1.7, radius: 0.8, height: 2.4, reach: 0.4, armor: 0.5 },
  boss: { name: '브루저', atkCd: 1.3, radius: 1.0, height: 3.4, reach: 0.8 },
  bossBomb: { name: '폭파광', atkCd: 1.3, radius: 1.05, height: 3.5, reach: 0.8 },
  bossAcid: { name: '산성 괴수', atkCd: 1.4, radius: 1.1, height: 3.6, reach: 0.8 },
  bossLord: { name: '군단장', atkCd: 1.2, radius: 1.15, height: 3.9, reach: 0.9, armor: 0.25 },
  king: { name: '좀비 왕', atkCd: 1.1, radius: 1.5, height: 5.0, reach: 1.2 },
};

export const BOSS_TYPES: ZType[] = ['boss', 'bossBomb', 'bossAcid', 'bossLord'];
export const isBossType = (t: ZType) => t === 'king' || BOSS_TYPES.includes(t);
/** 10웨이브 브루저, 20 폭파광, 30 산성 괴수, 40 군단장, 50 좀비 왕. 50 이후 무한 모드는 보스가 순환한다 */
export const bossTypeFor = (wave: number): ZType => (wave === FINAL_WAVE ? 'king' : BOSS_TYPES[(Math.floor(wave / 10) - 1) % BOSS_TYPES.length]);
/** 10의 배수 웨이브는 보스, 50웨이브는 좀비 왕 */
export const isBossWave = (wave: number) => wave > 0 && wave % 10 === 0;

/** 보스 패턴 공통 수치와 보스별 패턴 목록(w = 선택 가중치) */
export const BOSS_MOVE = {
  slam: { windup: 1.1, dmgMul: 1.6 },
  charge: { windup: 0.8, time: 0.7, speed: 16, dmgMul: 1.3 },
  volley: { windup: 0.9, count: 5, spread: 0.9, time: 0.9, radius: 1.8, dmgMul: 0.9, pool: 3, dps: 6 },
  bombRain: { windup: 1.3, count: 4, radius: 4, dmgMul: 1.4, scatter: 7 },
  summon: { windup: 1.2 },
  scream: { windup: 1.0, radius: 40, buff: 1.4, time: 8 },
};
export interface BossKit {
  moves: { kind: keyof typeof BOSS_MOVE; w: number }[];
  /** 소환 목록: 한 번에 type 을 count 마리씩 */
  summon?: { type: ZType; count: number }[];
  slamRadius: number;
  /** 패턴 사이 쉬는 시간 [일반, 체력 50% 이하] */
  cd: [number, number];
  summonCd: [number, number];
}
export const BOSS_KIT: Record<string, BossKit> = {
  boss: { moves: [{ kind: 'slam', w: 3 }, { kind: 'charge', w: 3 }], slamRadius: 5.5, cd: [5, 3.2], summonCd: [99, 99] },
  bossBomb: { moves: [{ kind: 'bombRain', w: 3 }, { kind: 'charge', w: 2 }, { kind: 'summon', w: 2 }], summon: [{ type: 'bomber', count: 3 }], slamRadius: 6, cd: [4.5, 3], summonCd: [16, 11] },
  bossAcid: { moves: [{ kind: 'volley', w: 4 }, { kind: 'slam', w: 2 }, { kind: 'summon', w: 1 }], summon: [{ type: 'spitter', count: 2 }, { type: 'crawler', count: 4 }], slamRadius: 6.5, cd: [4.5, 3], summonCd: [18, 12] },
  bossLord: { moves: [{ kind: 'scream', w: 2 }, { kind: 'summon', w: 2 }, { kind: 'charge', w: 3 }, { kind: 'slam', w: 2 }], summon: [{ type: 'runner', count: 4 }, { type: 'tank', count: 1 }, { type: 'leaper', count: 2 }], slamRadius: 7, cd: [4, 2.6], summonCd: [14, 10] },
  king: { moves: [{ kind: 'slam', w: 3 }, { kind: 'charge', w: 2 }, { kind: 'summon', w: 2 }, { kind: 'bombRain', w: 2 }, { kind: 'scream', w: 1 }], summon: [{ type: 'normal', count: 5 }, { type: 'tank', count: 1 }], slamRadius: 8, cd: [4, 2.6], summonCd: [20, 14] },
};

/** 엘리트: 이 웨이브부터 일반 종류가 확률적으로 강화판(금빛)으로 나온다. 떼거리와 보스는 제외 */
export const ELITE = { fromWave: 20, chanceBase: 0.08, chancePerWave: 0.01, chanceMax: 0.35, hp: 2.5, dmg: 1.4, scale: 1.15, reward: 3 };
export const eliteChance = (wave: number) => (wave < ELITE.fromWave ? 0 : Math.min(ELITE.chanceMax, ELITE.chanceBase + (wave - ELITE.fromWave) * ELITE.chancePerWave));

/** 처치 코인 (상자 보상 대체 — 전투가 주 수입) */
export const ZOMBIE_REWARD: Record<ZType, { gold: number; xp: number }> = {
  normal: { gold: 4, xp: 5 }, runner: { gold: 4, xp: 7 }, fatty: { gold: 8, xp: 14 },
  crawler: { gold: 3, xp: 5 }, swarmer: { gold: 2, xp: 2 }, leaper: { gold: 7, xp: 12 },
  spitter: { gold: 10, xp: 16 }, bomber: { gold: 8, xp: 14 }, screamer: { gold: 13, xp: 20 }, tank: { gold: 18, xp: 28 },
  boss: { gold: 120, xp: 150 }, bossBomb: { gold: 150, xp: 200 }, bossAcid: { gold: 180, xp: 250 }, bossLord: { gold: 240, xp: 350 },
  king: { gold: 750, xp: 1000 },
};

/** 모든 웨이브 준비 시간 30초 + 영구 업그레이드 보너스(state.start.prepBonus) */
export const prepTime = (_wave: number, bonus = 0) => ENEMY_RULES.prep + bonus;

/**
 * 등장 표: 종류별로 from 웨이브부터 weight = min(max, base + (wave-from)*ramp). 나머지는 일반 좀비.
 * pack > 1 이면 한 번 뽑힐 때 그 수만큼 한꺼번에 나온다(웨이브 수에는 마리 수로 센다).
 */
export const ROSTER: { type: ZType; from: number; base: number; ramp: number; max: number; pack: number }[] = [
  { type: 'crawler', from: 2, base: 0.1, ramp: 0.01, max: 0.18, pack: 1 },
  { type: 'runner', from: 3, base: 0.08, ramp: 0.02, max: 0.25, pack: 1 },
  { type: 'swarmer', from: 4, base: 0.05, ramp: 0.01, max: 0.12, pack: 6 },
  { type: 'fatty', from: 5, base: 0.05, ramp: 0.01, max: 0.15, pack: 1 },
  { type: 'leaper', from: 6, base: 0.06, ramp: 0.015, max: 0.2, pack: 1 },
  { type: 'spitter', from: 7, base: 0.05, ramp: 0.012, max: 0.16, pack: 1 },
  { type: 'tank', from: 8, base: 0.04, ramp: 0.008, max: 0.12, pack: 1 },
  { type: 'bomber', from: 9, base: 0.05, ramp: 0.01, max: 0.14, pack: 1 },
  { type: 'screamer', from: 11, base: 0.03, ramp: 0.006, max: 0.08, pack: 1 },
];
/** 웨이브 w 에서 뽑을 수 있는 종류와 가중치(합 1, 일반 좀비 포함) */
export function waveRoster(wave: number): { type: ZType; weight: number; pack: number }[] {
  const out = ROSTER.filter((r) => wave >= r.from).map((r) => ({ type: r.type, weight: Math.min(r.max, r.base + (wave - r.from) * r.ramp), pack: r.pack }));
  const sum = out.reduce((a, r) => a + r.weight, 0);
  const scale = sum > 0.8 ? 0.8 / sum : 1; // 일반 좀비가 최소 20% 는 남는다
  const list = out.map((r) => ({ ...r, weight: r.weight * scale }));
  list.unshift({ type: 'normal', weight: 1 - list.reduce((a, r) => a + r.weight, 0), pack: 1 });
  return list;
}
