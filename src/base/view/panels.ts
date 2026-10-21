// DOM 창: 상점 창, 건설 HUD. 스타일은 이 파일이 직접 주입한다 (index.html 은 W7 소유).
import { BUILDINGS, BUILDING_ORDER, RES_BUY_PRICE, RES_KEYS, RES_LABEL, RES_PRICE, type BuildingId } from '../../data';
import { state } from '../../core/state';
import { costText, canAfford, type Building, type Cost } from '../logic/base';
import { buy, sell, sellAll, sellValue } from '../logic/shop';

const CSS = `
.bz-root{position:fixed;inset:0;pointer-events:none;font-family:'Malgun Gothic','Apple SD Gothic Neo',system-ui,sans-serif;color:#eef3f6;z-index:4}
.bz-banner{position:absolute;top:56px;left:50%;transform:translateX(-50%);padding:6px 16px;border-radius:999px;background:linear-gradient(90deg,#0e2a36e6,#12384ae6);border:1px solid #7fe3ff66;font-size:13px;letter-spacing:.2px;text-shadow:0 1px 2px #000;white-space:nowrap;display:none}
.bz-banner b{color:#7fe3ff}
.bz-pal{position:absolute;left:50%;bottom:18px;transform:translateX(-50%);display:none;gap:8px;padding:10px;border-radius:14px;background:#0b141bd9;border:1px solid #ffffff22;backdrop-filter:blur(6px);box-shadow:0 8px 30px #000a}
.bz-slot{position:relative;width:96px;padding:8px 6px 7px;border-radius:10px;background:#16222c;border:1px solid #ffffff1a;text-align:center;transition:transform .12s,border-color .12s}
.bz-slot.sel{border-color:#7fe3ff;background:#1b3340;transform:translateY(-6px);box-shadow:0 6px 18px #7fe3ff33}
.bz-slot.off{opacity:.55}
.bz-key{position:absolute;top:4px;left:6px;font-size:10px;color:#9fb3c0;font-weight:700}
.bz-ico{font-size:26px;line-height:32px}
.bz-nm{font-size:12px;font-weight:700;margin:2px 0 3px}
.bz-cost{font-size:10.5px;line-height:1.35;color:#c5d3dc}
.bz-cost i{font-style:normal;color:#ff7b72}
.bz-info{position:absolute;left:50%;bottom:166px;transform:translateX(-50%);min-width:320px;max-width:520px;padding:8px 14px;border-radius:10px;background:#0b141bd9;border:1px solid #ffffff22;font-size:12.5px;line-height:1.5;text-align:center;display:none}
.bz-info em{font-style:normal;color:#ffb347}
.bz-tip{position:absolute;left:50%;top:56%;transform:translateX(-50%);padding:3px 10px;border-radius:6px;background:#000a;font-size:13px;display:none;white-space:nowrap}
.bz-tip.bad{color:#ff8a80}.bz-tip.good{color:#9be9a8}
.bz-hover{position:absolute;left:50%;top:38%;transform:translateX(-50%);padding:8px 14px;border-radius:10px;background:#0b141be6;border:1px solid #ffb34766;font-size:12.5px;line-height:1.55;text-align:center;display:none}
.bz-hover b{font-size:14px}
.bz-hover kbd{background:#ffffff1c;border-radius:4px;padding:0 5px;font-family:inherit;font-size:11px}
.bz-ov{position:fixed;inset:0;display:none;align-items:center;justify-content:center;background:#000b;pointer-events:auto;z-index:6}
.bz-card{width:min(760px,96vw);max-height:88vh;overflow:auto;background:linear-gradient(160deg,#1b2530,#141b23);border:1px solid #ffffff26;border-radius:16px;padding:20px 24px 18px;box-shadow:0 20px 60px #000c}
.bz-card h2{margin:0 0 2px;font-size:22px}
.bz-sub{color:#9fb3c0;font-size:12.5px;margin-bottom:12px}
.bz-gold{float:right;font-size:18px;font-weight:700;color:#f2c14e}
.bz-cols{display:grid;grid-template-columns:1.35fr 1fr;gap:18px}
@media(max-width:620px){.bz-cols{grid-template-columns:1fr}}
.bz-h{font-size:12px;color:#7fe3ff;font-weight:700;letter-spacing:.5px;margin:2px 0 6px}
.bz-row{display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid #ffffff12;font-size:13.5px}
.bz-row .n{flex:1}.bz-row small{color:#9fb3c0}
.bz-xrow{display:flex;flex-wrap:wrap;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid #ffffff12;font-size:13.5px}
.bz-xrow .n{flex:1 1 200px}.bz-xrow small{color:#9fb3c0}
.bz-xrow .btns{display:flex;flex-wrap:wrap;gap:4px}
.bz-btn{background:#2f6f4e;color:#fff;border:0;border-radius:7px;padding:5px 10px;font:inherit;font-size:12.5px;cursor:pointer}
.bz-btn:hover:not(:disabled){filter:brightness(1.2)}
.bz-btn:disabled{background:#37404a;color:#8a96a0;cursor:default}
.bz-btn.gold{background:#8a6a1b}.bz-btn.sec{background:#44505f}
.bz-keybox{padding:10px;border-radius:10px;background:#101820;border:1px solid #ffffff14;margin-bottom:10px}
.bz-keybox .t{font-weight:700}.bz-keybox .d{font-size:12px;color:#9fb3c0;margin:2px 0 8px}
.bz-foot{display:flex;justify-content:space-between;align-items:center;margin-top:14px}
`;

