# 채집 모듈 (gathering)

W3. 소유: `src/gathering/`, `src/data/index.ts`의 채집 구역(`GATHER_*`, `SAMPLE_DROPS`, `NodeKind`). `src/core/props.ts`(임시 기둥)는 삭제했다.

## 구조

| 경로 | 역할 | Unity |
|------|------|-------|
| `logic/rng.ts` | 시드 가능한 난수 `mulberry32`, `randRange`, `randInt` | `System.Random(seed)` 또는 자체 xorshift |
| `logic/nodes.ts` | `GatherNode` 모델, `generateLayout(rng, map)` 배치 | 순수 C# `GatherNode` 클래스 + 배치 서비스 |
| `logic/gathering.ts` | 진행도, 고갈, 재생성, 샘플 드롭, 저장/불러오기 | 순수 C# `GatheringService` |
| `view/models.ts` | 노드 5종 프리미티브 모델 | 프리팹 5종 (처음엔 Cube/Sphere 조합) |
| `view/gatheringView.ts` | 흔들림, 쓰러짐/재생성 연출, 파편, 진행 막대, 떠오르는 글자 | 프리팹 애니메이션, ParticleSystem, 월드 스페이스 UI |
| `index.ts` | `GatheringSystem` 연결부: logic ↔ `state`/`events`/`interact`/`world` ↔ view | `MonoBehaviour` 하나 |

`logic/`은 `three`, DOM, `core/`를 import 하지 않는다(`data/`와 `data/map.ts` 타입만 읽음).

## 데이터 표 (`src/data/index.ts`, 직렬화 가능)

```ts
type NodeKind = 'tree' | 'rock' | 'iron' | 'herb' | 'wreck';      // data/map.ts 의 ResNodeKind 와 동일
GATHER_NODES: Record<NodeKind, {
  name, verb, res: ResKey,
  work,                        // 속도 1.0 기준 채집 초
  yieldMin, yieldMax,          // 획득량
  respawnMin, respawnMax,      // 재생성 초 (기획 60~180)
  radius, depletedBlock        // 충돌 반경, 고갈 후 남는 비율
}>
GATHER_ZONE_DENSITY: Record<ZoneKind, Partial<Record<NodeKind, number>>>   // 100㎡당 노드 수
GATHER_OPEN_DENSITY: Partial<Record<NodeKind, number>>                      // 구역 밖 흩뿌리기, 10,000㎡당
GATHER_LAYOUT   { seed, baseMargin, laneHalfWidth, gap, edgeMargin, startClear, zoneBias, tries }
GATHER_REACH, GATHER_VIEW_DIST
SAMPLE_DROPS: Record<ZType 문자열, { chance, min, max, special }>
```
→ ScriptableObject `GatherNodeDef` 5개, `GatherLayoutConfig` 1개, `SampleDropTable` 1개.

## 상태 (`GatherNode`)

`id, kind, res, x, z, yaw, scale, variant(0..1), r, zone, state('ready'|'depleted'), progress(0..1), idle, hitT, respawnT`

상태 전이: `ready` --(progress ≥ 1)--> `depleted` --(respawnT ≤ 0)--> `ready`.
`progress`는 E를 떼고 `GATHER_IDLE_GRACE`(0.6초)가 지나면 `GATHER_DECAY`(초당 0.9)로 줄어든다.

## 배치 (맵 규칙 준수)

위치를 하드코딩하지 않는다. `generateLayout(rng, MAP)`:
1. `MAP.resourceNodes`가 있으면 그대로 쓴다.
2. 비었으면 `MAP.zones`의 `kind`별 `GATHER_ZONE_DENSITY`로 구역 안에 채운다.
3. 그다음 구역 밖 빈 땅에 `GATHER_OPEN_DENSITY`로 흩뿌린다(약초·폐차·철광이 구역이 없어도 있게).
- 비우는 곳: 핵 건설 반경 + `baseMargin`, 좀비 `MAP.lanes` 양옆 `laneHalfWidth`, `MAP.playerStart`, 맵 가장자리. 노드끼리는 `gap` 이상 띄운다.
- 시드가 같고 `MAP`이 같으면 결과가 같다(`GATHER_LAYOUT.seed`). 지형 높이는 `index.ts`의 `groundY`(지금 0)를 맵 담당의 `getGroundY`로 바꾸면 된다.
- 넓은 맵 대비: 플레이어에서 `GATHER_VIEW_DIST` 밖 노드는 그리기와 애니메이션을 건너뛴다.

