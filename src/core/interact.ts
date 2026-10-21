// E 상호작용 공용 처리. 채집 노드, 상자, 기절 좀비, 연구소, 상점이 모두 E 를 쓰므로
// 각 모듈은 여기에 등록만 하고, 가장 가까운 하나만 반응한다.
import { input } from './input';
import { events } from './events';
import type { System } from './types';

export interface Interactable {
  x: number; z: number;
  /** 반응 거리 */
  range: number;
  /** 화면에 띄울 안내 (예: 'E 나무 베기'). null 이면 지금은 상호작용 불가 */
  label(): string | null;
  /** E 를 누른 순간 */
  press?(): void;
  /** E 를 누르고 있는 동안 매 프레임 (채집처럼 길게 누르는 동작) */
  hold?(dt: number): void;
}

const list = new Set<Interactable>();
export const addInteractable = (i: Interactable) => list.add(i);
export const removeInteractable = (i: Interactable) => list.delete(i);

let current: Interactable | null = null;
let lastLabel: string | null = null;

export const InteractSystem: System = {
  update(dt, ctx) {
    const { x, z } = ctx.player;
    current = null;
    let best = Infinity;
    for (const i of list) {
      const d = Math.hypot(i.x - x, i.z - z);
      if (d <= i.range && d < best && i.label() !== null) { best = d; current = i; }
    }
    const label = current?.label() ?? null;
    if (label !== lastLabel) { lastLabel = label; events.emit('interact:prompt', { text: label }); }
    if (!current) return;
    if (input.pressed.has('KeyE')) current.press?.();
    if (input.keys.has('KeyE')) current.hold?.(dt);
  },
};
