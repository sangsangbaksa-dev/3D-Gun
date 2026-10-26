// 2D 업그레이드 타이쿤(사망 후 메타 진행) 데이터. 소유: tycoon2d.
// 직렬화 가능한 객체만 둔다(함수 없음). Unity 에서는 ScriptableObject/JSON 으로 그대로 옮긴다.
import type { ResKey } from './index';

/** 메타 지갑에 들어가는 통화. 런에서 남긴 골드·자원·샘플·스킬 포인트가 그대로 쌓인다 */
export type WalletKey = 'gold' | ResKey | 'samples' | 'samplesSp' | 'skillPoints';
export const WALLET_KEYS: WalletKey[] = ['gold', 'wood', 'stone', 'iron', 'herb', 'parts', 'samples', 'samplesSp', 'skillPoints'];
export const WALLET_LABEL: Record<WalletKey, string> = {
  gold: '골드', wood: '나무', stone: '돌', iron: '철', herb: '약초', parts: '부품', samples: '샘플', samplesSp: '특수 샘플', skillPoints: '스킬 포인트',
};
export const WALLET_ICON: Record<WalletKey, string> = {
  gold: '🪙', wood: '🪵', stone: '🪨', iron: '⛓️', herb: '🌿', parts: '⚙️', samples: '🧪', samplesSp: '☣️', skillPoints: '⭐',
};
export type Cost = Partial<Record<WalletKey, number>>;

/** 첫 런부터 주던 기본 보급 */
export const BASE_START = { wood: 24, stone: 16, herb: 4, parts: 4 }; // 첫 웨이브에 감시탑 1기(나무 22·돌 14·부품 3)를 바로 세울 수 있는 양

export type UpgradeCat = 'weapon' | 'base' | 'turret' | 'ally' | 'econ';
export const CAT_ORDER: UpgradeCat[] = ['weapon', 'base', 'turret', 'ally', 'econ'];
export const CAT_LABEL: Record<UpgradeCat, string> = { weapon: '무기', base: '기지·핵', turret: '포탑', ally: '아군', econ: '보급·경제' };
export const CAT_ICON: Record<UpgradeCat, string> = { weapon: '🔫', base: '🏰', turret: '🗼', ally: '🧟', econ: '💱' };

export type UpgradeEffect =
  | { kind: 'startGold'; per: number }
  | { kind: 'startRes'; res: ResKey; per: number }
  | { kind: 'startSamples'; per: number }
  | { kind: 'startSamplesSp'; per: number }
  | { kind: 'startSkillPoints'; per: number }       // (레거시) 미사용 — 시작 포인트는 정산에서 빠지므로 xpMul 로 대체
  | { kind: 'xpMul'; per: number }                  // 런 경험치 배율 (+per)
  | { kind: 'coreHp'; per: number }
  | { kind: 'maxHp'; per: number }
  | { kind: 'dmgMul'; per: number }
  | { kind: 'gatherSpeed'; per: number }
  | { kind: 'turretDmgMul'; per: number }
  | { kind: 'turretRangeMul'; per: number }
  | { kind: 'turretRateMul'; per: number }   // 연사 간격 감소 (레벨당 -per, 합산)
  | { kind: 'turretAmmoMul'; per: number }   // 포탑 내구도(탄) +per
  | { kind: 'turretHpMul'; per: number }     // 포탑 건물 체력 +per
  | { kind: 'trapDpsMul'; per: number }
  | { kind: 'allyCap'; per: number }
  | { kind: 'allyDmgMul'; per: number }
  | { kind: 'allyHpMul'; per: number }
  | { kind: 'vacBonus'; per: number }
  | { kind: 'weaponLv'; weapon: string; per: number }  // 총 품질: state.start.weaponLv[weapon]
  | { kind: 'weapon'; id: string }
  | { kind: 'prepBonus'; per: number }                 // 준비 시간 +초
  | { kind: 'startWave'; per: number }                 // 시작 웨이브 +N (영구)
  | { kind: 'clickGold'; per: number }     // (레거시) 미사용 — 교환소로 대체됨
  | { kind: 'incomeMul'; per: number }     // 모든 생산 건물 수입 배율
  | { kind: 'keepRatio'; per: number };    // 사망 시 남은 자원을 지갑으로 옮기는 비율 보너스

