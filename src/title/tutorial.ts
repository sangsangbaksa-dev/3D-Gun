// 첫 출격 안내 카드 (#ztTut).
import { events } from '../core/events';
import { input } from '../core/input';
import { state } from '../core/state';
import { BUILDINGS } from '../data';
import { canAfford } from '../base/logic/base';
import { injectKeycapCss, kbds } from '../ui/keys';
import { isHelpOpen } from '../ui/keybar';
import { TUTORIAL_CSS } from './style';
import { bldName, onLocaleChange, t } from '../i18n';

type Until = 'move' | 'fire' | 'reload' | 'dash' | 'build' | 'place' | 'wave' | 'kill' | 'shop' | 'vaccine';
interface Step { until: Until; keys: string[]; titleKey: string; whyKey: string; optional?: boolean }

const KILLS = 3;
const STEPS: Step[] = [
  { until: 'move', keys: ['W', 'A', 'S', 'D'], titleKey: 'tutorial.step.move.title', whyKey: 'tutorial.step.move.why' },
  { until: 'fire', keys: ['좌클릭', 'LMB'], titleKey: 'tutorial.step.fire.title', whyKey: 'tutorial.step.fire.why' },
  { until: 'reload', keys: ['R'], titleKey: 'tutorial.step.reload.title', whyKey: 'tutorial.step.reload.why' },
  { until: 'dash', keys: ['Shift'], titleKey: 'tutorial.step.dash.title', whyKey: 'tutorial.step.dash.why' },
  { until: 'build', keys: ['B'], titleKey: 'tutorial.step.build.title', whyKey: 'tutorial.step.build.why' },
  { until: 'place', keys: ['1', '좌클릭'], titleKey: 'tutorial.step.place.title', whyKey: 'tutorial.step.place.why' },
  { until: 'wave', keys: ['N'], titleKey: 'tutorial.step.wave.title', whyKey: 'tutorial.step.wave.why' },
  { until: 'kill', keys: ['좌클릭', 'LMB'], titleKey: 'tutorial.step.kill.title', whyKey: 'tutorial.step.kill.why' },
  { until: 'shop', keys: ['V'], titleKey: 'tutorial.step.shop.title', whyKey: 'tutorial.step.shop.why' },
  { until: 'vaccine', keys: ['L'], titleKey: 'tutorial.step.vaccine.title', whyKey: 'tutorial.step.vaccine.why', optional: true },
];
const KEY = '3dgun.tutorialDone.v1';
const MOVE = ['KeyW', 'KeyA', 'KeyS', 'KeyD'];
const MOVE_NEED_S = 0.8;
const OPTIONAL_WAIT_S = 20;

const isDone = () => { try { return localStorage.getItem(KEY) === '1'; } catch { return false; } };
const markDone = () => { try { localStorage.setItem(KEY, '1'); } catch { /* 저장소 불가 */ } };

export function resetTutorial() {
  try { localStorage.removeItem(KEY); } catch { /* 저장소 불가 */ }
}

export class Tutorial {
  private i = -1;
  private el?: HTMLDivElement;
  private active = false;
  private moved = 0;
  private kills = 0;
  private stepT = 0;
  private lastHtml = '';

  constructor() {
    const st = document.createElement('style');
    st.textContent = TUTORIAL_CSS;
    document.head.appendChild(st);
    injectKeycapCss();
    onLocaleChange(() => { this.lastHtml = ''; if (this.active) this.render(); });
    events.on('run:start', () => { if (!this.active && !isDone()) this.start(); });
    events.on('weapon:fired', () => { if (this.cur() === 'fire') this.next(); });
    events.on('building:placed', ({ kind }) => { if (this.cur() === 'place' && (kind === 'tower' || kind === 'mgtower')) this.next(); });
    events.on('wave:start', () => { if (this.cur() === 'wave') this.next(); });
    events.on('enemy:killed', ({ byAlly }) => {
      if (this.cur() !== 'kill' || byAlly) return;
      this.kills++;
      if (this.kills >= KILLS) this.next(); else this.render();
    });
    events.on('run:over', () => this.stop());
  }

