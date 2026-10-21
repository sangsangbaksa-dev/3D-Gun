// 모듈 간 느슨한 통신용 이벤트 버스. 이벤트 이름은 아래 GameEvents 에 추가한다.
export interface GameEvents {
  'wave:start': { wave: number };
  'wave:clear': { wave: number };
  'player:dead': undefined;
  'enemy:killed': { x: number; z: number; type: string; byAlly: boolean };
  'toast': { text: string };

  // ↓ 조율 문서(docs/COORDINATION.md)에서 정한 계약. 새 이벤트는 자기 모듈 블록 끝에 추가만 한다.
  // core
  'state:changed': undefined;                        // state.ts 값이 바뀜 → UI 갱신
  'ui:modal': { open: boolean };                     // 모달 열림/닫힘 → 포인터 락 해제, 입력 정지
  'game:end': { victory: boolean };                  // 엔딩 또는 게임 오버 화면
  'interact:prompt': { text: string | null };        // interact.ts → UI 가 'E ...' 안내 표시
  // player
  'player:hit': { dmg: number; x: number; z: number }; // 누군가 플레이어를 공격 → player 가 무적/체력 처리
  'weapon:fired': { weapon: string; ammo: number; mag: number };
  // enemies
  'zombie:stunned': { id: number };
  'boss:spawn': { wave: number; type: string };
  'boss:dead': { wave: number; type: string };
  'wave:prep': { wave: number; time: number };        // 준비 단계 시작 (다음에 올 웨이브 번호와 준비 시간)
  'checkpoint:reset': { wave: number };               // 죽어서 체크포인트로 복귀 (wave = 다시 시작할 웨이브)
  // allies
  'zombie:converted': { id: number; type: string };  // enemies 는 이 좀비를 목록에서 빼고 메시를 넘겨준다
  'ally:dead': { id: number };
  // gathering
  'resource:gathered': { res: string; amount: number };
  // loot
  'chest:opened': { tier: number; rarity: number; text: string };
  // base
  'building:placed': { id: number; kind: string };
  'building:destroyed': { id: number; kind: string };
  'core:damaged': { hp: number; maxHp: number };     // 기지 핵 피해 → UI 체력바
  'core:destroyed': undefined;                       // 핵 파괴 → enemies 가 체크포인트 복귀 처리
  'interact:lab': undefined;                         // 연구소에서 E → allies 가 백신 제작 창을 연다
  'interact:shop': undefined;                        // 상점에서 E → base 가 판매/열쇠 구매 창을 연다
  // skills
  'xp:gain': { amount: number; reason: string };
}

type Handler<T> = (payload: T) => void;
const handlers = new Map<string, Handler<never>[]>();

export const events = {
  on<K extends keyof GameEvents>(name: K, fn: Handler<GameEvents[K]>) {
    const list = handlers.get(name) ?? [];
    list.push(fn as Handler<never>);
    handlers.set(name, list);
  },
  emit<K extends keyof GameEvents>(name: K, payload: GameEvents[K]) {
    handlers.get(name)?.forEach((fn) => (fn as Handler<GameEvents[K]>)(payload));
  },
};
