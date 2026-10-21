// 카메라 자세 계산 (숫자만). view 가 이 값을 three 카메라에 적용한다.
// 'first' 는 눈높이, 'third' 는 어깨 너머. 기본은 1인칭.
import { lerp, type Vec3 } from './math';
import type { Player } from './player';

export interface CameraPose { pos: Vec3; dir: Vec3; fov: number }
export type CameraView = 'first' | 'third';

const BACK = 4.8, BACK_AIM = 3.5, SIDE = 1.3, SIDE_AIM = 1.1, FOV = 70, FOV_AIM = 56, DASH_FOV = 9;
const EYE = 1.62;
/** 시선 방향으로 살짝 밀어 카메라가 머리 안에 들어가지 않게 한다 */
const EYE_NUDGE = 0.25;

/** adsFov: 지금 든 총의 조준 시야각. view 기본값은 1인칭 */
export function cameraPose(p: Player, adsFov = FOV_AIM, view: CameraView = 'first'): CameraPose {
  // pitch 양수 = 아래로 내려다봄. kick 은 반동으로 시선이 위로 튀는 양
  const pitch = p.pitch - p.kick;
  const cp = Math.cos(pitch);
  const dir = { x: -Math.sin(p.yaw) * cp, y: -Math.sin(pitch), z: -Math.cos(p.yaw) * cp };
  const fov = lerp(FOV, adsFov, p.aimT) + (p.dashT > 0 ? DASH_FOV : 0);
  if (view === 'first') {
    return {
      pos: {
        x: p.x + dir.x * EYE_NUDGE,
        y: p.y + EYE + dir.y * EYE_NUDGE,
        z: p.z + dir.z * EYE_NUDGE,
      },
      dir,
      fov,
    };
  }
  const back = lerp(BACK, BACK_AIM, p.aimT), side = lerp(SIDE, SIDE_AIM, p.aimT);
  const rx = Math.cos(p.yaw), rz = -Math.sin(p.yaw);
  const pos = {
    x: p.x - dir.x * back + rx * side,
    y: Math.max(p.y + 0.5, p.y + 1.6 - dir.y * back),
    z: p.z - dir.z * back + rz * side,
  };
  return { pos, dir, fov };
}

/** 조준 광선의 시작점. 1인칭은 눈(카메라), 3인칭은 카메라 광선 위에서 가슴에 가장 가까운 점 */
export function aimOrigin(pose: CameraPose, p: Player, view: CameraView = 'first'): Vec3 {
  if (view === 'first') return { x: pose.pos.x, y: pose.pos.y, z: pose.pos.z };
  const cx = p.x - pose.pos.x, cy = p.y + 1.3 - pose.pos.y, cz = p.z - pose.pos.z;
  const t = Math.max(0, cx * pose.dir.x + cy * pose.dir.y + cz * pose.dir.z);
  return { x: pose.pos.x + pose.dir.x * t, y: pose.pos.y + pose.dir.y * t, z: pose.pos.z + pose.dir.z * t };
}
