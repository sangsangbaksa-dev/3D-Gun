// 플레이어 모듈의 System. 입력/카메라/씬을 logic 과 view 로 이어 주는 얇은 접착층이다.
//   logic/  : 순수 TS (이동, 무기, 판정, 피격). three/DOM 없음
//   view/   : Three.js 모델·이펙트, DOM 오버레이
import * as THREE from 'three';
import { input } from '../core/input';
import { state } from '../core/state';
import { zombies } from '../core/entities';
import { getGroundY, resolveObstacles } from '../core/world';
import { GUNS } from '../data';
import { PlayerController, type FrameIntent } from './logic/controller';
import { createRng } from './logic/math';
import { magSize } from './logic/weapons';
import { Effects } from './view/effects';
import { CombatHud, UpgradePanel } from './view/hud';
import { GunSfx } from './view/sfx';
import { events } from '../core/events';
import { PlayerView } from './view/playerView';
import type { System } from '../core/types';
import type { Player } from './logic/player';

export type { Player } from './logic/player';

// game.ts 가 호출한다. 상태만 만들고, 3D 모델은 System.init 에서 만든다.
export function createPlayer(_scene?: THREE.Scene): Player {
  return controller().player;
}

/** combat=false 면 이동/카메라/모델만 동작한다. 테스트 빌드(playtest)가 자체 사격을 쓰는 동안 main.ts 에서 끈다. */
export const playerOptions = { combat: true };
/** 카메라 후처리 훅: PlayerSystem 이 카메라를 놓은 직후 순서대로 부른다 (사망 연출의 쓰러짐 기울기 등) */
export const cameraPost: ((cam: THREE.PerspectiveCamera) => void)[] = [];

let ctrl: PlayerController | null = null;
function controller() { return (ctrl ??= new PlayerController()); }

const SLOT_KEYS = ['Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6'];
const groundY = getGroundY;

let view: PlayerView, fx: Effects, hud: CombatHud, panel: UpgradePanel | undefined, prevFire = false;
let shake = 0;
const rng = createRng((Math.random() * 2 ** 32) >>> 0);
const v0 = new THREE.Vector3(), v1 = new THREE.Vector3(), v2 = new THREE.Vector3();

