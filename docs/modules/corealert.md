# corealert (핵 방향 화살표 + 피격 자동 알림)

소유: `src/ui/logic/coreAlert.ts`(순수 TS), `src/ui/view/corePointer.ts`(DOM). Godot 쪽은 `godot/scripts/core_alert.gd`(규칙)와 `core_pointer.gd`(화면)로 같은 수치를 쓴다.

## 구조
| 파일 | 역할 | C# 대응 |
|------|------|---------|
| `ui/logic/coreAlert.ts` | `CoreAlert` 상태기계, `bearing`, `edgePoint`, `distanceAlpha`, `hpColor`, `nearestLane` | 순수 C# 클래스 `CoreAlert` + 정적 `CoreAlertMath` |
| `ui/view/corePointer.ts` | `CorePointerSystem`: 배너·붉은 테두리·화살표/마커 DOM, 경보음 재생 | UGUI Canvas(배너, 화살표 Image), `AudioSource` |

`logic`은 `three`/DOM 을 쓰지 않는다. 입력은 숫자(체력, 좌표, 시선 수평 성분)뿐이다.

## 수치 (Godot 와 동일)
| 이름 | 값 | 뜻 |
|------|----|----|
| `CLEAR_AFTER` | 4.0 s | 마지막 피격 뒤 경보를 거두기까지 |
| `ALARM_COOLDOWN` | 3.0 s | 경보음(`coreAlarm`) 사이 최소 간격 |
| `EMPHASIS_TIME` | 2.5 s | 50%·25% 통과 강조 지속 |
| `NEAR_FULL` / `FAR_FADE` / `MIN_ALPHA` | 40 m / 220 m / 0.35 | 거리별 투명도 (가까우면 1, 멀면 0.35, 사이는 선형) |
| 색 | 청록 `#2EE6D6` (체력 85% 이상) → 주황 `#FF8A2A` (50%) → 빨강 `#E0303A` (25% 이하) | `hpColor(frac)`, 점멸 중엔 빨강쪽으로 섞는다 |

## 상태 (`CoreAlert`)
`active, sinceHit, level(0/1/2), emphasis, emphasisLevel, phase, alarmCd, lastHp, lane`.

- `onHp(hp, maxHp)` → `AlertEvent[]` (`hit` | `alarm` | `half` | `quarter`). 체력이 줄면 `active=true`, `sinceHit=0`. 쿨다운이 0이거나 50%/25%를 처음 통과하면 `alarm`(쿨다운 3초 재설정). 회복해 문턱 위로 올라가면 `level`이 내려가 다시 강조할 수 있다.
- `update(dt)` → 경보가 꺼진 프레임에 true. `sinceHit >= 4`이면 `active=false`.
- `pulse()` → 점멸 세기 0..1 (경보 중에만 > 0).
- 상태 전이: `idle --(hp 감소)--> active --(4초 무피격)--> idle`. `active` 중 피격은 타이머만 재시작.

## 화면 (view)
- 핵 위 한 점(`MAP.core`, 높이 `CORE.height + 0.8`)을 카메라로 투영. 화면 안(가장자리 46px 안쪽)이면 핵 위 마커(아래를 가리키는 화살표 + 거리), 밖이거나 뒤면 `bearing`/`edgePoint`로 가장자리에서 핵 쪽으로 회전한 화살표 + 중심 쪽에 거리(m).
- 경보 중: 상단 배너 "핵이 공격받고 있습니다! · 북쪽 레인"(가장 가까운 좀비의 레인 = `nearestLane`), 50%/25% 강조 줄, 붉은 테두리 점멸, 화살표 붉은 점멸·확대.
- 일시정지, 모달, 사망, 런 종료 중에는 모두 숨긴다.

## 이벤트
- 구독: `core:damaged {hp,maxHp}`(체력 변화마다 `onHp`), `run:start`(리셋).
- 발행: 없음. 경보음은 `audio/index.ts`의 `playSfx('coreAlarm')`을 호출하고, 레시피(880/660/880Hz 사이렌, 쿨다운 2.5s)는 `audio/logic/cues.ts`에 있다.
- 문구는 i18n 키 `coreAlert.attack|lane|half|quarter|lane.<id>` (ko/en).
- 디버그(DEV): `window.__coreAlert` = `{alarms, events, onScreen, shown, dist, angle, alert}`.

Unity 메모: `CoreAlert`는 그대로 C# 클래스로 옮기고, `core:damaged`는 `UnityEvent<float,float>`로 받는다. 화면 투영은 `Camera.WorldToScreenPoint`(z<0이면 뒤).
