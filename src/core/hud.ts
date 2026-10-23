// 모듈 조합 실행용 기본 HUD: 웨이브/준비시간/남은 좀비/핵 체력/자원을 index.html 요소에 그린다.
import type { System } from './types';
import { state } from './state';
import { events } from './events';
import { RES_KEYS, RES_LABEL } from '../data';

let wave: HTMLElement | null, sub: HTMLElement | null, res: HTMLElement | null, help: HTMLElement | null;
let hpFill: HTMLElement | null, hpText: HTMLElement | null, hpGhost: HTMLElement | null;
let acc = 0;
let lastPct = 100;
let lastWaveText = '';

function applyHpBar(hp: number, maxHp: number) {
  const pct = maxHp > 0 ? Math.max(0, Math.min(100, (hp / maxHp) * 100)) : 0;
  if (hpFill) hpFill.style.width = `${pct}%`;
  // 흰 잔상 막대: 맞으면 잠깐 남았다가 따라 줄고, 회복은 바로 따라간다
  if (hpGhost) { hpGhost.classList.toggle('up', pct > lastPct); hpGhost.style.width = `${pct}%`; }
  hpFill?.closest('.bar')?.classList.toggle('low', pct > 0 && pct < 30);
  lastPct = pct;
  if (hpText) hpText.textContent = `HP ${Math.ceil(hp)} / ${Math.ceil(maxHp)}`;
}

export const HudSystem: System = {
  init() {
    wave = document.getElementById('wave'); sub = document.getElementById('sub');
    res = document.getElementById('res'); help = document.getElementById('help');
    hpFill = document.getElementById('hpFill');
    hpText = document.getElementById('hpText');
    hpGhost = document.getElementById('hpGhost');
    if (help) help.style.display = 'none';
    events.on('toast', ({ text }) => showToast(text));
    events.on('player:hp', ({ hp, maxHp }) => applyHpBar(hp, maxHp));
    events.on('ui:modal', ({ open }) => {
      const hud = document.getElementById('hud');
      if (hud) hud.style.display = open ? 'none' : '';
    });
  },
  update(dt) {
    acc += dt;
    if (acc < 0.2) return;
    acc = 0;
    if (wave) {
      const t = state.phase === 'ended' ? (state.wave >= 50 ? '클리어!' : '런 종료') : `웨이브 ${state.wave}`;
      if (t !== lastWaveText) {
        wave.textContent = t;
        // 웨이브가 바뀌면 주황으로 한 번 튀었다가 흰색으로 돌아온다
        if (lastWaveText) { wave.classList.remove('pop'); void wave.offsetWidth; wave.classList.add('pop'); }
        lastWaveText = t;
      }
    }
    if (sub) {
      sub.textContent = state.phase === 'prep'
        ? `준비 ${Math.ceil(state.prepLeft)}초 · B 건설 · L 백신 · N 시작`
        : `남은 좀비 ${state.waveRemaining} · 핵 ${Math.ceil(state.coreHp)}/${state.coreMaxHp}`;
    }
    if (res) {
      const vac = state.vaccines.reduce((s, n) => s + n, 0);
      res.textContent = [
        RES_KEYS.map((k) => `${RES_LABEL[k]} ${state.res[k]}`).join(' '),
        `샘플 ${state.samples}`,
        vac ? `백신 ${vac}` : '',
        `코인 ${state.gold}`,
      ].filter(Boolean).join(' · ');
    }
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
