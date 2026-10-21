/// <reference types="vite/client" />
// 2D 업그레이드 타이쿤 모듈 진입점.
// 흐름: run:over(사망/핵 파괴) → 재화 정산 → 2D 화면 → "출격" → state.statMods/state.start 반영 → run:start.
import type { System } from '../core/types';
import { events } from '../core/events';
import { input } from '../core/input';
import { meta, loadMeta, saveMeta, resetMeta } from '../core/meta';
import { state, recalcStats } from '../core/state';
import { RES_KEYS } from '../data';
import { bankRun, bonuses, settleOffline, tick, type RunReport, type RunSnapshot } from './logic/economy';
import { TycoonPanel } from './view/panel';

const BASE_CORE_HP = 500;
let panel: TycoonPanel;
let overSeen = false;
let pending: { snap: RunSnapshot; t: number } | null = null;
let acc = 0;

function snapshot(wave: number, checkpoint: number, kills: number, gold: number): RunSnapshot {
  return { wave, checkpoint, kills, gold, res: { ...state.res }, samples: state.samples, samplesSp: state.samplesSp, skillPoints: state.skillPoints };
}

/** 영구 업그레이드를 state 의 보정/시작 보너스에 등록한다 (recalcStats 가 statMods 를 적용) */
function applyToState() {
  const b = bonuses(meta);
  state.statMods = [(s) => {
    s.maxHp += b.maxHp; s.dmgMul += b.dmgMul; s.gatherSpeed += b.gatherSpeed; s.allyCap += b.allyCap;
  }];
  Object.assign(state.start, {
    gold: b.startGold, startWave: b.startWave, res: { ...b.startRes }, coreHp: b.coreHp, prepBonus: b.prepBonus,
    samples: b.startSamples, skillPoints: b.startSkillPoints, weapons: [...b.weapons], weaponLv: { ...b.weaponLv }, turretDmgMul: b.turretDmgMul,
  });
}

/** 런 시작 직후 호출: 다른 모듈이 run:start 로 자기 상태를 비운 뒤에 시작 보너스를 얹는다 */
function seedRun() {
  const s = state.start;
  state.gold = s.gold;
  for (const k of RES_KEYS) state.res[k] = s.res[k] ?? 0;
  state.samples = s.samples; state.samplesSp = 0; state.skillPoints = s.skillPoints;
  state.skillLv = { ...bonuses(meta).skillLv };
  state.weapons = [...s.weapons];
  state.coreMaxHp = BASE_CORE_HP + s.coreHp; state.coreHp = state.coreMaxHp;
  recalcStats();
}

function showPanel(report: RunReport | null, offline?: { secs: number; gold: number }) {
  state.mode = 'modal';
  input.modalOpen = true;
  document.exitPointerLock?.();
  events.emit('ui:modal', { open: true });
  panel.open(report, offline);
}

function handleOver(snap: RunSnapshot) {
  if (panel.isOpen) return;
  overSeen = true;
  pending = null;
  const report = bankRun(meta, snap);
  meta.lastSeen = Date.now();
  saveMeta();
  state.gold = 0; // 정산된 재화는 지갑으로 옮겼다
  showPanel(report);
}

function launch() {
  applyToState();
  const startWave = state.start.startWave;
  panel.close();
  state.mode = 'play';
  input.modalOpen = false;
  overSeen = false;
  events.emit('ui:modal', { open: false });
  events.emit('run:start', { run: meta.totalRuns + 1, startWave });
  seedRun();
  meta.lastSeen = Date.now();
  saveMeta();
}

export const Tycoon2dSystem: System = {
  init() {
    loadMeta();
    const off = settleOffline(meta, Date.now());
    applyToState();
    seedRun();
    panel = new TycoonPanel({
      onLaunch: launch,
      onChanged: () => { applyToState(); saveMeta(); },
      onReset: () => { resetMeta(); applyToState(); },
    });
    if (off.secs > 0) events.emit('toast', { text: `부재 중 수익: 🪙 +${Math.floor(off.gains.gold ?? 0)}` });

    // W2 가 run:over 를 내면 그대로 쓰고, 아직 없으면 사망/핵 파괴 이벤트로 대신 감지한다 (같은 프레임 안 호출 순서상 먼저 스냅샷)
    events.on('run:over', (e) => handleOver(snapshot(e.wave, e.checkpoint, e.kills, e.gold)));
    const fallback = () => { if (!pending && !panel.isOpen) pending = { snap: snapshot(state.wave, state.checkpoint, 0, state.gold), t: 0.1 }; };
    events.on('player:dead', fallback);
    events.on('core:destroyed', fallback);
    addEventListener('beforeunload', () => { meta.lastSeen = Date.now(); saveMeta(); });
    if (import.meta.env.DEV) (window as unknown as { __t2d: unknown }).__t2d = { meta, panel, handleOver, snapshot, launch };
  },
  update(dt) {
    if (pending) { pending.t -= dt; if (pending.t <= 0) { const p = pending; pending = null; if (!overSeen) handleOver(p.snap); } }
    if (panel.isOpen) { panel.update(dt); return; }
    tick(meta, dt);
    acc += dt;
    if (acc > 5) { acc = 0; meta.lastSeen = Date.now(); saveMeta(); }
  },
};
