# 좀비/웨이브/보스 모듈 (W2, `src/enemies/`)

타워 디펜스 흐름: 준비 단계에 건설하고, 전투 단계에 4개 레인(`MAP.lanes`)으로 좀비가 몰려와 핵(`structures`의 `kind:'core'`)을 향한다. Unity 이식을 위해 `logic/`(규칙)과 `view/`(Three.js, DOM)를 나눴다. `logic/`은 `three`, `document`, `window`를 쓰지 않는다.

## 구조
| 파일 | 역할 | Unity 대응 |
|------|------|------------|
| `logic/zombie.ts` | 좀비 상태(`Zombie`), `ZombieRef` 구현, `hit()` | `Zombie` 컴포넌트의 데이터부 |
| `logic/sim.ts` | 추적·공격·기절·보스 패턴·사망·독가스·배회 좀비 (`EnemySim`) | `EnemyManager` |
| `logic/director.ts` | 웨이브 상태머신, 체크포인트, 패배 복귀 (`WaveDirector`) | `WaveManager` |
| `logic/fx.ts` | logic → view 표현 요청 큐 | `UnityEvent`/VFX 호출 |
| `logic/rng.ts` | 시드 난수 `mulberry32` | `System.Random(seed)` |
| `view/models.ts`, `view/enemyView.ts` | 모델, 애니메이션, 체력바, 데미지 숫자, 텔레그래프 링, 스폰 포털 | 프리팹, Animator, ParticleSystem, UGUI |
| `index.ts` | `EnemiesSystem` (logic과 view를 잇고 `main.ts`에 등록) | `GameManager`가 도는 서비스 |

`logic/`은 `SimDeps`(난수 `rng`, 플레이어 값 `PlayerLike`, 충돌 `collide`)를 주입받는다. 위치는 `x/z` 숫자, 방향은 `yaw` 숫자다(앞 = `-z`).

## 데이터 (`src/data/index.ts`, W2 구역)
모두 숫자·문자열·배열·객체이며 ScriptableObject/JSON으로 그대로 옮길 수 있다.
- `zombieStats(wave, type)`: `{hp, speed, dmg, scale}` (기획서 공식). `ZType = 'normal'|'runner'|'fatty'|'boss'|'king'`
- `waveCount(wave)`, `MAX_ALIVE`, `FINAL_WAVE`
- `waveMix(wave)`: 종류 비율. 달리기 3웨이브부터, 뚱보 5웨이브부터
- `isBossWave(wave)`: 10의 배수는 보스, 50은 좀비 왕, 50 이후 무한 모드에서도 10의 배수마다 보스
- `prepTime(wave)`: 준비 시간(첫 웨이브 30초, 이후 `20+wave` 초, 상한 45초)
- `CHECKPOINT_EVERY = 5`
- `ENEMY_RULES`: 기절 기준 체력 30%, 기본 기절 확률 35%, 기절 시간 8초, 분노 속도 ×1.3, 사망 자원 손실 30%, 인식 거리, 독가스, 배회 좀비 수 등
- `ZOMBIE_TUNING`(종류별 공격 간격·반경·키), `ZOMBIE_REWARD`(처치 골드/경험치)
- 레인·핵 위치는 `src/data/map.ts`의 `MAP.lanes`, `MAP.core`, `MAP.zones[].danger`를 읽는다.

## 상태 (모두 `state.ts`)
`state.wave`: 지금 싸우는(또는 준비 중인 다음) 웨이브 번호, 게임 시작 시 1. `state.phase`: `prep`/`combat`. 추가한 필드: `prepLeft`(준비 남은 시간), `waveRemaining`(남은 좀비 수, 스폰 대기 포함), `checkpoint`(마지막으로 클리어한 5의 배수 웨이브).

### 좀비 개체(`Zombie`)
`id, type, x, z, yaw, hp, maxHp, radius, height, dead, stunned, view` (이 중 `ZombieRef` 필드는 `entities.zombies`로 공개). 내부: `state`(`spawn|chase|windup|stunned|dying`), `target`, `rage`, `lane/wp`(레인 진행), 보스 패턴(`move`, `moveT`, `moveCd`), 배회용 `home`.
`view`에는 `core/humanoid`의 `Humanoid`(그룹과 머티리얼)를 넣는다. 백신 성공 시 W5가 이 핸들을 가져다 아군 모델로 쓴다.

