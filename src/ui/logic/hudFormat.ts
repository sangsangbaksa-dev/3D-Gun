// HUD 표시용 순수 함수들 (숫자 → 문자열/비율).
export const ratio = (v: number, max: number) => (max > 0 ? Math.max(0, Math.min(1, v / max)) : 0);
export const pct = (v: number, max: number) => `${(ratio(v, max) * 100).toFixed(1)}%`;
export const int = (n: number) => Math.round(n).toLocaleString('ko-KR');

export function phaseLabel(phase: 'prep' | 'combat' | 'ended'): string {
  return phase === 'prep' ? '준비 단계' : phase === 'combat' ? '전투 중' : '종료';
}

export function mmss(sec: number): string {
  const s = Math.max(0, Math.floor(sec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

/** 체력 비율에 따른 위험 단계 (0 정상, 1 주의, 2 위험) */
export const dangerLevel = (r: number) => (r <= 0.25 ? 2 : r <= 0.5 ? 1 : 0);