  private cur(): Until | undefined { return this.active ? STEPS[this.i]?.until : undefined; }

  private start() {
    this.el?.remove();
    const el = document.createElement('div');
    el.id = 'ztTut';
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    el.addEventListener('mousedown', (e) => e.stopPropagation());
    el.addEventListener('click', (e) => { if ((e.target as HTMLElement).closest('[data-skip]')) this.skip(); });
    document.body.appendChild(el);
    this.el = el;
    this.active = true;
    this.i = -1;
    this.next();
  }

  private next() {
    const el = this.el;
    if (!el) return;
    this.i++;
    this.moved = 0; this.kills = 0; this.stepT = 0;
    if (this.i >= STEPS.length) { this.finish(); return; }
    el.classList.remove('on');
    const i = this.i;
    setTimeout(() => {
      if (!this.active || this.el !== el || this.i !== i) return;
      this.lastHtml = '';
      this.render();
      el.classList.add('on');
    }, i === 0 ? 0 : 320);
  }

  private hint(s: Step): string {
    if ((s.until === 'build' || s.until === 'place') && state.phase !== 'prep') return t('tutorial.hint.combatBuild');
    if (s.until === 'place' && state.mode !== 'build') return t('tutorial.hint.needBuild');
    if (s.until === 'place' && !canAfford(BUILDINGS.tower.cost)) return t('tutorial.hint.needRes');
    if (s.until === 'kill') return `${this.kills}/${KILLS}`;
    return '';
  }

  private stepTitle(s: Step) {
    if (s.until === 'place') return t(s.titleKey, { name: bldName('tower', BUILDINGS.tower.name) });
    if (s.until === 'kill') return t(s.titleKey, { n: KILLS });
    return t(s.titleKey);
  }

  private render() {
    const el = this.el;
    const s = STEPS[this.i];
    if (!el || !s) return;
    const h = this.hint(s);
    const html = `<div class="tt-top"><b class="tt-n">${this.i + 1}/${STEPS.length}</b><span class="tt-k">${kbds(s.keys)}</span><span class="tt-t">${this.stepTitle(s)}</span>`
      + `<button type="button" class="tt-skip" data-skip>${s.optional ? t('tutorial.end') : t('tutorial.skip')}</button></div>`
      + `<div class="tt-why">${t(s.whyKey)}</div>`
      + (h ? `<div class="tt-hint">${h}</div>` : '')
      + `<div class="tt-foot">${t('tutorial.foot')}</div>`;
    if (html !== this.lastHtml) { this.lastHtml = html; el.innerHTML = html; }
  }

  private skip() { markDone(); this.stop(); }
  private finish() { markDone(); this.stop(); }

  private stop() {
    if (!this.active && !this.el) return;
    this.active = false;
    const el = this.el;
    this.el = undefined;
    el?.classList.remove('on');
    setTimeout(() => el?.remove(), 400);
  }

  private lastNow = 0;

  update() {
    const now = performance.now();
    const dt = Math.min(0.25, Math.max(0, (now - (this.lastNow || now)) / 1000));
    this.lastNow = now;
    const u = this.cur();
    if (this.el) this.el.style.visibility = input.modalOpen || state.mode === 'modal' ? 'hidden' : '';
    if (!u || input.paused || isHelpOpen()) return;
    this.stepT += dt;
    if (u === 'shop' && input.pressed.has('KeyV')) { this.next(); return; }
    if (u === 'vaccine' && (input.pressed.has('KeyL') || this.stepT > OPTIONAL_WAIT_S)) { this.next(); return; }
    if (input.modalOpen || state.mode === 'modal') return;
    if (u === 'move' && MOVE.some((k) => input.keys.has(k))) { this.moved += dt; if (this.moved >= MOVE_NEED_S) this.next(); }
    else if (u === 'reload' && input.pressed.has('KeyR')) this.next();
    else if (u === 'dash' && input.pressed.has('ShiftLeft')) this.next();
    else if (u === 'build' && state.mode === 'build') this.next();
    else if (u === 'wave' && state.phase === 'combat') this.next();
    else this.render();
  }
}