const ICON: Record<BuildingId, string> = { tower: '🗼', mgtower: '🔫', barricade: '🚧', trap: '🕸️', lab: '🧪', barracks: '🏠', shop: '🏪' };

const el = <K extends keyof HTMLElementTagNameMap>(tag: K, cls: string, parent?: HTMLElement, html = ''): HTMLElementTagNameMap[K] => {
  const e = document.createElement(tag); e.className = cls; if (html) e.innerHTML = html; parent?.appendChild(e); return e;
};

export class BasePanels {
  private root: HTMLDivElement;
  private banner: HTMLDivElement; private pal: HTMLDivElement; private info: HTMLDivElement; private tip: HTMLDivElement; private hover: HTMLDivElement;
  private slots: HTMLDivElement[] = [];
  private ov: HTMLDivElement; private card: HTMLDivElement;
  private last = new Map<HTMLElement, string>();
  shopOpen = false;
  onShopClose: () => void = () => {};

  constructor() {
    const style = document.createElement('style'); style.textContent = CSS; document.head.appendChild(style);
    this.root = el('div', 'bz-root', document.body);
    this.banner = el('div', 'bz-banner', this.root);
    this.pal = el('div', 'bz-pal', this.root);
    this.info = el('div', 'bz-info', this.root);
    this.tip = el('div', 'bz-tip', this.root);
    this.hover = el('div', 'bz-hover', this.root);
    BUILDING_ORDER.forEach((id, i) => {
      const d = BUILDINGS[id];
      const s = el('div', 'bz-slot', this.pal, `<div class="bz-key">${i + 1}</div><div class="bz-ico">${ICON[id]}</div><div class="bz-nm">${d.name}</div><div class="bz-cost"></div>`);
      this.slots.push(s);
    });
    this.ov = el('div', 'bz-ov', document.body);
    this.card = el('div', 'bz-card', this.ov);
    addEventListener('keydown', (e) => { if (this.shopOpen && (e.code === 'Escape' || e.code === 'KeyE')) this.closeShop(); });
    this.ov.addEventListener('mousedown', (e) => { if (e.target === this.ov) this.closeShop(); });
  }

  private set(e: HTMLElement, html: string) { if (this.last.get(e) !== html) { this.last.set(e, html); e.innerHTML = html; } }
  private show(e: HTMLElement, on: boolean, disp = 'block') { e.style.display = on ? disp : 'none'; }

