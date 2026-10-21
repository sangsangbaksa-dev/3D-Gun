# 모듈: UI (`src/ui/`, `index.html` 마크업)

HUD, 토스트, 타이틀(실시간 3D 배경), 일시정지, 엔딩/게임오버, 공용 모달(`ui:modal`).

## 구조
| 경로 | 역할 | 엔진 의존 |
|------|------|-----------|
| `logic/toasts.ts` | 토스트 대기열(중복 병합, 수명) | 없음 |
| `logic/modalTracker.ts` | 모달 열림 깊이 → `state.mode` 복원 | 없음 |
| `logic/hudFormat.ts` | 비율/문구/시간 포맷, 위험 단계 | 없음 |
| `view/hud.ts` | state/이벤트 → HUD DOM | DOM |
| `view/screens.ts` | 타이틀·일시정지·엔딩 버튼 연결 | DOM |
| `view/titleScene.ts` | 타이틀 배경(불·연기·좀비 거리, 별도 렌더러, 시작 시 해제) | three |
| `view/modal.ts` | `openBox/closeBox`, 조작법 내용 | DOM |
| `view/icons.ts`, `view/ui.css` | SVG 아이콘, 공용 스타일 | |

## 데이터/상태
UI 고유 상태 없음. 읽는 값: `state`(wave, phase, 자원, 골드, 열쇠, 샘플, 아군, 코어 체력, xp, 스킬 포인트, stats), `ctx.player`(hp, maxHp, dashCd), `zombies`(보스 체력바). 통계(처치 수, 플레이 시간)는 HUD 안에서만 센다.

## 이벤트
- 구독: `state:changed`, `weapon:fired`, `interact:prompt`, `toast`, `wave:start/clear`, `boss:spawn/dead`, `enemy:killed`, `player:dead`, `core:destroyed`, `resource:gathered`, `chest:opened`, `building:*`, `zombie:converted`, `ally:dead`, `game:end`, `skill:levelup`, `ui:modal`
- 처리: `ui:modal{open}` → 포인터 락 해제/복귀, `state.mode`(`modal`↔이전 값), `body.modal-open`

## 다른 모듈이 창을 만들 때 (공용 모달 규칙)
1. `#box` 안을 자기 DOM 으로 채우고 `#modal` 에 `open` 클래스를 붙인 뒤 `events.emit('ui:modal', {open:true})`. 닫을 때 `{open:false}`. (또는 `ui/view/modal.ts` 의 `openBox` 사용은 W7 내부용)
2. 클래스: `.panel`, `.btn`(`.primary` `.danger` `.sm` `.lg`), `.btn-row`, `.row`, `.kicker`, `.pill`, `.muted`, `.t0~.t3`(등급색), `kbd`. 색 변수: `--accent --warn --danger --xp --gold --dim --line`.
3. Esc 는 열린 `#box` 를 닫는다(내용은 `closeBox` 로 비워지지 않으므로 각 모듈이 `ui:modal` 로 정리).
4. 타이틀(z 50)보다 `#modal`(z 60)이 위에 있어 조작법 같은 창이 항상 보인다.

## 화면 흐름
타이틀(`#title`, 게임 시작/조작법) → 플레이(HUD) → Esc/포인터락 해제 시 일시정지(`#hint`: 계속하기/스킬트리/조작법/소리) → `game:end` 엔딩(승리: 계속하기·다시 시작, 패배: 다시 시작). WebGL 미지원이면 타이틀에 안내를 띄우고 시작을 막는다.

## Unity(C#) 메모
HUD/타이틀 → UGUI Canvas(Screen Space Overlay) + 프리팹. `ToastQueue`, `ModalTracker`, `hudFormat` → 순수 C# 클래스. 타이틀 배경 → 별도 Scene(카메라 Cinemachine 드리프트, ParticleSystem 불/연기). `ui:modal` → `Time.timeScale`/커서 잠금 처리.
