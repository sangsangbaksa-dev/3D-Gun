# 좀비 타이쿤 3D: 멀티 에이전트 조율

여러 작업자(에이전트)가 동시에 개발할 때 지키는 규칙입니다. 기획은 [GAME_DESIGN.md](./GAME_DESIGN.md),
코드 구조는 [ARCHITECTURE.md](./ARCHITECTURE.md)를 봅니다. 이 문서는 **누가 어디를 고치고, 모듈끼리 무엇으로 대화하고, 어떻게 합치는지**를 정합니다.

- 스택: Three.js + TypeScript + Vite. 진짜 3D(3D 월드, 3인칭 카메라, 프리미티브 3D 모델)
- 저장소: https://github.com/sangsangbaksa-dev/3D-Gun, 기본 브랜치 `main`
- `main`은 항상 `npm run build`가 통과하고 `npm run dev`로 플레이 가능한 상태를 유지합니다.
- 조율 책임: **총괄 조율 스레드**. 병합: 사용자(Waldo).

---

## 1. 모듈과 소유권

각 작업자는 **자기 소유 경로만** 고칩니다. 다른 기능 폴더의 파일은 import 하지 않습니다.
모듈끼리는 `src/core/`의 공용 계약(아래 2장)만 씁니다.

| 작업자 | 모듈 | 소유 경로 | `data/index.ts` 소유 구역 |
|--------|------|-----------|---------------------------|
| W1 | 무기/전투 | `src/player/` | `WEAPONS`, `WEAPON_ORDER`, `WeaponDef` |
| W2 | 좀비/웨이브/보스 | `src/enemies/` | `zombieStats`, `ZType`, `MAX_ALIVE`, `waveCount`, `FINAL_WAVE` |
| W3 | 채집 | `src/gathering/`, `src/core/props.ts` 삭제 권한 | `RES_*`, `ResKey` |
| W4 | 보물상자 | `src/loot/` | `CHEST_*`, `REWARD_NAMES`, `PITY_LIMIT` |
| W5 | 백신/아군 | `src/allies/` | `VACCINES`, `VaccineDef` |
| W6 | 기지/타이쿤 | `src/base/` | `BUILDINGS`, `BUILDING_ORDER`, `BuildingDef` |
| W7 | 스킬트리/UI/오디오 | `src/skills/`, `src/ui/`, `src/audio/`, `index.html`의 UI 마크업 | `SKILLS`, `Stats`, `calcStats` |
| 총괄 조율 | 코어 계약 | `src/core/`(props.ts 제외), `src/main.ts`의 순서, `docs/COORDINATION.md` | 파일 맨 위 공용 정의 |

- 수치는 `src/data/index.ts`에서만 바꾸고, **자기 구역만** 고칩니다. 새 수치는 자기 구역 바로 아래에 추가합니다.
- 각 기능 패널(제작 창, 건설 메뉴, 상자 열기 연출 등)은 **그 기능 작업자가 자기 폴더 안에서** DOM으로 만듭니다. W7은 HUD, 토스트, 스킬트리 창, 엔딩/게임오버 화면, 모달 공통 동작(`ui:modal`)을 맡습니다. 이렇게 해야 W7을 기다리지 않고 각자 끝까지 만들 수 있습니다.

## 1-b. Unity 이식 대비 규칙 (필수)

