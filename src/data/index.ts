// 모든 밸런스 수치는 여기서 조정한다.

export const FINAL_WAVE = 50;

export type ResKey = 'wood' | 'stone' | 'iron' | 'herb' | 'parts';
export const RES_KEYS: ResKey[] = ['wood', 'stone', 'iron', 'herb', 'parts'];
export const RES_LABEL: Record<ResKey, string> = { wood: '나무', stone: '돌', iron: '철', herb: '약초', parts: '부품' };
export const RES_PRICE: Record<ResKey, number> = { wood: 2, stone: 3, iron: 8, herb: 4, parts: 10 };

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
