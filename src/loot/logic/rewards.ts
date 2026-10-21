// 상자 뽑기 규칙: 보상 등급 추첨(천장 포함) → 보상 추첨 → state 에 지급. 순수 TS (three/DOM 없음).
import { CHEST_TABLE, COSTUMES, COSTUME_DUPLICATE_GOLD, DUPLICATE_WEAPON_GOLD, PITY_LIMIT, REWARD_TABLE, RES_LABEL, WEAPONS, type RewardDef } from '../../data';
import { changed, state } from '../../core/state';
import { events } from '../../core/events';
import { randInt, type Rng } from './rng';

/** 추첨이 끝난 보상. 직렬화 가능(저장/네트워크/Unity 로 그대로 옮길 수 있음). */
export interface Reward { def: RewardDef; amount: number; text: string; costume?: string }

export interface RollResult { rarity: number; reward: Reward; pity: number; forced: boolean }

/** 천장이 적용되는 상자인가 (나무 상자는 천장과 무관) */
export const hasPity = (tier: number) => tier >= 1;

/** 천장이 찼는가 → 다음 뽑기는 희귀 이상 확정 */
export const pityReady = (pity: number) => pity >= PITY_LIMIT;

function weightedIndex(weights: number[], rng: Rng): number {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = rng() * total;
  for (let i = 0; i < weights.length; i++) { r -= weights[i]; if (r < 0) return i; }
  return weights.length - 1;
}

/** 보상 등급 추첨. 천장이면 희귀(2) 이상으로 제한한다. */
export function rollRarity(tier: number, pity: number, rng: Rng): { rarity: number; forced: boolean } {
  const odds = CHEST_TABLE[tier];
  const forced = hasPity(tier) && pityReady(pity);
  if (forced) {
    const hi = odds.slice(2);
    const sum = hi.reduce((a, b) => a + b, 0);
    return { rarity: 2 + (sum > 0 ? weightedIndex(hi, rng) : 0), forced };
  }
  return { rarity: weightedIndex(odds, rng), forced };
}

export function rollReward(rarity: number, rng: Rng): Reward {
  const table = REWARD_TABLE[rarity];
  const def = table[weightedIndex(table.map((d) => d.w), rng)];
  const range = (d: { min: number; max: number }) => randInt(rng, d.min, d.max);
  switch (def.kind) {
    case 'res': { const n = range(def); return { def, amount: n, text: `${RES_LABEL[def.res]} ${n}개` }; }
    case 'gold': { const n = range(def); return { def, amount: n, text: `골드 ${n}` }; }
    case 'sample': { const n = range(def); return { def, amount: n, text: `좀비 샘플 ${n}개` }; }
    case 'sampleSp': { const n = range(def); return { def, amount: n, text: `특수 샘플 ${n}개` }; }
    case 'key': return { def, amount: def.n, text: `철 열쇠 ${def.n}개` };
    case 'goldKey': return { def, amount: def.n, text: `황금 열쇠 ${def.n}개` };
    case 'vaccine': return { def, amount: def.n, text: `${['초급', '중급', '고급'][def.tier]} 백신 ${def.n}개` };
    case 'skillPoint': return { def, amount: def.n, text: `스킬 포인트 +${def.n}` };
    case 'weapon': return { def, amount: 1, text: `${WEAPONS[def.id].name} 획득!` };
    case 'costume': {
      const c = COSTUMES[Math.floor(rng() * COSTUMES.length)];
      return { def, amount: 1, text: `아군 코스튬 「${c}」`, costume: c };
    }
  }
}

/** 상자 하나를 뽑는다. pity 는 호출하는 쪽이 state.pity 에 반영한다. */
export function rollChest(tier: number, pity: number, rng: Rng): RollResult {
  const { rarity, forced } = rollRarity(tier, pity, rng);
  const reward = rollReward(rarity, rng);
  const nextPity = !hasPity(tier) ? pity : rarity >= 2 ? 0 : pity + 1;
  return { rarity, reward, pity: nextPity, forced };
}

/** 보상을 state 에 지급하고 실제 지급 결과 문구를 돌려준다 (중복 무기는 골드로 전환). */
export function applyReward(r: Reward): string {
  const d = r.def;
  let text = r.text;
  switch (d.kind) {
    case 'res': state.res[d.res] += r.amount; break;
    case 'gold': state.gold += r.amount; break;
    case 'sample': state.samples += r.amount; break;
    case 'sampleSp': state.samplesSp += r.amount; break;
    case 'key': state.keys += r.amount; break;
    case 'goldKey': state.goldKeys += r.amount; break;
    case 'vaccine': state.vaccines[d.tier] += r.amount; break;
    case 'skillPoint': state.skillPoints += r.amount; break;
    case 'weapon':
      if (state.weapons.includes(d.id)) { state.gold += DUPLICATE_WEAPON_GOLD; text = `${WEAPONS[d.id].name} (이미 보유) → 골드 ${DUPLICATE_WEAPON_GOLD}`; }
      else state.weapons.push(d.id);
      break;
    case 'costume':
      if (r.costume && state.costumes.includes(r.costume)) { state.gold += COSTUME_DUPLICATE_GOLD; text = `「${r.costume}」 (중복) → 골드 ${COSTUME_DUPLICATE_GOLD}`; }
      else if (r.costume) state.costumes.push(r.costume);
      break;
  }
  changed();
  events.emit('toast', { text: `상자 보상: ${text}` });
  return text;
}
