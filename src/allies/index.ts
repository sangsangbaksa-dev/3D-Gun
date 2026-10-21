/// <reference types="vite/client" />
// 백신/아군 모듈 진입점. 규칙은 logic/, 그리기와 DOM 은 view/ 에 있고 여기서는 둘을 이어 준다.
import { INJECT, VACCINES, ALLY_ROLES, ALLY_ROLE_ORDER } from '../data';
import { state, changed } from '../core/state';
import { events } from '../core/events';
import { allies } from '../core/entities';
import { input } from '../core/input';
import { addInteractable } from '../core/interact';
import { resolveObstacles } from '../core/world';
import type { Ctx, System } from '../core/types';
import { updateAlly, reapDead, spawnAlly, setRole, canSetRole, countRole, syncCount, type Ally, type AllyEnv, type GatherNode } from './logic/ally';
import { injector, stunnedNear, advance, resetInject, activeTier, blockReason, chanceFor } from './logic/inject';
import { enqueueCraft, updateCraft, nextOwnedTier, craftQueue } from './logic/vaccine';
import { AllyView } from './view/allyView';
import { Fx } from './view/fx';
import { Camp } from './view/camp';
import { LabPanel } from './view/labPanel';
import { InjectHud } from './view/injectHud';
import type { ZombieRef } from '../core/entities';

let gatherProvider: () => GatherNode[] = () => [];
/** gathering 모듈의 자원 노드를 채집병에게 알려 준다. main.ts 등에서 한 번 연결한다 (docs/modules/allies.md) */
export const setGatherNodeProvider = (fn: () => GatherNode[]) => { gatherProvider = fn; };

const toast = (text: string) => events.emit('toast', { text });
const env: AllyEnv = {
  rng: Math.random,
  collide: (p, r) => resolveObstacles(p, r),
  player: () => ctxRef.player,
  gatherNodes: () => gatherProvider(),
};
let ctxRef: Ctx;
let target: ZombieRef | undefined;
let time = 0;
let fx: Fx, hud: InjectHud, camp: Camp, panel: LabPanel;
const views = new Map<number, AllyView>();
const dying: { v: AllyView; m: Ally }[] = [];
let dev: { update(dt: number): void } | null = null;

const researchers = () => countRole('researcher');

function closePanel() {
  if (!panel.open) return;
  panel.hide(); panel.closedAt = time;
  events.emit('ui:modal', { open: false });
}
let labBuilt = false;
function openPanel() {
  if (panel.open || time - panel.closedAt < 0.3) return;
  if (state.phase !== 'prep' && !labBuilt) {
    toast('전투 중에는 연구소(건설 6번)를 지은 뒤 핵·연구소에서 제작하세요');
    return;
  }
  panel.show();
  document.exitPointerLock?.();
  events.emit('ui:modal', { open: true });
}

function convert(z: ZombieRef, tier: number, chance: number) {
  events.emit('zombie:converted', { id: z.id, type: z.type });
  const a = spawnAlly(z.x, z.z, z.type, z.view);
  fx.burst(z.x, 1, z.z, 0x66ff88, 40, 6);
  fx.burst(z.x, 2, z.z, 0xe9ff7a, 14, 4);
  hud.flash('아군 영입!', `${VACCINES[tier].name} 성공 (${Math.round(chance * 100)}%) · ${ALLY_ROLES[a.role].name} 배치`, '#7dffa0');
  toast(`좀비가 우리 편이 됐다! (${ALLY_ROLES[a.role].name})`);
}

function fail(z: ZombieRef, tier: number, chance: number) {
  events.emit('zombie:inject-failed', { id: z.id });
  fx.burst(z.x, 1, z.z, 0xff5555, 24, 5);
  hud.flash('주사 실패…', `${VACCINES[tier].name} 소모 (성공률 ${Math.round(chance * 100)}%) · 좀비가 깨어난다!`, '#ff7a7a');
  toast('백신이 듣지 않았다! 좀비가 분노한다');
}

const injectable = {
  get x() { return target?.x ?? 1e6; },
  get z() { return target?.z ?? 1e6; },
  range: INJECT.range,
  label(): string | null {
    if (!target || target.dead || !target.stunned) return null;
    const b = blockReason();
    if (b === 'nostock') return '백신이 없다 — 연구소에서 제작하자';
    if (b === 'cap') return `아군 상한에 도달 (${state.allyCount}) — 숙소·스킬로 늘리자`;
    return `E 길게 눌러 ${VACCINES[activeTier()].name} 주사 · 성공률 ${Math.round(chanceFor(target) * 100)}% · C 백신 변경`;
  },
  press() {
    const b = blockReason();
    if (b === 'nostock') toast('백신이 없다. 연구소에서 만들어 오자');
    else if (b === 'cap') toast('아군이 가득 찼다');
  },
  hold(dt: number) {
    if (!target || target.dead || !target.stunned || blockReason() !== 'none') return;
    const z = target;
    const r = advance(dt, z, Math.random());
    if (r.kind === 'success') convert(z, r.tier, r.chance);
    else if (r.kind === 'fail') fail(z, r.tier, r.chance);
  },
};

