// 첫 출격 안내 띠 "1/4 WASD로 이동한다" (빨간 하늘 빌드의 #ztTut). 해당 입력을 하면 다음 단계로 넘어간다.
// 네 단계를 다 마치면 다시 띄우지 않는다.
import { events } from '../core/events';
import { input } from '../core/input';
import { state } from '../core/state';
import { TUTORIAL_CSS } from './style';

type Until = 'move' | 'fire' | 'build' | 'wave';
const STEPS: { text: string; until: Until }[] = [
  { text: 'WASD로 이동한다', until: 'move' },
  { text: '우클릭으로 조준, 좌클릭으로 사격', until: 'fire' },
  { text: 'B로 건설 모드를 열어 포탑을 세운다', until: 'build' },
  { text: 'N으로 다음 웨이브를 바로 부른다', until: 'wave' },
];
const KEY = '3dgun.tutorialDone.v1';
const MOVE = ['KeyW', 'KeyA', 'KeyS', 'KeyD'];

const isDone = () => { try { return localStorage.getItem(KEY) === '1'; } catch { return false; } };

export class Tutorial {
  private i = -1;
  private el?: HTMLDivElement;
  private active = false;

  constructor() {
    const st = document.createElement('style');
    st.textContent = TUTORIAL_CSS;
    document.head.appendChild(st);
    events.on('run:start', () => { if (!this.active && !isDone()) this.start(); });
    events.on('weapon:fired', () => { if (this.cur() === 'fire') this.next(); });
    events.on('wave:start', () => { if (this.cur() === 'wave') this.next(); });
    events.on('run:over', () => this.stop());
  }

  private cur(): Until | undefined { return this.active ? STEPS[this.i]?.until : undefined; }

  private start() {
    this.el?.remove();
    this.el = document.createElement('div');
    this.el.id = 'ztTut';
    this.el.setAttribute('role', 'status');
    document.body.appendChild(this.el);
    this.active = true;
    this.i = -1;
    this.next();
  }

  private next() {
    const el = this.el;
    if (!el) return;
    this.i++;
    if (this.i >= STEPS.length) {
      try { localStorage.setItem(KEY, '1'); } catch { /* 저장소 불가 */ }
      this.stop();
      return;
    }
    el.classList.remove('on');
    const i = this.i;
    setTimeout(() => {
      if (!this.active || this.el !== el || this.i !== i) return;
      el.innerHTML = `<b>${i + 1}/${STEPS.length}</b>${STEPS[i].text}`;
      el.classList.add('on');
    }, i === 0 ? 0 : 320);
  }

  private stop() {
    if (!this.active) return;
    this.active = false;
    const el = this.el;
    this.el = undefined;
    el?.classList.remove('on');
    setTimeout(() => el?.remove(), 400);
  }

  update() {
    const u = this.cur();
    if (!u || input.paused || input.modalOpen || state.mode === 'modal') return;
    if (u === 'move' && MOVE.some((k) => input.keys.has(k))) this.next();
    else if (u === 'build' && input.pressed.has('KeyB')) this.next();
    else if (u === 'wave' && input.pressed.has('KeyN')) this.next();
  }
}