  // ---- 건설 HUD ----
  buildHud(active: boolean, sel: number, phase: string, tip: { text: string; ok: boolean } | null, hover: Building | null, hoverLines: string, nearGateMsg: string | null) {
    this.show(this.banner, active, 'block');
    this.show(this.pal, active, 'flex');
    this.show(this.info, active, 'block');
    this.show(this.tip, active && !!tip && !hover, 'block');
    this.show(this.hover, active && !!hover, 'block');
    if (!active) return;
    this.set(this.banner, phase === 'prep'
      ? '🏗 <b>건설 모드</b> · 클릭 배치 · 우클릭/<b>X</b> 철거 · <b>F</b> 수리 · <b>U</b> 강화 · <b>B</b> 종료'
      : '⚔ 전투 중에는 건설할 수 없어요 (수리·보충은 E)');
    BUILDING_ORDER.forEach((id, i) => {
      const d = BUILDINGS[id];
      const ok = canAfford(d.cost);
      const parts = RES_KEYS.filter((k) => (d.cost[k] ?? 0) > 0).map((k) => {
        const lack = state.res[k] < (d.cost[k] as number);
        return lack ? `<i>${RES_LABEL[k]} ${d.cost[k]}</i>` : `${RES_LABEL[k]} ${d.cost[k]}`;
      });
      this.slots[i].className = 'bz-slot' + (i === sel ? ' sel' : '') + (ok ? '' : ' off');
      this.set(this.slots[i].querySelector('.bz-cost') as HTMLElement, parts.join('<br>'));
    });
    const d = BUILDINGS[BUILDING_ORDER[sel]];
    let stat = '';
    if (d.turret) { const l = d.turret.levels[0]; stat = ` · 피해 ${l.dmg} · 연사 ${(1 / l.rate).toFixed(1)}/s · 사거리 ${l.range}m · 탄약 ${d.turret.ammo}`; }
    if (d.trap) stat = ` · 반경 ${d.trap.radius}m · 감속 ${Math.round((1 - d.trap.slow) * 100)}% · 초당 ${d.trap.dps}`;
    this.set(this.info, `<b>${d.name}</b> — ${d.desc}<br><span style="color:#9fb3c0">체력 ${d.hp}${stat}</span>` + (nearGateMsg ? `<br><em>${nearGateMsg}</em>` : ''));
    if (tip) { this.set(this.tip, tip.text); this.tip.className = 'bz-tip ' + (tip.ok ? 'good' : 'bad'); }
    if (hover) this.set(this.hover, hoverLines);
  }

  // ---- 상점 ----
  openShop() {
    this.shopOpen = true;
    this.ov.style.display = 'flex';
    document.exitPointerLock?.();
    this.renderShop();
  }
  closeShop() {
    if (!this.shopOpen) return;
    this.shopOpen = false;
    this.ov.style.display = 'none';
    this.onShopClose();
  }
  /** state:changed 에서 호출 */
  refreshShop() { if (this.shopOpen) this.renderShop(); }

  private renderShop() {
    const c = this.card;
    c.innerHTML = '';
    el('div', 'bz-gold', c, `🪙 ${state.gold}`);
    el('h2', '', c, '교환소');
    el('div', 'bz-sub', c, '전투에서 얻은 코인으로 자원을 사고, 가진 자원은 코인으로 팔아요. (E / Esc 로 닫기)');
    for (const k of RES_KEYS) {
      const sellP = RES_PRICE[k], buyP = RES_BUY_PRICE[k];
      const row = el('div', 'bz-xrow', c);
      el('div', 'n', row, `${RES_LABEL[k]} <small>보유 ${state.res[k]} · 판매 ${sellP} · 구매 ${buyP}</small>`);
      const btns = el('div', 'btns', row);
      const s1 = el('button', 'bz-btn', btns, '팔기 1');
      const sa = el('button', 'bz-btn', btns, '팔기 전부');
      const b1 = el('button', 'bz-btn gold', btns, '사기 1');
      const b10 = el('button', 'bz-btn gold', btns, '사기 10');
      s1.disabled = state.res[k] < 1;
      sa.disabled = state.res[k] < 1;
      b1.disabled = state.gold < buyP;
      b10.disabled = state.gold < buyP * 10;
      s1.onclick = () => sell(k, 1);
      sa.onclick = () => sell(k, state.res[k]);
      b1.onclick = () => buy(k, 1);
      b10.onclick = () => buy(k, 10);
    }
    const foot = el('div', 'bz-foot', c);
    const all = el('button', 'bz-btn', foot, `전부 팔기 +${sellValue()}G`); all.disabled = sellValue() <= 0; all.onclick = () => sellAll();
    const close = el('button', 'bz-btn sec', foot, '닫기'); close.onclick = () => this.closeShop();
  }
}

export const hoverText = (b: Building, repair: Cost | null, up: { cost: Cost; gold: number } | null, refund: string): string => {
  const d = BUILDINGS[b.kind];
  const lines = [`<b>${d.name}</b>${d.turret ? ` Lv${b.level}` : ''} · 체력 ${Math.ceil(b.hp)}/${b.maxHp}`];
  if (d.turret) lines.push(`탄약 ${b.ammo}/${d.turret.ammo}`);
  const keys: string[] = [];
  if (repair) keys.push(`<kbd>F</kbd> 수리 (${costText(repair)})`);
  if (up) keys.push(`<kbd>U</kbd> 강화 (${costText(up.cost, up.gold)})`);
  keys.push(`<kbd>우클릭/X</kbd> 철거 (${refund})`);
  lines.push(keys.join('<br>'));
  return lines.join('<br>');
};
