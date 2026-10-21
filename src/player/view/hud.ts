// 전투 전용 DOM 오버레이: 조준선(퍼짐 반영), 히트마커, 피격 화면 효과, 탄약/무기 슬롯, 재장전 바.
// 모든 요소는 코드로 만들어 붙인다 (index.html 은 W7 소유). 탄약 표시는 W7 HUD 가 생기면 SHOW_AMMO_PANEL 만 끄면 된다.
import { WEAPON_ORDER, WEAPONS, type WeaponId } from '../../data';

export const SHOW_AMMO_PANEL = true;

const CSS = `
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
  private oldCross: HTMLElement | null;

  constructor() {
    const style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);
    this.root.append(this.vig, this.low, this.cross, this.hit, this.dash);
    if (SHOW_AMMO_PANEL) this.root.append(this.ammo);
    document.body.appendChild(this.root);
    this.nm = this.ammo.querySelector('.nm')!;
    this.n = this.ammo.querySelector('.n')!;
    this.rl = this.ammo.querySelector('.rl')!;
    this.rlFill = this.rl.firstElementChild as HTMLElement;
    this.slots = this.ammo.querySelector('.pv-slots')!;
    WEAPON_ORDER.forEach((id, i) => {
      const s = el('pv-slot', `<b>${i + 1}</b>${WEAPONS[id].name}`);
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

  setWeapon(id: WeaponId, ammo: number, mag: number, owned: readonly string[]) {
    this.nm.textContent = WEAPONS[id].name;
    this.n.innerHTML = `${ammo}<small> / ${mag}</small>`;
    this.n.classList.toggle('low', ammo <= Math.ceil(mag * 0.25));
    for (const w of WEAPON_ORDER) {
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

  dispose() { this.root.remove(); if (this.oldCross) this.oldCross.style.display = ''; }
}
