// logic → view 로 보내는 표현 요청. 로직은 그리지 않고 이 목록에만 쌓고, view 가 매 프레임 비운다.
// Unity: 이벤트(UnityEvent/Action) 또는 VFX 호출 지점.
import type { Zombie } from './zombie';

export type RingColor = 'warn' | 'impact' | 'scream' | 'acid';
export type Fx =
  | { k: 'spawn'; z: Zombie }
  | { k: 'hit'; z: Zombie; dmg: number }
  | { k: 'stun'; z: Zombie }
  | { k: 'wake'; z: Zombie }
  | { k: 'die'; z: Zombie; byAlly: boolean; silent?: boolean }
  | { k: 'converted'; z: Zombie }
  | { k: 'swing'; z: Zombie }
  | { k: 'ring'; x: number; z: number; r: number; t: number; color: RingColor }
  | { k: 'gas'; x: number; z: number; r: number; t: number; kind: 'gas' | 'acid' }
  | { k: 'proj'; x: number; z: number; tx: number; tz: number; t: number; kind: 'acid' }
  | { k: 'blast'; x: number; z: number; r: number; kind: 'bomb' | 'acid' | 'slam' }
  | { k: 'roar'; z: Zombie };
