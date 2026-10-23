// 첫 출격 안내 카드 (#ztTut). 실제 한 판의 흐름을 따라 단계마다 키캡 + 한 줄 이유를 보여 주고,
// 그 행동을 실제로 하면 다음 단계로 넘어간다. 끝까지 하거나 "건너뛰기"를 누르면 다시 띄우지 않는다.
// 타이틀 설정 창의 "튜토리얼 다시 보기"(resetTutorial)로 다음 출격 때 처음부터 다시 볼 수 있다.
import { events } from '../core/events';
import { input } from '../core/input';
import { state } from '../core/state';
import { BUILDINGS } from '../data';
import { canAfford } from '../base/logic/base';
import { injectKeycapCss, kbds } from '../ui/keys';
import { isHelpOpen } from '../ui/keybar';
import { TUTORIAL_CSS } from './style';

type Until = 'move' | 'fire' | 'reload' | 'dash' | 'build' | 'place' | 'wave' | 'kill' | 'shop' | 'vaccine';
interface Step { until: Until; keys: string[]; title: string; why: string; optional?: boolean }

const KILLS = 3;
const STEPS: Step[] = [
  { until: 'move', keys: ['W', 'A', 'S', 'D'], title: '이동', why: '좀비에게 둘러싸이지 않게 계속 움직이세요' },
  { until: 'fire', keys: ['좌클릭'], title: '시점 · 사격', why: '화면을 클릭하면 마우스가 고정돼요. 마우스로 보고 좌클릭으로 쏩니다 (우클릭 조준)' },
  { until: 'reload', keys: ['R'], title: '재장전', why: '탄창이 비기 전에 미리 채워 두면 위기에 끊기지 않아요' },
  { until: 'dash', keys: ['왼쪽 Shift'], title: '대시', why: '포위당하면 이동키와 함께 눌러 순간적으로 빠져나가세요' },
  { until: 'build', keys: ['B'], title: '건설 모드', why: '준비 시간에만 지을 수 있어요. 포탑이 기지 핵을 지켜 줍니다' },
  { until: 'place', keys: ['1', '좌클릭'], title: `${BUILDINGS.tower.name} 배치`, why: '1 로 감시탑을 고르고 땅을 클릭하세요. 알아서 좀비를 쏩니다' },
  { until: 'wave', keys: ['N'], title: '웨이브 시작', why: '준비가 끝났으면 타이머를 기다리지 말고 바로 부르세요' },
  { until: 'kill', keys: ['좌클릭'], title: `좀비 ${KILLS}마리 처치`, why: '처치하면 코인과 백신 재료(샘플)가 쌓여요' },
  { until: 'shop', keys: ['V'], title: '무기 상점', why: '모은 코인으로 무기를 사고 강화하세요 (Esc 로 닫기)' },
  { until: 'vaccine', keys: ['L'], title: '백신 (선택)', why: '샘플로 백신을 만들어 기절한 좀비에게 E 길게 → 아군이 됩니다', optional: true },
];
const KEY = '3dgun.tutorialDone.v1';
const MOVE = ['KeyW', 'KeyA', 'KeyS', 'KeyD'];
const MOVE_NEED_S = 0.8;
const OPTIONAL_WAIT_S = 20;

const isDone = () => { try { return localStorage.getItem(KEY) === '1'; } catch { return false; } };
const markDone = () => { try { localStorage.setItem(KEY, '1'); } catch { /* 저장소 불가 */ } };

/** 타이틀 "튜토리얼 다시 보기": 다음 출격 때 처음부터 다시 띄운다 */
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
    el.addEventListener('mousedown', (e) => e.stopPropagation()); // 건너뛰기 클릭이 사격·일시정지 해제로 새지 않게
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

  /** 지금 상황에서 이 단계를 못 하는 이유 (전투 중 건설 등) */
  private hint(s: Step): string {
    if ((s.until === 'build' || s.until === 'place') && state.phase !== 'prep') return '지금은 전투 중 — 이번 웨이브를 넘기고 준비 시간에 다시';
    if (s.until === 'place' && state.mode !== 'build') return 'B 로 건설 모드를 다시 여세요';
    if (s.until === 'place' && !canAfford(BUILDINGS.tower.cost)) return '자원이 모자라요 — 나무·돌 근처에서 E 를 길게 눌러 채집';
    if (s.until === 'kill') return `${this.kills}/${KILLS}`;
    return '';
  }

  private render() {
    const el = this.el;
    const s = STEPS[this.i];
    if (!el || !s) return;
    const h = this.hint(s);
    const html = `<div class="tt-top"><b class="tt-n">${this.i + 1}/${STEPS.length}</b><span class="tt-k">${kbds(s.keys)}</span><span class="tt-t">${s.title}</span>`
      + `<button type="button" class="tt-skip" data-skip>${s.optional ? '끝내기' : '건너뛰기'}</button></div>`
      + `<div class="tt-why">${s.why}</div>`
      + (h ? `<div class="tt-hint">${h}</div>` : '')
      + `<div class="tt-foot">H 전체 조작키 · Esc 로 멈추고 건너뛰기 가능</div>`;
    if (html !== this.lastHtml) { this.lastHtml = html; el.innerHTML = html; }
  }

  private finish() {
    markDone();
    const el = this.el;
    if (el) {
      el.classList.add('on');
      el.innerHTML = `<div class="tt-top"><b class="tt-n">완료</b><span class="tt-t">기본기 끝! 막히면 언제든</span><span class="tt-k">${kbds(['H'])}</span><span class="tt-t">도움말</span></div>`;
    }
    setTimeout(() => this.stop(), 4000);
  }

  private skip() {
    markDone();
    this.stop();
  }

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
    // 실제 경과 시간 (프레임 dt 는 0.05 로 잘리므로 느린 기기에서 '0.8초 이동'이 길어지지 않게)
    const now = performance.now();
    const dt = Math.min(0.25, Math.max(0, (now - (this.lastNow || now)) / 1000));
    this.lastNow = now;
    const u = this.cur();
    // 상점·연구소 같은 창이 열려 있으면 카드를 잠시 숨긴다 (창 위를 가리지 않게)
    if (this.el) this.el.style.visibility = input.modalOpen || state.mode === 'modal' ? 'hidden' : '';
    if (!u || input.paused || isHelpOpen()) return;
    this.stepT += dt;
    // V/L 은 누른 그 프레임에 창이 열려 mode 가 'modal' 이 되므로 모달 검사보다 먼저 본다
    if (u === 'shop' && input.pressed.has('KeyV')) { this.next(); return; }
    if (u === 'vaccine' && (input.pressed.has('KeyL') || this.stepT > OPTIONAL_WAIT_S)) { this.next(); return; }
    if (input.modalOpen || state.mode === 'modal') return;
    if (u === 'move' && MOVE.some((k) => input.keys.has(k))) { this.moved += dt; if (this.moved >= MOVE_NEED_S) this.next(); }
    else if (u === 'reload' && input.pressed.has('KeyR')) this.next();
    else if (u === 'dash' && input.pressed.has('ShiftLeft')) this.next();
    else if (u === 'build' && state.mode === 'build') this.next();
    else if (u === 'wave' && state.phase === 'combat') this.next(); // 준비 시간이 끝나 저절로 시작된 경우
    else this.render(); // 상황 안내(전투 중·자원 부족) 갱신
  }
}
