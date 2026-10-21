# 모듈: player (W1 무기/전투)

소유 경로 `src/player/`. 이동·대시·3인칭 카메라·무기 3종·히트스캔 사격·피격/사망.

## 구조 (Unity 이식 규칙)

```
src/player/
  player.ts            System 접착층. 입력(input)→FrameIntent, 카메라/이펙트/HUD 적용. 규칙 없음
  logic/               순수 TS (three, DOM 없음). 위치는 {x,y,z}, 회전은 yaw/pitch 숫자
    math.ts            Vec3, 시드 난수 createRng, forwardOf/rightOf (좌표계 부호가 모이는 곳)
    player.ts          Player 상태 (Ctx.player)
    movement.ts        stepMovement: 이동, 조준 감속, 대시, 시선
    camera.ts          cameraPose(위치·방향·fov), aimOrigin(조준 광선 시작점)
    hitscan.ts         rayCylinder/castRay: 세로 원기둥 vs 광선 (Three 레이캐스트 미사용)
    weapons.ts         WeaponState, tryFire, startReload, switchWeapon, currentSpread
    controller.ts      PlayerController.update(dt, intent, env) → FrameOut. 이벤트 발행 담당
  view/                Three.js / DOM
    playerView.ts      휴머노이드+모자·배낭, 조준 자세, 반동, 총구 불꽃/조명, 재장전 동작
    guns.ts            무기 3종 프리미티브 모델
    effects.ts         풀링된 트레이서, 피, 착탄 먼지, 불똥, 탄피
    hud.ts             조준선(퍼짐 반영), 히트마커(일반/헤드/처치), 피격 비네트, 탄약·슬롯, 재장전 바, 대시 쿨타임
```

## 테스트 빌드와의 공존
main 의 `playtest` 슬라이스가 자체 사격·체력·좀비 시뮬레이션을 쓰므로, `main.ts` 에서 `playerOptions.combat = false` 로 둔다. 이 상태에서 player 모듈은 **이동·대시·카메라(조준 줌)·모델**만 맡고, 전투(사격·재장전·피격·HUD)는 꺼진다. enemies(W2)가 `zombies` 목록을 채우고 playtest 가 빠지는 시점에 그 한 줄을 지우면 전투 전체가 켜진다. 조준은 언제나 **화면 중앙(카메라 광선)** 이다. 포인터 잠금은 선택 사항이라 잠금이 없어도 조작된다.

## 조작
WASD 이동 · Shift 대시 · 좌클릭(누르고 있으면 연사) 사격 · **우클릭 조준**(이동 35% 감속, 퍼짐 절반, 카메라 당김·줌) · R 재장전 · 1/2/3 무기 교체(보유한 것만). 탄이 0이면 자동 재장전.
`state.mode !== 'play'`(건설/모달)이거나 포인터가 잠겨 있지 않으면 이동·사격이 멈춘다.

## 데이터 (`src/data/index.ts`, 직렬화 가능)

`WeaponDef` (표 `WEAPONS: Record<WeaponId, WeaponDef>`, 순서 `WEAPON_ORDER`)

| 필드 | 뜻 |
|------|----|
| `dmg` `rate` `mag` `reload` `pellets` `spread` `range` | 기존 수치 (피해, 발사 간격 s, 탄창, 재장전 s, 한 번에 나가는 탄 수, 퍼짐 라디안, 사거리 m) |
| `recoil` | 한 발마다 시선이 위로 튀는 각도(라디안) |
| `bloom` | 한 발마다 늘어나는 퍼짐 (1 = 기본의 2배). 초당 2.2 만큼 줄어든다 |
| `falloff` | 최대 사거리에서의 피해 감소 비율 (거리에 선형) |
| `tracer` | 트레이서 색 |

`PLAYER` 상수: `hp speed aimSpeedMul dashSpeed dashTime dashIframes hurtIframes radius sens respawnDelay headshotMul aimAssist`.
최종 수치는 `state.stats`(`dmgMul`, `reloadMul`, `magMul`, `dashCd`, `maxHp`)로 보정된다. 시작 위치는 `MAP.playerStart`.

## 상태

`Player` (Ctx.player, 다른 모듈은 읽기만): `x z y hp maxHp yaw pitch iframes dashT dashCd dashDirX dashDirZ speed moving aiming aimT dead deadT kick`.
`WeaponState`: `current ammo{무기→탄} reloadLeft reloadTotal cooldown bloom`.
`state.weapons: string[]` (공유 상태에 추가). 보유 무기. 권총만 시작 보유. 예비 탄약은 무한(탄창만 관리).

