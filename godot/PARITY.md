# 웹 원본(`src/`) ↔ Godot 이식 기능 대조

감사 기준: 웹 `src/` 모듈별로 Godot(`godot/scripts`)에 없거나 규칙·수치가 다른 것. 상태: 같음 / 구현(이번 감사에서 넣음) / 미구현(남음) / 해당 없음.

| 웹 모듈 | 항목 | Godot | 비고 |
|---|---|---|---|
| player | 이동·대시·점프·총기 6종·탄 낙차·시선 반동·산탄·관통·머리 1.8배 | 같음 | `ballistics.gd` |
| player | **조준 보정 `PLAYER.aimAssist` 0.15** (히트스캔 판정 반경 = 좀비 반지름 + 0.15m) | **구현** | Godot 는 물리 캡슐 광선이라 가장자리 탄이 빗나갔다. `Ballistics.assist_pick` 이 살아 있는 좀비를 웹과 같은 원기둥식으로 한 번 더 검사(물리 광선이 더 가까운 것을 맞혔으면 그쪽 우선). 테스트 `ballistics_test.gd` |
| player | G 약초 응급처치 (`HERB_HEAL`: 약초 3개, 최대 체력 40%, 대기 6초, 가득/부족/대기 안내) | **구현** | `game.gd herb_heal()`, 수치는 `game_data.json herbHeal` |
| player | 방향키 시점 (초당 650px, 상하 0.7배) | **구현** | `player.gd _arrow_look` |
| player | 사망 후 자동 부활 `respawnDelay` | 해당 없음 | Godot 는 사망 = 출격 종료(사망 카드) |
| enemies | 좀비 15종·보스 4종·왕·엘리트·레인·웨이브 표·기절/분노 | 같음 | 수치는 `game_data.json` |
| enemies | `CHECKPOINT_EVERY`, `checkpoint` | 해당 없음 | 웹도 `run:over` 에서 checkpoint 를 항상 0 으로 보냄(죽은 기능) |
| enemies | 내비메시 길찾기 | 미구현 | 벽 따라 미끄러지는 회피만 (PORTING.md 4단계) |
| base | 건물 7종·격자·수리·강화·철거·핵 수리/강화·준비 단계 회복·포탑 저장 | 같음 | |
| base | 핵 파괴 후 `CORE_REBUILD_PCT` 60% 복구 | 해당 없음 | 웹은 run 이 안 끝난 경우만. Godot 는 핵 파괴 = 사망 카드 |
| gathering | 노드 5종·배치(같은 시드)·고갈/재생·`gatherExtra` | 같음 | `GATHER_VIEW_DIST`/구역 밀도는 배치가 JSON 으로 구워져 있어 불필요 |
| allies | 백신 주사·성공률·역할 4종·저장·연구소·숙소·상점 | 같음 | |
| allies | **C 백신 등급 순환** | **구현** | `allies.cycle_tier()` (보유한 등급만) |
| allies | **Q 가까운 아군 역할 바꾸기** (6m 이내, 역할 상한 반영) | **구현** | `allies.cycle_nearest_role()` |
| allies | L 키로 백신 창 열기 | 미구현 | Godot 는 연구소 건물 곁 E 로만 연다 |
| skills | 스킬 19개·런 경험치·포인트 | 같음 | |
| tycoon2d | 업그레이드·시설·시작 웨이브·교환소·정산 | 같음 | |
| loot | 상자·가챠·열쇠·황금 열쇠·천장 | 해당 없음 | 웹에서 이미 제거됨(`chests.ts` 는 빈 스텁). `CHEST_*`, `REWARD_*`, `KEY_PRICE`, `COSTUMES` 는 죽은 상수 → 이식 대상 아님 |
| ui | 키 막대(상황별 단축키)·H/F1 도움말 창 | 미구현 | Godot H 는 튜토리얼 넘기기만. 조작키 창(타이틀)·일시정지는 있음 |
| ui | 웨이브 클리어 플래시·코어 경보·코어 포인터·사망 카드 | 같음 | 연출은 Godot 식 |
| audio | 합성 효과음·구역 발소리·보스 포효·경고 | 같음 | 청감 확인은 실기 필요 |
| title | 설정(볼륨·감도·언어)·조작키·스플래시·도입 컷 | 같음 | 효과음/앰비언트 슬라이더는 Godot 추가 |
| i18n | `ui-en.ts` 227키 중 이름이 같은 것 42키 | 부분 | 나머지 185키(hub 67·keys 29·tutorial 26·hud 19·death 13·coreAlert 10·story 7 …)는 Godot 가 같은 문구를 **다른 키 이름**으로 각 스크립트(`hub.gd`, `tutorial_text.gd`, `intro.gd`, `allies.gd TEXT`)에 들고 있다. 키 이름 통일은 미구현. 키 막대·도움말 문구는 UI 자체가 없어 없음 |
| data | `export-data.ts` 미내보내기 상수 | 정리됨 | `HERB_HEAL` 추가. 남은 것은 죽은 상수(상자 계열)·구형 `WEAPONS`·`ROSTER` 등 |

## 이번 감사에서 넣은 것 (이식 가치 순)
1. 조준 보정 (전투 체감 직결, 모든 무기 적용)
2. G 약초 응급처치 (+ i18n en/ko, 데이터 내보내기)
3. C/Q 아군 조작
4. 방향키 시점

테스트: `ballistics_test.gd`(조준 보정 항목 추가), `controls_test.gd`(G/C/Q 신규).

## 남은 것
- H/F1 도움말 창 + 상황별 키 막대, L 백신 창
- i18n 키 이름 통일(웹 `src/i18n` → Godot)
- 내비메시 길찾기
