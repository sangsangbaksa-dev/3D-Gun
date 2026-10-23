// 플레이어 상태. Ctx.player 로 모든 모듈에 공유된다 (다른 모듈은 읽기만, 피해는 'player:hit' 이벤트).
import { PLAYER } from '../../data';
import { MAP } from '../../data/map';

export interface Player {
  x: number; z: number;
  /** 지면 높이 (지형 높낮이). 지형이 생기기 전까지 0 */
  y: number;
  hp: number; maxHp: number;
  yaw: number; pitch: number;
  /** 무적 남은 시간 (대시, 피격 직후). 0 보다 크면 'player:hit' 을 무시한다 */
  iframes: number;
  dashT: number; dashCd: number; dashDirX: number; dashDirZ: number;
  /** 현재 이동 속도(m/s). 애니메이션용 */
  speed: number;
  moving: boolean;
  /** 우클릭 조준 중 */
  aiming: boolean;
  /** 조준 전환 0~1 (카메라 보간용) */
  aimT: number;
  dead: boolean;
  deadT: number;
  /** 사격 반동으로 올라간 시선 각도(라디안). 시간이 지나면 돌아온다 */
  kick: number;
}

export function createPlayerState(maxHp: number): Player {
  return {
    x: MAP.playerStart.x, z: MAP.playerStart.z, y: 0,
    hp: maxHp, maxHp,
    yaw: Math.PI, pitch: 0.2, // 핵을 등지고 남쪽 도로를 바라보며 시작
    iframes: 0, dashT: 0, dashCd: 0, dashDirX: 0, dashDirZ: 0,
    speed: 0, moving: false, aiming: false, aimT: 0,
    dead: false, deadT: 0, kick: 0,
  };
}

export const PLAYER_RADIUS = PLAYER.radius;
