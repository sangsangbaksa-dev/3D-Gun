// W2 좀비/웨이브/보스: System 진입점. logic(EnemySim, WaveDirector)과 view(EnemyView)를 이어 준다.
import type { System } from '../core/types';
import { input } from '../core/input';
import { state } from '../core/state';
import { resolveObstacles } from '../core/world';
import * as worldNs from '../core/world';
import { EnemySim } from './logic/sim';
import { WaveDirector } from './logic/director';
import { mulberry32 } from './logic/rng';
import { EnemyView, setGroundFn } from './view/enemyView';

let sim: EnemySim, director: WaveDirector, view: EnemyView;

export const EnemiesSystem: System = {
  init(ctx) {
    // 맵 담당이 world.getGroundY 를 추가하면 자동으로 지형 높이를 따른다
    const gy = (worldNs as unknown as { getGroundY?: (x: number, z: number) => number }).getGroundY;
    setGroundFn(gy ?? null);
    sim = new EnemySim({ rng: mulberry32((Date.now() ^ 0x5eed) >>> 0), player: ctx.player, collide: resolveObstacles });
    director = new WaveDirector(sim);
    view = new EnemyView(ctx.scene, ctx.camera, sim);
    director.start();
    if ((import.meta as unknown as { env?: { DEV?: boolean } }).env?.DEV) (window as unknown as Record<string, unknown>).__enemies = { sim, director, state };
  },
  update(dt, _ctx) {
    // 창이 열려 있는 동안(상점, 연구소 등)은 시간을 멈춘다
    if (state.mode !== 'modal') {
      if (input.pressed.has('KeyN')) director.callNext();
      director.update(dt);
      sim.updateRoamers(dt);
      sim.update(dt);
    }
    view.update(state.mode === 'modal' ? 0 : dt);
  },
  dispose() { view.dispose(); },
};
