// 플레이어 모듈의 System. 입력/카메라/씬을 logic 과 view 로 이어 주는 얇은 접착층이다.
//   logic/  : 순수 TS (이동, 무기, 판정, 피격). three/DOM 없음
//   view/   : Three.js 모델·이펙트, DOM 오버레이
import * as THREE from 'three';
import { input } from '../core/input';
import { state } from '../core/state';
import { zombies } from '../core/entities';
import { resolveObstacles } from '../core/world';
import { WEAPONS, WEAPON_ORDER } from '../data';
import { PlayerController, type FrameIntent } from './logic/controller';
import { createRng } from './logic/math';
import { magSize } from './logic/weapons';
import { Effects } from './view/effects';
import { CombatHud } from './view/hud';
import { PlayerView } from './view/playerView';
import type { System } from '../core/types';
import type { Player } from './logic/player';

export type { Player } from './logic/player';

// game.ts 가 호출한다. 상태만 만들고, 3D 모델은 System.init 에서 만든다.
export function createPlayer(_scene?: THREE.Scene): Player {
  return controller().player;
}

let ctrl: PlayerController | null = null;
function controller() { return (ctrl ??= new PlayerController()); }

const SLOT_KEYS = ['Digit1', 'Digit2', 'Digit3'];
// TODO(맵 담당): core/world.ts 에 getGroundY 가 생기면 교체
const groundY = (_x: number, _z: number) => 0;

let view: PlayerView, fx: Effects, hud: CombatHud;
let shake = 0;
const rng = createRng((Math.random() * 2 ** 32) >>> 0);
const v0 = new THREE.Vector3(), v1 = new THREE.Vector3(), v2 = new THREE.Vector3();

export const PlayerSystem: System = {
  init(ctx) {
    view = new PlayerView(ctx.scene);
    fx = new Effects(ctx.scene);
    hud = new CombatHud();
    const c = controller();
    const w = c.weapons;
    hud.setWeapon(w.current, w.ammo[w.current], magSize(w.current, state.stats), state.weapons);
  },

  update(dt, ctx) {
    const c = controller();
    const p = c.player, w = c.weapons;
    const playing = state.mode === 'play' && input.locked && state.phase !== 'ended';

    const k = input.keys;
    const intent: FrameIntent = {
      forward: playing ? (k.has('KeyW') ? 1 : 0) - (k.has('KeyS') ? 1 : 0) : 0,
      strafe: playing ? (k.has('KeyD') ? 1 : 0) - (k.has('KeyA') ? 1 : 0) : 0,
      lookDx: state.mode === 'play' ? input.dx : 0,
      lookDy: state.mode === 'play' ? input.dy : 0,
      dash: playing && input.pressed.has('ShiftLeft'),
      aim: playing && input.mouseRightDown,
      fire: playing && input.mouseDown,
      reload: playing && input.pressed.has('KeyR'),
      slot: null,
    };
    for (let i = 0; i < SLOT_KEYS.length; i++) if (input.pressed.has(SLOT_KEYS[i])) intent.slot = i;

    const out = c.update(dt, intent, { zombies, collide: resolveObstacles, groundY, rng, canShoot: playing });

    // 카메라
    const cam = ctx.camera;
    cam.fov = out.pose.fov;
    cam.updateProjectionMatrix();
    shake = Math.max(0, shake - dt * 4);
    const s = shake * shake * 0.06;
    cam.position.set(out.pose.pos.x + (Math.random() - 0.5) * s, out.pose.pos.y + (Math.random() - 0.5) * s, out.pose.pos.z + (Math.random() - 0.5) * s);
    cam.lookAt(cam.position.x + out.pose.dir.x, cam.position.y + out.pose.dir.y, cam.position.z + out.pose.dir.z);
    ctx.aimDir.set(out.pose.dir.x, out.pose.dir.y, out.pose.dir.z);
    ctx.world.sun.position.set(p.x + 30, 50, p.z + 20);
    ctx.world.sun.target.position.set(p.x, 0, p.z);

    view.update(dt, p, w);

    // 사격 연출
    if (out.shot) {
      const def = WEAPONS[out.shot.weapon];
      view.fired(w);
      const muzzle = view.muzzleWorld(w, v0);
      const mdir = view.muzzleDir(w, v1);
      shake = Math.min(1, shake + (def.pellets > 1 ? 0.6 : out.shot.weapon === 'smg' ? 0.18 : 0.3));
      fx.sparks(muzzle, mdir, def.pellets > 1 ? 6 : 3);
      view.ejectWorld(w, v2);
      if (out.shot.weapon !== 'shotgun') fx.casing(v2, Math.cos(p.yaw), -Math.sin(p.yaw), false);
      let best: 'hit' | 'head' | 'kill' | null = null;
      for (const pl of out.shot.pellets) {
        fx.tracer(muzzle, pl.end, def.tracer, def.pellets > 1 ? 0.025 : 0.04);
        if (pl.kind === 'zombie') {
          fx.blood(pl.end, { x: -out.pose.dir.x, y: 0, z: -out.pose.dir.z }, pl.kill ? 12 : 5);
          if (pl.kill) best = 'kill';
          else if (pl.headshot && best !== 'kill') best = 'head';
          else if (!best) best = 'hit';
        } else if (pl.kind === 'ground') fx.impact(pl.end);
      }
      if (best) hud.hitmarker(best);
    }
    if (out.switched || out.reloadDone || out.reloadStarted || out.shot) {
      hud.setWeapon(w.current, w.ammo[w.current], magSize(w.current, state.stats), state.weapons);
    }
    if (out.hurt) { hud.hurt(Math.min(0.4, out.hurt.dmg / 60)); shake = Math.min(1, shake + 0.55); }
    if (out.died) shake = 1;

    fx.update(dt);

    // HUD 갱신 (매 프레임 가벼운 값만)
    const rad = c.spreadNow();
    const px = Math.tan(rad) / Math.tan((out.pose.fov * Math.PI) / 360) * (innerHeight / 2);
    hud.setSpread(Math.min(80, px), !p.dead);
    hud.setReload(w.reloadLeft > 0 ? 1 - w.reloadLeft / w.reloadTotal : null);
    hud.setLowHp(!p.dead && p.hp / p.maxHp <= 0.3);
    hud.setDash(p.dashCd > 0 ? 1 - p.dashCd / state.stats.dashCd : 1);
  },
};

export { WEAPON_ORDER };
