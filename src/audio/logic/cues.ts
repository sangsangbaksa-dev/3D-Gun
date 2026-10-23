// 이벤트 → 효과음 매핑과 재생 간격 제한. 엔진을 모르는 순수 로직(WebAudio 는 view/synth.ts).
import type { SfxId } from '../../data';

/** 보상 등급(0 일반~3 전설) → 상자 효과음 */
export function chestCue(rarity: number): SfxId {
  return rarity >= 2 ? 'chest2' : rarity === 1 ? 'chest1' : 'chest0';
}

/** 같은 소리가 너무 자주 겹치지 않게 막는다. now 는 초 단위 시계 */
export class CueGate {
  private last = new Map<string, number>();
  allow(id: string, now: number, cooldown: number): boolean {
    const t = this.last.get(id);
    if (t !== undefined && now - t < cooldown) return false;
    this.last.set(id, now);
    return true;
  }
}

/** 전투 긴장도(0~1)에 따른 배경 드론 볼륨/필터 목표값 */
export function ambientTarget(phase: 'prep' | 'combat' | 'ended', bossAlive: boolean): { gain: number; cutoff: number } {
  if (phase === 'ended') return { gain: 0.0, cutoff: 200 };
  if (bossAlive) return { gain: 0.11, cutoff: 700 };
  return phase === 'combat' ? { gain: 0.08, cutoff: 520 } : { gain: 0.04, cutoff: 300 };
}
