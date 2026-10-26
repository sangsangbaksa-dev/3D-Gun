// 전투 전용 DOM 오버레이: 조준선(퍼짐 반영), 히트마커, 피격 화면 효과, 탄약/무기 슬롯, 재장전 바.
// 모든 요소는 코드로 만들어 붙인다 (index.html 은 W7 소유). 탄약 표시는 W7 HUD 가 생기면 SHOW_AMMO_PANEL 만 끄면 된다.
import { GUNS, GUN_ORDER, GUN_UNLOCK_GOLD, type GunId } from '../../data';
import { changed, state } from '../../core/state';
import { events } from '../../core/events';
import { gunName, onLocaleChange, t } from '../../i18n';
import { gunStats } from '../logic/weapons';

export const SHOW_AMMO_PANEL = true;

const smoothScope = (v: number) => {
  const t = Math.max(0, Math.min(1, v));
  return t * t * (3 - 2 * t);
};

const CSS = `
.pv-scope{position:absolute;inset:0;opacity:0;background:radial-gradient(circle at center,transparent 0,transparent 31vmin,#000 31.4vmin);transition:opacity .08s}
.pv-scope::before,.pv-scope::after{content:'';position:absolute;background:#2ee6d6;opacity:.9}
.pv-scope::before{left:50%;top:calc(50% - 31vmin);width:1px;height:62vmin}
.pv-scope::after{top:50%;left:calc(50% - 31vmin);height:1px;width:62vmin}
.pv-scope i{position:absolute;left:50%;top:50%;width:62vmin;height:62vmin;margin:-31vmin;border-radius:50%;box-shadow:inset 0 0 6vmin 2vmin #000c,0 0 0 1px #2ee6d666}
.pv-up{position:fixed;inset:0;display:none;align-items:center;justify-content:center;background:#000a;pointer-events:auto;z-index:6}
.pv-up .box{background:#121A20F2;border:1px solid #2EE6D6;border-radius:10px;padding:18px 22px;min-width:560px;max-width:720px;max-height:86vh;overflow:auto;box-shadow:0 10px 40px #000}
.pv-up h2{margin:0 0 4px}.pv-up .sub{opacity:.75;font-size:13px;margin-bottom:10px}
.pv-up .g{display:grid;grid-template-columns:1fr auto;gap:2px 14px;align-items:center;padding:9px 0;border-bottom:1px solid #fff1}
.pv-up .g .n{font-weight:bold}.pv-up .g .n b{color:#FF8A2A;font-weight:bold;margin-left:6px}
.pv-up .g .d{font-size:12px;opacity:.75;grid-column:1}
.pv-up .g .s{font-size:12px;color:#9cf;grid-column:1}
.pv-up .g button{grid-column:2;grid-row:1 / span 3;background:#2EE6D6;color:#0b1014;border:0;border-radius:5px;padding:8px 14px;cursor:pointer;font:inherit;font-weight:700;min-width:130px}
.pv-up .g button:disabled{background:#2a3338;color:#7d8b90;cursor:default}
.pv-up .g.lock{opacity:.35}
.pv-up .x{margin-top:12px;text-align:right}.pv-up .x button{background:#44505f;color:#fff;border:0;border-radius:5px;padding:6px 14px;cursor:pointer;font:inherit}
.pv-lv{color:#FF8A2A;font-size:11px;margin-left:4px}

.pv-root{position:fixed;inset:0;pointer-events:none;z-index:3;font-family:'Pretendard','Malgun Gothic','Apple SD Gothic Neo',system-ui,sans-serif;color:#fff}
.pv-cross{position:absolute;left:50%;top:50%;width:0;height:0;transition:opacity .2s ease-out}
.pv-cross i{position:absolute;background:#fff;box-shadow:0 0 2px #000,0 0 4px #0008;border-radius:1px;transition:background-color .12s ease-out}
.pv-cross .t,.pv-cross .b{width:2px;height:8px;left:-1px}.pv-cross .l,.pv-cross .r{height:2px;width:8px;top:-1px}
.pv-cross .dot{width:2px;height:2px;left:-1px;top:-1px;opacity:.9}
.pv-cross.hit i{background:#E0303A;transition:none}
.pv-hit{position:absolute;left:50%;top:50%;width:0;height:0;opacity:0}
.pv-hit i{position:absolute;width:2px;height:7px;background:#2EE6D6;box-shadow:0 0 3px #000;left:-1px;top:-11px;transform-origin:1px 11px;opacity:.75}
.pv-hit.kill i{background:#E0303A;height:9px;opacity:1}
.pv-hit.head i{background:#FF8A2A;width:3px;height:9px;left:-1.5px;top:-12px;transform-origin:1.5px 12px;opacity:1;box-shadow:0 0 3px #000,0 0 6px #FF8A2A99}
.pv-hit i:nth-child(1){transform:rotate(45deg)}.pv-hit i:nth-child(2){transform:rotate(135deg)}
.pv-hit i:nth-child(3){transform:rotate(225deg)}.pv-hit i:nth-child(4){transform:rotate(315deg)}
.pv-vig{position:absolute;inset:0;background:radial-gradient(ellipse at center,transparent 45%,rgba(224,48,58,.65) 100%);opacity:0}
.pv-low{position:absolute;inset:0;box-shadow:inset 0 0 120px 30px rgba(224,48,58,.45);opacity:0;transition:opacity .4s ease-out}
.pv-low::after{content:'';position:absolute;inset:0;box-shadow:inset 0 0 90px 10px rgba(224,48,58,.35);animation:pvPulse 1.6s ease-in-out infinite}
@keyframes pvPulse{50%{opacity:.25}}
.pv-ammo{position:absolute;right:12px;bottom:12px;text-align:right;text-shadow:0 2px 4px #000}
.pv-ammo .nm{font-size:13px;opacity:.85;letter-spacing:.5px;margin-bottom:4px}
.pv-ammo .n{font-size:34px;font-weight:bold;line-height:1;font-variant-numeric:tabular-nums;transition:color .25s ease-out}
.pv-ammo .n small{font-size:18px;opacity:.65;font-weight:normal}
.pv-ammo .n.low{color:#FF8A2A}
.pv-ammo .rl{height:5px;width:150px;margin:6px 0 0 auto;background:#0009;border:1px solid #fff3;border-radius:3px;overflow:hidden;opacity:0;transition:opacity .2s ease-out}
.pv-ammo .rl div{height:100%;width:0;background:#2EE6D6}
.pv-slots{display:flex;gap:4px;justify-content:flex-end;margin-top:6px}
.pv-slot{min-width:40px;padding:3px 6px;border-radius:5px;background:#121A20B3;border:1px solid #2ee6d633;font-size:11px;font-weight:600;text-align:center;color:#d4e2e5;text-shadow:0 1px 2px #000,0 0 4px #000a;transition:color .2s ease-out,border-color .2s ease-out,box-shadow .2s ease-out,background-color .2s ease-out}
.pv-slot b{display:block;font-size:13px;font-weight:600;color:#9fb6bd;line-height:1.1}
.pv-slot.cur{border-color:#2ee6d6;color:#2ee6d6;background:#0d1d20f0;box-shadow:0 0 10px #2ee6d666,inset 0 0 6px #2ee6d633}
.pv-slot.cur b{color:#2ee6d6}
.pv-slot.lock{color:#8a9aa0;border-style:dashed;border-color:#ffffff22}
.pv-slot.lock b{color:#6f8086}
/* 좁은 화면: 무기 칸은 번호만(현재 무기 이름은 탄약 위에 표시) → 1인칭 총과 겹치지 않게 칸 폭을 줄인다 */
@media (max-width:1400px){.pv-slots{gap:3px}.pv-slot{min-width:26px;padding:4px 6px;font-size:0}.pv-slot b{font-size:14px}}
.pv-dash{position:absolute;left:50%;top:calc(50% + 46px);width:56px;height:4px;margin-left:-28px;background:#0007;border-radius:2px;overflow:hidden;opacity:0;transition:opacity .2s ease-out}
.pv-dash div{height:100%;background:#2EE6D6;width:100%}
@media (prefers-reduced-motion:reduce){.pv-low::after{animation:none}.pv-root *{transition-duration:.01s!important}}
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
  private lastWeapon: GunId = 'pistol';
  private lastAmmo = 0;
  private lastMag = 0;
  private lastOwned: readonly string[] = ['pistol'];
  private hitAnim?: Animation;
  private crossHitTimer?: ReturnType<typeof setTimeout>;
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
      const s = el('pv-slot', `<b>${i + 1}</b>${gunName(id, GUNS[id].name)}`);
      this.slots.appendChild(s);
      this.slotEls[id] = s;
    });
    onLocaleChange(() => {
      GUN_ORDER.forEach((id, i) => {
        this.slotEls[id].innerHTML = `<b>${i + 1}</b>${gunName(id, GUNS[id].name)}`;
      });
      this.setWeapon(this.lastWeapon, this.lastAmmo, this.lastMag, this.lastOwned);
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
    // 맞히면 조준선이 잠깐 빨갛게 된다
    this.cross.classList.add('hit');
    clearTimeout(this.crossHitTimer);
    this.crossHitTimer = setTimeout(() => this.cross.classList.remove('hit'), kind === 'kill' ? 160 : 90);
    this.hit.className = 'pv-hit' + (kind === 'kill' ? ' kill' : kind === 'head' ? ' head' : '');
    this.hitAnim?.cancel();
    this.hitAnim = this.hit.animate(
      [{ opacity: 1, transform: 'scale(.7)' }, { opacity: 1, transform: 'scale(1.1)', offset: 0.25 }, { opacity: 0, transform: 'scale(1.25)' }],
      { duration: kind === 'kill' ? 260 : 150, easing: 'ease-out' },
    );
  }

  hurt(strength: number) {
    this.vigAnim?.cancel();
    this.vigAnim = this.vig.animate([{ opacity: Math.min(0.8, 0.45 + strength) }, { opacity: 0 }], { duration: 300, easing: 'ease-out' });
  }

  setLowHp(on: boolean) { this.low.style.opacity = on ? '1' : '0'; }

  setScope(amount: number, on: boolean) {
    const t = on ? smoothScope(amount) : 0;
    this.scope.style.opacity = String(t);
    this.cross.style.display = on && t > 0.65 ? 'none' : '';
  }

  setWeapon(id: GunId, ammo: number, mag: number, owned: readonly string[]) {
    this.lastWeapon = id; this.lastAmmo = ammo; this.lastMag = mag; this.lastOwned = owned;
    const lv = state.weaponLv[id] ?? 0;
    const name = gunName(id, GUNS[id].name);
    this.nm.innerHTML = `${name}${lv ? `<span class="pv-lv">Lv${lv}</span>` : ''}`;
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


/** 총기 창 (V). 없는 총은 코인으로 산다. 가진 총의 강화는 이 판에서 막혀 있다. */
export class UpgradePanel {
  private el = el('pv-up', '<div class="box"></div>');
  private box = this.el.firstElementChild as HTMLElement;
  open = false;

  constructor(private onUpgrade: (id: GunId) => void, private onClose: () => void) {
    document.body.appendChild(this.el);
    this.el.addEventListener('mousedown', (e) => e.stopPropagation());
    this.el.addEventListener('click', (e) => { if (e.target === this.el) onClose(); });
    onLocaleChange(() => { if (this.open) this.refresh(); });
  }

  show(on: boolean) { this.open = on; this.el.style.display = on ? 'flex' : 'none'; if (on) this.refresh(); }

  refresh() {
    if (!this.open) return;
    const fmt = (id: GunId, lv: number) => {
      const a = gunStats(id, lv, state.stats), d = GUNS[id];
      const dps = (a.dmg * d.pellets / d.rate).toFixed(0);
      const pellets = d.pellets > 1 ? t('weapon.panel.pellets', { n: d.pellets }) : '';
      return t('weapon.panel.stats', { dmg: a.dmg.toFixed(0), pellets, mag: a.mag, reload: a.reload.toFixed(1), dps });
    };
    let html = `<h2>${t('weapon.panel.title')} <small style="font-weight:normal;opacity:.7">${t('weapon.panel.closeHint')}</small></h2>`
      + `<div class="sub">${t('weapon.panel.sub', { gold: state.gold, partsCount: state.res.parts })}</div>`;
    for (const id of GUN_ORDER) {
      const d = GUNS[id], own = state.weapons.includes(id), lv = (state.weaponLv[id] ?? 0) + (state.weaponLvBonus[id] ?? 0);
      const price = GUN_UNLOCK_GOLD[id];
      const canBuy = !own && price != null && (state.cheatUnlimited || state.gold >= price);
      const detail = own ? fmt(id, lv) : (price != null ? t('weapon.panel.buyFor', { price }) : t('weapon.panel.starter'));
      const button = own
        ? `<button disabled>${t('weapon.panel.noUpgrade')}</button>`
        : (price != null ? `<button data-buy="${id}"${canBuy ? '' : ' disabled'}>${t('weapon.panel.buyBtn', { price })}</button>` : '');
      const gName = gunName(id, d.name);
      html += `<div class="g${own || price != null ? '' : ' lock'}"><div class="n">${gName}<b>${own ? t('weapon.panel.owned') : t('weapon.panel.notOwned')}</b></div>`
        + `<div class="d">${t(`gun.${id}.desc`, undefined, d.desc)}</div><div class="s">${detail}</div>${button}</div>`;
    }
    html += `<div class="x"><button data-close>${t('weapon.panel.close')}</button></div>`;
    this.box.innerHTML = html;
    this.box.querySelectorAll<HTMLButtonElement>('button[data-id]').forEach((b) => b.addEventListener('click', () => this.onUpgrade(b.dataset.id as GunId)));
    this.box.querySelectorAll<HTMLButtonElement>('button[data-buy]').forEach((b) => b.addEventListener('click', () => this.buyGun(b.dataset.buy as GunId)));
    this.box.querySelector('[data-close]')?.addEventListener('click', this.onClose);
  }

  private buyGun(id: GunId) {
    const price = GUN_UNLOCK_GOLD[id];
    if (price == null || state.weapons.includes(id) || (!state.cheatUnlimited && state.gold < price)) return;
    if (!state.cheatUnlimited) state.gold -= price;
    events.emit('weapon:unlock', { weapon: id });
    changed();
    this.refresh();
  }

  dispose() { this.el.remove(); }
}
