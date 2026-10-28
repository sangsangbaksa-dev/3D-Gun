// 약초 응급처치 규칙. 순수 TS (three/DOM 없음). 입력과 출력은 숫자와 간단한 객체뿐이다.
import { HERB_HEAL } from '../../data';

export type HealResult =
  | { ok: true; healed: number }
  | { ok: false; reason: 'dead' | 'full' | 'cooldown' | 'herb' };

/** 응급처치를 시도한다. 성공하면 hp 를 올리고 약초를 깎는 일은 호출한 쪽이 `spendHerb` 로 한다. */
export function planHerbHeal(hp: number, maxHp: number, dead: boolean, cdLeft: number, herb: number, rules = HERB_HEAL): HealResult {
  if (dead) return { ok: false, reason: 'dead' };
  if (hp >= maxHp - 0.5) return { ok: false, reason: 'full' };
  if (cdLeft > 0) return { ok: false, reason: 'cooldown' };
  if (herb < rules.cost) return { ok: false, reason: 'herb' };
  return { ok: true, healed: Math.min(maxHp - hp, maxHp * rules.healPct) };
}
