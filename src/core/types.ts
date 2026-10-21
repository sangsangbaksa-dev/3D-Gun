import type * as THREE from 'three';
import type { World } from './world';
import type { Player } from '../player/player';

/** 모든 시스템이 받는 공용 컨텍스트. 공유 객체는 여기에 추가한다. */
export interface Ctx {
  world: World;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  player: Player;
  /** 카메라 정면(조준) 방향. PlayerSystem 이 매 프레임 갱신한다. */
  aimDir: THREE.Vector3;
}

/** 기능 모듈은 System 하나를 export 하고 main.ts 의 systems 배열에 한 줄로 등록한다. */
export interface System {
  init?(ctx: Ctx): void;
  update(dt: number, ctx: Ctx): void;
  dispose?(): void;
}
