// 이동·시선·구르기(Shift). 입력은 이미 숫자로 바뀐 의도(intent)로 받는다.
import { PLAYER } from '../../data';
import { state } from '../../core/state';
import { clamp, forwardOf, rightOf } from './math';
import type { Player } from './player';

export interface MoveIntent {
  /** 앞(+1)/뒤(-1), 오른쪽(+1)/왼쪽(-1) */
  forward: number; strafe: number;
  lookDx: number; lookDy: number;
  dash: boolean;
  aim: boolean;
}

/** collide 는 장애물·맵 경계 처리(위치를 직접 보정). */
export function stepMovement(p: Player, dt: number, it: MoveIntent, dashCooldown: number, collide: (p: { x: number; z: number }, radius: number) => void) {
  p.iframes = Math.max(0, p.iframes - dt);
  p.dashCd = Math.max(0, p.dashCd - dt);
  // 연사로 쌓인 수직 반동. 쏘는 동안은 천천히만 돌아오고, 멈추면 더 빨리 내려온다
  const kickRecover = 0.85;
  p.kick = Math.max(0, p.kick - p.kick * dt * kickRecover);

  if (p.dead) { p.speed = 0; p.moving = false; p.aiming = false; p.aimT = Math.max(0, p.aimT - dt * 6); return; }

  p.yaw -= it.lookDx * PLAYER.sens * (p.aiming ? 0.7 : 1);
  p.pitch = clamp(p.pitch + it.lookDy * PLAYER.sens * (p.aiming ? 0.7 : 1), -0.6, 0.9);
  p.aiming = it.aim;
  p.aimT = clamp(p.aimT + (it.aim ? dt * 8 : -dt * 8), 0, 1);

  const f = forwardOf(p.yaw), r = rightOf(p.yaw);
  let mx = f.x * it.forward + r.x * it.strafe;
  let mz = f.z * it.forward + r.z * it.strafe;
  const len = Math.hypot(mx, mz);
  if (len > 0) { mx /= len; mz /= len; }

  if (it.dash && p.dashCd <= 0) {
    p.dashT = PLAYER.dashTime; p.iframes = Math.max(p.iframes, PLAYER.dashIframes); p.dashCd = dashCooldown;
    p.dashDirX = len > 0 ? mx : f.x; p.dashDirZ = len > 0 ? mz : f.z;
  }
  let speed = len > 0 ? PLAYER.speed * state.stats.speedMul * (p.aiming ? PLAYER.aimSpeedMul : 1) : 0;
  p.moving = len > 0;
  if (p.dashT > 0) {
    p.dashT -= dt;
    mx = p.dashDirX; mz = p.dashDirZ; speed = PLAYER.dashSpeed;
    p.moving = true;
  }
  p.x += mx * speed * dt;
  p.z += mz * speed * dt;
  collide(p, PLAYER.radius);
  p.speed = speed;
}
