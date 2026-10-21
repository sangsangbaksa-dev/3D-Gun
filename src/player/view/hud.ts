// 전투 전용 DOM 오버레이: 조준선(퍼짐 반영), 히트마커, 피격 화면 효과, 탄약/무기 슬롯, 재장전 바.
// 모든 요소는 코드로 만들어 붙인다 (index.html 은 W7 소유). 탄약 표시는 W7 HUD 가 생기면 SHOW_AMMO_PANEL 만 끄면 된다.
import { GUNS, GUN_ORDER, GUN_UNLOCK_GOLD, GUN_UPGRADE, RES_LABEL, type GunId } from '../../data';
import { changed, state } from '../../core/state';
import { events } from '../../core/events';
import { gunStats } from '../logic/weapons';

export const SHOW_AMMO_PANEL = true;

const CSS = `
.pv-scope{position:absolute;inset:0;opacity:0;background:radial-gradient(circle at center,transparent 0,transparent 31vmin,#000 31.4vmin);transition:opacity .08s}
.pv-scope::before,.pv-scope::after{content:'';position:absolute;background:#000c}
.pv-scope::before{left:50%;top:calc(50% - 31vmin);width:1px;height:62vmin}
.pv-scope::after{top:50%;left:calc(50% - 31vmin);height:1px;width:62vmin}
.pv-scope i{position:absolute;left:50%;top:50%;width:6px;height:6px;margin:-3px;border-radius:50%;background:#f33;box-shadow:0 0 6px #f33}
.pv-up{position:fixed;inset:0;display:none;align-items:center;justify-content:center;background:#000a;pointer-events:auto;z-index:6}
.pv-up .box{background:#1b212b;border:1px solid #fff3;border-radius:10px;padding:18px 22px;min-width:560px;max-width:720px;max-height:86vh;overflow:auto;box-shadow:0 10px 40px #000}
.pv-up h2{margin:0 0 4px}.pv-up .sub{opacity:.75;font-size:13px;margin-bottom:10px}
.pv-up .g{display:grid;grid-template-columns:1fr auto;gap:2px 14px;align-items:center;padding:9px 0;border-bottom:1px solid #fff1}
.pv-up .g .n{font-weight:bold}.pv-up .g .n b{color:#ffd23b;font-weight:bold;margin-left:6px}
.pv-up .g .d{font-size:12px;opacity:.75;grid-column:1}
.pv-up .g .s{font-size:12px;color:#9cf;grid-column:1}
.pv-up .g button{grid-column:2;grid-row:1 / span 3;background:#2f6f4e;color:#fff;border:0;border-radius:5px;padding:8px 14px;cursor:pointer;font:inherit;min-width:130px}
.pv-up .g button:disabled{background:#444;color:#999;cursor:default}
.pv-up .g.lock{opacity:.35}
.pv-up .x{margin-top:12px;text-align:right}.pv-up .x button{background:#44505f;color:#fff;border:0;border-radius:5px;padding:6px 14px;cursor:pointer;font:inherit}
.pv-lv{color:#ffd23b;font-size:11px;margin-left:4px}

.pv-root{position:fixed;inset:0;pointer-events:none;z-index:3;font-family:'Malgun Gothic','Apple SD Gothic Neo',system-ui,sans-serif;color:#fff}
.pv-cross{position:absolute;left:50%;top:50%;width:0;height:0;transition:opacity .15s}
.pv-cross i{position:absolute;background:#fff;box-shadow:0 0 2px #000,0 0 4px #0008;border-radius:1px}
.pv-cross .t,.pv-cross .b{width:2px;height:8px;left:-1px}.pv-cross .l,.pv-cross .r{height:2px;width:8px;top:-1px}
.pv-cross .dot{width:2px;height:2px;left:-1px;top:-1px;opacity:.9}
.pv-hit{position:absolute;left:50%;top:50%;width:0;height:0;opacity:0}
.pv-hit i{position:absolute;width:2px;height:9px;background:#fff;box-shadow:0 0 3px #000;left:-1px;top:-17px;transform-origin:1px 17px}
.pv-hit.kill i{background:#ff3b3b;height:12px}.pv-hit.head i{background:#ffd23b}
.pv-hit i:nth-child(1){transform:rotate(45deg)}.pv-hit i:nth-child(2){transform:rotate(135deg)}
.pv-hit i:nth-child(3){transform:rotate(225deg)}.pv-hit i:nth-child(4){transform:rotate(315deg)}
.pv-vig{position:absolute;inset:0;background:radial-gradient(ellipse at center,transparent 45%,rgba(190,0,0,.62) 100%);opacity:0}
.pv-low{position:absolute;inset:0;box-shadow:inset 0 0 120px 30px rgba(200,0,0,.55);opacity:0;animation:pvPulse 1s ease-in-out infinite}
@keyframes pvPulse{50%{filter:brightness(1.7)}}
.pv-ammo{position:absolute;right:22px;bottom:70px;text-align:right;text-shadow:0 2px 4px #000}
.pv-ammo .nm{font-size:13px;opacity:.85;letter-spacing:.5px}
.pv-ammo .n{font-size:40px;font-weight:bold;line-height:1;font-variant-numeric:tabular-nums}
.pv-ammo .n small{font-size:18px;opacity:.65;font-weight:normal}
.pv-ammo .n.low{color:#ff6b5a}
.pv-ammo .rl{height:5px;width:150px;margin:6px 0 0 auto;background:#0009;border:1px solid #fff3;border-radius:3px;overflow:hidden;opacity:0;transition:opacity .1s}
.pv-ammo .rl div{height:100%;width:0;background:linear-gradient(90deg,#ffcf5a,#ff9d3b)}
.pv-slots{display:flex;gap:6px;justify-content:flex-end;margin-top:8px}
.pv-slot{min-width:52px;padding:4px 8px;border-radius:5px;background:#000a;border:1px solid #fff2;font-size:12px;text-align:center;opacity:.55}
.pv-slot b{display:block;font-size:11px;opacity:.7;font-weight:normal}
.pv-slot.cur{opacity:1;border-color:#ffd23b;box-shadow:0 0 8px #ffd23b55}
.pv-slot.lock{opacity:.25}
.pv-dash{position:absolute;left:50%;top:calc(50% + 46px);width:56px;height:4px;margin-left:-28px;background:#0007;border-radius:2px;overflow:hidden;opacity:0;transition:opacity .2s}
.pv-dash div{height:100%;background:#7fd6ff;width:100%}
`;

