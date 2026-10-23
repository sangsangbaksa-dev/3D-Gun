/// <reference types="vite/client" />
// 상자 가챠는 제거되었다. 코인은 좀비 처치로만 들어오고, 이 시스템은 상자를 만들지 않는다.
import type { System } from '../core/types';

/** 예전 코드가 이 값을 읽어도 상자 관리자는 없다. */
export const lootManager = null;

export const LootSystem: System = {
  init() {},
  update() {},
};
