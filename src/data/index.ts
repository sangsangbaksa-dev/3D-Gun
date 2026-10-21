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
export interface WeaponDef { name: string; dmg: number; rate: number; mag: number; reload: number; pellets: number; spread: number; range: number }
export const WEAPON_ORDER: WeaponId[] = ['pistol', 'shotgun', 'smg'];
export const WEAPONS: Record<WeaponId, WeaponDef> = {
  pistol: { name: '권총', dmg: 14, rate: 0.34, mag: 12, reload: 1.5, pellets: 1, spread: 0.004, range: 80 },
  shotgun: { name: '샷건', dmg: 9, rate: 0.85, mag: 6, reload: 2.3, pellets: 7, spread: 0.075, range: 28 },
  smg: { name: '기관총', dmg: 7, rate: 0.085, mag: 35, reload: 2.0, pellets: 1, spread: 0.035, range: 60 },
};

export type BuildingId = 'lab' | 'barracks' | 'barricade' | 'tower' | 'shop';
export interface BuildingDef { name: string; cost: Partial<Record<ResKey, number>>; radius: number; hp: number; desc: string }
export const BUILDING_ORDER: BuildingId[] = ['lab', 'barracks', 'barricade', 'tower', 'shop'];
export const BUILDINGS: Record<BuildingId, BuildingDef> = {
  lab: { name: '연구소', cost: { wood: 10, stone: 10, parts: 3 }, radius: 1.8, hp: 300, desc: 'E: 백신 제작' },
  barracks: { name: '숙소', cost: { wood: 12, stone: 4 }, radius: 1.8, hp: 300, desc: '아군 상한 +3' },
  barricade: { name: '바리케이드', cost: { wood: 4 }, radius: 1.2, hp: 200, desc: '좀비를 막는다' },
  tower: { name: '감시탑', cost: { wood: 10, stone: 8 }, radius: 1.2, hp: 300, desc: '자동 사격' },
  shop: { name: '상점', cost: { wood: 15, stone: 10, iron: 5 }, radius: 1.8, hp: 300, desc: 'E: 자원 판매, 열쇠 구매' },
};

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