const el = (cls: string, html = '') => { const d = document.createElement('div'); d.className = cls; d.innerHTML = html; return d; };

export class CombatHud {
  private root = el('pv-root');
  private cross = el('pv-cross', '<i class="t"></i><i class="b"></i><i class="l"></i><i class="r"></i><i class="dot"></i>');
  private hit = el('pv-hit', '<i></i><i></i><i></i><i></i>');
  private vig = el('pv-vig');
  private low = el('pv-low');
  private ammo = el('pv-ammo', '<div class="nm"></div><div class="n"></div><div class="rl"><div></div></div><div class="pv-slots"></div>');
  private dash = el('pv-dash', '<div></div>');
  private nm: HTMLElement; private n: HTMLElement; private rl: HTMLElement; private rlFill: HTMLElement; private slots: HTMLElement;
  private slotEls: Record<string, HTMLElement> = {};
  private hitAnim?: Animation;
  private vigAnim?: Animation;
  private scope = el('pv-scope', '<i></i>');
  private oldCross: HTMLElement | null;

  constructor() {
    const style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);
    this.root.append(this.scope, this.vig, this.low, this.cross, this.hit, this.dash);
    if (SHOW_AMMO_PANEL) this.root.append(this.ammo);
    document.body.appendChild(this.root);
    this.nm = this.ammo.querySelector('.nm')!;
    this.n = this.ammo.querySelector('.n')!;
    this.rl = this.ammo.querySelector('.rl')!;
    this.rlFill = this.rl.firstElementChild as HTMLElement;
    this.slots = this.ammo.querySelector('.pv-slots')!;
    GUN_ORDER.forEach((id, i) => {
      const s = el('pv-slot', `<b>${i + 1}</b>${GUNS[id].name}`);
      this.slots.appendChild(s);
      this.slotEls[id] = s;
    });
    // index.html 의 임시 정적 조준선은 동적 조준선으로 대체한다
    this.oldCross = document.getElementById('cross');
    if (this.oldCross) this.oldCross.style.display = 'none';
  }

  setSpread(px: number, visible: boolean) {
    const gap = 5 + px;
    const c = this.cross;
    c.style.opacity = visible ? '1' : '0';
    (c.querySelector('.t') as HTMLElement).style.top = `${-gap - 8}px`;
    (c.querySelector('.b') as HTMLElement).style.top = `${gap}px`;
    (c.querySelector('.l') as HTMLElement).style.left = `${-gap - 8}px`;
    (c.querySelector('.r') as HTMLElement).style.left = `${gap}px`;
  }

  hitmarker(kind: 'hit' | 'head' | 'kill') {
    this.hit.className = 'pv-hit' + (kind === 'kill' ? ' kill' : kind === 'head' ? ' head' : '');
    this.hitAnim?.cancel();
    this.hitAnim = this.hit.animate(
      [{ opacity: 1, transform: 'scale(.7)' }, { opacity: 1, transform: 'scale(1.1)', offset: 0.25 }, { opacity: 0, transform: 'scale(1.25)' }],
      { duration: kind === 'kill' ? 360 : 200, easing: 'ease-out' },
    );
  }

  hurt(strength: number) {
    this.vigAnim?.cancel();
    this.vigAnim = this.vig.animate([{ opacity: Math.min(1, 0.55 + strength) }, { opacity: 0 }], { duration: 520, easing: 'ease-out' });
  }

  setLowHp(on: boolean) { this.low.style.opacity = on ? '1' : '0'; }

  setScope(amount: number, on: boolean) {
    this.scope.style.opacity = on ? String(Math.max(0, (amount - 0.55) / 0.45)) : '0';
    this.cross.style.display = on && amount > 0.7 ? 'none' : '';
  }

  setWeapon(id: GunId, ammo: number, mag: number, owned: readonly string[]) {
    const lv = state.weaponLv[id] ?? 0;
    this.nm.innerHTML = `${GUNS[id].name}${lv ? `<span class="pv-lv">Lv${lv}</span>` : ''}`;
    this.n.innerHTML = `${ammo}<small> / ${mag}</small>`;
    this.n.classList.toggle('low', ammo <= Math.ceil(mag * 0.25));
    for (const w of GUN_ORDER) {
      this.slotEls[w].classList.toggle('cur', w === id);
      this.slotEls[w].classList.toggle('lock', !owned.includes(w));
    }
  }

  setReload(progress: number | null) {
    this.rl.style.opacity = progress === null ? '0' : '1';
    if (progress !== null) this.rlFill.style.width = `${Math.round(progress * 100)}%`;
  }

  setDash(ready01: number) {
    this.dash.style.opacity = ready01 >= 1 ? '0' : '1';
    (this.dash.firstElementChild as HTMLElement).style.width = `${Math.round(ready01 * 100)}%`;
  }

  setVisible(on: boolean) { this.root.style.display = on ? '' : 'none'; }

  dispose() { this.root.remove(); if (this.oldCross) this.oldCross.style.display = ''; }
}


