# 3D-GUN — Godot 4 이식

웹 게임(`../src`, TypeScript + Three.js)을 Godot 4(GDScript)로 옮기는 작업 폴더입니다.
웹 게임은 그대로 두고, 이 폴더만 따로 자랍니다. 이식 계획은 [PORTING.md](PORTING.md)에 있습니다.

## 지금 되는 것 (1~6단계)

- 타이틀: 스플래시 그림, 3D-GUN 로고, 출격 버튼(Enter), English / 한국어 전환
- 1인칭 이동: WASD, 마우스 시점, Space 점프, Shift 구르기(무적 시간 포함)
- 총기 6종 (권총·매그넘·기관단총·샷건·돌격소총·저격총): 1~6 교체, 탄 퍼짐·반동, 우클릭 조준(시야 확대),
  R 재장전, 탄 낙차(거리²에 비례, 저격총은 1/20)와 시선 반동(연사할수록 더 튀고 조준하면 0.45배, 멈추면 회복), 머리 명중 1.8배, 거리 감쇠, 샷건 산탄, 매그넘·저격총 관통(맞힐 때마다 피해 70%), 저격총 조준경
- V 무기 창: 코인으로 총 구매·강화(최대 5단계, 피해·연사·탄창·재장전·퍼짐, 샷건은 산탄 수). 열려 있는 동안 일시정지
- 좀비 15종 전부: 일반·달리기·뚱보(죽으면 독가스)·기어다니는·떼거리·도약·산성(침과 웅덩이)·폭탄(자폭)·비명(주변 가속과 소환)·장갑,
  보스 4종(브루저·폭파광·산성 괴수·군단장)과 50웨이브 좀비 왕. 보스는 내려찍기·돌진·산성 연사·폭격·소환·포효 패턴, 체력 절반 이하면 더 자주
- 웨이브: 6개 레인을 따라 3~5마리씩 무리 지어 핵으로 걸어옴. 등장 표·엘리트(20웨이브부터 금빛)·10의 배수 보스 웨이브는 웹 게임과 같은 규칙
- 핵: 레인 끝까지 온 좀비가 공격. 부서지면 출격 실패. 웨이브 클리어 시 30% 회복 + 보너스 코인. N 으로 다음 웨이브 바로 시작
- 맵·기지(4단계): 원작 지형·구역·소품과 장애물 충돌, 채집(E 길게: 나무·바위·철·약초·잔해, 고갈 뒤 다시 자람, 채집 소리),
  B 로 건설 모드(준비 단계만): 핵 기준 격자에 감시탑·기관포탑·바리케이드·감속 함정·연구소·숙소·상점 배치, X/우클릭 철거(환급), F 수리, U 강화.
  건물 곁에서 E 로도 수리(전투 중 포함)와 강화(준비 단계). 포탑은 탄약 대신 내구도라 다 쓰면 부서지고, 남은 포탑은 다음 판에도 남는다(`meta.turrets`).
  핵 수리·강화(E), 준비 단계 핵 자연 회복, 웨이브 클리어 때 핵·건물 회복. 함정은 지나가는 좀비를 느리게 하고 깎으며, 건물 피해로는 좀비가 기절하지 않는다
- 구역 배회 좀비: 숲·채석장·폐허·폐광·황무지·둥지(위험도 2 이상)마다 위험도에 비례해 어슬렁거리고(웨이브 수와 별개), 가까이 가면 쫓아옴. 처치 코인·샘플은 받는다
- 맞으면 하얗게 번쩍이고, 죽으면 뒤로 넘어짐. 경고 원, 폭발, 산성 침, 독가스 연출
- HUD: 웨이브·처치·코인·남은 좀비, 체력·핵 바, 보스 체력 바, 새 적·보스 알림, 탄약, 퍼짐을 따라 벌어지는 조준선, 명중 표시
- 사망 카드: 기록 표시 후 본부 또는 타이틀로
- 아군: 체력이 줄어 기절한 좀비 곁에서 E 를 길게 눌러 백신 주사(성공률은 백신 등급·남은 체력에 따라). 성공하면 아군(전투병·경비·채집·연구 보조), 실패하면 분노해서 깸. 아군은 다음 출격에도 저장됨
- 연구소(E): 약초·부품·철·샘플로 백신 제작, 숙소는 아군 수 +3, 상점(E): 자원↔코인 교환
- 본부(2D, `hub.tscn`): 사망·핵 파괴 때 번 재화(시작 지급 제외)의 일부와 도달 웨이브·처치 보너스가 지갑에 쌓임.
  영구 업그레이드 구매(분류 5개), 생산 시설 8종(본부 화면을 보는 동안만 수입이 쌓이는 방치 수익, 오프라인 정산 없음),
  출격 전 시작 웨이브 구매(도달한 최고 웨이브까지, 웨이브마다 골드·철·부품·샘플 비용). 저장은 `user://save.json`
  (웹 빌드는 원본 게임과 같은 localStorage 키라 두 버전이 진행을 공유; 예전 `user://meta.json` 은 처음 한 번 읽어 옴).
  스킬 트리와 지갑 교환소는 아직 없음

