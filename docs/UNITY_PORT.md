# Unity 이식 메모

나중에 Unity(C#)로 옮길 때 쓰는 메모입니다. 지금 목표는 "옮기기 쉬운 구조"를 유지하는 것입니다.

## 원칙
1. 로직(`src/<모듈>/logic/`)은 엔진을 모르는 순수 TS. 표현(`view/`)은 Three.js/DOM. Unity에서는 `logic`을 C#으로 번역하고 `view`는 Unity 씬·프리팹·UGUI로 다시 만든다.
2. 데이터(`src/data/`)는 직렬화 가능한 객체. 이식 시 JSON으로 내보내 ScriptableObject나 JSON 로더로 읽는다.
3. 모듈 간 통신은 타입 있는 이벤트. C#에서는 `event Action<T>`나 정적 EventBus로 1:1 대응.

## 대응표
| 여기 | Unity |
|------|-------|
| `System`(init/update/dispose) | `MonoBehaviour`(Awake/Update/OnDestroy) 또는 GameManager가 도는 순수 C# 서비스 |
| `state.ts` | 순수 C# `GameState` 클래스(싱글톤) + 저장은 JSON |
| `events.ts` | C# `EventBus` + 이벤트별 struct |
| `entities.ts` 목록 | 레지스트리 클래스. 판정은 x/z 원기둥 → `Physics` 또는 직접 거리 계산 |
| `data/index.ts` 표 | ScriptableObject(무기, 좀비, 건물, 스킬, 백신, 상자 표) |
| `humanoid.ts` 프리미티브 모델 | 프리팹(초기엔 Cube 조합) |
| `view/` 메시·이펙트 | 프리팹, ParticleSystem, LineRenderer |
| DOM UI | UGUI 또는 UI Toolkit |
| WebAudio 합성음 | AudioSource + 클립 |
| localStorage 저장 | `Application.persistentDataPath`의 JSON |

## 좌표·단위
- 지면은 x/z 평면, y가 위. Unity와 같은 왼손 좌표(Y-up)지만 Three.js는 오른손 좌표라 앞이 `-z`. 이식 시 yaw 부호와 앞 방향을 한 곳(변환 유틸)에서 뒤집는다. 로직은 yaw 숫자와 `forward(yaw)` 함수만 쓰게 해 이 지점을 하나로 모은다.
- 단위는 미터, 시간은 초.

## 이식 순서(제안)
1. `data` → ScriptableObject/JSON 내보내기 스크립트
2. `state`, `events`, `entities` → C# 코어
3. 모듈별 `logic` 번역(전투 → 좀비/웨이브 → 채집/상자 → 백신/아군 → 기지 → 스킬)
4. `view` 재제작, UI 재제작

## 모듈별 데이터 모델
각 모듈의 `docs/modules/<모듈>.md`에 정리한다(작업자가 PR에 포함).
