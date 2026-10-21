// 모듈 조합 실행용 기본 HUD: 웨이브/준비시간/남은 좀비/핵 체력/자원을 index.html 요소에 그린다.
import type { System } from './types';
import { state } from './state';
import { events } from './events';
import { RES_KEYS, RES_LABEL } from '../data';

let wave: HTMLElement | null, sub: HTMLElement | null, res: HTMLElement | null, help: HTMLElement | null;
let acc = 0;

export const HudSystem: System = {
  init() {
    wave = document.getElementById('wave'); sub = document.getElementById('sub');
    res = document.getElementById('res'); help = document.getElementById('help');
    if (help) help.style.display = 'none';
    events.on('toast', ({ text }) => showToast(text));
  },
  update(dt) {
    acc += dt;
    if (acc < 0.2) return;
    acc = 0;
    if (wave) wave.textContent = state.phase === 'ended' ? (state.wave >= 50 ? '클리어!' : '런 종료') : `웨이브 ${state.wave}`;
    if (sub) {
      sub.textContent = state.phase === 'prep'
        ? `준비 ${Math.ceil(state.prepLeft)}초 · N 으로 바로 시작`
        : `남은 좀비 ${state.waveRemaining} · 핵 ${Math.ceil(state.coreHp)}/${state.coreMaxHp}`;
    }
    if (res) res.textContent = RES_KEYS.map((k) => `${RES_LABEL[k]} ${state.res[k]}`).join('  ') + `  · 코인 ${state.gold}`;
  },
};

/** 짧은 알림. 처치 코인처럼 자주 나와도 모달을 띄우지 않는다. */
function showToast(text: string) {
  const box = document.getElementById('toasts');
  if (!box) return;
  const d = document.createElement('div');
  d.textContent = text;
  box.appendChild(d);
  while (box.children.length > 5) box.removeChild(box.firstChild as ChildNode);
  setTimeout(() => d.remove(), 1600);
}
