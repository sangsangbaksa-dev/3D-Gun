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
- `ZType`: 일반 `normal`, `runner`, `fatty`, 신규 `crawler`, `swarmer`, `leaper`, `spitter`, `bomber`, `screamer`, `tank`, 보스 `boss`, `bossBomb`, `bossAcid`, `bossLord`, `king`
- `zombieStats(wave, type)`: `{hp, speed, dmg, scale}`. `waveCount(wave)`, `MAX_ALIVE`, `FINAL_WAVE`
- `ZOMBIE_TUNING[type]`(`ZTune`): 이름, 공격 간격, 반경, 키, 사거리와 능력 파라미터(`armor`, `keep`, `leap`, `spit`, `bomb`, `scream`). 능력 필드가 있는 종류만 그 행동을 한다.
- `ROSTER` + `waveRoster(wave)`: 종류별 등장 시작 웨이브와 비율(`from/base/ramp/max/pack`). 일반 좀비는 최소 20% 남는다. `pack > 1` 은 한 번 뽑히면 그 수만큼 한꺼번에(떼거리 6마리)
- `bossTypeFor(wave)`, `isBossWave`, `BOSS_KIT`, `BOSS_MOVE`: 보스별 패턴 목록과 수치
- `ELITE`, `eliteChance(wave)`: 20웨이브부터 일반 종류가 확률적으로 엘리트(체력 ×2.5, 공격 ×1.4, 금빛, 보상 ×3)
- `ZOMBIE_REWARD`: 처치 골드/경험치
- `prepTime(wave, bonus)`: 모든 웨이브 30초 + `state.start.prepBonus`
- `ENEMY_RULES`: 기절 기준 30%, 기절 확률 35%, 기절 시간 8초, 분노 속도 ×1.3, 인식 거리, 독가스, 배회 좀비 수, `fallbackRestart` 등
- 레인·핵 위치는 `src/data/map.ts`의 `MAP.lanes`, `MAP.core`, `MAP.zones[].danger`를 읽는다.

### 몬스터 목록
| 종류 | 등장 | 특징 |
|------|------|------|
| 좀비 / 달리기 / 뚱보 | 1 / 3 / 5 | 기본 근접. 뚱보는 죽으면 독가스 |
| 기어다니는 좀비 `crawler` | 2 | 낮게 기어 다녀 맞히기 어렵다(키 0.85m) |
| 떼거리 `swarmer` | 4 | 아주 작고 빠르며 6마리씩 몰려온다 |
| 도약 `leaper` | 6 | 4~12m 거리에서 웅크렸다가 목표로 뛰어 착지 범위 피해(착지점 예고 링) |
| 산성 `spitter` | 7 | 6~15m 거리를 유지하며 산성 침을 던진다. 착탄 후 3초 웅덩이 |
| 장갑 `tank` | 8 | 받는 피해 50% 감소. 기절하면 장갑이 풀려 약점이 드러난다 |
| 폭탄 `bomber` | 9 | 2.8m 안에서 0.8초 도화선 후 큰 폭발(건물 포함). 쏴서 죽여도 작게 터진다 |
| 비명 `screamer` | 11 | 8~12m 뒤에서 9초마다 비명: 28m 안 좀비가 6초간 40% 빨라지고 일반 좀비 2마리 소환 |
| 엘리트 | 20+ | 위 종류의 강화판 (금빛 견장과 보석) |

### 보스 (10웨이브마다 순환, 50 왕)
| 웨이브 | 보스 | 패턴 |
|--------|------|------|
| 10 | 브루저 | 슬램, 돌진 |
| 20 | 폭파광 | 폭격(예고 링 4곳), 돌진, 폭탄 좀비 소환 |
| 30 | 산성 괴수 | 산성 부채꼴 5발, 슬램, 산성/기어다니는 좀비 소환 |
| 40 | 군단장 | 비명(전체 가속), 소환(달리기/장갑/도약), 돌진, 슬램. 장갑 25% |
| 50 | 좀비 왕 | 슬램, 돌진, 폭격, 비명, 소환(일반 5 + 장갑 1) |
50 이후 무한 모드에서는 10의 배수마다 브루저→폭파광→산성 괴수→군단장이 순환한다. 체력 50% 이하에서 패턴 간격이 줄고 발광한다.

## 상태 (모두 `state.ts`)
`state.wave`: 지금 싸우는(또는 준비 중인 다음) 웨이브 번호, 시작 시 `state.start.startWave`. `state.phase`: `prep`/`combat`/`ended`(게임오버 대기). 추가한 필드: `prepLeft`, `waveRemaining`, `checkpoint`. 런 흐름용 `state.start`(시작 웨이브, 준비 시간 보너스 등)와 `state.statMods`는 조율 문서 1-e 계약.

### 좀비 개체(`Zombie`)
`id, type, x, z, yaw, hp, maxHp, radius, height, dead, stunned, view` (`ZombieRef` 필드는 `entities.zombies`로 공개). 내부: `state`(`spawn|chase|windup|stunned|dying`), `target`, `rage`, `frenzy`(비명으로 빨라진 시간), `elite`, `armor`, `move`(진행 중인 특수 동작)와 `phase`/`moveT`, 레인 진행 `lane/wp`, 배회용 `home`.
`view`에는 `core/humanoid`의 `Humanoid`(그룹과 머티리얼)를 넣는다. 백신 성공 시 W5가 이 핸들을 가져다 아군 모델로 쓴다.

