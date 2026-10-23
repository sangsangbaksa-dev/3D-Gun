// 채집 모듈 연결부: logic(규칙) ↔ core(상태, 이벤트, 상호작용) ↔ view(Three.js).
// 이 파일과 view/ 는 Unity 에서 다시 만들고, logic/ 은 C# 으로 번역한다.
import type { System } from '../core/types';
import { state, gain, changed } from '../core/state';
import { events } from '../core/events';
import { addInteractable, removeInteractable, type Interactable } from '../core/interact';
import { gatherNodes, type GatherNodeRef } from '../core/entities';
import { getGroundY, obstacles, type Obstacle } from '../core/world';
import { MAP } from '../data/map';
import { GATHER_LAYOUT, GATHER_NODES, GATHER_REACH } from '../data';
import { mulberry32 } from './logic/rng';
import { blockRadius, createGathering, harvest, resetGathering, rollSampleDrop, tick, type GatheringModel } from './logic/gathering';
import type { GatherNode } from './logic/nodes';
import { createGatheringView, type GatheringView } from './view/gatheringView';

const groundY = getGroundY;

let model: GatheringModel;
let view: GatheringView;
let obstacleOf: Map<number, Obstacle>;
const interactables: Interactable[] = [];
const refs: GatherNodeRef[] = [];
let alive = false;
const byId = new Map<number, GatherNode>();

const rng = Math.random; // 게임 진행용 난수(드롭, 재생성 시간). 맵 배치는 시드 고정

/** 플레이어가 노드를 채집해서 자원을 얻는다. */
function award(res: GatherNode['res'], amount: number) {
  gain(res, amount);
  events.emit('resource:gathered', { res, amount });
}

export const GatheringSystem: System = {
  init(ctx) {
    alive = true;
    model = createGathering(mulberry32(GATHER_LAYOUT.seed), MAP);
    byId.clear();
    model.nodes.forEach((n) => byId.set(n.id, n));
    view = createGatheringView(ctx.scene, model, groundY);
    obstacleOf = new Map();

    for (const n of model.nodes) {
      const def = GATHER_NODES[n.kind];
      const ob: Obstacle = { x: n.x, z: n.z, r: blockRadius(n) };
      obstacles.push(ob);
      obstacleOf.set(n.id, ob);

      const it: Interactable = {
        x: n.x, z: n.z,
        range: n.r + GATHER_REACH,
        label: () => (n.state === 'ready' && state.mode === 'play' && state.phase !== 'ended' ? `E 길게 눌러 ${def.verb}` : null),
        hold: (dt) => {
          const r = harvest(model, n, dt, state.stats.gatherSpeed, state.stats.gatherExtra, rng);
          if (r) award(r.res, r.amount);
        },
      };
      addInteractable(it);
      interactables.push(it);

      const ref: GatherNodeRef = {
        id: n.id, kind: n.kind, res: n.res, x: n.x, z: n.z, radius: n.r,
        get ready() { return n.state === 'ready'; },
        harvest: (dt, speedMul) => {
          const r = harvest(model, n, dt, speedMul, state.stats.gatherExtra, rng);
          return r ? { res: r.res, amount: r.amount } : null;
        },
      };
      gatherNodes.push(ref);
      refs.push(ref);
    }

    // 새 런: 노드 재생성, 채집 진행 초기화 (자원/샘플 수치는 state 초기화 쪽이 맡는다)
    events.on('run:start', () => {
      if (!alive) return;
      resetGathering(model);
      view.reset();
    });

    // 좀비 처치 → 샘플 드롭 (처치자가 아군이어도 받는다)
    events.on('enemy:killed', (e) => {
      if (!alive) return;
      const drop = rollSampleDrop(e.type, rng);
      if (!drop) return;
      if (drop.special) state.samplesSp += drop.amount; else state.samples += drop.amount;
      changed();
      events.emit('resource:gathered', { res: drop.special ? 'samplesSp' : 'samples', amount: drop.amount });
      view.floatText(e.x, 1.9, e.z, `+${drop.amount} ${drop.special ? '특수 샘플' : '샘플'}`, drop.special ? '#e58cff' : '#8fe8d0');
    });
  },

  update(dt, ctx) {
    tick(model, dt);

    // 다른 시스템(임시 playtest)이 obstacles 를 비우고 다시 만들 수 있으므로 빠졌으면 다시 등록한다
    const first = obstacleOf.get(model.nodes[0]?.id ?? -1);
    if (first && !obstacles.includes(first)) for (const ob of obstacleOf.values()) obstacles.push(ob);

    // 고갈/재생성에 따라 충돌 반경 갱신
    for (const n of model.nodes) {
      const ob = obstacleOf.get(n.id)!;
      const r = blockRadius(n);
      if (ob.r !== r) ob.r = r;
    }

    // 가장 가까운 채집 가능 노드 = 링/막대를 보여 줄 대상
    let focus: GatherNode | null = null;
    if (state.mode === 'play') {
      let best = Infinity;
      const { x, z } = ctx.player;
      for (const n of model.nodes) {
        if (n.state !== 'ready') continue;
        const d = Math.hypot(n.x - x, n.z - z);
        if (d <= n.r + GATHER_REACH && d < best) { best = d; focus = n; }
      }
    }

    const evs = model.events;
    for (const e of evs) if (e.t === 'hit') {
      const n = byId.get(e.id);
      if (n) events.emit('gather:hit', { kind: n.kind });
    }
    view.update(dt, ctx.camera, ctx.player, focus, evs);
    evs.length = 0;
  },

  dispose() {
    for (const it of interactables) removeInteractable(it);
    for (const ob of obstacleOf.values()) { const i = obstacles.indexOf(ob); if (i >= 0) obstacles.splice(i, 1); }
    for (const r of refs) { const i = gatherNodes.indexOf(r); if (i >= 0) gatherNodes.splice(i, 1); }
    interactables.length = 0; refs.length = 0;
    alive = false;
    view.dispose();
  },
};