수치(체력, 속도, 피해, 탄창, 재장전…)는 모두 웹 게임의 `src/data` 에서 그대로 가져옵니다.

## 실행

1. [Godot 4.4](https://godotengine.org/download) 설치 (표준판, .NET 아님)
2. Godot 에서 `godot/project.godot` 열기 → F5

## 데이터 다시 내보내기

밸런스는 `src/data/index.ts` 한 곳에서만 고칩니다. 고친 뒤 저장소 루트에서:

```bash
npx tsx godot/tools/export-data.ts   # → godot/data/game_data.json
```

## 웹 빌드

```bash
GODOT=/path/to/godot ./godot/build-web.sh   # → godot/build/web/
```

스레드 없는(no-threads) 웹 템플릿을 써서 COOP/COEP 헤더 없이도 Vercel 같은 정적 호스팅에서 돕니다.

## 테스트

```bash
godot --headless --path godot --fixed-fps 60 -s res://tests/smoke_test.gd
```

봇이 가장 가까운 좀비를 조준해 쏘면서 웨이브 시작, 처치, 코인, 피격을 확인하고, 무기 창으로 6종을 모두 사서
각각 좀비를 맞히는지, 강화가 피해를 올리는지 확인합니다 (`SMOKE ... -> PASS`). `SEED=3` 처럼 스폰 씨앗을 바꿀 수 있습니다.

```bash
godot --headless --path godot --fixed-fps 60 -s res://tests/enemies_test.gd
```

좀비 15종이 하나씩 나와 플레이어에게 피해를 주는지, 처치 코인이 맞는지, 레인 좀비가 핵까지 와서 때리는지,
10웨이브에 보스가 나오는지 확인합니다 (`ENEMIES ... -> PASS`).

```bash
godot --headless --path godot --fixed-fps 60 -s res://tests/roamers_test.gd
```

구역 배회 좀비가 위험 구역마다 채워지고 웨이브 수에 안 들어가는지, 감속 함정이 듣는지, 건물 곁 E 수리·강화,
준비 단계 핵 회복, 포탑 저장·복원(저장 파일은 건드리지 않음)을 확인합니다 (`ROAMERS ... -> PASS`).
(다른 테스트는 배회 좀비를 꺼 두고 돈다: `game.roamers.enabled = false`)

```bash
godot --headless --path godot --fixed-fps 60 -s res://tests/hub_test.gd
```

본부 규칙(업그레이드·시설 수입·시작 웨이브 비용·런 정산)과 저장 파일(저장·불러오기, 깨진 값 거르기, 깨진 파일), 게임 장면으로의
인계(시작 웨이브, 공격력 배율, 시작 지급 제외)를 확인합니다 (`HUB ... -> PASS`). 저장은 임시 파일에만 쓰고 실제 저장은 건드리지 않습니다.

```bash
godot --headless --path godot --fixed-fps 60 -s res://tests/ballistics_test.gd
```

탄 낙차 거리별 값(30m 0.72m, 50m 2m, 저격총 1/20), 시선 반동의 누적·상한·조준 감소·회복, 낙차를 따라가는 구간 광선과 관통 재발사를
확인합니다 (`BALLISTICS ... -> PASS`).

### 화면 확인 (디자인)

```bash
xvfb-run -s "-screen 0 1280x720x24" godot --path godot --rendering-driver opengl3 --resolution 1280x720 -s res://tests/shots.gd     # 출격 장면 5장
xvfb-run -s "-screen 0 1280x720x24" godot --path godot --rendering-driver opengl3 --resolution 1280x720 -s res://tests/shots_ui.gd  # 타이틀·본부·사망 카드
```

`OUT=폴더` 로 저장 위치, `SHOTS=spawn,base` 로 장면을 고릅니다. 브라우저에서 실제 웹 빌드로 찍으려면
`godot --headless --path godot --export-release WebShots build/shots/index.html` 후 `node tools/godot-shots.mjs 출력폴더 spawn,base`,
원본 웹 게임은 `npx vite` 를 띄우고 `node tools/classic-shots.mjs 출력폴더` 로 같은 자리를 찍어 비교합니다.
분위기(하늘·조명·안개·불씨)는 `scripts/look.gd`, HUD 모양은 `scripts/hud_style.gd` 에 있습니다.

## 폴더

| 경로 | 내용 |
|------|------|
| `scenes/` | `title.tscn`, `game.tscn` (노드는 스크립트가 만든다) |
| `scripts/game_data.gd` | 자동 로드. `data/game_data.json` 을 읽는다 |
| `scripts/i18n.gd` | 자동 로드. en/ko 문구 |
| `scripts/title.gd` | 타이틀 화면 |
| `scripts/game.gd` | 월드, 웨이브, HUD, 사망 카드 |
| `scripts/player.gd` | 1인칭 이동과 총기 6종 (`src/player/logic` 이식) |
| `scripts/ballistics.gd` | 탄 낙차·구간 광선·시선 반동 규칙 (`hitscan.ts`, `controller.ts`, `movement.ts` 이식). 노드 없는 정적 함수 |
| `scripts/weapon_shop.gd` | V 무기 창 (구매·강화·장착) |
| `scripts/zombie.gd` | 좀비 15종: 레인 이동, 목표 선택, 근접 공격, 특수 능력, 보스 패턴 (`src/enemies/logic/sim.ts` 이식) |
| `scripts/hazards.gd` | 범위 공격과 연출: 경고 원, 폭발, 산성 침, 폭격, 독가스·산성 웅덩이 |
| `scripts/hub.gd`, `scenes/hub.tscn` | 2D 본부 화면 (지갑, 업그레이드·시설 카드, 시작 웨이브, 출격) |
| `scripts/hub_logic.gd` | 본부 규칙 (`tycoon2d/logic/economy.ts` 이식): 구매, 방치 수입, 시작 웨이브 비용, 런 정산. 노드 없이 테스트 가능 |
| `scripts/save.gd` | 자동 로드. 영구 진행·설정 저장/불러오기 |
| `scripts/meta_bonus.gd` | 영구 업그레이드를 새 런에 적용 (시작 골드·자원, 체력, 총 품질, 시작 웨이브…) |
| `scripts/core.gd` | 핵 (체력, 피해, 회복) |
| `scripts/base.gd` · `structure.gd` | 격자 건설, 건물(포탑·함정·바리케이드), 수리·강화·철거, 핵 수리·강화, 포탑 저장 (`src/base/logic` 이식) |
| `scripts/gathering.gd` | 채집 노드 (`src/gathering/logic` 이식, 배치는 웹과 같은 시드) |
| `scripts/roamers.gd` | 구역 배회 좀비 (`sim.ts` updateRoamers 이식) |
| `assets/art/` | `public/art` 에서 복사한 그림 |
| `tools/export-data.ts` | `src/data` → JSON |
| `tests/smoke_test.gd` | 헤드리스 자동 테스트: 전투와 총기 |
| `tests/ballistics_test.gd` | 헤드리스 자동 테스트: 낙차 값, 반동 누적·회복, 구간 광선 |
| `tests/enemies_test.gd` | 헤드리스 자동 테스트: 좀비 15종, 레인, 보스 |
| `tests/base_test.gd` | 헤드리스 자동 테스트: 채집, 건설, 포탑, 바리케이드 |
| `tests/roamers_test.gd` | 헤드리스 자동 테스트: 배회 좀비, 함정 감속, E 수리·강화, 핵 회복, 포탑 저장 |
| `scripts/allies.gd`, `ally.gd`, `station_panel.gd` | 백신 주사, 아군 관리·저장, 아군 AI, 연구소·상점 창 |
| `tests/allies_test.gd`, `lab_test.gd` | 헤드리스 자동 테스트: 기절→백신→아군, 백신 제작·교환 |
| `tests/hub_test.gd` | 헤드리스 자동 테스트: 본부 규칙, 저장 파일, 시작 웨이브 인계 |