### 상태 전이
- 웨이브: `prep`(30초 카운트다운 또는 N 키) → `combat`(스폰 큐 소진 + 생존 0) → `wave:clear` → `wave+1`, `prep`. 5의 배수 클리어는 체크포인트 갱신. 새 종류가 처음 나오는 웨이브에 "새 적 등장" 토스트.
- 좀비: `spawn`(0.8초) → `chase` ⇄ `windup`(0.45초) → 피해. 체력이 30% 이하가 되는 타격은 확률(35% + `stats.stunBonus`)로 죽이지 않고 `stunned`(8초). 시간이 끝나거나 `zombie:inject-failed`가 오거나 다른 모듈이 `stunned=false`로 풀면 분노(속도 ×1.3)로 복귀. 아군 타격, 보스, 자폭 중인 폭탄 좀비는 기절하지 않는다.
- 특수 동작(`move`): `fuse`, `leap`, `spit`, `scream`(일반 능력)과 `slam`, `charge`, `volley`, `bombRain`, `summon`, `scream`(보스). 모두 예고 시간(windup) 뒤 실행되고, 예고 링(`fx ring`)이 바닥에 표시된다.

## 목표 선택
가까운 쪽 우선: 플레이어(16m, 보스 ×1.6), 아군(11m), 길목의 방어 건물(7m, 핵 제외). 없으면 레인 경유점을 따라 핵으로 간다. 건물은 통과하지 못하고, 가는 길을 막는 건물(바리케이드)은 부순다. `structures`에 핵이 없으면 가상 핵(`state.coreHp`)을 대신 때리고 화면에 임시 크리스털을 그린다(base가 핵을 등록하면 자동으로 꺼진다).
구역 `danger >= 2`에는 배회 좀비가 상주한다(웨이브와 무관, 플레이어에게서 90m 넘으면 정지).

## 이벤트
| 방향 | 이벤트 |
|------|--------|
| 발행 | `wave:prep`, `wave:start`, `wave:clear`, `enemy:killed`, `zombie:stunned`, `boss:spawn`, `boss:dead`, `game:end`(좀비 왕 처치 `victory:true`), `run:over`(사망/핵 파괴), `player:hit`(공격, 폭발, 침, 독), `player:respawn`, `core:damaged`/`core:destroyed`(가상 핵일 때만), `xp:gain`, `toast` |
| 구독 | `player:dead`, `core:destroyed`(→ `run:over`), `run:start`(새 런), `zombie:converted`(목록에서 빼고 모델은 씬에 남김), `zombie:inject-failed`(분노), `boss:dead` |

처치 시 `state.gold`에 골드를 더한다(`ZOMBIE_REWARD`). 웨이브 클리어 보너스 골드는 `10 + wave*2`.

## 런 흐름 (조율 문서 1-e)
`player:dead` 또는 `core:destroyed` → 모든 좀비·투사체 제거(보상 없음), `state.phase='ended'`로 멈춤 → `run:over {wave, checkpoint, kills, gold, reason}` 발행. 그 자리에서 되돌리지 않는다.
2D 업그레이드 타이쿤이 `run:start {run, startWave}`를 내면 `state.wave = startWave`, `checkpoint = 0`으로 준비 단계부터 새 런을 시작한다(런 상태 초기화는 각 모듈이 같은 이벤트로 한다). 타이쿤 화면이 없을 때 멈춰 서지 않도록, `state.mode`가 `modal`이 아닌 채로 4초(`fallbackRestart`)가 지나면 enemies 가 스스로 `run:start`를 낸다(타이쿤이 창을 띄우면 `modal`이라 기다린다).

## 다른 모듈이 알아야 할 것
- 보스 체력바(W7): `zombies`에서 `type === 'boss' || 'king'`을 찾아 `hp/maxHp`를 읽는다. 시작은 `boss:spawn`, 끝은 `boss:dead`.
- 웨이브 바로 시작: 준비 단계에 `N` 키(`index.html` 도움말과 동일).
- 모달(`state.mode === 'modal'`)이 열려 있으면 좀비 시간을 멈춘다. 2D 타이쿤은 `run:over`를 받으면 `state.mode='modal'`로 두어야 자동 재시작이 기다린다.
- `run:start` 때 플레이어가 죽은 상태면 W2가 체력·위치를 복구하고 `player:respawn`을 낸다(W1이 먼저 처리하면 무시된다).
- 개발 모드(`npm run dev`)에서만 `window.__enemies`(sim, director, state)를 열어 디버깅에 쓴다. 빌드에는 들어가지 않는다.

## C# 이식 메모
- `Zombie` → `class Zombie : MonoBehaviour`(데이터는 `ZombieData` 순수 클래스로 분리), `ZombieRef` → `IDamageable`/`ITarget` 인터페이스.
- `EnemySim`/`WaveDirector` → 순수 C# 클래스, `Update(float dt)`를 매니저가 호출. `Fx` 큐 → `event Action<FxEvent>`.
- `ENEMY_RULES`, `ZOMBIE_TUNING`(능력 파라미터 포함), `ROSTER`, `BOSS_KIT`, `ELITE`, `ZOMBIE_REWARD` → ScriptableObject(`EnemyRulesSO`, `ZombieTypeSO`, `BossKitSO`). 능력은 `IZombieAbility`(Leap, Spit, Bomb, Scream)로 나누고 `ZTune`의 해당 필드가 있으면 붙인다. `zombieStats`/`waveMix`/`waveCount` → 정적 함수.
- 이벤트(`wave:start` 등) → 정적 `EventBus`의 struct 이벤트.
- 방향은 `yaw` 숫자와 "앞 = -z"를 쓴다. Unity에서는 변환 유틸 한 곳에서 부호를 뒤집는다.
