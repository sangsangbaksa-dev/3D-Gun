// 토스트 대기열. 시간(dt)만 받아 상태를 바꾸는 순수 로직이라 view 와 분리된다.
export type ToastKind = 'info' | 'good' | 'warn' | 'bad';
export interface ToastItem { id: number; text: string; kind: ToastKind; age: number; ttl: number; count: number }

export class ToastQueue {
  items: ToastItem[] = [];
  private nextId = 1;
  constructor(private max = 5, private ttl = 3.6, private mergeWindow = 1.2) {}

  /** 같은 문구가 막 나왔다면 새로 만들지 않고 횟수만 올린다 */
  push(text: string, kind: ToastKind = 'info'): ToastItem {
    const dup = this.items.find((t) => t.text === text && t.age < this.mergeWindow);
    if (dup) { dup.count++; dup.age = 0; return dup; }
    const t: ToastItem = { id: this.nextId++, text, kind, age: 0, ttl: this.ttl, count: 1 };
    this.items.push(t);
    while (this.items.length > this.max) this.items.shift();
    return t;
  }

  /** 시간 경과. 사라진 항목 id 목록을 돌려준다 */
  update(dt: number): number[] {
    const gone: number[] = [];
    for (const t of this.items) t.age += dt;
    this.items = this.items.filter((t) => (t.age < t.ttl ? true : (gone.push(t.id), false)));
    return gone;
  }
}