/** 총기 창 (V). 없는 총은 코인으로 사고, 가진 총은 골드+부품으로 강화한다. 강화는 'weapon:upgrade' 를 받은 컨트롤러가 처리한다. */
export class UpgradePanel {
  private el = el('pv-up', '<div class="box"></div>');
  private box = this.el.firstElementChild as HTMLElement;
  open = false;

  constructor(private onUpgrade: (id: GunId) => void, private onClose: () => void) {
    document.body.appendChild(this.el);
    this.el.addEventListener('mousedown', (e) => e.stopPropagation());
    this.el.addEventListener('click', (e) => { if (e.target === this.el) onClose(); });
  }

  show(on: boolean) { this.open = on; this.el.style.display = on ? 'flex' : 'none'; if (on) this.refresh(); }

  refresh() {
    if (!this.open) return;
    const fmt = (id: GunId, lv: number) => {
      const a = gunStats(id, lv, state.stats), d = GUNS[id];
      const dps = (a.dmg * d.pellets / d.rate).toFixed(0);
      return `피해 ${a.dmg.toFixed(0)}${d.pellets > 1 ? '×' + d.pellets : ''} · 탄창 ${a.mag} · 재장전 ${a.reload.toFixed(1)}초 · 초당 ${dps}`;
    };
    let html = `<h2>무기 <small style="font-weight:normal;opacity:.7">(V 로 닫기)</small></h2><div class="sub">코인 ${state.gold} · ${RES_LABEL.parts} ${state.res.parts}</div>`;
    for (const id of GUN_ORDER) {
      const d = GUNS[id], own = state.weapons.includes(id), lv = state.weaponLv[id] ?? 0, max = lv >= GUN_UPGRADE.maxLv;
      const price = GUN_UNLOCK_GOLD[id];
      const cost = max ? '' : `${GUN_UPGRADE.gold[lv]}G + ${RES_LABEL.parts} ${GUN_UPGRADE.parts[lv]}`;
      const can = own && !max && state.gold >= GUN_UPGRADE.gold[lv] && state.res.parts >= GUN_UPGRADE.parts[lv];
      const canBuy = !own && price != null && state.gold >= price;
      const detail = own
        ? fmt(id, lv) + (max ? '' : '  →  ' + fmt(id, lv + 1))
        : (price != null ? `코인 ${price}에 구매` : '기본 지급');
      const button = own
        ? `<button data-id="${id}"${can ? '' : ' disabled'}>${max ? '최대 강화' : '강화 ' + cost}</button>`
        : (price != null ? `<button data-buy="${id}"${canBuy ? '' : ' disabled'}>구매 ${price}G</button>` : '');
      html += `<div class="g${own || price != null ? '' : ' lock'}"><div class="n">${d.name}<b>${own ? 'Lv' + lv + '/' + GUN_UPGRADE.maxLv : '미보유'}</b></div>`
        + `<div class="d">${d.desc}</div><div class="s">${detail}</div>${button}</div>`;
    }
    html += '<div class="x"><button data-close>닫기</button></div>';
    this.box.innerHTML = html;
    this.box.querySelectorAll<HTMLButtonElement>('button[data-id]').forEach((b) => b.addEventListener('click', () => this.onUpgrade(b.dataset.id as GunId)));
    this.box.querySelectorAll<HTMLButtonElement>('button[data-buy]').forEach((b) => b.addEventListener('click', () => this.buyGun(b.dataset.buy as GunId)));
    this.box.querySelector('[data-close]')?.addEventListener('click', this.onClose);
  }

  private buyGun(id: GunId) {
    const price = GUN_UNLOCK_GOLD[id];
    if (price == null || state.weapons.includes(id) || state.gold < price) return;
    state.gold -= price;
    events.emit('weapon:unlock', { weapon: id });
    changed();
    this.refresh();
  }

  dispose() { this.el.remove(); }
}
