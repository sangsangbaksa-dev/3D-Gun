// 모든 밸런스 수치는 여기서 조정한다.

export const FINAL_WAVE = 50;

export type ResKey = 'wood' | 'stone' | 'iron' | 'herb' | 'parts';
export const RES_KEYS: ResKey[] = ['wood', 'stone', 'iron', 'herb', 'parts'];
export const RES_LABEL: Record<ResKey, string> = { wood: '나무', stone: '돌', iron: '철', herb: '약초', parts: '부품' };
export const RES_PRICE: Record<ResKey, number> = { wood: 2, stone: 3, iron: 8, herb: 4, parts: 10 };

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
// W1 은 새 총기까지 포함한 GUNS 를 쓴다. 새 총기는 상자 보상표(loot)나 상점에서 id 로 지급한다.
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
  aimAssist: 0.15,     // 3인칭 조준 보정: 판정 반경에 더하는 여유(m)
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
  lab: { name: '연구소', cost: { wood: 10, stone: 10, parts: 3 }, radius: 1.8, hp: 300, height: 3.2, desc: 'E: 백신 제작' },
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
  shop: { name: '상점', cost: { wood: 15, stone: 10, iron: 5 }, radius: 1.8, hp: 300, height: 3, desc: 'E: 자원 판매, 열쇠 구매' },
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
  { name: '초급 백신', herb: 3, sample: 2, sampleSp: 0, parts: 0, iron: 0, rate: 0.4 },
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
  | { kind: 'weapon'; w: number; id: WeaponId }
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
  ],
  [ // 희귀
    { kind: 'vaccine', w: 20, tier: 1, n: 1 },
    { kind: 'res', w: 14, res: 'parts', min: 4, max: 6 },
    { kind: 'res', w: 12, res: 'iron', min: 8, max: 12 },
    { kind: 'sampleSp', w: 12, min: 1, max: 1 },
    { kind: 'gold', w: 16, min: 100, max: 180 },
    { kind: 'key', w: 8, n: 2 },
    { kind: 'skillPoint', w: 8, n: 1 },
    { kind: 'weapon', w: 6, id: 'shotgun' },
    { kind: 'costume', w: 4 },
  ],
  [ // 전설
    { kind: 'weapon', w: 20, id: 'smg' },
    { kind: 'weapon', w: 14, id: 'shotgun' },
    { kind: 'vaccine', w: 16, tier: 2, n: 1 },
    { kind: 'skillPoint', w: 14, n: 2 },
    { kind: 'goldKey', w: 10, n: 1 },
    { kind: 'gold', w: 12, min: 400, max: 600 },
    { kind: 'sampleSp', w: 8, min: 3, max: 3 },
    { kind: 'costume', w: 6 },
  ],
];

export type ZType = 'normal' | 'runner' | 'fatty' | 'boss' | 'king';
export interface ZStats { hp: number; speed: number; dmg: number; scale: number }
export function zombieStats(wave: number, t: ZType): ZStats {
  const baseHp = 30 + wave * 9 + wave * wave * 0.5;
  const baseDmg = 10 + wave * 0.6;
  switch (t) {
    case 'runner': return { hp: baseHp * 0.55, speed: 4.4, dmg: baseDmg * 0.8, scale: 0.95 };
    case 'fatty': return { hp: baseHp * 2.6, speed: 1.35, dmg: baseDmg * 1.4, scale: 1.5 };
    case 'boss': return { hp: baseHp * 14, speed: 2.4, dmg: baseDmg * 2.2, scale: 2.2 };
    case 'king': return { hp: 14000, speed: 2.8, dmg: 55, scale: 3.2 };
    default: return { hp: baseHp, speed: 2.1 + Math.min(1, wave * 0.02), dmg: baseDmg, scale: 1 };
  }
}
export const MAX_ALIVE = 40;
export const waveCount = (w: number) => Math.floor(6 + w * 1.6);

// ── W2 enemies 구역: 웨이브/좀비 수치 (직렬화 가능한 표와 순수 함수만) ──
export const CHECKPOINT_EVERY = 5;
/** 상태 이름 표기용이 아니라 밸런스 상수 모음 */
export const ENEMY_RULES = {
  prepFirst: 30,          // 첫 웨이브 준비 시간(초)
  prepMax: 45,            // 준비 시간 상한
  stunHpRatio: 0.3,       // 체력이 이 비율 이하일 때 기절 판정
  stunBase: 0.35,         // 기본 기절 확률 (+ stats.stunBonus)
  stunTime: 8,            // 기절 유지 시간
  rageSpeed: 1.3,         // 기절에서 깨어난 좀비 속도 배수
  lossOnDeath: 0.3,       // 체크포인트 복귀 때 잃는 자원 비율
  aggroPlayer: 16, aggroAlly: 11, aggroStructure: 7,
  reach: 0.9,             // 근접 공격 여유 거리
  windup: 0.45,           // 공격 준비 동작
  waveClearGold: 10,      // 웨이브 클리어 골드 = 이 값 + 웨이브 × 2
  gasRadius: 3.2, gasTime: 4, gasDps: 7, // 뚱보 사망 독가스
  roamAggro: 14, roamPerDanger: 2, roamRespawn: 45, // 구역 배회 좀비 (zones[].danger 기준)
  laneSpread: 3,          // 레인 경유점 좌우 흩어짐(m)
};
/** 좀비 종류별 공격 간격(초)과 체형 */
export const ZOMBIE_TUNING: Record<ZType, { atkCd: number; radius: number; height: number; reach: number }> = {
  normal: { atkCd: 1.1, radius: 0.45, height: 1.9, reach: 0 },
  runner: { atkCd: 0.8, radius: 0.4, height: 1.8, reach: 0 },
  fatty: { atkCd: 1.6, radius: 0.75, height: 2.2, reach: 0.3 },
  boss: { atkCd: 1.3, radius: 1.0, height: 3.4, reach: 0.8 },
  king: { atkCd: 1.1, radius: 1.5, height: 5.0, reach: 1.2 },
};
export const ZOMBIE_REWARD: Record<ZType, { gold: number; xp: number }> = {
  normal: { gold: 2, xp: 5 },
  runner: { gold: 2, xp: 7 },
  fatty: { gold: 5, xp: 14 },
  boss: { gold: 80, xp: 150 },
  king: { gold: 500, xp: 1000 },
};
export const prepTime = (wave: number) => (wave <= 1 ? ENEMY_RULES.prepFirst : Math.min(ENEMY_RULES.prepMax, 20 + wave));
/** 웨이브별 종류 비율(합 1). 달리기는 3웨이브부터, 뚱보는 5웨이브부터 섞인다 */
export function waveMix(wave: number): { normal: number; runner: number; fatty: number } {
  const runner = wave < 3 ? 0 : Math.min(0.4, 0.08 + (wave - 3) * 0.02);
  const fatty = wave < 5 ? 0 : Math.min(0.25, 0.05 + (wave - 5) * 0.01);
  return { normal: 1 - runner - fatty, runner, fatty };
}
/** 10의 배수 웨이브는 보스, 50웨이브는 좀비 왕. 50 이후 무한 모드에서도 10의 배수마다 보스가 나온다 */
export const isBossWave = (wave: number) => wave > 0 && wave % 10 === 0;