export const PlayerSystem: System = {
  init(ctx) {
    view = new PlayerView(ctx.scene);
    fx = new Effects(ctx.scene);
    const c = controller();
    const w = c.weapons;
    if (!playerOptions.combat) return;
    hud = new CombatHud();
    new GunSfx();
    panel = new UpgradePanel((id) => events.emit('weapon:upgrade', { weapon: id }), closePanel);
    const refresh = () => panel?.refresh();
    events.on('state:changed', refresh);
    events.on('weapon:upgraded', () => { refresh(); hud.setWeapon(w.current, w.ammo[w.current], magSize(w, state.stats), state.weapons); });
    events.on('weapon:switched', () => hud.setWeapon(w.current, w.ammo[w.current], magSize(w, state.stats), state.weapons));
    events.on('run:start', () => { if (panel?.open) closePanel(); });
    addEventListener('keydown', (e) => { if (e.code === 'Escape' && panel?.open) closePanel(); });
    hud.setWeapon(w.current, w.ammo[w.current], magSize(w, state.stats), state.weapons);
  },

  update(dt, ctx) {
    const c = controller();
    const p = c.player, w = c.weapons;
    // 포인터 잠금은 선택 사항: 잠금이 없어도 조작된다. 일시정지 중에는 core 가 update 를 호출하지 않는다.
    const playing = state.mode === 'play' && state.phase !== 'ended';

    const k = input.keys;
    const intent: FrameIntent = {
      forward: playing ? (k.has('KeyW') ? 1 : 0) - (k.has('KeyS') ? 1 : 0) : 0,
      strafe: playing ? (k.has('KeyD') ? 1 : 0) - (k.has('KeyA') ? 1 : 0) : 0,
      lookDx: state.mode === 'play' ? input.dx : 0,
      lookDy: state.mode === 'play' ? input.dy : 0,
      dash: playing && (input.pressed.has('ShiftLeft') || input.pressed.has('ShiftRight')),
      jump: playing && input.pressed.has('Space'),
      aim: playing && input.mouseRightDown,
      fire: playing && input.mouseDown,
      firePressed: playing && input.mouseDown && !prevFire,
      reload: playing && input.pressed.has('KeyR'),
      slot: null,
    };
    prevFire = input.mouseDown;
    if (panel && input.pressed.has('KeyV') && (state.mode === 'play' || panel.open)) togglePanel();
    for (let i = 0; i < SLOT_KEYS.length; i++) if (input.pressed.has(SLOT_KEYS[i])) intent.slot = i;
    const out = c.update(dt, intent, { zombies, collide: resolveObstacles, groundY, rng, canShoot: playing, combat: playerOptions.combat, view: 'first' });

    // 카메라
    const cam = ctx.camera;
    cam.fov = out.pose.fov;
    cam.updateProjectionMatrix();
    shake = Math.max(0, shake - dt * 4);
    const s = shake * shake * 0.06;
    cam.position.set(out.pose.pos.x + (Math.random() - 0.5) * s, out.pose.pos.y + (Math.random() - 0.5) * s, out.pose.pos.z + (Math.random() - 0.5) * s);
    cam.lookAt(cam.position.x + out.pose.dir.x, cam.position.y + out.pose.dir.y, cam.position.z + out.pose.dir.z);
    for (const f of cameraPost) f(cam);
    ctx.aimDir.set(out.pose.dir.x, out.pose.dir.y, out.pose.dir.z);
    ctx.world.sun.position.set(p.x + 30, 50, p.z + 20);
    ctx.world.sun.target.position.set(p.x, 0, p.z);

    view.update(dt, p, w, 'first');
    if (!playerOptions.combat) return;

    const hudOn = state.mode === 'play' && state.phase !== 'ended';
    hud.setVisible(hudOn);
    if (!hudOn) return;

    // 사격 연출
    if (out.shot) {
      const def = GUNS[out.shot.weapon];
      view.fired(w);
      const muzzle = view.muzzleWorld(w, v0);
      const mdir = view.muzzleDir(w, v1);
      shake = Math.min(1, shake + (def.kind === 'shotgun' ? 0.6 : def.kind === 'sniper' ? 1 : def.kind === 'revolver' ? 0.45 : def.kind === 'smg' ? 0.15 : 0.28));
      fx.sparks(muzzle, mdir, def.pellets > 1 ? 6 : 3);
      view.ejectWorld(w, v2);
      if (def.kind !== 'revolver') fx.casing(v2, Math.cos(p.yaw), -Math.sin(p.yaw), def.kind === 'shotgun', def.kind === 'sniper' || def.kind === 'rifle' ? 1.3 : 1);
      let best: 'hit' | 'head' | 'kill' | null = null;
      for (const pl of out.shot.pellets) {
        fx.tracer(muzzle, pl.end, def.tracer, def.kind === 'shotgun' ? 0.025 : def.kind === 'sniper' ? 0.07 : 0.04, def.kind === 'sniper' ? 400 : 220);
        if (pl.kind === 'zombie') {
          fx.blood(pl.end, { x: -out.pose.dir.x, y: 0, z: -out.pose.dir.z }, pl.kill ? 12 : 5);
          for (const a of pl.also) fx.blood(a, { x: -out.pose.dir.x, y: 0, z: -out.pose.dir.z }, a.kill ? 10 : 4);
          if (pl.kill) best = 'kill';
          else if (pl.headshot && best !== 'kill') best = 'head';
          else if (!best) best = 'hit';
        } else if (pl.kind === 'ground') fx.impact(pl.end);
      }
      if (best) hud.hitmarker(best);
    }
    if (out.switched || out.reloadDone || out.reloadStarted || out.shot) {
      hud.setWeapon(w.current, w.ammo[w.current], magSize(w, state.stats), state.weapons);
    }
    if (out.hurt) { hud.hurt(Math.min(0.4, out.hurt.dmg / 60)); shake = Math.min(1, shake + 0.55); }
    if (out.died) shake = 1;

    fx.update(dt);

    // HUD 갱신 (매 프레임 가벼운 값만)
    const rad = c.spreadNow();
    const px = Math.tan(rad) / Math.tan((out.pose.fov * Math.PI) / 360) * (innerHeight / 2);
    hud.setScope(p.aimT, GUNS[w.current].scope);
    hud.setSpread(Math.min(80, px), !p.dead);
    hud.setReload(w.reloadLeft > 0 ? 1 - w.reloadLeft / w.reloadTotal : null);
    hud.setLowHp(!p.dead && p.hp / p.maxHp <= 0.3);
    hud.setDash(p.dashCd > 0 ? 1 - p.dashCd / state.stats.dashCd : 1);
  },
};


function togglePanel() {
  if (!panel) return;
  if (panel.open) return closePanel();
  panel.show(true);
  state.mode = 'modal'; input.modalOpen = true;
  document.exitPointerLock?.();
  events.emit('ui:modal', { open: true });
}
function closePanel() {
  panel?.show(false);
  state.mode = 'play'; input.modalOpen = false;
  events.emit('ui:modal', { open: false });
}

