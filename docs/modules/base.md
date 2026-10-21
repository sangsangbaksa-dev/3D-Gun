# base (기지 / 타이쿤 / 디펜스)

소유: `src/base/`, `data/index.ts`의 BUILDINGS 구역. 구조: `logic/`(순수 TS)와 `view/`(Three.js, DOM).

## 구조
| 파일 | 역할 | C# 대응 |
|------|------|---------|
| `logic/grid.ts` | 격자 스냅, 레이→지면, 배치 검사, 레인 입구 계산 | 정적 `GridUtil` |
| `logic/base.ts` | `createBase()`: 핵, 건물 목록, 배치/철거/수리/강화, 포탑 AI, 함정, 숙소 보너스, 저장 | `BaseService`(순수 C# 클래스) |
| `logic/shop.ts` | 자원 판매, 열쇠 구매 | `ShopService` |
| `view/*` | 모델, 이펙트, 건설 모드 입력, 미리보기, 상점 창 | 프리팹, ParticleSystem, UGUI |
| `index.ts` | `BaseSystem` (main.ts 한 줄) | `MonoBehaviour` 진입점 |

`logic`은 `three`/DOM 을 쓰지 않는다. 장애물 목록(`obstacles`)과 난수(`rng`)는 `createBase({obstacles, rng})`로 주입한다.

## 데이터 모델 (`src/data/index.ts`)
```
BuildingDef { name, cost: Partial<Record<ResKey,number>>, radius, hp, height, desc,
              turret?: { ammo, refill: Cost, levels: TurretLevel[] },
              trap?:   { radius, slow, dps } }
TurretLevel { dmg, rate(초), range(m), upCost: Cost, upGold }   // levels[0] 이 1단계
BuildingId = tower | mgtower | barricade | trap | lab | barracks | shop
CORE = { radius, height, hp: number[] /* 강화 단계별 최대 체력 */ }
CORE_REPAIR { pct, cost }  CORE_UPGRADES: {cost, gold}[]  CORE_REBUILD_PCT
GRID, CORE_CLEARANCE, DEMOLISH_REFUND, BARRACKS_CAP, KEY_PRICE{iron,gold}
```
맵 쪽 값은 `data/map.ts`의 `MAP.core`, `MAP.buildRadius`, `MAP.lanes`를 읽는다. Unity: 건물/핵은 ScriptableObject(`BuildingDef`), 포탑 단계는 `TurretLevel[]`.

## 런타임 상태 (`Building`, `CoreStructure`)
`StructureRef`(id,x,z,radius,hp,maxHp,height,dead,view,kind,hit)를 구현하고 아래를 더한다.
`level, ammo, cooldown, aimYaw, tracking, pulse, hitFlash`. 핵은 `kind:'core'`, `level, hitFlash`, 체력은 `state.coreHp/coreMaxHp`와 동기화.
저장: `baseSave()/baseLoad()` → `{coreLevel, coreHp, buildings:[{kind,x,z,level,hp,ammo}]}` (직렬화 가능). 총괄이 localStorage 에 연결한다.

## 규칙 요약
- 건설: `phase==='prep'`에서만. 격자 2m(핵 기준), 건설 반경 안, 핵·다른 건물·장애물과 겹치면 불가. 비용은 `spend()`. 완료 시 `structures`에 등록, 함정 외에는 `obstacles`에도 등록.
- 철거: 준비 단계, 비용의 50% × 체력 비율 환급. 우클릭.
- 수리(전 단계): 건물 E(감시탑류·바리케이드·함정·숙소), 핵 E. 연구소/상점의 수리는 건설 모드에서 F. 비용 = 건설 비용 × 50% × 잃은 체력 비율.
- 탄약 보충(전 단계): 포탑 E. 강화(준비 단계): 포탑 E 또는 건설 모드 U, 핵 E(체력이 가득일 때).
- 포탑: 사거리 안 가장 가까운 좀비를 조준(회전 속도 제한), 탄약이 있고 각도가 맞으면 `zombie.hit(dmg, true)`. 크리티컬 10%(rng). 사격 이펙트는 `fx` 큐로 view 에 전달.
- 함정: 0.5초마다 범위 안 좀비에 `dps×0.5` 피해, 범위 안에 있는 동안 `zombie.slowMul = slow`(밖으로 나가면 제거).
- 숙소: `state.allyCapBonus = 숙소 수 × 3`.
- 핵: `hit(dmg)` → `state.coreHp` 감소, `core:damaged`; 0 이면 `core:destroyed`, 1.2초 뒤 `CORE_REBUILD_PCT`만큼 체력 복구(체크포인트 복귀 처리는 enemies). 준비 단계에는 초당 약 1.2% 자연 회복.

## 이벤트
| 발행 | 구독 |
|------|------|
| `building:placed/destroyed`, `core:damaged/destroyed`, `interact:lab`, `interact:shop`, `toast`, `ui:modal` | `wave:start`(건설 모드 종료), `interact:shop`(상점 창), `state:changed`(상점 갱신), `ui:modal`(건설 모드 종료) |

상태 전이: 건설 모드 `play ↔ build`(B), 상점 창 `play → modal → play`.

## 다른 모듈에 부탁하는 것
- enemies: 이동 속도에 `(z as {slowMul?:number}).slowMul ?? 1`을 곱한다(슬로우 트랩). 건물과 핵을 공격할 때는 `structures`의 `hit(dmg)`을 부른다. 핵 중심은 `MAP.core`.
- allies: `building:placed/destroyed`의 `kind==='barracks'`가 아니라 `state.allyCapBonus`를 읽으면 된다.
- 총괄: `getGroundY`가 생기면 자동으로 지형 높이를 쓴다(`view/ground.ts`).

## C# 메모
`createBase` → `BaseService` 클래스(생성자에 `IObstacleSink`, `Func<float> rng`). `Fx` 큐 → 이벤트(`ShotFired` 등)로 바꿔 파티클/라인을 재생. `Slowable.slowMul` → 좀비 컴포넌트의 `speedMultiplier`. `view/models.ts`는 프리팹 제작 참고용(치수·색).
