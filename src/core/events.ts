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
  // 런 흐름: 사망/핵 파괴 → run:over → (2D 업그레이드 타이쿤) → run:start → 모든 모듈이 런 상태 초기화
  'run:over': { wave: number; checkpoint: number; kills: number; gold: number; reason: 'player' | 'core' };
  'run:start': { run: number; startWave: number };    // tycoon2d 가 "출격" 때 발행. 모듈은 자기 런 상태를 비운다
  'interact:prompt': { text: string | null };        // interact.ts → UI 가 'E ...' 안내 표시
  // player
  'player:hit': { dmg: number; x: number; z: number }; // 누군가 플레이어를 공격 → player 가 무적/체력 처리
  'weapon:fired': { weapon: string; ammo: number; mag: number };
  'player:hp': { hp: number; maxHp: number };          // 체력이 바뀔 때마다 (HUD)
  'player:respawn': { x: number; z: number };          // 되살아남 (자동 부활 또는 enemies 가 hp 를 채웠을 때)
  'weapon:ammo': { weapon: string; ammo: number; mag: number; reloading: boolean }; // 교체/재장전/발사 후 탄약 표시용
  'weapon:reload': { weapon: string; duration: number };
  'weapon:switched': { weapon: string };
  'weapon:upgrade': { weapon: string };              // UI/상점이 총기 강화를 요청하면 player 가 비용을 내고 레벨을 올린다
  'weapon:upgraded': { weapon: string; level: number };
  /** 효과음 훅: W7 오디오가 구독해 실제 소리로 바꿀 수 있다. 기본 합성음은 player/view/sfx.ts */
  'weapon:sound': { weapon: string; kind: 'fire' | 'dry' | 'reload' | 'reloadDone' | 'switch' | 'hit' | 'kill' | 'headshot' };
  'weapon:unlock': { weapon: string };               // 무기 획득 (강화창이 코인으로 산다). player 가 state.weapons 에 넣는다
  // enemies
  'zombie:stunned': { id: number };
  'boss:spawn': { wave: number; type: string };
  'boss:dead': { wave: number; type: string };
  'wave:prep': { wave: number; time: number };        // 준비 단계 시작 (다음에 올 웨이브 번호와 준비 시간)
  'checkpoint:reset': { wave: number };               // 죽어서 체크포인트로 복귀 (wave = 다시 시작할 웨이브)
  // allies
  'zombie:converted': { id: number; type: string };  // enemies 는 이 좀비를 목록에서 빼고 메시를 넘겨준다
  'ally:dead': { id: number };
  'zombie:inject-failed': { id: number };            // 주사 실패 → enemies 가 그 좀비를 분노(이동속도 +30%) 상태로 깨운다
  'ally:spawned': { id: number; role: string };
  // gathering
  'resource:gathered': { res: string; amount: number }; // res: ResKey 또는 'samples' | 'samplesSp'
  'gather:hit': { kind: string };                    // 채집 중 타격 한 번 (효과음용: tree, rock, iron, herb, wreck)
  // loot
  'chest:opened': { tier: number; rarity: number; text: string };
  // base
  'building:placed': { id: number; kind: string };
  'building:destroyed': { id: number; kind: string };
  'core:damaged': { hp: number; maxHp: number };     // 기지 핵 피해 → UI 체력바
  'core:destroyed': undefined;                       // 핵 파괴 → enemies 가 체크포인트 복귀 처리
  'interact:lab': undefined;                         // 연구소에서 E → allies 가 백신 제작 창을 연다
  'interact:shop': undefined;                        // 상점에서 E → base 가 교환소를 연다
  // skills
  'xp:gain': { amount: number; reason: string };
  'skill:levelup': { level: number };                // 레벨업 → HUD 배너, 효과음
  'skill:bought': { id: string; lv: number };        // 스킬을 찍음
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
