/// <reference types="vite/client" />
// 2D 업그레이드 타이쿤 모듈 진입점.
// 흐름: run:over(사망/핵 파괴) → 재화 정산 → 2D 화면 → "출격" → state.statMods/state.start 반영 → run:start.
import type { System } from '../core/types';
import { events } from '../core/events';
import { input } from '../core/input';
import { meta, loadMeta, saveMeta, resetMeta } from '../core/meta';
import { state, recalcStats, changed } from '../core/state';
import { RES_KEYS } from '../data';
import { RUN_XP } from '../data/tycoon2d';
import { addXp, bankRun, bonuses, tick, xpToNext, type RunGrant, type RunReport, type RunSnapshot } from './logic/economy';
import { TycoonPanel } from './view/panel';
import { mountAttract } from './view/attract';
import { playDeath, deathActive } from '../ui/deathScreen';

const BASE_CORE_HP = 500;
let panel: TycoonPanel;
let attract: ReturnType<typeof mountAttract>;
let overSeen = false;
let pending: { snap: RunSnapshot; t: number } | null = null;
let acc = 0;
/** 이번 런 시작 때 지급한 양 (seedRun 이 기록). 정산 때 빼서 공짜 지급은 저축되지 않게 한다 */
let grant: RunGrant = { gold: 0, res: {}, samples: 0, skillPoints: 0 };

function snapshot(wave: number, checkpoint: number, kills: number, gold: number): RunSnapshot {
  // 치트로 채운 인런 재화는 영구 지갑 정산에 넣지 않는다 (시작 지급 수준만 남김).
  if (state.cheatUnlimited) {
    const res = Object.fromEntries(RES_KEYS.map((k) => [k, grant.res[k] ?? 0])) as RunSnapshot['res'];
    return {
      wave, checkpoint, kills, gold: grant.gold, res,
      samples: grant.samples, samplesSp: 0, skillPoints: state.skillPoints, grant,
    };
  }
  return { wave, checkpoint, kills, gold, res: { ...state.res }, samples: state.samples, samplesSp: state.samplesSp, skillPoints: state.skillPoints, grant };
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
    exchangeSellBonus: b.exchangeSellBonus,
  });
  // 총 품질(영구): player 가 같은 객체를 참조하므로 키만 갈아 끼운다 ('*' = 모든 총기)
  for (const k of Object.keys(state.weaponLvBonus)) delete state.weaponLvBonus[k];
  Object.assign(state.weaponLvBonus, b.weaponLv);
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
  state.xp = 0; state.level = 0; state.xpNext = xpToNext(0);
  grant = { gold: state.gold, res: { ...state.res }, samples: state.samples, skillPoints: state.skillPoints };
  recalcStats();
}

function showPanel(report: RunReport | null) {
  state.mode = 'modal';
  input.modalOpen = true;
  document.exitPointerLock?.();
  events.emit('ui:modal', { open: true });
  panel.open(report);
}

function handleOver(snap: RunSnapshot, reason: 'player' | 'core' = 'player') {
  if (panel.isOpen || deathActive()) return;
  overSeen = true;
  pending = null;
  const level = state.level;
  const report = bankRun(meta, snap);
  saveMeta();
  state.gold = 0; // 정산된 재화는 지갑으로 옮겼다
  // 사망 연출 → 결과 카드 → 본부. 연출 중에도 창(modal) 상태로 둬서 사격·일시정지·director 대체 재시작이 돌지 않게 한다
  state.mode = 'modal';
  input.modalOpen = true;
  document.exitPointerLock?.();
  events.emit('ui:modal', { open: true });
  playDeath({ reason, report, level }, () => showPanel(report));
}

function launch() {
  applyToState();
  const startWave = state.start.startWave;
  attract.hide();
  panel.close();
  state.mode = 'play';
  input.modalOpen = false;
  overSeen = false;
  events.emit('ui:modal', { open: false });
  events.emit('run:start', { run: meta.totalRuns + 1, startWave });
  seedRun();
  saveMeta();
}

export const Tycoon2dSystem: System = {
  init() {
    loadMeta();
    applyToState();
    seedRun();
    panel = new TycoonPanel({
      onLaunch: launch,
      onChanged: () => { applyToState(); saveMeta(); },
      onReset: () => { resetMeta(); applyToState(); },
    });
    attract = mountAttract(() => showPanel(null));
    state.mode = 'modal';
    input.modalOpen = true;
    events.emit('ui:modal', { open: true });
    attract.show();

    // W2 가 run:over 를 내면 그대로 쓰고, 아직 없으면 사망/핵 파괴 이벤트로 대신 감지한다 (같은 프레임 안 호출 순서상 먼저 스냅샷)
    events.on('run:over', (e) => handleOver(snapshot(e.wave, e.checkpoint, e.kills, e.gold), e.reason));
    const fallback = () => { if (!pending && !panel.isOpen) pending = { snap: snapshot(state.wave, state.checkpoint, 0, state.gold), t: 0.1 }; };
    events.on('player:dead', fallback);
    // 런 경험치 → 레벨업마다 스킬 포인트 (정산 때 전부 저축)
    events.on('xp:gain', (e) => {
      if (state.phase === 'ended' || panel.isOpen) return;
      const ups = addXp(state, e.amount * bonuses(meta).xpMul);
      state.xpNext = xpToNext(state.level);
      if (ups > 0) {
        const sp = ups * RUN_XP.spPerLevel;
        state.skillPoints += sp;
        events.emit('xp:levelup', { level: state.level, skillPoints: sp });
        events.emit('toast', { text: `레벨 ${state.level}! 스킬 포인트 +${sp} (본부에서 사용)` });
      }
      changed();
    });
    events.on('core:destroyed', fallback);
    addEventListener('beforeunload', () => saveMeta());
    if (import.meta.env.DEV) (window as unknown as { __t2d: unknown }).__t2d = { meta, panel, handleOver, snapshot, launch };
  },
  update(dt) {
    if (pending) { pending.t -= dt; if (pending.t <= 0) { const p = pending; pending = null; if (!overSeen) handleOver(p.snap); } }
    // 생산 시설 수익은 게임 화면을 보고 있는 동안에만 쌓인다 (부재 중·숨긴 탭 정산 없음)
    const earning = !document.hidden;
    if (panel.isOpen) { panel.update(earning ? dt : 0); return; }
    if (earning) tick(meta, dt);
    acc += dt;
    if (acc > 5) { acc = 0; saveMeta(); }
  },
};
