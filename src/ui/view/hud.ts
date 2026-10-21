// HUD: state/이벤트를 읽어 index.html 의 HUD 마크업을 채운다. 게임 규칙은 건드리지 않는다.
import { events } from '../../core/events';
import { state } from '../../core/state';
import { zombies } from '../../core/entities';
import type { Ctx } from '../../core/types';
import { RES_KEYS, RES_LABEL, WEAPONS, xpToNext, type WeaponId, type ResKey } from '../../data';
import { levelOf } from '../../skills/logic/skilltree';
import { ToastQueue, type ToastKind } from '../logic/toasts';
import { dangerLevel, int, mmss, pct, phaseLabel, ratio } from '../logic/hudFormat';
import { icon } from './icons';

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const bannerEl = () => $('banner');

interface Chip { el: HTMLElement; val: HTMLElement; last: string }

export interface HudStats { kills: number; startedAt: number }

export function createHud() {
  const toasts = new ToastQueue();
  const toastEls = new Map<number, HTMLElement>();
  const chips = new Map<string, Chip>();
  const stats: HudStats = { kills: 0, startedAt: performance.now() };

  // ── 자원 패널 ──
  const resbox = $('resbox');
  const addChip = (key: string, ic: string, label: string, cls = '') => {
    const el = document.createElement('div');
    el.className = `chip ${cls}`;
    el.innerHTML = `${ic}<span class="lbl">${label}</span><b>0</b>`;
    resbox.appendChild(el);
    chips.set(key, { el, val: el.querySelector('b')!, last: '' });
  };
  for (const k of RES_KEYS) addChip(k, icon(k, 20), RES_LABEL[k]);
  addChip('samples', icon('sample', 20), '샘플');
  addChip('gold', icon('coin', 20), '골드', 'gold');
  addChip('keys', icon('key', 20), '철 열쇠');
  addChip('goldKeys', icon('key', 20).replace('currentColor', '#ffd25a'), '황금 열쇠');
  addChip('allies', icon('people', 20), '아군');

  const setChip = (key: string, text: string, bump = true) => {
    const c = chips.get(key)!;
    if (c.last === text) return;
    const first = c.last === '';
    c.last = text;
    c.val.textContent = text;
    if (bump && !first) { c.el.classList.remove('bump'); void c.el.offsetWidth; c.el.classList.add('bump'); }
  };

  const refreshState = () => {
    for (const k of RES_KEYS as ResKey[]) setChip(k, int(state.res[k]));
    setChip('samples', `${state.samples}${state.samplesSp ? `+${state.samplesSp}` : ''}`);
    setChip('gold', int(state.gold));
    setChip('keys', String(state.keys));
    setChip('goldKeys', String(state.goldKeys));
    setChip('allies', `${state.allyCount}/${state.stats.allyCap + state.allyCapBonus}`, false);

    $('waveNum').textContent = String(state.wave);
    const pill = $('phasePill');
    pill.textContent = phaseLabel(state.phase);
    pill.className = `pill ${state.phase}`;

    $('coreLabel').textContent = `기지 핵  ${int(state.coreHp)} / ${int(state.coreMaxHp)}`;
    $('coreFill').style.width = pct(state.coreHp, state.coreMaxHp);
    $('coreMeter').classList.toggle('danger', ratio(state.coreHp, state.coreMaxHp) < 0.35);

    const level = levelOf(state);
    const need = xpToNext(level);
    const lv = $('lvNum');
    if (lv.textContent !== String(level)) {
      if (lv.textContent !== '1' || level > 1) { lv.parentElement!.classList.remove('up'); void lv.offsetWidth; lv.parentElement!.classList.add('up'); }
      lv.textContent = String(level);
    }
    $('xpFill').style.width = pct(state.xp, need);
    $('spNum').textContent = String(state.skillPoints);
    $('skillHint').classList.toggle('show', state.skillPoints > 0);

    // 탄창 보정(스킬)이 바뀌면 최대치 표기를 맞춘다
    if (!firedOnce) { const m = Math.round(WEAPONS.pistol.mag * state.stats.magMul); $('ammoNow').textContent = String(m); $('ammoMax').textContent = String(m); }
  };
  let firedOnce = false;
  events.on('state:changed', refreshState);

  // ── 탄약 ──
  events.on('weapon:fired', (e) => {
    firedOnce = true;
    $('weaponName').textContent = WEAPONS[e.weapon as WeaponId]?.name ?? e.weapon;
    $('ammoNow').textContent = String(e.ammo);
    $('ammoMax').textContent = String(e.mag);
    document.querySelector('.ammo')!.classList.toggle('empty', e.ammo === 0);
    $('reloadHint').classList.toggle('show', e.ammo <= Math.max(1, Math.floor(e.mag * 0.2)));
  });

  // ── 상호작용 안내 ──
  events.on('interact:prompt', ({ text }) => {
    const p = $('prompt');
    if (!text) { p.classList.remove('show'); return; }
    p.querySelector('span')!.textContent = text.replace(/^\[?E\]?\s+/, '');
    p.classList.add('show');
  });

  // ── 토스트 ──
  const toast = (text: string, kind: ToastKind = 'info') => {
    const t = toasts.push(text, kind);
    let el = toastEls.get(t.id);
    if (!el) {
      el = document.createElement('div');
      el.className = `toast ${kind}`;
      $('toasts').appendChild(el);
      toastEls.set(t.id, el);
    }
    const alive = new Set(toasts.items.map((i) => i.id));
    for (const [id, e] of toastEls) if (!alive.has(id)) { e.remove(); toastEls.delete(id); }
    el.innerHTML = `<span>${text.replace(/</g, '&lt;')}</span>${t.count > 1 ? `<em>×${t.count}</em>` : ''}`;
  };
  events.on('toast', ({ text }) => toast(text));
  events.on('resource:gathered', ({ res, amount }) => toast(`+${amount} ${RES_LABEL[res as ResKey] ?? res}`, 'good'));
  events.on('chest:opened', ({ text }) => toast(text, 'good'));
  events.on('building:placed', ({ kind }) => toast(`건설 완료: ${kind}`, 'good'));
  events.on('building:destroyed', ({ kind }) => toast(`건물 파괴: ${kind}`, 'bad'));
  events.on('zombie:converted', () => toast('좀비가 아군이 되었다', 'good'));
  events.on('ally:dead', () => toast('아군이 쓰러졌다', 'bad'));

  // ── 배너 ──
  const banner = (main: string, sub = '', cls = '') => {
    const el = bannerEl();
    el.querySelector('.banner-main')!.textContent = main;
    el.querySelector('.banner-sub')!.textContent = sub;
    el.className = '';
    void el.offsetWidth;
    el.className = `show ${cls}`;
  };
  events.on('wave:start', ({ wave }) => banner(`웨이브 ${wave}`, '감염체 접근 중', 'warn'));
  events.on('wave:clear', ({ wave }) => banner('웨이브 클리어', `WAVE ${wave} CLEARED`));
  events.on('core:destroyed', () => banner('기지 핵 파괴', 'CORE LOST', 'warn'));

  // ── 보스 체력바 ──
  let bossType = '';
  let bossLost = 0;
  events.on('boss:spawn', ({ wave, type }) => {
    bossType = type;
    $('bossLabel').textContent = type === 'king' ? '좀비 왕' : `웨이브 ${wave} 보스`;
    $('bossMeter').classList.add('on');
    banner(type === 'king' ? '좀비 왕 출현' : '보스 출현', 'BOSS', 'boss');
  });
  events.on('boss:dead', () => { bossType = ''; $('bossMeter').classList.remove('on'); banner('보스 처치', 'BOSS DOWN', 'gold'); });

  // ── 조준점 피드백 ──
  let hitT = 0;
  events.on('enemy:killed', () => { stats.kills++; $('cross').classList.add('hit'); hitT = 0.12; });

  // ── 화면 피격 효과 ──
  let lastHp = -1, flashT = 0;
  events.on('player:dead', () => { const d = $('death'); d.classList.remove('show'); void d.offsetWidth; d.classList.add('show'); });

  refreshState();

  return {
    stats, toast, banner,
    update(dt: number, ctx: Ctx) {
      const p = ctx.player;
      const r = ratio(p.hp, p.maxHp);
      $('hpText').textContent = `${Math.ceil(p.hp)} / ${Math.ceil(p.maxHp)}`;
      $('hpFill').style.width = pct(p.hp, p.maxHp);
      $('hpGhost').style.width = pct(p.hp, p.maxHp);
      const bar = $('hpFill').parentElement!;
      const d = dangerLevel(r);
      bar.classList.toggle('mid', d === 1);
      bar.classList.toggle('low', d === 2);

      if (lastHp >= 0 && p.hp < lastHp - 0.01) flashT = 0.18;
      lastHp = p.hp;
      const v = $('vignette');
      if (flashT > 0) { flashT -= dt; v.classList.add('hit'); } else v.classList.remove('hit');
      v.classList.toggle('low', d === 2 && p.hp > 0);

      const dashMax = state.stats.dashCd;
      const dashBar = $('dashFill').parentElement!;
      const dashFill = $('dashFill');
      const cd = p.dashCd > 0 ? p.dashCd : 0;
      dashFill.style.width = `${(1 - ratio(cd, dashMax)) * 100}%`;
      dashBar.classList.toggle('ready', cd <= 0);

      if (hitT > 0) { hitT -= dt; if (hitT <= 0) $('cross').classList.remove('hit'); }

      // 보스 체력
      if (bossType) {
        const b = zombies.find((z) => !z.dead && z.type === bossType);
        if (b) {
          bossLost = 0;
          $('bossFill').style.width = pct(b.hp, b.maxHp);
          $('bossGhost').style.width = pct(b.hp, b.maxHp);
        } else if ((bossLost += dt) > 1.5) $('bossMeter').classList.remove('on');
      }

      // 토스트
      const gone = toasts.update(dt);
      for (const id of gone) { toastEls.get(id)?.remove(); toastEls.delete(id); }
      for (const t of toasts.items) toastEls.get(t.id)?.classList.toggle('out', t.age > t.ttl - 0.45);
    },
    playTime: () => mmss((performance.now() - stats.startedAt) / 1000),
  };
}
export type Hud = ReturnType<typeof createHud>;
