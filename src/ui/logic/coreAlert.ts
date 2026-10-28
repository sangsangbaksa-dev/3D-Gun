// 핵 위치 화살표와 피격 알림의 규칙 (three/DOM 을 모르는 순수 TS). Godot godot/scripts/core_alert.gd 와 같은 수치.
// 핵 체력이 줄면 경보가 켜지고, 마지막 피격 뒤 CLEAR_AFTER 초가 지나면 꺼진다.
// 체력이 50%·25% 아래로 처음 내려갈 때는 따로 강조한다. 회복해 문턱 위로 올라가면 다시 울릴 수 있다.

export const CLEAR_AFTER = 4.0;     // 마지막 피격 후 경보를 거두기까지(초)
export const ALARM_COOLDOWN = 3.0;  // 경보음 사이 최소 간격(초)
export const EMPHASIS_TIME = 2.5;   // 50%·25% 통과 강조가 이어지는 시간(초)
export const NEAR_FULL = 40;        // 이 거리 안이면 화살표가 또렷하고
export const FAR_FADE = 220;        // 이 거리 밖이면 가장 흐리다
export const MIN_ALPHA = 0.35;

export type AlertEvent = 'hit' | 'alarm' | 'half' | 'quarter';
export interface Rgb { r: number; g: number; b: number }

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

export class CoreAlert {
  active = false;
  sinceHit = 99;
  /** 0 정상, 1 체력 50% 이하를 겪음, 2 25% 이하를 겪음 */
  level = 0;
  /** 남은 강조 시간(초) */
  emphasis = 0;
  /** 강조 중인 문턱 (1 = 50%, 2 = 25%) */
  emphasisLevel = 0;
  phase = 0;
  alarmCd = 0;
  lastHp = -1;
  /** 가장 최근 공격자의 레인 번호 (-1 = 모름) */
  lane = -1;

  /** 체력이 바뀔 때마다 부른다. 일어난 일을 돌려준다. */
  onHp(hp: number, maxHp: number): AlertEvent[] {
    const ev: AlertEvent[] = [];
    const frac = clamp(hp / Math.max(1, maxHp), 0, 1);
    if (this.lastHp >= 0 && hp < this.lastHp - 0.01) {
      this.active = true;
      this.sinceHit = 0;
      ev.push('hit');
      let alarm = this.alarmCd <= 0;
      if (frac <= 0.25 && this.level < 2 && hp > 0) {
        this.level = 2; this.emphasis = EMPHASIS_TIME; this.emphasisLevel = 2;
        ev.push('quarter'); alarm = true;
      } else if (frac <= 0.5 && this.level < 1) {
        this.level = 1; this.emphasis = EMPHASIS_TIME; this.emphasisLevel = 1;
        ev.push('half'); alarm = true;
      }
      if (alarm) { this.alarmCd = ALARM_COOLDOWN; ev.push('alarm'); }
    } else if (this.lastHp >= 0 && hp > this.lastHp + 0.01) {
      if (frac > 0.5) this.level = 0;
      else if (frac > 0.25 && this.level === 2) this.level = 1;
    }
    this.lastHp = hp;
    return ev;
  }

  /** 매 프레임. 경보가 꺼지면 true. */
  update(dt: number): boolean {
    this.phase += dt;
    this.alarmCd = Math.max(0, this.alarmCd - dt);
    this.emphasis = Math.max(0, this.emphasis - dt);
    if (this.active) {
      this.sinceHit += dt;
      if (this.sinceHit >= CLEAR_AFTER) { this.active = false; return true; }
    }
    return false;
  }

  reset() {
    this.active = false; this.sinceHit = 99; this.level = 0; this.emphasis = 0;
    this.emphasisLevel = 0; this.alarmCd = 0; this.lastHp = -1; this.lane = -1;
  }

  /** 점멸 세기 0..1. 경보 중에만 0보다 크고, 처음 맞은 직후와 강조 중에 더 세다. */
  pulse(): number {
    if (!this.active) return 0;
    const base = 0.5 + 0.5 * Math.sin(this.phase * (this.emphasis > 0 ? 9 : 6));
    const fresh = clamp(1 - this.sinceHit / 1.2, 0, 1);
    return clamp(0.35 + 0.65 * base * (0.6 + 0.4 * fresh) + (this.emphasis > 0 ? 0.25 : 0), 0, 1);
  }
}

/** 플레이어가 보는 방향 기준 핵의 방위 (라디안, 0 = 정면, 양수 = 오른쪽, ±π = 뒤). (fx, fz) 는 시선의 수평 성분. */
export function bearing(px: number, pz: number, fx: number, fz: number, tx: number, tz: number): number {
  const l = Math.hypot(fx, fz);
  if (l < 0.0001) return 0;
  fx /= l; fz /= l;
  const dx = tx - px, dz = tz - pz;
  return Math.atan2(dx * -fz + dz * fx, dx * fx + dz * fz);
}

/** 방위를 화면 가장자리 점으로. 화면 중심에서 (sin, -cos) 방향 반직선이 margin 만큼 안쪽 사각형과 만나는 곳. */
export function edgePoint(angle: number, w: number, h: number, margin: number): { x: number; y: number } {
  const dx = Math.sin(angle), dy = -Math.cos(angle);
  const hx = Math.max(1, w * 0.5 - margin), hy = Math.max(1, h * 0.5 - margin);
  const k = Math.min(hx / Math.max(Math.abs(dx), 0.0001), hy / Math.max(Math.abs(dy), 0.0001));
  return { x: w * 0.5 + dx * k, y: h * 0.5 + dy * k };
}

/** 거리에 따른 투명도: 가까울수록 또렷하고 멀수록 흐리다. */
export function distanceAlpha(d: number): number {
  return lerp(1, MIN_ALPHA, clamp((d - NEAR_FULL) / (FAR_FADE - NEAR_FULL), 0, 1));
}

const TEAL: Rgb = { r: 0x2e, g: 0xe6, b: 0xd6 };
const ORANGE: Rgb = { r: 0xff, g: 0x8a, b: 0x2a };
export const ALERT_RED: Rgb = { r: 0xe0, g: 0x30, b: 0x3a };
export const mixRgb = (a: Rgb, b: Rgb, k: number): Rgb => ({ r: lerp(a.r, b.r, k), g: lerp(a.g, b.g, k), b: lerp(a.b, b.b, k) });

/** 핵 체력 비율에 따른 색: 청록 → 주황 → 빨강. */
export function hpColor(frac: number): Rgb {
  if (frac >= 0.85) return TEAL;
  if (frac >= 0.5) return mixRgb(TEAL, ORANGE, (0.85 - frac) / 0.35);
  return mixRgb(ORANGE, ALERT_RED, clamp((0.5 - frac) / 0.25, 0, 1));
}

/** (x, z) 에서 가장 가까운 레인 번호 (레인 웨이포인트 거리 기준). */
export function nearestLane(x: number, z: number, lanes: ReadonlyArray<{ waypoints: ReadonlyArray<{ x: number; z: number }> }>): number {
  let best = -1, bestD = Infinity;
  lanes.forEach((l, i) => {
    for (const p of l.waypoints) {
      const d = Math.hypot(x - p.x, z - p.z);
      if (d < bestD) { bestD = d; best = i; }
    }
  });
  return best;
}
