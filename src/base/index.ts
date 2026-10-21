// 기지/타이쿤/디펜스 모듈 진입점. main.ts 의 systems 배열에 BaseSystem 한 줄만 등록한다.
import { addInteractable, removeInteractable, type Interactable } from '../core/interact';
import { events } from '../core/events';
import { state } from '../core/state';
import { zombies } from '../core/entities';
import { obstacles } from '../core/world';
import type { Ctx, System } from '../core/types';
import { createBase, type Action, type Building, type BaseModel } from './logic/base';
import { BuildOverlay } from './view/overlay';
import { BaseView } from './view/baseView';
import { BuildController } from './view/build';
import { BasePanels } from './view/panels';
import { MAP } from '../data/map';
import { CORE } from '../data';

let model: BaseModel;
let view: BaseView;
let build: BuildController;
let panels: BasePanels;
let overlay: BuildOverlay;
const links = new Map<Building, Interactable>();
let canvas: HTMLElement | null = null;

const labelOf = (a: Action | null) => (a ? `E ${a.label}` : null);
const playable = () => state.mode === 'play' && state.phase !== 'ended';

function linkFor(b: Building): Interactable {
  return {
    x: b.x, z: b.z, range: b.radius + 2.4,
    label: () => (playable() ? labelOf(model.actionFor(b)) : null),
    press: () => { const a = model.actionFor(b); if (a) model.perform(b, a); },
  };
}

export const BaseSystem: System = {
  init(ctx: Ctx) {
    model = createBase({ obstacles, rng: Math.random });
    canvas = document.getElementById('c');
    overlay = new BuildOverlay(ctx.scene);
    view = new BaseView(ctx.scene, ctx.camera, model);
    panels = new BasePanels();
    build = new BuildController(ctx.scene, model, panels, overlay);
    if ((import.meta as unknown as { env?: { DEV?: boolean } }).env?.DEV) (window as unknown as Record<string, unknown>).__base = { model, ctx, build, panels };

    // 핵: 가까이 가서 E 로 수리/강화
    addInteractable({
      x: MAP.core.x, z: MAP.core.z, range: CORE.radius + 3,
      label: () => (playable() ? labelOf(model.coreAction()) : null),
      press: () => {
        const a = model.coreAction();
        if (!a) return;
        if (a.kind === 'repair') model.repairCore(); else model.upgradeCore();
      },
    });

    events.on('interact:shop', () => {
      if (state.mode !== 'play') return;
      panels.openShop();
      state.mode = 'modal';
      events.emit('ui:modal', { open: true });
    });
    panels.onShopClose = () => { if (state.mode === 'modal') state.mode = 'play'; events.emit('ui:modal', { open: false }); canvas?.requestPointerLock?.(); };
    events.on('state:changed', () => panels.refreshShop());
    events.on('building:placed', ({ kind }) => { if (kind === 'barracks') events.emit('toast', { text: '숙소 완공! 아군 상한 +3' }); });
  },

  update(dt, ctx) {
    model.update(dt, zombies);
    // 건물 ↔ 상호작용 등록 동기화
    for (const b of model.buildings) if (!links.has(b)) { const l = linkFor(b); links.set(b, l); addInteractable(l); }
    for (const [b, l] of links) if (b.dead) { removeInteractable(l); links.delete(b); }
    build.update(dt, ctx);
    view.update(dt);
    overlay.update(performance.now() / 1000);
  },
};

/** 저장/불러오기 훅 (Phase 2 에서 총괄이 localStorage 와 연결) */
export const baseSave = () => model.save();
export const baseLoad = (s: Parameters<BaseModel['load']>[0]) => model.load(s);