export interface UpgradeDef {
  id: string;
  cat: UpgradeCat;
  name: string;
  desc: string;
  icon: string;
  max: number;
  /** 1레벨 비용. 이후 레벨은 costGrowth^(lv) 배 */
  cost: Cost;
  costGrowth: number;
  effect: UpgradeEffect;
  /** 선행 업그레이드 (id, 필요 레벨) */
  requires?: { id: string; lv: number };
}

export const UPGRADES: UpgradeDef[] = [
  // 무기
  { id: 'w_pistol', cat: 'weapon', name: '권총 품질', desc: '권총 강화 +1단계', icon: '🔫', max: 8, cost: { gold: 50, iron: 1 }, costGrowth: 1.55, effect: { kind: 'weaponLv', weapon: 'pistol', per: 1 } },
  { id: 'w_shotgun_q', cat: 'weapon', name: '샷건 품질', desc: '샷건 강화 +1단계', icon: '🔫', max: 8, cost: { gold: 180, iron: 4 }, costGrowth: 1.6, effect: { kind: 'weaponLv', weapon: 'shotgun', per: 1 }, requires: { id: 'w_shotgun', lv: 1 } },
  { id: 'w_smg_q', cat: 'weapon', name: '기관총 품질', desc: '기관총 강화 +1단계', icon: '🔫', max: 8, cost: { gold: 420, parts: 3 }, costGrowth: 1.65, effect: { kind: 'weaponLv', weapon: 'smg', per: 1 }, requires: { id: 'w_smg', lv: 1 } },
  { id: 'w_all', cat: 'weapon', name: '병기 정비', desc: '모든 총기 강화 +1단계', icon: '🛠️', max: 5, cost: { gold: 300, parts: 4 }, costGrowth: 1.8, effect: { kind: 'weaponLv', weapon: '*', per: 1 } },
  { id: 'w_mul', cat: 'weapon', name: '총열 정밀 가공', desc: '모든 무기 공격력 +6%', icon: '🎯', max: 10, cost: { gold: 90, parts: 1 }, costGrowth: 1.5, effect: { kind: 'dmgMul', per: 0.06 } },
  { id: 'w_shotgun', cat: 'weapon', name: '샷건 시작 보유', desc: '매 런 샷건을 들고 시작', icon: '🔫', max: 1, cost: { gold: 400, iron: 12, parts: 2 }, costGrowth: 1, effect: { kind: 'weapon', id: 'shotgun' } },
  { id: 'w_smg', cat: 'weapon', name: '기관총 시작 보유', desc: '매 런 기관총을 들고 시작', icon: '🔫', max: 1, cost: { gold: 1200, parts: 8, samples: 6 }, costGrowth: 1, effect: { kind: 'weapon', id: 'smg' }, requires: { id: 'w_shotgun', lv: 1 } },
  // 기지·핵
  { id: 'b_core', cat: 'base', name: '핵 장갑 보강', desc: '핵 최대 체력 +80', icon: '🛡️', max: 10, cost: { gold: 70, stone: 8 }, costGrowth: 1.45, effect: { kind: 'coreHp', per: 80 } },
  { id: 'b_hp', cat: 'base', name: '단련', desc: '플레이어 최대 체력 +15', icon: '❤️', max: 8, cost: { gold: 80, herb: 6 }, costGrowth: 1.5, effect: { kind: 'maxHp', per: 15 } },
  { id: 'b_wood', cat: 'base', name: '목재 비축', desc: '런 시작 나무 +10', icon: '🪵', max: 8, cost: { gold: 40, wood: 15 }, costGrowth: 1.4, effect: { kind: 'startRes', res: 'wood', per: 10 } },
  { id: 'b_stone', cat: 'base', name: '석재 비축', desc: '런 시작 돌 +8', icon: '🪨', max: 8, cost: { gold: 45, stone: 12 }, costGrowth: 1.4, effect: { kind: 'startRes', res: 'stone', per: 8 } },
  // 포탑
  { id: 't_dmg', cat: 'turret', name: '포탑 탄두 강화', desc: '포탑 피해 +20%', icon: '🗼', max: 10, cost: { gold: 100, iron: 4 }, costGrowth: 1.5, effect: { kind: 'turretDmgMul', per: 0.2 } },
  { id: 't_iron', cat: 'turret', name: '철 보급', desc: '런 시작 철 +3', icon: '⛓️', max: 6, cost: { gold: 70, iron: 5 }, costGrowth: 1.45, effect: { kind: 'startRes', res: 'iron', per: 3 }, requires: { id: 't_dmg', lv: 1 } },
  { id: 't_parts', cat: 'turret', name: '부품 재활용', desc: '런 시작 부품 +2', icon: '⚙️', max: 5, cost: { gold: 160, parts: 3 }, costGrowth: 1.6, effect: { kind: 'startRes', res: 'parts', per: 2 }, requires: { id: 't_dmg', lv: 2 } },
  { id: 't_range', cat: 'turret', name: '장거리 조준경', desc: '포탑 사거리 +6%', icon: '🎯', max: 8, cost: { gold: 120, stone: 10 }, costGrowth: 1.48, effect: { kind: 'turretRangeMul', per: 0.06 }, requires: { id: 't_dmg', lv: 1 } },
  { id: 't_rate', cat: 'turret', name: '자동 장전기', desc: '포탑 연사 간격 -5%', icon: '⚡', max: 6, cost: { gold: 140, iron: 6, parts: 2 }, costGrowth: 1.55, effect: { kind: 'turretRateMul', per: 0.05 }, requires: { id: 't_range', lv: 2 } },
  { id: 't_ammo', cat: 'turret', name: '대용량 탄통', desc: '포탑 내구도(탄) +10%', icon: '📦', max: 6, cost: { gold: 110, iron: 5 }, costGrowth: 1.5, effect: { kind: 'turretAmmoMul', per: 0.1 }, requires: { id: 't_iron', lv: 2 } },
  { id: 't_armor', cat: 'turret', name: '포탑 방호판', desc: '포탑 건물 체력 +18%', icon: '🛡️', max: 5, cost: { gold: 130, stone: 12, iron: 4 }, costGrowth: 1.52, effect: { kind: 'turretHpMul', per: 0.18 }, requires: { id: 't_dmg', lv: 3 } },
  { id: 't_trap', cat: 'turret', name: '트랩 강화', desc: '슬로우 트랩 피해 +15%', icon: '🕸️', max: 6, cost: { gold: 85, wood: 15, iron: 2 }, costGrowth: 1.45, effect: { kind: 'trapDpsMul', per: 0.15 } },
  // 아군
  { id: 'a_cap', cat: 'ally', name: '숙소 확장', desc: '아군 상한 +1', icon: '🏠', max: 6, cost: { gold: 150, wood: 20, samples: 2 }, costGrowth: 1.7, effect: { kind: 'allyCap', per: 1 } },
  { id: 'a_sample', cat: 'ally', name: '샘플 냉동고', desc: '런 시작 샘플 +2', icon: '🧪', max: 6, cost: { gold: 90, herb: 8 }, costGrowth: 1.45, effect: { kind: 'startSamples', per: 2 } },
  { id: 'a_herb', cat: 'ally', name: '약초 상비', desc: '런 시작 약초 +4', icon: '🌿', max: 6, cost: { gold: 50, herb: 8 }, costGrowth: 1.4, effect: { kind: 'startRes', res: 'herb', per: 4 } },
  { id: 'a_adm', cat: 'ally', name: '전투 훈련', desc: '아군 공격력 +8%', icon: '⚔️', max: 6, cost: { gold: 120, samples: 3 }, costGrowth: 1.55, effect: { kind: 'allyDmgMul', per: 0.08 }, requires: { id: 'a_cap', lv: 1 } },
  { id: 'a_ahp', cat: 'ally', name: '강화 주사', desc: '아군 체력 +12%', icon: '💉', max: 5, cost: { gold: 100, herb: 10, samples: 2 }, costGrowth: 1.5, effect: { kind: 'allyHpMul', per: 0.12 }, requires: { id: 'a_sample', lv: 2 } },
  { id: 'a_vac', cat: 'ally', name: '백신 연구', desc: '아군화 성공률 +5%', icon: '🧪', max: 6, cost: { gold: 140, herb: 12, samples: 4 }, costGrowth: 1.58, effect: { kind: 'vacBonus', per: 0.05 }, requires: { id: 'a_sample', lv: 1 } },
  { id: 'a_sp', cat: 'ally', name: '특수 샘플 보관', desc: '런 시작 특수 샘플 +1', icon: '☣️', max: 4, cost: { gold: 400, samplesSp: 2, parts: 6 }, costGrowth: 1.85, effect: { kind: 'startSamplesSp', per: 1 }, requires: { id: 'a_vac', lv: 2 } },
  { id: 'e_gold', cat: 'econ', name: '출격 지원금', desc: '런 시작 골드 +25', icon: '🪙', max: 10, cost: { gold: 60 }, costGrowth: 1.5, effect: { kind: 'startGold', per: 25 } },
  { id: 'e_click', cat: 'econ', name: '교환 협상', desc: '교환소 판매가 +1 골드 (자원당, 구매가 미만)', icon: '💱', max: 10, cost: { gold: 30 }, costGrowth: 1.35, effect: { kind: 'clickGold', per: 1 } },
  { id: 'e_income', cat: 'econ', name: '운영 효율', desc: '모든 생산 건물 수입 +10%', icon: '📈', max: 10, cost: { gold: 200, parts: 2 }, costGrowth: 1.6, effect: { kind: 'incomeMul', per: 0.1 } },
  { id: 'e_keep', cat: 'econ', name: '철수 보급', desc: '사망 시 남은 자원 회수율 +6%', icon: '🎒', max: 8, cost: { gold: 120, wood: 20 }, costGrowth: 1.5, effect: { kind: 'keepRatio', per: 0.06 } },
  { id: 'e_gather', cat: 'econ', name: '채집 효율', desc: '채집 속도 +10%', icon: '⛏️', max: 8, cost: { gold: 80, wood: 15 }, costGrowth: 1.45, effect: { kind: 'gatherSpeed', per: 0.1 } },
  { id: 'e_prep', cat: 'base', name: '준비 시간 연장', desc: '웨이브 준비 시간 +3초', icon: '⏱️', max: 8, cost: { gold: 90, wood: 10 }, costGrowth: 1.5, effect: { kind: 'prepBonus', per: 3 } },
  { id: 'e_wave', cat: 'base', name: '전진 기지', desc: '출격 시 웨이브 건너뛰기 비용 -8% (레벨당)', icon: '🚩', max: 10, cost: { gold: 250, iron: 5 }, costGrowth: 1.7, effect: { kind: 'startWave', per: 1 } },
  { id: 'e_sp', cat: 'econ', name: '교범 학습', desc: '런 경험치 +20% (레벨업마다 스킬 포인트)', icon: '📘', max: 5, cost: { gold: 300, samples: 4 }, costGrowth: 1.9, effect: { kind: 'xpMul', per: 0.2 } },
];