이 게임은 나중에 Unity(C#)로 옮깁니다. 그래서 **로직과 표현을 분리**합니다.

- 각 모듈은 `src/<모듈>/logic/`(규칙·AI·계산·상태)과 `src/<모듈>/view/`(Three.js 메시, 카메라, DOM)로 나눕니다. **`logic/`에서는 `three`를 import 하지 않고 `document`/`window`도 쓰지 않습니다.** 위치는 `{x, y, z}` 숫자, 회전은 yaw 숫자로 다룹니다.
- `logic/`은 `dt`와 입력 값을 받아 상태를 바꾸고 이벤트를 내는 순수 TS입니다. `view/`가 그 상태를 읽어 그립니다. 랜덤은 시드를 넣을 수 있는 함수(`rng()`)를 주입받아 씁니다.
- 밸런스, 적, 아이템, 건물, 스킬, 웨이브 표는 `src/data/`의 **직렬화 가능한 객체**(숫자·문자열·배열·객체만, 함수·클래스 없음)로 둡니다. Unity에서 ScriptableObject나 JSON으로 그대로 옮길 수 있어야 합니다. 공식은 `data`에 순수 함수로 두되 입력과 출력이 숫자인 것만 허용합니다.
- 외부 의존성(DOM, localStorage, WebAudio)은 `view/`나 `src/core/platform/` 뒤에 숨깁니다.
- 각 모듈은 PR에 `docs/modules/<모듈>.md`를 추가해 **데이터 모델**(상태 필드, 데이터 표 스키마, 발행/구독 이벤트, 상태 전이)을 적습니다. C# 클래스·ScriptableObject·이벤트로 어떻게 옮길지 한 줄 메모를 붙입니다. 상세 이식 메모는 [UNITY_PORT.md](./UNITY_PORT.md).
- 기존 스캐폴드(`player.ts`, `core/world.ts` 등)는 W1, 총괄 조율이 같은 규칙으로 점차 나눕니다.

## 2. 공용 계약 (src/core/)

이미 `main`에 있는 것: `Ctx`/`System`(types.ts), `events`(events.ts), `input`, `world`(씬·`obstacles`·`resolveObstacles`), `humanoid`(사람형 모델).
이 문서와 함께 추가된 것: `state.ts`, `entities.ts`, `events.ts`의 계약 이벤트.

### 2.1 System
```ts
export const XxxSystem: System = { init?(ctx) {}, update(dt, ctx) {}, dispose?() {} };
```
- 모듈마다 `System`을 export 하고 `src/main.ts` 배열에 **한 줄만** 추가합니다. 실행 순서는 배열 순서이고, 권장 순서는 `Props/Gathering → Base → Player → Enemies → Allies → Loot → Skills → UI` 입니다.
- `ctx.player`(x, z, hp, maxHp, iframes 등)는 W1 소유입니다. 다른 모듈은 **읽기만** 하고, 피해는 `player:hit` 이벤트로 줍니다.
- 조준 방향은 `ctx.aimDir`, 카메라는 `ctx.camera`.

### 2.2 공유 상태 `src/core/state.ts`
`state` 싱글톤에 웨이브, 단계(`prep`/`combat`/`ended`), 골드, 열쇠, 자원(`res`), 좀비 샘플, 백신 보유 수, 경험치/스킬 포인트/스킬 레벨, 상자 천장, 아군 수, 최종 스탯(`state.stats`)이 있습니다.
- 자원 증감은 `gain(res, n)`, 지불은 `spend(cost, gold)`(부족하면 false). 직접 바꾼 뒤에는 `changed()`를 부릅니다.
- 스킬 레벨을 바꾼 뒤에는 `recalcStats()`. 모든 모듈은 수치 보정을 `state.stats`(예: `dmgMul`, `allyCap`, `gatherSpeed`)에서 읽습니다.
- 필드는 **추가만** 합니다. 이름 변경이나 삭제는 총괄 조율과 먼저 합의합니다.

### 2.2-b 상호작용 `src/core/interact.ts`
채집, 상자, 기절 좀비 주사, 연구소, 상점이 모두 E를 씁니다. 각 모듈은 `addInteractable({x, z, range, label(), press?(), hold?(dt)})`로 등록만 하면 가장 가까운 하나만 반응하고, 안내 문구는 `interact:prompt` 이벤트로 W7 UI가 표시합니다. `state.mode`가 `build`/`modal`이면 W1은 사격·무기 교체를 멈춥니다. 기획의 키 배치(E 상호작용, B 건설, Tab 스킬)를 따릅니다.

### 2.3 개체 목록 `src/core/entities.ts`
| 목록 | 넣고 빼는 주인 | 쓰는 쪽 |
|------|----------------|---------|
| `zombies: ZombieRef[]` | W2 | W1(사격 판정), W5(기절 좀비 찾기, 아군 공격), W6(감시탑) |
| `allies: AllyRef[]` | W5 | W2(좀비가 아군을 공격) |
| `structures: StructureRef[]` | W6 | W2(좀비가 건물을 공격) |

- 피격 판정은 `x, z, radius, height` 원기둥 수학으로 합니다(Three 레이캐스트 금지, `view`는 불투명 핸들). 피해는 항상 대상의 `hit()`을 부릅니다. `ZombieRef.hit(dmg, byAlly)`는 W2가 구현하며, 체력이 낮을 때 `state.stats.stunBonus`를 반영해 기절시키고 `zombie:stunned`를 냅니다.
- 좀비 아군화: W5가 기절 좀비에 백신을 쓰고 성공하면 `zombie:converted { id }`를 냅니다. W2는 그 좀비를 `zombies`에서 빼고 메시를 씬에 남겨 둡니다. W5는 같은 `obj`를 가져와 아군으로 씁니다.
- `nearest(list, x, z, maxDist)`로 가장 가까운 대상을 찾습니다. ID는 `newId()`.

### 2.4 이벤트 (`src/core/events.ts`의 `GameEvents`)
| 이벤트 | 내는 쪽 | 듣는 쪽 |
|--------|---------|---------|
| `player:hit` | W2(좀비), 보스 | W1 |
| `player:dead` | W1 | W2(체크포인트 복귀, 자원 30% 손실), W7 |
| `weapon:fired` | W1 | W7(탄약 HUD, 사운드) |
| `wave:start` / `wave:clear` | W2 | W6(준비 단계에만 건설), W4(웨이브 보상 상자), W7 |
| `enemy:killed` | W2 | W3(샘플·부품 드롭), W4(상자 드롭), W7(경험치) |
| `zombie:stunned` | W2 | W5, W7 |
| `boss:spawn` / `boss:dead` | W2 | W4(황금 열쇠), W7(보스 체력바) |
| `game:end` | W2(50웨이브 좀비 왕 처치) | W7(엔딩 화면) |
| `zombie:converted` / `ally:dead` | W5 | W2, W7 |
| `resource:gathered` | W3 | W7 |
| `chest:opened` | W4 | W7 |
| `building:placed` / `building:destroyed` | W6 | W5(숙소 = 아군 상한), W7 |
| `interact:lab` / `interact:shop` | W6 | W5(백신 제작 창) / W6 |
| `xp:gain` | 누구나 | W7(스킬 포인트) |
| `ui:modal` | 창을 여닫는 모듈 | W7(포인터 락 해제·복귀), W1(창 열림 동안 사격 정지) |
| `state:changed` | `state.ts` | W7(HUD 갱신) |
| `toast` | 누구나 | W7 |

새 이벤트는 `events.ts`의 **자기 모듈 주석 블록 끝에 추가만** 합니다. 기존 이벤트의 이름이나 페이로드를 바꾸지 않습니다.

## 3. 작업 보드

상태: ☐ 대기 · ◐ 진행 · ☑ 병합됨

### Phase 0: 기반
| 작업 | 담당 | 상태 |
|------|------|------|
| Vite+TS+Three.js 스캐폴드, 월드, 3인칭 카메라, 이동/대시, 밸런스 데이터 | 기획 스레드 | ☑ |
| 조율 문서, `state.ts`, `entities.ts`, 계약 이벤트 | 총괄 조율 | ◐ |

### Phase 1: 모듈 MVP (모두 병렬)
| 작업자 | 완료 기준 (브라우저에서 확인) | 상태 |
|--------|------------------------------|------|
| W1 무기/전투 | 좌클릭 히트스캔 사격, R 재장전, 1/2/3 무기 교체(권총만 시작 보유), 트레이서. `player:hit`로 체력 감소, 0이면 `player:dead` | ☐ |
| W2 좀비/웨이브/보스 | 일반/달리기/뚱보 좀비가 쫓아와 공격, 기절, 사망. 준비→전투 웨이브 흐름, 5웨이브 체크포인트, 10/20/30/40 중간 보스, 50 좀비 왕과 `game:end`. 초반 5~8웨이브에서 대부분 쓰러지는 난이도 | ☐ |
| W3 채집 | 나무/바위/철광/약초/폐차(부품) 노드, E 길게 눌러 채집(hold), 재생성. `props.ts` 대체. 좀비 처치 시 샘플 드롭 | ☐ |
| W4 보물상자 | 맵 스폰 + 웨이브/보스 보상 상자 3등급, 확률표 표시, 천장 10회, 열기 연출 | ☐ |
| W5 백신/아군 | 연구소에서 백신 3등급 제작, 기절 좀비에 E로 주사(성공률 공식), 아군 4역할 AI(전투/채집/경비/연구) | ☐ |
| W6 기지/타이쿤 | B로 건설 모드, 격자 배치, 건물 5종 효과(감시탑 자동 사격, 바리케이드, 숙소 상한, 상점 판매/열쇠, 연구소 상호작용) | ☐ |
| W7 스킬/UI/오디오 | HUD(체력/탄약/웨이브/자원/골드/열쇠/아군 수), 토스트, Tab 스킬트리 창(4가지, 리스펙), 게임오버·엔딩 화면, 효과음 | ☐ |

### Phase 2: 통합·마감
| 작업 | 담당 |
|------|------|
| localStorage 저장/불러오기 (`state` + 각 모듈 `save/load`) | 먼저 끝난 작업자 1명 (총괄 조율이 배정) |
| 50웨이브 통과 플레이 테스트와 밸런스 조정 | 총괄 조율 + 해당 수치의 소유 작업자 |
| 성능 점검 (동시 좀비 40, 아군 20에서 60fps 목표) | W2, W5 |

## 4. 브랜치와 병합 규칙

1. **작업자당 브랜치 하나, PR 하나.** 브랜치에서 `main`으로 PR을 엽니다. PR 제목은 `[W2 enemies] 좀비 AI와 웨이브`처럼 작업자와 모듈을 붙입니다.
2. **소유 경로만 수정.** 예외는 아래 공유 파일뿐이며, 모두 "추가만" 합니다.
   - `src/main.ts`: 자기 System 한 줄(import 한 줄 포함).
   - `src/core/events.ts`: 자기 모듈 블록 끝에 이벤트 추가.
   - `src/core/state.ts`: 필드 추가 (기존 필드 변경 금지).
   - `src/data/index.ts`: 자기 구역 안에서만.
   - `index.html`: W7 외에는 수정 금지. 다른 모듈의 DOM은 코드로 만들어 붙입니다.
   - `package.json`: 새 의존성은 PR 설명에 이유를 적습니다. 가능하면 추가하지 않습니다.
3. **계약 변경**(기존 이벤트·필드·인터페이스의 이름이나 모양을 바꾸는 일)은 코드로 우회하지 말고 총괄 조율 스레드에 먼저 요청합니다.
4. **PR 전 필수:** 최신 `main`을 받아 충돌 해결 → `npm run build` 통과 → `npm run dev`로 실제 플레이 확인(가능하면 Playwright 스크린샷).
5. **다른 모듈이 아직 없을 때:** 이벤트를 내기만 하거나, 자기 폴더 안의 임시 코드로 테스트합니다. 다른 작업자의 폴더에 임시 코드를 넣지 않습니다.
6. **병합 순서:** 먼저 준비된 PR부터. `main.ts`/`events.ts`/`data` 충돌은 줄 단위 추가라 뒤에 오는 PR이 rebase해서 양쪽을 모두 살립니다.
7. **리뷰:** 총괄 조율 스레드가 경계 위반과 계약 위반을 확인한 뒤 사용자에게 병합을 요청합니다.
8. 커밋 메시지: `<모듈>: 내용` (예: `allies: 백신 주사 성공률 적용`).

## 5. 작업자 공통 지침

- 시작 전 GAME_DESIGN.md, ARCHITECTURE.md, 이 문서를 읽습니다.
- 모델은 `core/humanoid.ts`와 Three.js 프리미티브로 만듭니다. 외부 에셋은 쓰지 않습니다.
- 끝나면 PR 링크와 "완료 기준을 어떻게 확인했는지" 한 줄을 총괄 조율 스레드에 남깁니다.
- 작업 보드의 상태는 총괄 조율 스레드가 갱신합니다.