export const AlliesSystem: System = {
  init(ctx) {
    ctxRef = ctx;
    fx = new Fx(ctx.scene); camp = new Camp(ctx.scene); hud = new InjectHud();
    panel = new LabPanel({
      craft: (tier) => { if (!enqueueCraft(tier)) toast('재료가 부족하다'); },
      setRole: (id, role) => {
        const a = (allies as Ally[]).find((x) => x.id === id);
        if (a && !setRole(a, role)) toast(`${ALLY_ROLES[role].name}은(는) 더 배치할 수 없다`);
      },
      close: closePanel,
    });
    addInteractable(injectable);
    events.on('interact:lab', openPanel);
    events.on('building:placed', ({ kind }) => { if (kind === 'lab') labBuilt = true; });
    events.on('wave:prep', ({ wave }) => {
      if (wave === 1) toast('준비 시간: B 로 포탑(1·2) · 핵 L 백신 제작 · 좀비 처치로 샘플');
      else if (wave % 3 === 0 && state.vaccines.every((n) => n === 0) && state.samples >= 1) toast('백신이 비었어요 — L 키로 제작');
    });
    events.on('player:hit', () => {
      if (injector.progress > 0.05) toast('주사가 취소됐다!');
      resetInject();
    });
    // 새 런: 아군·백신·샘플·제작 대기열을 모두 비운다 (docs/COORDINATION.md 1-e)
    events.on('run:start', () => {
      closePanel();
      labBuilt = false;
      resetInject();
      injector.tier = -1;
      craftQueue.length = 0;
      for (const a of allies as Ally[]) a.dead = true;
      allies.length = 0;
      for (const v of views.values()) v.dispose();
      views.clear();
      for (const d of dying) d.v.dispose();
      dying.length = 0;
      state.allyCount = 0;
      state.vaccines = [0, 0, 0];
      state.samples = 0; state.samplesSp = 0;
      changed();
    });
    addEventListener('keydown', (e) => { if (e.code === 'Escape') closePanel(); });
    if (import.meta.env.DEV && location.hash.includes('allies-dev')) {
      import('./view/devHarness').then((m) => { dev = m.startDevHarness(ctx); });
    }
  },

  update(dt, ctx) {
    time += dt;
    // 이번 프레임 주사 대상
    target = stunnedNear(ctx.player.x, ctx.player.z, INJECT.range + 0.8);
    // E 를 놓았거나 대상이 바뀌면 주사 취소 (hold 는 눌리는 동안에만 불린다)
    if (!injector.heldThisFrame && injector.progress > 0) resetInject();
    injector.heldThisFrame = false;

    if (state.mode !== 'modal' && !panel.open) {
      if (input.pressed.has('KeyL')) openPanel();
      if (input.pressed.has('KeyC')) {
        const t = nextOwnedTier(injector.tier < 0 ? -1 : injector.tier);
        if (t < 0) toast('보유한 백신이 없다');
        else { injector.tier = t; toast(`${VACCINES[t].name} 선택 (보유 ${state.vaccines[t]})`); }
      }
      if (input.pressed.has('KeyQ')) {
        let best: Ally | undefined, bd = 36;
        for (const a of allies as Ally[]) {
          const d = (a.x - ctx.player.x) ** 2 + (a.z - ctx.player.z) ** 2;
          if (!a.dead && d < bd) { bd = d; best = a; }
        }
        if (!best) toast('가까운 아군이 없다');
        else {
          const i = ALLY_ROLE_ORDER.indexOf(best.role);
          for (let k = 1; k <= ALLY_ROLE_ORDER.length; k++) {
            const r = ALLY_ROLE_ORDER[(i + k) % ALLY_ROLE_ORDER.length];
            if (canSetRole(best, r)) { setRole(best, r); toast(`좀비 #${best.id} → ${ALLY_ROLES[r].name}`); break; }
          }
        }
      }
    }

    for (const tier of updateCraft(dt, researchers())) {
      toast(`${VACCINES[tier].name} 제작 완료!`);
      fx.burst(ctx.player.x, 2, ctx.player.z, 0x9dffb5, 10, 3);
    }

    dev?.update(dt);
    for (const a of allies as Ally[]) updateAlly(a, dt, env);
    for (const dead of reapDead()) {
      const v = views.get(dead.id);
      if (v) { views.delete(dead.id); dying.push({ v, m: dead }); }
      toast('아군이 쓰러졌다…');
      fx.burst(dead.x, 1, dead.z, 0x9aa5a0, 12, 3);
    }
    syncCount();
    for (const a of allies as Ally[]) if (!views.has(a.id)) views.set(a.id, new AllyView(a, ctx.scene));
    for (const v of views.values()) v.update(dt, ctx.camera);
    for (let i = dying.length - 1; i >= 0; i--) if (dying[i].v.update(dt, ctx.camera)) dying.splice(i, 1);
    camp.sync(gatherProvider().length === 0 && countRole('gatherer') > 0);

    if (injector.progress > 0 && target) {
      fx.beam(target.x, target.z, injector.progress, time);
      hud.show(`<b>${VACCINES[activeTier()].name}</b> 주사 중… 성공률 ${Math.round(chanceFor(target) * 100)}%`, injector.progress);
    } else { fx.hideBeam(); hud.hide(); }
    fx.update(dt);
    panel.tick(researchers());
  },
};
