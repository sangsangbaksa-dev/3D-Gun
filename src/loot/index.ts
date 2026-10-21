/// <reference types="vite/client" />
// 보물상자 모듈 진입점. logic(상자 규칙) 과 view(3D·DOM) 를 이어 붙이는 System.
import * as THREE from 'three';
import type { System, Ctx } from '../core/types';
import { addInteractable, removeInteractable, type Interactable } from '../core/interact';
import { obstacles, type Obstacle } from '../core/world';
import { events } from '../core/events';
import { state } from '../core/state';
import { CHEST_INTERACT_RANGE, CHEST_ODDS_RANGE, CHEST_NAMES } from '../data';
import { ChestManager } from './logic/chests';
import { bindLootEvents } from './logic/triggers';
import { mulberry32 } from './logic/rng';
import { makeChestView, updateChestView, disposeChestView, type ChestView } from './view/chestMesh';
import { BurstFx } from './view/burst';
import { LootUI } from './view/ui';

export let lootManager: ChestManager | null = null;

interface Entry { view: ChestView; act: Interactable; obs: Obstacle }

let mgr: ChestManager;
let ui: LootUI;
let fx: BurstFx;
let time = 0;
const entries = new Map<number, Entry>();

function attach(ctx: Ctx, id: number) {
  const c = mgr.chests.find((o) => o.id === id)!;
  const view = makeChestView(c);
  ctx.scene.add(view.group);
  const obs: Obstacle = { x: c.x, z: c.z, r: 0.75 };
  obstacles.push(obs);
  const act: Interactable = {
    x: c.x, z: c.z, range: CHEST_INTERACT_RANGE,
    label: () => mgr.label(c),
    press: () => { if (mgr.tryOpen(c) === 'nokey') events.emit('toast', { text: `${CHEST_NAMES[c.tier]}을 열려면 ${c.tier === 1 ? '철' : '황금'} 열쇠가 필요합니다` }); },
  };
  addInteractable(act);
  entries.set(id, { view, act, obs });
}

function detach(id: number) {
  const e = entries.get(id)!;
  removeInteractable(e.act);
  const i = obstacles.indexOf(e.obs);
  if (i >= 0) obstacles.splice(i, 1);
  disposeChestView(e.view);
  entries.delete(id);
}

export const LootSystem: System = {
  init(ctx) {
    const rng = mulberry32((Date.now() ^ 0x9e3779b9) >>> 0);
    mgr = new ChestManager(rng);
    lootManager = mgr;
    mgr.initMap();
    if (import.meta.env.DEV) (window as unknown as { __loot: ChestManager }).__loot = mgr; // 개발 중 콘솔 확인용
    bindLootEvents(mgr, rng);
    ui = new LootUI();
    fx = new BurstFx(ctx.scene);
    events.on('chest:opened', ({ tier, rarity, text }) => ui.reveal(tier, rarity, text));
  },

  update(dt, ctx) {
    time += dt;
    mgr.update(dt);

    // 로직의 상자 목록과 3D 오브젝트를 맞춘다
    const live = new Set(mgr.chests.map((c) => c.id));
    for (const id of [...entries.keys()]) if (!live.has(id)) detach(id);
    for (const c of mgr.chests) if (!entries.has(c.id)) attach(ctx, c.id);

    // 가장 가까운 닫힌 상자의 확률표
    let near: (typeof mgr.chests)[number] | null = null;
    let best = CHEST_ODDS_RANGE;
    for (const c of mgr.chests) {
      if (c.phase !== 'closed') continue;
      const d = Math.hypot(c.x - ctx.player.x, c.z - ctx.player.z);
      if (d < best) { best = d; near = c; }
    }
    ui.showOdds(near ? near.tier : -1, state.pity, near ? (near.tier === 1 ? state.keys : state.goldKeys) : 0);

    for (const c of mgr.chests) {
      const e = entries.get(c.id)!;
      updateChestView(e.view, c, time, c === near && best <= CHEST_INTERACT_RANGE);
      if (c.burst && !e.view.burstDone) { e.view.burstDone = true; fx.spawn(c.x, 0.9, c.z, c.rarity); }
    }
    fx.update(dt);
  },
};
