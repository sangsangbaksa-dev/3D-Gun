// 채집 규칙: 진행도, 고갈, 재생성, 샘플 드롭. three/DOM/core 를 import 하지 않는 순수 TS.
// 밖(게임 연결부)은 harvest()/tick() 의 반환값과 model.events 만 읽는다.
import { GATHER_DECAY, GATHER_IDLE_GRACE, GATHER_NODES, SAMPLE_DROPS, type ResKey } from '../../data';
import { generateLayout, type GatherNode, type LayoutMap } from './nodes';
import { randInt, randRange, type Rng } from './rng';

/** 표현 계층(이펙트, 소리)이 소비하는 이벤트. 한 프레임마다 비운다 */
export type GatherEvent =
  | { t: 'hit'; id: number }
  | { t: 'done'; id: number; res: ResKey; amount: number; extra: boolean }
  | { t: 'respawn'; id: number };

export interface GatherResult { id: number; res: ResKey; amount: number; extra: boolean }

export interface GatheringModel {
  nodes: GatherNode[];
  events: GatherEvent[];
}

export function createGathering(layoutRng: Rng, map: LayoutMap): GatheringModel {
  return { nodes: generateLayout(layoutRng, map), events: [] };
}

/** 이 프레임에 채집을 하고 있지 않은 노드의 진행도 감소, 재생성 타이머. */
export function tick(m: GatheringModel, dt: number): void {
  for (const n of m.nodes) {
    n.idle += dt;
    if (n.state === 'depleted') {
      n.respawnT -= dt;
      if (n.respawnT <= 0) { n.state = 'ready'; n.progress = 0; m.events.push({ t: 'respawn', id: n.id }); }
    } else if (n.progress > 0 && n.idle > GATHER_IDLE_GRACE) {
      n.progress = Math.max(0, n.progress - GATHER_DECAY * dt);
    }
  }
}

/**
 * E 를 누르고 있는 동안 매 프레임 호출. 끝나면 결과를 돌려주고 노드를 고갈시킨다.
 * 지급(자원 증가)은 호출한 쪽이 한다: 플레이어는 곧바로 gain(), 아군은 운반 후 저장고 반납.
 * @param speedMul   state.stats.gatherSpeed
 * @param extraChance state.stats.gatherExtra (추가 +1 획득 확률)
 */
export function harvest(m: GatheringModel, n: GatherNode, dt: number, speedMul: number, extraChance: number, rng: Rng): GatherResult | null {
  if (n.state !== 'ready') return null;
  const def = GATHER_NODES[n.kind];
  n.idle = 0;
  n.progress += (dt * speedMul) / def.work;
  n.hitT -= dt;
  if (n.hitT <= 0) { n.hitT = 0.26; m.events.push({ t: 'hit', id: n.id }); }
  if (n.progress < 1) return null;

  const extra = rng() < extraChance;
  const amount = randInt(rng, def.yieldMin, def.yieldMax) + (extra ? 1 : 0);
  n.state = 'depleted';
  n.progress = 0;
  n.respawnT = randRange(rng, def.respawnMin, def.respawnMax);
  m.events.push({ t: 'done', id: n.id, res: n.res, amount, extra });
  return { id: n.id, res: n.res, amount, extra };
}

/** 지금 충돌 반경 (고갈되면 그루터기/잔해 크기로 줄어든다) */
export function blockRadius(n: GatherNode): number {
  return n.state === 'ready' ? n.r : n.r * GATHER_NODES[n.kind].depletedBlock;
}

/** 좀비 처치 샘플. 못 얻으면 null. type 은 ZType 문자열, 모르면 normal 로 본다 */
export function rollSampleDrop(type: string, rng: Rng): { special: boolean; amount: number } | null {
  const d = SAMPLE_DROPS[type] ?? SAMPLE_DROPS.normal;
  if (rng() >= d.chance) return null;
  return { special: d.special, amount: randInt(rng, d.min, d.max) };
}

/** 새 런 시작: 모든 노드를 채집 가능 상태로 되돌린다 (배치는 같은 시드라 그대로). */
export function resetGathering(m: GatheringModel): void {
  for (const n of m.nodes) { n.state = 'ready'; n.progress = 0; n.idle = 99; n.hitT = 0; n.respawnT = 0; }
  m.events.length = 0;
}

// ── 저장/불러오기 (Phase 2 에서 localStorage 에 연결) ─────────────────
export interface GatheringSave { nodes: { id: number; depleted: boolean; respawnT: number }[] }

export function saveGathering(m: GatheringModel): GatheringSave {
  return { nodes: m.nodes.map((n) => ({ id: n.id, depleted: n.state === 'depleted', respawnT: n.respawnT })) };
}

export function loadGathering(m: GatheringModel, s: GatheringSave): void {
  const byId = new Map(s.nodes.map((x) => [x.id, x]));
  for (const n of m.nodes) {
    const x = byId.get(n.id);
    if (!x) continue;
    n.state = x.depleted ? 'depleted' : 'ready';
    n.respawnT = x.respawnT;
    n.progress = 0;
  }
}
