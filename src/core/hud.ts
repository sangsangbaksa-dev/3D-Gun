// 모듈 조합 실행용 기본 HUD: 웨이브/준비시간/남은 좀비/핵 체력/자원을 index.html 요소에 그린다.
import type { System } from './types';
import { state } from './state';
import { events } from './events';
import { zombies } from './entities';
import {
  RES_KEYS, RES_LABEL, FINAL_WAVE,
  isBossWave, isBossType, bossTypeFor, ZOMBIE_TUNING, type ZType,
} from '../data';
import { mountKeyHelp, updateKeyBar } from '../ui/keybar';
import { mountWaveClearFlash, updateWaveClearFlash } from '../ui/waveClearFlash';

let wave: HTMLElement | null, sub: HTMLElement | null, res: HTMLElement | null, help: HTMLElement | null;
let hpFill: HTMLElement | null, hpText: HTMLElement | null, hpGhost: HTMLElement | null, xpFill: HTMLElement | null;
let bossEl: HTMLElement | null, bossName: HTMLElement | null, bossFill: HTMLElement | null, banner: HTMLElement | null;
let coreBar: HTMLElement | null, coreFill: HTMLElement | null, coreText: HTMLElement | null;
let acc = 0;
let lastPct = 100;
let lastWaveText = '';
let bannerT = 0;
let activeBossType: string | null = null;
const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

function applyHpBar(hp: number, maxHp: number) {
  const pct = maxHp > 0 ? Math.max(0, Math.min(100, (hp / maxHp) * 100)) : 0;
  if (hpFill) hpFill.style.width = `${pct}%`;
  // 흰 잔상 막대: 맞으면 잠깐 남았다가 따라 줄고, 회복은 바로 따라간다
  if (hpGhost) { hpGhost.classList.toggle('up', pct > lastPct); hpGhost.style.width = `${pct}%`; }
  hpFill?.closest('.bar')?.classList.toggle('low', pct > 0 && pct < 30);
  lastPct = pct;
  if (hpText) hpText.textContent = `HP ${Math.ceil(hp)} / ${Math.ceil(maxHp)}`;
}

function waveBannerText(w: number) {
  if (w === FINAL_WAVE) return '최종 보스 — 좀비 왕';
  if (isBossWave(w)) return `웨이브 ${w} — ${ZOMBIE_TUNING[bossTypeFor(w)].name}`;
  return `웨이브 ${w}`;
}

function showBanner(text: string, ms = 2100) {
  if (!banner) return;
  banner.textContent = text;
  banner.classList.remove('show');
  if (!reducedMotion()) void banner.offsetWidth;
  banner.style.opacity = reducedMotion() ? '1' : '';
  banner.classList.add('show');
  clearTimeout(bannerT);
  bannerT = window.setTimeout(() => {
    banner!.style.opacity = '0';
    banner!.classList.remove('show');
  }, ms);
}

function hideBossBar() {
  activeBossType = null;
  if (bossEl) bossEl.style.display = 'none';
}

function refreshBossBar() {
  if (!bossEl || !bossFill || !bossName) return;
  let boss = activeBossType
    ? zombies.find((z) => !z.dead && z.type === activeBossType)
    : undefined;
  if (!boss) boss = zombies.find((z) => !z.dead && isBossType(z.type as ZType));
  if (!boss) {
    if (state.phase !== 'combat') hideBossBar();
    return;
  }
  const tune = ZOMBIE_TUNING[boss.type as keyof typeof ZOMBIE_TUNING];
  const pct = boss.maxHp > 0 ? (boss.hp / boss.maxHp) * 100 : 0;
  bossEl.style.display = 'block';
  bossName.textContent = tune?.name ? `보스 · ${tune.name}` : '보스';
  bossFill.style.width = `${Math.max(0, Math.min(100, pct))}%`;
  bossEl.classList.toggle('rage', pct > 0 && pct < 50);
}

function refreshCoreWarn() {
  const low = state.phase === 'combat' && state.coreMaxHp > 0 && state.coreHp / state.coreMaxHp < 0.28;
  document.body.classList.toggle('ztCoreLow', low);
}

function refreshCoreBar() {
  if (!coreBar || !coreFill || !coreText) return;
  const show = state.phase !== 'ended' && state.coreMaxHp > 0;
  coreBar.style.display = show ? 'block' : 'none';
  if (!show) return;
  const pct = Math.max(0, Math.min(100, (state.coreHp / state.coreMaxHp) * 100));
  coreFill.style.width = `${pct}%`;
  coreText.textContent = `${Math.ceil(state.coreHp)} / ${Math.ceil(state.coreMaxHp)}`;
  coreBar.classList.toggle('low', pct > 0 && pct < 28);
}

