// 교환소: 자원을 코인으로 팔고, 코인으로 자원을 산다. 순수 로직 (UI 는 view/panels.ts).
import { RES_BUY_PRICE, exchangeSellUnit, type ResKey } from '../../data';
import { state, changed } from '../../core/state';

const runSellBonus = () => state.start.exchangeSellBonus ?? 0;

/** 자원을 n개(최대 보유량까지) 팔아 코인을 받는다. 실제로 판 개수를 돌려준다 */
export function sell(res: ResKey, n: number): number {
  const c = Math.max(0, Math.min(Math.floor(n), state.res[res]));
  if (c <= 0) return 0;
  const unit = exchangeSellUnit(res, runSellBonus());
  state.res[res] -= c;
  state.gold += c * unit;
  changed();
  return c;
}

export function sellAll(): number {
  const bonus = runSellBonus();
  let total = 0;
  for (const k of Object.keys(state.res) as ResKey[]) {
    const n = state.res[k];
    total += n * exchangeSellUnit(k, bonus);
    state.res[k] = 0;
  }
  state.gold += total;
  changed();
  return total;
}

export const sellValue = () => (Object.keys(state.res) as ResKey[]).reduce((s, k) => s + state.res[k] * exchangeSellUnit(k, runSellBonus()), 0);

/** 코인으로 자원을 산다. 가격은 판매가보다 비싸다. 살 수 있는 만큼(최대 n)만 사고, 실제 산 개수를 돌려준다 */
export function buy(res: ResKey, n: number): number {
  const want = Math.max(0, Math.floor(n));
  if (want <= 0) return 0;
  const price = RES_BUY_PRICE[res];
  const c = Math.min(want, Math.floor(state.gold / price));
  if (c <= 0) return 0;
  state.gold -= c * price;
  state.res[res] += c;
  changed();
  return c;
}