`FrameIntent`(입력의 숫자 표현) → `PlayerController.update` → `FrameOut`(카메라 자세, 사격 결과, 피격/사망/교체 플래그). view 는 FrameOut 만 읽는다.

## 판정 규칙
- 조준 광선은 **카메라 광선**이다. 시작점은 카메라 광선 위에서 플레이어 가슴에 가장 가까운 점(플레이어 뒤쪽 좀비 오사격 방지). 탄은 총구에서 그 명중 지점으로 그려진다.
- `zombies` 각 개체를 `x,z,radius(+aimAssist), height` 원기둥으로 판정, 가장 가까운 하나에 `hit(dmg, false)`.
- 피해 = `dmg × dmgMul × 거리 감쇠 × (머리 ? headshotMul : 1)`. 머리 = 명중 높이가 `height` 의 78% 이상. 샷건은 펠릿마다 따로 판정.
- 장애물은 탄을 막지 않는다(단순화). 지면(y=0)에 닿으면 먼지 이펙트. 지형 높이는 `groundY` 주입 지점이 있고 `getGroundY` 가 생기면 `player.ts` 의 한 줄만 교체한다.
- 퍼짐 = `spread × (1 + bloom) × (이동 1.35) × (조준 0.5)`.

## 피격·사망
- `player:hit` 구독. `iframes > 0`(대시 0.3s, 피격 직후 0.15s)이면 무시. 체력 0이면 `player:dead` 발행, `dead = true`(조작 정지, 모델 쓰러짐).
- **되살리기:** enemies 가 `ctx.player.hp` 를 채우면(필요하면 위치도 옮기면) 다음 프레임에 자동으로 `dead=false`, 무적 2초, `player:respawn` 발행. 아무도 되살리지 않으면 `respawnDelay`(3초) 뒤 `MAP.playerStart` 에서 체력 가득 부활 (`phase === 'ended'` 이면 부활하지 않음).
- 최대 체력이 스킬로 늘면 늘어난 만큼 현재 체력도 오른다.

## 이벤트
발행: `weapon:fired {weapon, ammo, mag}`, `weapon:ammo {weapon, ammo, mag, reloading}`(교체·재장전·발사 후), `weapon:reload {weapon, duration}`, `weapon:switched {weapon}`, `player:dead`, `player:hp {hp, maxHp}`(변할 때만), `player:respawn {x, z}`, `toast`.
구독: `player:hit {dmg, x, z}`, `weapon:unlock {weapon}`(loot 등이 무기를 주려면 이 이벤트를 낸다. `state.weapons` 에 넣고 토스트).

## UI 메모 (W7 참고)
조준선, 히트마커, 피격 비네트, 탄약/무기 슬롯, 재장전 바는 `view/hud.ts` 가 코드로 DOM 에 붙인다. 탄약 패널을 W7 HUD 로 옮기려면 `SHOW_AMMO_PANEL = false` 로 끄고 `weapon:ammo`/`player:hp` 이벤트를 쓰면 된다. 임시 `#cross`(index.html)는 동적 조준선이 대신해 숨긴다.

## Unity(C#) 이식 메모
| 여기 | Unity |
|------|-------|
| `WEAPONS`/`PLAYER` 표 | `WeaponDef`·`PlayerConfig` ScriptableObject |
| `PlayerController` / `WeaponState` / `Player` | 순수 C# 클래스 (MonoBehaviour 가 `Update` 에서 `FrameIntent` 를 채워 호출) |
| `FrameIntent` | Input System 액션 값을 담은 struct |
| `cameraPose` | Cinemachine 3rd Person Follow 또는 직접 계산 후 `Camera.transform` 적용 |
| `castRay`(원기둥) | 좀비에 CapsuleCollider 를 두고 `Physics.Raycast`, 또는 같은 수학 그대로 |
| `Effects`(풀링) | ParticleSystem + 오브젝트 풀, 트레이서는 `LineRenderer`/TrailRenderer |
| `hud.ts` DOM | UGUI 크로스헤어·탄약 텍스트, 히트마커 애니메이션 |
| `events` | C# `EventBus`/`event Action<T>` |
| 좌표 | 앞 방향 부호는 `forwardOf/rightOf` 한 곳에서 뒤집기 |
