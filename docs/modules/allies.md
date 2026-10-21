# 모듈: 백신 / 아군 좀비 (`src/allies/`)

기절한 좀비에게 백신을 놓아 아군으로 만들고, 아군 4역할(전투병·경비병·채집병·연구 보조)을 굴리는 모듈. 담당 W5.

## 폴더 구조
| 경로 | 내용 | 엔진 의존 |
|------|------|-----------|
| `logic/math.ts` | `forward(yaw)`, `yawTo`, `turnToward` (앞 = -z 규칙을 한 곳에 모음) | 없음 |
| `logic/vaccine.ts` | 재료 계산·지불, 성공률 공식, 제작 대기열 | 없음 |
| `logic/inject.ts` | 주사 진행도(E 길게 누르기), 대상·선택 백신 | 없음 |
| `logic/ally.ts` | `Ally` 개체, 생성/사망, 역할별 AI(`updateAlly`) | 없음 |
| `view/allyView.ts` | 아군 3D 표현(모자·도구·체력바·등장/사망 연출) | Three.js |
| `view/labPanel.ts`, `view/injectHud.ts` | 연구소 창, 주사 진행 막대·결과 배너 | DOM |
| `view/fx.ts`, `view/camp.ts` | 불꽃/링 이펙트, 임시 채집장 | Three.js |
| `view/devHarness.ts` | 개발 전용 테스트 장치 (`npm run dev` 후 URL 끝 `#allies-dev`, 프로덕션 번들 제외) | 둘 다 |
| `index.ts` | `AlliesSystem` (logic ↔ view 연결), `setGatherNodeProvider` | 둘 다 |

`logic/`은 `three`/`document`를 import 하지 않는다. 랜덤(`rng`), 장애물 충돌(`collide`), 채집 노드(`gatherNodes`)는 `AllyEnv`로 주입한다.

## 데이터 (`src/data/index.ts`, 직렬화 가능)
- `VACCINES: VaccineDef[]` — `{name, herb, sample, sampleSp, parts, iron, rate}` 3등급 (초급/중급/고급)
- `ALLY_ROLES: Record<AllyRole, {name, desc, color, max}>`, `ALLY_ROLE_ORDER` — 전투병 최대 3
- `ALLY` — 아군 기본 능력 `{hp, speed, dmg, atkRate, atkRange, radius, height, regenDelay, regen, aggro, leash}`
- `INJECT` — `{time 1.5s, range, lowHpBonus 0.2, bossPenalty 0.3, minRate, maxRate}`
- `CRAFT` — `{time 3s, perResearcher 0.35}`, `GATHER` — `{time, carryRange}`, `ALLY_HARD_CAP = 30`

## 상태
`Ally`(= 공용 `AllyRef` 구현)
`id, x, z, radius, height, hp, maxHp, dead, view | role, yaw, speed, act('idle'|'move'|'attack'|'work'|'flee'), actT, atkCd, swing, hurtT, sinceHit, slot, patrol, zType, born, carry{res,amount}|null, nodeId, deadT`

공용 `state`의 `vaccines[3]`(보유), `samples/samplesSp/res`(재료), `allyCount`, `allyCapBonus`를 쓴다. 모듈 내부 상태: `craftQueue: {tier, t}[]`, `injector {progress, targetId, tier}`.