### 상태 전이
- 웨이브: `prep`(카운트다운 또는 N 키) → `combat`(스폰 큐 소진 + 생존 0) → `wave:clear` → `wave+1`, `prep`. 5의 배수 클리어는 체크포인트 갱신.
- 좀비: `spawn`(0.8초, 땅에서 올라옴) → `chase` ⇄ `windup`(공격 준비 0.45초) → 피해. 체력이 30% 이하가 되는 타격은 확률(35% + `stats.stunBonus`)로 죽이지 않고 `stunned`(8초). 시간이 끝나거나 다른 모듈이 `stunned=false`로 풀면 분노(속도 ×1.3)로 `chase` 복귀. 아군 타격과 보스는 기절하지 않는다.
- 보스: 휘두르기 범위 피해, 슬램(1.1초 예고 링 후 범위 피해), 돌진(0.8초 조준 후 직선 돌진). 체력 50% 이하에서 쿨다운이 줄고 발광. 좀비 왕은 슬램 범위가 크고 20초(광폭 14초)마다 일반 좀비 5마리 소환.
- 뚱보는 죽으면 독가스(반경 3.2m, 4초, 0.5초마다 피해).

## 목표 선택
가까운 쪽 우선: 플레이어(16m, 보스 ×1.6), 아군(11m), 길목의 방어 건물(7m, 핵 제외). 없으면 레인 경유점을 따라 핵으로 간다. 건물은 통과하지 못하고, 가는 길을 막는 건물(바리케이드)은 부순다. `structures`에 핵이 없으면 가상 핵(`state.coreHp`)을 대신 때리고 화면에 임시 크리스털을 그린다(base가 핵을 등록하면 자동으로 꺼진다).
구역 `danger >= 2`에는 배회 좀비가 상주한다(웨이브와 무관, 플레이어에게서 90m 넘으면 정지).

## 이벤트
| 방향 | 이벤트 |
|------|--------|
| 발행 | `wave:prep`(새), `wave:start`, `wave:clear`, `enemy:killed`, `zombie:stunned`, `boss:spawn`, `boss:dead`, `game:end`(좀비 왕 처치 `victory:true`), `player:hit`(좀비 공격, 보스 범위, 독가스), `core:damaged`/`core:destroyed`(가상 핵일 때만), `checkpoint:reset`(새), `xp:gain`, `toast` |
| 구독 | `player:dead`, `core:destroyed`(체크포인트 복귀), `zombie:converted`(목록에서 빼고 모델은 씬에 남김), `boss:dead`(좀비 왕 확인) |

처치 시 `state.gold`에 골드를 더한다(`ZOMBIE_REWARD`). 웨이브 클리어 보너스 골드는 `10 + wave*2`.

## 체크포인트 복귀 (`player:dead` 또는 `core:destroyed`)
모든 좀비 제거(보상 없음) → `state.res` 30% 손실 → 핵 체력 복구 → 플레이어 체력 회복과 시작 위치 이동(무적 2초) → `state.wave = checkpoint + 1`, 준비 단계. `checkpoint:reset` 이벤트와 토스트. 건물·스킬·아군·골드는 유지.

## 다른 모듈이 알아야 할 것
- 보스 체력바(W7): `zombies`에서 `type === 'boss' || 'king'`을 찾아 `hp/maxHp`를 읽는다. 시작은 `boss:spawn`, 끝은 `boss:dead`.
- 웨이브 바로 시작: 준비 단계에 `N` 키(`index.html` 도움말과 동일).
- 모달(`state.mode === 'modal'`)이 열려 있으면 좀비 시간을 멈춘다.
- 플레이어 복귀 처리(`hp`, 위치)는 임시로 W2가 `ctx.player`에 직접 쓴다. W1이 처리하게 되면 `director.ts`의 `defeat()`에서 해당 줄을 빼면 된다.
- 개발 모드(`npm run dev`)에서만 `window.__enemies`(sim, director, state)를 열어 디버깅에 쓴다. 빌드에는 들어가지 않는다.

## C# 이식 메모
- `Zombie` → `class Zombie : MonoBehaviour`(데이터는 `ZombieData` 순수 클래스로 분리), `ZombieRef` → `IDamageable`/`ITarget` 인터페이스.
- `EnemySim`/`WaveDirector` → 순수 C# 클래스, `Update(float dt)`를 매니저가 호출. `Fx` 큐 → `event Action<FxEvent>`.
- `ENEMY_RULES`, `ZOMBIE_TUNING`, `ZOMBIE_REWARD`, `SPAWN` → ScriptableObject(`EnemyRulesSO`, `ZombieTypeSO`). `zombieStats`/`waveMix`/`waveCount` → 정적 함수.
- 이벤트(`wave:start` 등) → 정적 `EventBus`의 struct 이벤트.
- 방향은 `yaw` 숫자와 "앞 = -z"를 쓴다. Unity에서는 변환 유틸 한 곳에서 부호를 뒤집는다.
