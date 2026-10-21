// 모듈 조합 실행용 HUD: 플레이어/핵 체력, 웨이브, 자원과 알림을 표시한다.
import type { System } from './types';
import { state } from './state';
import { events } from './events';
import { RES_KEYS, RES_LABEL } from '../data';

let wave: HTMLElement | null, sub: HTMLElement | null, res: HTMLElement | null, help: HTMLElement | null;
let playerHpText: HTMLElement | null, playerHpFill: HTMLElement | null;
let coreHpText: HTMLElement | null, coreHpFill: HTMLElement | null;
let acc = 0;

const percent = (value: number, max: number) =>
  max > 0 ? Math.max(0, Math.min(100, value / max * 100)) : 0;

export const HudSystem: System = {
  init() {
    wave = document.getElementById('wave'); sub = document.getElementById('sub');
    res = document.getElementById('res'); help = document.getElementById('help');
    playerHpText = document.getElementById('hpText');
    playerHpFill = document.getElementById('hpFill');
    coreHpText = document.getElementById('coreHpText');
    coreHpFill = document.getElementById('coreHpFill');
    if (help) help.style.display = 'none';
    events.on('toast', ({ text }) => showToast(text));
  },
  update(dt, ctx) {
    // 체력은 실제 게임 상태에서 읽어 부상/회복/업그레이드를 즉시 반영한다.
    acc += dt;
    if (acc >= 0.1) {
      acc = 0;
      const playerHp = Math.max(0, Math.min(ctx.player.hp, ctx.player.maxHp));
      const playerPct = percent(playerHp, ctx.player.maxHp);
      if (playerHpFill) playerHpFill.style.width = playerPct + '%';
      if (playerHpText) playerHpText.textContent = `플레이어 ${Math.ceil(playerHp)} / ${Math.ceil(ctx.player.maxHp)}`;
      if (playerHpFill) playerHpFill.style.filter = playerPct <= 30 ? 'saturate(1.5) brightness(.85)' : '';

      const coreHp = Math.max(0, Math.min(state.coreHp, state.coreMaxHp));
      if (coreHpFill) coreHpFill.style.width = percent(coreHp, state.coreMaxHp) + '%';
      if (coreHpText) coreHpText.textContent = `코어 ${Math.ceil(coreHp)} / ${Math.ceil(state.coreMaxHp)}`;
    }
    if (acc < 0.2) return;
    if (wave) wave.textContent = state.phase === 'ended' ? (state.wave >= 50 ? '클리어!' : '런 종료') : `웨이브 ${state.wave}`;
    if (sub) {
      sub.textContent = state.phase === 'prep'
        ? `준비 ${Math.ceil(state.prepLeft)}초 · N 으로 바로 시작`
        : `남은 좀비 ${state.waveRemaining}`;
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
