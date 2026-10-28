# Godot 이식 계획

## 결론

옮길 수 있습니다. 웹 게임은 로직(`src/*/logic`, 엔진과 무관한 순수 TS)과 표현(`view`, Three.js/DOM)이 이미 나뉘어 있고,
밸런스 수치는 `src/data` 한 곳에 모여 있어서 이식이 쉬운 구조입니다. 로직은 GDScript 로 한 줄씩 번역하고,
표현(3D 모델, 이펙트, UI)은 Godot 노드로 새로 만듭니다. Godot 웹 내보내기로 지금처럼 브라우저(Vercel)에서도 돌릴 수 있습니다.

## 선택한 기술

- **Godot 4.4, GDScript** (C# 은 웹 내보내기가 안 되므로 제외)
- **렌더러: Compatibility (WebGL 2)** — 웹에서 도는 유일한 렌더러. PC 빌드도 같은 렌더러로 맞춰 화면 차이를 없앤다
- **웹 템플릿: no-threads** — Vercel 에 특별한 헤더(COOP/COEP) 없이 올릴 수 있다
- **데이터: `src/data` → JSON 내보내기** (`tools/export-data.ts`). 이식 기간 동안 두 버전의 수치가 어긋나지 않게 한다

## 무엇이 무엇으로

| 웹 게임 | Godot |
|---------|-------|
| `System` (init/update/dispose), `main.ts` 의 배열 | 씬의 노드 + `_ready` / `_process` / `_physics_process` |
| `core/state.ts`, `core/meta.ts` (localStorage) | 자동 로드 싱글톤 `GameState` + `user://save.json` (웹에서는 IndexedDB 로 저장됨) |
| `core/events.ts` 이벤트 버스 | Godot 시그널 (자동 로드 `Events` 에 모음) |
| `src/data` 표 | `data/game_data.json` → 나중에 `Resource`(.tres) 로 바꿀 수 있음 |
| `player/logic` (이동, 무기, 히트스캔) | `CharacterBody3D` + `PhysicsRayQueryParameters3D` |
| `enemies/logic` (좀비 AI, 웨이브 감독) | `CharacterBody3D` 좀비 + `NavigationAgent3D`(레인·길찾기) + 웨이브 노드 |
| `core/humanoid.ts`, `*/view/models.ts` 프리미티브 모델 | 지금은 같은 박스 조합, 나중에 `.glb` 모델(Blender) 로 교체 |
| `core/terrain.ts`, `scenery.ts`, `data/map.ts` | `MeshInstance3D` 지형 + `StaticBody3D` 충돌, 맵 배치는 JSON 에서 읽거나 에디터에서 배치 |
| 파티클·트레이서 (`view/effects.ts`, `fx.ts`) | `GPUParticles3D`/`CPUParticles3D`, `ImmediateMesh` |
| DOM HUD, 본부(tycoon2d), 강화창, 사망 카드 | `Control` 노드 (테마 `.tres` 로 색·글꼴 통일) |
| 2D 본부 화면 (`tycoon2d`) | 별도 씬 `hub.tscn` (`Control` 기반) |
| `i18n` (en 기본, ko) | Godot 번역: `src/i18n` → CSV 내보내기 → `TranslationServer` |
| WebAudio 합성음 (`audio/`) | `AudioStreamGenerator` 로 같은 합성, 또는 녹음한 효과음 `.ogg` |
| 포인터 잠금 | `Input.mouse_mode = MOUSE_MODE_CAPTURED` |

## 단계

1. ✅ **첫 플레이 버전** — 타이틀, 1인칭 이동, 권총, 좀비 웨이브, HUD, 사망 카드, 웹 빌드
2. ✅ **총기 6종 + 강화** — 매그넘·기관단총·샷건·소총·저격총, 1~6 교체, 산탄·관통·조준경, V 강화창
   (강화 비용의 부품은 채집이 들어오는 4단계에서, 탄 낙차와 조준 보정은 3단계에서)
3. ✅ **좀비 전 종류 + 보스** — 도약·산성·폭탄·비명·장갑·뚱보, 보스 패턴, 엘리트, 레인 경로, 핵
   (기절은 백신과 함께 5단계에서, 구역 배회 좀비와 내비메시 길찾기는 맵이 들어오는 4단계에서)
4. ✅ **맵·기지** — 원작 지형·구역·핵, 채집(E 길게), 격자 건설(B, 준비 중), 감시탑·기관포탑·바리케이드·트랩, 수리·강화·철거, 핵 수리·강화, 좀비가 건물 공격
   (포탑 탄약 보충, 내비메시 길찾기는 아직)
5. ✅ **아군·연구소·백신**, 교환소 — 기절한 좀비에 E 길게 눌러 백신 주사(성공 시 아군, 실패 시 분노), 역할 4종 아군(전투병·경비·채집·연구 보조)과 저장, 연구소 백신 제작 창, 숙소로 아군 수 확장, 상점 자원↔코인 교환
   (`allies.gd`, `ally.gd`, `station_panel.gd`; 테스트 `allies_test.gd`, `lab_test.gd`)
6. **2D 본부와 영구 진행** — 업그레이드, 시작 웨이브 구매, 저장/불러오기
7. **연출과 소리** — 이야기 장면, 튜토리얼, 효과음, 진짜 3D 모델로 교체
8. **배포** — 웹 빌드를 Vercel 에, 원하면 PC(Windows/Mac) 와 모바일 빌드

## 위험과 대응

- **웹 빌드 크기**: 엔진 wasm 이 약 44MB(압축 전송 시 약 10MB). 첫 로딩이 지금 웹 게임보다 길다. Vercel 은 자동으로 압축해서 보낸다. 더 줄이려면 쓰지 않는 엔진 모듈을 뺀 사용자 정의 템플릿을 빌드한다.
- **웹 성능**: Compatibility 렌더러라 그림자·후처리가 단순하다. 좀비 40마리 + 이펙트를 저사양에서 확인해야 한다.
- **두 버전 동시 유지**: 이식 중에는 웹 게임에 새 기능이 계속 들어간다. 수치는 JSON 내보내기로 맞추지만, 로직 변경은 양쪽에 따로 옮겨야 한다. 어느 시점에 웹 게임 기능 추가를 멈추는 게 좋다.
- **사용자 저장 데이터**: 웹 게임의 localStorage 진행(코인, 업그레이드)은 Godot 웹 빌드가 직접 읽지 못한다. 옮기려면 JSON 내보내기/가져오기 버튼이 필요하다.
- **좌표계**: 둘 다 Y 위, 앞이 -Z 라 숫자를 그대로 쓸 수 있다 (Unity 와 달리 뒤집을 필요 없음).
- **AI 길찾기**: 웹 게임은 레인 경유점과 직접 충돌 처리를 쓴다. 이번 버전은 벽을 따라 미끄러지는 간단한 회피만 있고, 3단계에서 `NavigationRegion3D` 로 바꾼다.

## 정해야 할 것

- 웹 버전을 계속 둘지, Godot 버전이 따라잡으면 3d-gun.vercel.app 을 Godot 웹 빌드로 바꿀지
- 이식 중 웹 게임에 새 기능을 계속 넣을지 (넣으면 양쪽 작업)
- 웹만 낼지, PC(Steam 등)·모바일 빌드도 낼지