function prepSubText() {
  const sec = Math.ceil(state.prepLeft);
  const w = state.wave;
  let hint = '';
  if (isBossWave(w)) {
    const name = w === FINAL_WAVE ? '좀비 왕' : ZOMBIE_TUNING[bossTypeFor(w)].name;
    hint = ` · ⚠ 보스 ${name}`;
  } else if (isBossWave(w + 1) && w + 1 <= FINAL_WAVE) {
    hint = ' · 다음 웨이브는 보스';
  }
  return `준비 ${sec}초${hint} · N 으로 바로 시작`;
}

export const HudSystem: System = {
  init() {
    wave = document.getElementById('wave'); sub = document.getElementById('sub');
    res = document.getElementById('res'); help = document.getElementById('help');
    hpFill = document.getElementById('hpFill');
    hpText = document.getElementById('hpText');
    hpGhost = document.getElementById('hpGhost');
    xpFill = document.getElementById('xpFill');
    bossEl = document.getElementById('boss');
    bossName = document.getElementById('bossName');
    bossFill = document.getElementById('bossFill');
    banner = document.getElementById('banner');
    coreBar = document.getElementById('coreBar');
    coreFill = document.getElementById('coreFill');
    coreText = document.getElementById('coreText');
    if (help) help.style.display = 'none';
    mountKeyHelp(); // 아래 가운데 상황별 키 막대 + H/F1 도움말 창
    mountWaveClearFlash();
    events.on('toast', ({ text, kind }) => {
      showToast(text, kind === 'cheat' ? 4200 : 1600, kind === 'cheat' ? 'toast-cheat' : '');
    });
    events.on('player:hp', ({ hp, maxHp }) => applyHpBar(hp, maxHp));
    events.on('ui:modal', ({ open }) => {
      const hud = document.getElementById('hud');
      if (hud) hud.style.display = open ? 'none' : '';
    });
    events.on('wave:start', ({ wave: w }) => showBanner(waveBannerText(w)));
    events.on('wave:prep', ({ wave: w }) => {
      hideBossBar();
      if (isBossWave(w) && w > 1) showBanner(`다음 — ${waveBannerText(w)}`, 2400);
    });
    events.on('boss:spawn', ({ type }) => { activeBossType = type; refreshBossBar(); });
    events.on('boss:dead', () => hideBossBar());
    events.on('run:start', () => { hideBossBar(); document.body.classList.remove('ztCoreLow'); });
    events.on('core:damaged', () => { refreshCoreWarn(); refreshCoreBar(); });
    events.on('run:start', () => refreshCoreBar());
  },
  update(dt) {
    updateKeyBar();
    updateWaveClearFlash(dt);
    acc += dt;
    if (acc < 0.2) return;
    acc = 0;
    if (wave) {
      const t = state.phase === 'ended' ? (state.wave >= FINAL_WAVE ? '클리어!' : '런 종료') : `웨이브 ${state.wave}`;
      if (t !== lastWaveText) {
        wave.textContent = t;
        // 웨이브가 바뀌면 주황으로 한 번 튀었다가 흰색으로 돌아온다
        if (lastWaveText) { wave.classList.remove('pop'); void wave.offsetWidth; wave.classList.add('pop'); }
        lastWaveText = t;
      }
    }
    if (sub) {
      sub.textContent = state.phase === 'prep'
        ? prepSubText()
        : `남은 좀비 ${state.waveRemaining} · 핵 ${Math.ceil(state.coreHp)}/${state.coreMaxHp}`;
      sub.classList.toggle('urgent', state.phase === 'prep' && state.prepLeft > 0 && state.prepLeft <= 5);
    }
    refreshBossBar();
    refreshCoreWarn();
    refreshCoreBar();
    // 런 레벨 진행도: 킬 XP 가 쌓이면 청록 막대가 찬다
    if (xpFill) xpFill.style.width = `${state.xpNext > 0 ? Math.min(100, (100 * state.xp) / state.xpNext) : 0}%`;
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
function showToast(text: string, ms = 1600, extraClass = '') {
  const box = document.getElementById('toasts');
  if (!box) return;
  const d = document.createElement('div');
  if (extraClass) d.className = extraClass;
  d.textContent = text;
  box.appendChild(d);
  while (box.children.length > 5) box.removeChild(box.firstChild as ChildNode);
  setTimeout(() => d.remove(), ms);
}