## 규칙
- **제작**: 재료 = 표 × `stats.vacCostMul`(0이 아닌 재료는 최소 1). 재료를 먼저 내고 대기열에 넣는다. 1개당 `CRAFT.time / (1 + 0.35 × 연구 보조 수)`초. 창을 닫아도 계속 진행.
- **주사**: 기절(`stunned`) 좀비 `INJECT.range` 안에서 E를 1.5초 누르고 있으면 판정. 놓거나 `player:hit`을 맞으면 취소(백신 소모 없음). 완료 시 백신 1개 소모(성공·실패 모두).
- **성공률** = `rate + (1 − hp/maxHp) × 0.2 + stats.vacBonus`, 보스(`boss`/`king`)는 −0.3, 5%~95%로 제한.
- **상한** = `min(30, stats.allyCap + state.allyCapBonus)`. 가득 차면 주사 불가.
- **역할 AI**: 전투병은 플레이어 주변 대형으로 따라다니며 12m 안 적을 공격, 경비병은 핵(없으면 원점) 주변을 순찰하다 16m 안 적을 공격, 채집병은 노드→기지 운반 후 `gain()`(좀비가 7m 안이면 도망), 연구 보조는 연구소 옆에서 일하며 제작 속도 증가. **아군은 기절한 좀비를 공격하지 않는다**(플레이어가 주사할 수 있도록).
- 새 아군 기본 역할: 전투 2 → 경비 1 → 채집 2 → 연구 1 → 부족한 역할 순. 연구소 창 또는 필드의 Q(가까운 아군 순환)로 변경.
- 5초 동안 맞지 않으면 초당 2 회복.

## 입력/상호작용
`E`(길게) 주사 · `C` 백신 등급 바꾸기 · `Q` 가까운 아군 역할 바꾸기 · 연구소에서 `E` → `interact:lab` → 창 · `Esc` 창 닫기.

## 이벤트
| 방향 | 이벤트 | 비고 |
|------|--------|------|
| 발행 | `zombie:converted {id, type}` | enemies 가 목록에서 빼고 메시를 남긴다 (`ZombieRef.view`를 아군이 이어받음) |
| 발행 | `zombie:inject-failed {id}` | **신규**. enemies 는 그 좀비를 깨워 분노(이동속도 +30%) 처리 |
| 발행 | `ally:spawned {id, role}` | **신규**. UI/통계용 |
| 발행 | `ally:dead {id}` | |
| 발행 | `resource:gathered`, `toast`, `ui:modal` | 채집병 운반 완료 / 안내 / 연구소 창 열고 닫음 |
| 구독 | `interact:lab`, `player:hit` | 창 열기 / 주사 취소 |

## 다른 모듈과의 연결 (후속 작업 필요)
- **enemies**: `zombie:converted` 시 `zombies`에서 제거, `zombie:inject-failed` 시 분노 상태로 깨우기. `ZombieRef.view`는 `core/humanoid`의 `Humanoid` 또는 `THREE.Object3D`면 된다. 좀비가 `allies`를 `hit(dmg)`로 공격한다.
- **gathering**: 노드 목록이 생기면 `setGatherNodeProvider(() => nodes)`로 연결한다(`GatherNode {id,x,z,res,available(),take()}`). 연결 전에는 기지 20m 밖 4곳의 임시 채집장(상자 더미)에서 일한다.
- **base**: 핵은 `structures`의 `kind:'core'`, 연구소는 `kind:'lab'`을 찾아 위치로 쓴다. 숙소는 `state.allyCapBonus`.
- **미구현(기획의 후순위)**: 진정제(유지비), 반란 이벤트, 저장/불러오기(`Ally`는 순수 데이터라 `id, role, x, z, hp, zType`만 저장하면 복원 가능).

## Unity(C#) 이식 메모
- `Ally` → `AllyAgent`(MonoBehaviour) + 순수 C# `AllyModel`. `ROLE_AI` 맵 → 역할별 `IAllyBrain` 구현 또는 상태 머신. `AllyEnv` → 인터페이스 `IAllyEnv`(NavMesh 이동이면 `collide` 대신 `NavMeshAgent`).
- `VACCINES`, `ALLY_ROLES`, `ALLY`, `INJECT`, `CRAFT` → ScriptableObject(`VaccineDef`, `AllyRoleDef`, `AllyTuning`).
- `craftQueue`/`injector` → 순수 C# 클래스(`CraftQueue`, `InjectionSession`).
- `AllyView` → 프리팹(모자·도구는 자식 오브젝트), 이펙트는 ParticleSystem, 체력바는 World Space Canvas, `LabPanel` → UGUI/UI Toolkit 창.
- 이벤트 → C# `EventBus` 구조체 이벤트. 앞이 `-z`(Three.js)인 `forward(yaw)`는 변환 유틸 한 곳에서 뒤집는다.