## 규칙 함수 (`logic/gathering.ts`)

| 함수 | 설명 |
|------|------|
| `createGathering(rng, map)` | 모델 생성 `{ nodes, events }` |
| `tick(model, dt)` | 재생성 타이머, 진행도 감소 |
| `harvest(model, node, dt, speedMul, extraChance, rng)` | 채집 진행. 끝나면 `{ id, res, amount, extra }`, 아니면 null. **지급은 호출한 쪽이 한다** |
| `blockRadius(node)` | 지금 충돌 반경 (고갈되면 그루터기/잔해 크기) |
| `rollSampleDrop(type, rng)` | 좀비 처치 샘플 드롭 `{ special, amount }` 또는 null |
| `saveGathering` / `loadGathering` | 고갈 상태와 남은 재생 시간만 저장 (Phase 2 localStorage 용) |

`model.events`(`hit` / `done` / `respawn`)는 view가 소비하고 매 프레임 비운다 → C# `event Action<GatherEvent>`.

## 다른 모듈과의 계약

- **상호작용**: 노드마다 `addInteractable({ range: r + GATHER_REACH, label, hold })`. 안내 문구는 `E 길게 눌러 나무 베기` 식. `state.mode !== 'play'`이거나 고갈이면 null.
- **스탯**: `state.stats.gatherSpeed`(채집 속도), `state.stats.gatherExtra`(추가 +1 획득 확률)를 읽는다.
- **지급**: `gain(res, amount)`(→ `state:changed`) 후 `resource:gathered { res, amount }`.
- **충돌**: 노드마다 `obstacles`에 원 하나를 등록하고, 고갈/재생성에 맞춰 `r`을 바꾼다(그루터기만 남음).
- **샘플 드롭**: `enemy:killed { type, byAlly, x, z }` 수신 → `SAMPLE_DROPS[type]` 확률로 `state.samples`(일반) 또는 `state.samplesSp`(보스·좀비 왕) 증가, `resource:gathered { res: 'samples' | 'samplesSp' }`와 떠오르는 글자.
- **새 이벤트**: `gather:hit { kind }` — 채집 중 타격마다(약 0.26초) 발행. W7이 효과음에 쓴다.
- **아군 채집병(W5)**: `core/entities.ts`의 `gatherNodes: GatherNodeRef[]`(추가만 했음)에서 `ready`인 노드를 찾아 `ref.harvest(dt, speedMul)`을 호출한다. 결과 `{ res, amount }`는 아군이 운반해 저장고에서 `gain()` 한다(자동 지급 아님).

## 연출 (view)

- 가장 가까운 채집 가능 노드에 노란 링, 채집 중이면 머리 위에 진행 막대(카메라를 향함).
- 타격마다 노드가 흔들리고 종류별 색 파편이 튄다. 완료되면 나무는 쓰러지며 사라지고 그루터기가 남고, 바위·철광·덤불·폐차 부품은 눌려서 흩어진다(잔해는 남음). 재생성은 통통 자라는 연출.
- 완료 시 `+4 나무`, 추가 획득이면 `✦` 표시가 떠오른다.
- 모델: 나무(침엽/활엽 2종), 바위(이끼 변형), 철광석(푸른 결정과 녹), 약초 덤불(꽃/열매), 폐차(뜯기는 바퀴·보닛·부품). 모두 프리미티브이고 개체마다 크기·회전·색조가 조금씩 다르다.

## 확인 방법

`npm run dev` 후 맵에서 노드로 다가가 E를 길게 누른다. 자원 수치가 늘고, 고갈된 노드는 약 60~180초 뒤 다시 자란다. 기본 `MAP`에서 노드는 약 80개(나무 35, 약초 21, 바위 15, 철 6, 폐차 6)다.
