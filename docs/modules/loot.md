# loot (보물상자) 모듈

소유: `src/loot/` · 수치: `src/data/index.ts`의 `CHEST_*`, `REWARD_*`, `PITY_LIMIT` 구역 · 위치: `src/data/map.ts`의 `MAP`

## 구조
```
src/loot/
  logic/   순수 TS (three/DOM 없음)
    rng.ts        시드 가능한 난수 mulberry32, Rng = () => number
    rewards.ts    등급 추첨(천장), 보상 추첨, state 에 지급
    chests.ts     ChestManager: 상자 목록, 열기 상태 전이, 재생성, 황금 상자 희귀 스폰, save/load
    placement.ts  MAP 에서 상자 자리 계산 (MAP.chests 가 비면 구역 danger 기준 절차 배치)
    triggers.ts   enemy:killed / wave:clear / boss:dead 를 받아 상자·열쇠 지급
  view/    Three.js, DOM
    chestMesh.ts  상자 3D 모델 + 흔들림/뚜껑/빛기둥 연출
    burst.ts      파편(콘페티)과 충격 고리
    ui.ts         확률표, 보상 카드, 화면 번쩍임 (스타일은 코드로 주입, index.html 미수정)
  index.ts  LootSystem (logic 과 view 를 이어 붙이고 interact 에 등록)
```

## 데이터 모델
### `Chest` (런타임 상태, 직렬화 가능)
| 필드 | 설명 |
|------|------|
| `id, x, z, yaw` | 개체 ID, 위치(미터), 방향(라디안) |
| `tier` | 0 나무 / 1 철 / 2 황금 |
| `source` | `map` 고정 / `drop` 좀비 드롭 / `wave` 웨이브 보상 / `boss` 보스 / `gold` 희귀 스폰 |
| `phase` | `closed` → `opening` → `opened`(곧 제거) |
| `t, burst` | 열기 시작 후 경과 초, 뚜껑이 터져 보상이 지급됐는가 |
| `rarity, reward, text` | 열기를 누른 순간 정해진 보상 등급·보상, 지급 결과 문구 |
| `ttl, spot` | 닫힌 채 남은 수명(null 무한), 고정 자리 인덱스(재생성용) |

### 데이터 표 (`src/data/index.ts`)
| 이름 | 형태 |
|------|------|
| `CHEST_NAMES`, `REWARD_NAMES`, `RARITY_COLORS` | 문자열/숫자 배열 |
| `CHEST_TABLE[tier][rarity]` | 보상 등급 확률(%) |
| `PITY_LIMIT` | 천장 횟수 |
| `CHEST_KEY[tier]` | 열쇠 필드 이름(`'keys'`/`'goldKeys'`/null) |
| `REWARD_TABLE[rarity]` | `RewardDef[]` 가중치 표. `kind`: res, gold, key, goldKey, sample, sampleSp, vaccine, skillPoint, weapon, costume |
| `CHEST_ANIM` | 연출 타임라인(터지는 시각, 전체 길이) |
| `CHEST_RESPAWN`, `ZONE_CHEST_RULE`, `CHEST_SCATTER`, `GOLD_SPAWN`, `CHEST_DROP`, `WAVE_CHEST`, `CHEST_MAX` | 스폰·드롭·재생성 수치 |

### 추가한 공유 상태 (`core/state.ts`, 추가만)
`weapons: string[]` 보유 무기(시작 `['pistol']`, 상자 보상으로 추가. player 가 읽어 1/2/3 교체에 사용), `costumes: string[]` 모은 코스튬. `pity`, `keys`, `goldKeys`, `vaccines`, `samples`, `samplesSp`, `skillPoints`, `gold`, `res`는 기존 필드를 쓴다.

## 규칙
- **뽑기**: 열기 시 열쇠 소모(나무는 무료) → `rollRarity(tier, pity)`: 철/황금만 천장 적용, `pity >= PITY_LIMIT`이면 희귀 이상만 가중 추첨 → 희귀 이상이면 `pity = 0`, 아니면 +1. 나무 상자는 천장에 영향 없음. 10만 회 시뮬레이션으로 희귀 미만 연속이 10회를 넘지 않음을 확인.
- **보상**: 등급별 `REWARD_TABLE`을 가중치로 추첨해 뚜껑이 터지는 순간 `state`에 지급. 이미 가진 무기·코스튬은 골드로 전환.
- **생성**: ① `MAP.chests`(없으면 구역 `danger`별 절차 배치 + 구역 밖 흩뿌림), 열린 뒤 등급별 시간 지나 재생성 ② 좀비 처치 4% 나무 상자(90초 후 소멸), 2% 철 열쇠 ③ 웨이브 클리어마다 핵 근처 나무 상자, 5웨이브마다 철 상자 추가 ④ 보스 처치 시 황금 열쇠 +1과 황금 상자 ⑤ 6분마다 위험도 4 이상 구역에 황금 상자(150초 후 소멸).
- **상호작용**: `addInteractable`로 E 등록(range 2.4). 열쇠 없으면 안내 문구만 바뀌고 누르면 토스트.
- **연출(view)**: 1.15초 흔들림 → 눌렸다 부풀며 뚜껑 터짐 → 등급색 빛기둥, 파편, 충격 고리, 보상 카드(희귀+ 화면 번쩍임) → 가라앉아 사라짐. 가까이 가면 확률표와 천장 게이지 표시. 황금 상자는 멀리서 보이는 가는 빛기둥과 반짝이.

## 이벤트
| 방향 | 이벤트 |
|------|--------|
| 구독 | `enemy:killed`, `wave:clear`, `boss:dead`, `run:start` (상자·타이머 초기화, `pity`·`keys`·`goldKeys`=0, `weapons`=['pistol']. 코스튬은 유지) |
| 발행 | `chest:opened { tier, rarity, text }`, `toast` |

## 저장
`ChestManager.save()/load()`가 `LootSave`(자리, 닫힌 상자, 재생성 대기, 황금 타이머)를 JSON으로 주고받는다. 천장과 열쇠는 `state`에 있다. 저장 통합(Phase 2)에서 호출만 하면 된다.

## Unity(C#) 이식 메모
- `Chest` → 순수 C# 클래스, `ChestManager` → 서비스(MonoBehaviour 불필요). `Rng` → `System.Random` 또는 시드 래퍼 인터페이스.
- `RewardDef` 판별 유니온 → ScriptableObject `RewardEntry`(enum `Kind` + 필드)의 리스트, 등급마다 `RewardTable` 에셋 4개. `CHEST_TABLE` → `ChestTier` ScriptableObject(확률 4개, 열쇠 종류).
- `view/chestMesh.ts` → 프리팹 + Animator(흔들림/뚜껑 키프레임), 빛기둥은 ParticleSystem 또는 메시, 파편은 ParticleSystem. `ui.ts` → UGUI 패널(확률표, 보상 카드).
- 이벤트 → `EventBus` 의 `ChestOpened` struct, `E` 상호작용 → `IInteractable`.
- 높이는 현재 0이다. `getGroundY(x, z)`가 생기면 `view/chestMesh.ts`의 TODO 한 곳만 바꾼다.