/** 사망 시 런에 남은 재화를 지갑으로 옮기는 기본 비율 (2~4h 완주 목표: 스노볼 약간 억제) */
export const KEEP_BASE = 0.66;
/** 도달한 웨이브마다 지갑에 더해 주는 보상 (골드 = wave × 이 값, 클리어한 웨이브 수 기준) */
export const WAVE_BONUS_GOLD = 13;
export const KILL_BONUS_GOLD = 0.45;

/** 방치형 생산 건물. 초당 수입 = perSec × 레벨 × 수입 배율 */
export interface ProducerDef {
  id: string; name: string; icon: string; desc: string;
  produces: WalletKey; perSec: number; max: number;
  cost: Cost; costGrowth: number;
  /** 해금 조건: 이 지갑 통화를 한 번이라도 누적 획득 */
  unlockEarned?: { key: WalletKey; amount: number };
}
export const PRODUCERS: ProducerDef[] = [
  // 방치 수입: 접속 중 tick만. 2차 패치 — 웨이브 정산 대비 스노볼 대폭 축소 (perSec·max·비용·producerIncomeMul)
  { id: 'p_gold', name: '약탈 정찰대', icon: '🪙', desc: '폐허에서 골드를 모아 온다', produces: 'gold', perSec: 0.092, max: 15, cost: { gold: 62 }, costGrowth: 1.26 },
  { id: 'p_wood', name: '벌목장', icon: '🪵', desc: '나무를 계속 베어 온다', produces: 'wood', perSec: 0.05, max: 13, cost: { gold: 78, wood: 12 }, costGrowth: 1.27 },
  { id: 'p_stone', name: '채석장', icon: '🪨', desc: '돌을 캔다', produces: 'stone', perSec: 0.04, max: 13, cost: { gold: 112, wood: 30 }, costGrowth: 1.27 },
  { id: 'p_herb', name: '약초밭', icon: '🌿', desc: '약초를 키운다', produces: 'herb', perSec: 0.03, max: 14, cost: { gold: 135, wood: 42 }, costGrowth: 1.26 },
  { id: 'p_iron', name: '철광 갱도', icon: '⛓️', desc: '철을 캔다', produces: 'iron', perSec: 0.016, max: 12, cost: { gold: 340, stone: 55 }, costGrowth: 1.28 },
  { id: 'p_parts', name: '폐차 해체장', icon: '⚙️', desc: '부품을 뜯어 낸다', produces: 'parts', perSec: 0.008, max: 12, cost: { gold: 620, iron: 32 }, costGrowth: 1.3 },
  { id: 'p_lab', name: '샘플 배양실', icon: '🧪', desc: '좀비 샘플을 배양한다', produces: 'samples', perSec: 0.006, max: 12, cost: { gold: 880, herb: 55, parts: 8 }, costGrowth: 1.32 },
  { id: 'p_lab2', name: '특수 샘플 연구소', icon: '☣️', desc: '희귀한 특수 샘플을 얻는다', produces: 'samplesSp', perSec: 0.0015, max: 8, cost: { gold: 4000, samples: 55, parts: 28 }, costGrowth: 1.4, unlockEarned: { key: 'samples', amount: 20 } },
];

/** 방치 수입 규칙 (생산 시설은 접속 중에만 돈다, 오프라인 정산 없음) */
export const IDLE = {
  baseClickGold: 3,
  skillCostBase: 1,        // 스킬 노드 구매 비용 = base + 현재 레벨 (스킬 포인트)
  /** 생산 시설 tick 배율 (1 = 데이터 perSec 그대로) */
  producerIncomeMul: 0.5,
};

/** 런 경험치: 처치 XP(ZOMBIE_REWARD.xp)로 레벨이 오르고, 레벨마다 스킬 포인트를 준다 (런 끝에 전부 저축).
 *  다음 레벨까지 = base + perLevel × 현재 레벨. 일반 좀비 5 XP 기준 1~5웨이브에서 약 3레벨 */
/** 런당 스킬 포인트 속도: 50웨이브 완주 전에 핵심 스킬 8~12개 정도 (2~4h 가정, 런 10~18회) */
export const RUN_XP = { base: 68, perLevel: 44, spPerLevel: 1 };
