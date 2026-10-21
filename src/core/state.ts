// 공유 게임 상태. 모듈끼리 직접 import 하지 않고 여기와 events 로만 데이터를 주고받는다.
// 필드는 추가만 한다. 바꾸면 changed() 로 알려 UI 가 다시 그리게 한다.
import { RES_KEYS, calcStats, type ResKey, type Stats } from '../data';
import { events } from './events';

export const state = {
  wave: 0,
  phase: 'prep' as 'prep' | 'combat' | 'ended',
  /** build: 건설 모드(B). 숫자키가 건물 선택이 되므로 무기 교체·사격을 멈춘다. modal: 창이 열림 */
  mode: 'play' as 'play' | 'build' | 'modal',
  gold: 0,
  keys: 0,        // 철 상자 열쇠
  goldKeys: 0,    // 황금 상자 열쇠
  res: Object.fromEntries(RES_KEYS.map((k) => [k, 0])) as Record<ResKey, number>,
  samples: 0,     // 좀비 샘플 (일반/달리기/뚱보)
  samplesSp: 0,   // 특수 샘플 (보스)
  vaccines: [0, 0, 0] as number[], // 초급/중급/고급 보유 수
  xp: 0,
  skillPoints: 0,
  skillLv: {} as Record<string, number>,
  pity: 0,        // 상자 천장 카운터
  weapons: ['pistol'] as string[], // 보유 무기 (상자 보상으로 늘어남. 소유: player 가 읽고 loot 가 추가)
  /** 총기별 강화 레벨 (소유: player) */
  weaponLv: {} as Record<string, number>,
  costumes: [] as string[],        // 모은 아군 코스튬 (꾸미기용, 소유: loot)
  /** 기지 핵(디펜스 목표). 소유: base. 0이 되면 패배 처리는 enemies 가 한다 */
  coreHp: 500,
  coreMaxHp: 500,
  allyCount: 0,
  allyCapBonus: 0, // 건물(숙소) 보너스. 최종 상한 = stats.allyCap + allyCapBonus
  stats: calcStats({}) as Stats,
  /** 런 간 영구 보정. tycoon2d 가 런 시작 때 등록한다. recalcStats() 가 skillLv 계산 뒤에 적용 */
  statMods: [] as Array<(s: Stats) => void>,
  /** 런 시작 보너스. tycoon2d 가 채우고 각 모듈이 `run:start` 때 읽는다 */
  start: { gold: 0, startWave: 1, res: {} as Partial<Record<ResKey, number>>, coreHp: 0, prepBonus: 0 },
  // enemies 가 갱신: 준비 단계 남은 시간(초), 이번 웨이브에서 남은 좀비 수(스폰 대기 포함), 마지막 체크포인트 웨이브
  prepLeft: 0,
  waveRemaining: 0,
  checkpoint: 0,
};

/** 스킬 레벨이 바뀐 뒤 호출. state.stats 를 다시 계산한다. */
export function recalcStats() {
  state.stats = calcStats(state.skillLv);
  for (const mod of state.statMods) mod(state.stats); // 영구 업그레이드(meta) 보정
  changed();
}

/** 자원을 지불할 수 있으면 차감하고 true. */
export function spend(cost: Partial<Record<ResKey, number>>, gold = 0): boolean {
  if (state.gold < gold) return false;
  for (const k of RES_KEYS) if ((cost[k] ?? 0) > state.res[k]) return false;
  for (const k of RES_KEYS) state.res[k] -= cost[k] ?? 0;
  state.gold -= gold;
  changed();
  return true;
}

export function gain(k: ResKey, n: number) {
  state.res[k] += n;
  changed();
}

export function changed() {
  events.emit('state:changed', undefined);
}
