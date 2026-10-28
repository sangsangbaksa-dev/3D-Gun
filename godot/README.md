# 3D-GUN — Godot 4 이식

웹 게임(`../src`, TypeScript + Three.js)을 Godot 4(GDScript)로 옮기는 작업 폴더입니다.
웹 게임은 그대로 두고, 이 폴더만 따로 자랍니다. 이식 계획은 [PORTING.md](PORTING.md)에 있습니다.

## 지금 되는 것 (1~5단계)

- 타이틀: 스플래시 그림, 3D-GUN 로고, 출격 버튼(Enter), English / 한국어 전환
- 1인칭 이동: WASD, 마우스 시점, Space 점프, Shift 구르기(무적 시간 포함)
- 총기 6종 (권총·매그넘·기관단총·샷건·돌격소총·저격총): 1~6 교체, 탄 퍼짐·반동, 우클릭 조준(시야 확대),
  R 재장전, 머리 명중 1.8배, 거리 감쇠, 샷건 산탄, 매그넘·저격총 관통(맞힐 때마다 피해 70%), 저격총 조준경
- V 무기 창: 코인으로 총 구매·강화(최대 5단계, 피해·연사·탄창·재장전·퍼짐, 샷건은 산탄 수). 열려 있는 동안 일시정지
- 좀비 15종 전부: 일반·달리기·뚱보(죽으면 독가스)·기어다니는·떼거리·도약·산성(침과 웅덩이)·폭탄(자폭)·비명(주변 가속과 소환)·장갑,
  보스 4종(브루저·폭파광·산성 괴수·군단장)과 50웨이브 좀비 왕. 보스는 내려찍기·돌진·산성 연사·폭격·소환·포효 패턴, 체력 절반 이하면 더 자주
- 웨이브: 6개 레인을 따라 3~5마리씩 무리 지어 핵으로 걸어옴. 등장 표·엘리트(20웨이브부터 금빛)·10의 배수 보스 웨이브는 웹 게임과 같은 규칙
- 핵: 레인 끝까지 온 좀비가 공격. 부서지면 출격 실패. 웨이브 클리어 시 30% 회복 + 보너스 코인. N 으로 다음 웨이브 바로 시작
- 맞으면 하얗게 번쩍이고, 죽으면 뒤로 넘어짐. 경고 원, 폭발, 산성 침, 독가스 연출
- HUD: 웨이브·처치·코인·남은 좀비, 체력·핵 바, 보스 체력 바, 새 적·보스 알림, 탄약, 퍼짐을 따라 벌어지는 조준선, 명중 표시
- 사망 카드: 기록 표시 후 타이틀로
- 아군: 체력이 줄어 기절한 좀비 곁에서 E 를 길게 눌러 백신 주사(성공률은 백신 등급·남은 체력에 따라). 성공하면 아군(전투병·경비·채집·연구 보조), 실패하면 분노해서 깸. 아군은 다음 출격에도 저장됨
- 연구소(E): 약초·부품·철·샘플로 백신 제작, 숙소는 아군 수 +3, 상점(E): 자원↔코인 교환

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
| `scripts/weapon_shop.gd` | V 무기 창 (구매·강화·장착) |
| `scripts/zombie.gd` | 좀비 15종: 레인 이동, 목표 선택, 근접 공격, 특수 능력, 보스 패턴 (`src/enemies/logic/sim.ts` 이식) |
| `scripts/hazards.gd` | 범위 공격과 연출: 경고 원, 폭발, 산성 침, 폭격, 독가스·산성 웅덩이 |
| `scripts/core.gd` | 핵 (체력, 피해, 회복) |
| `assets/art/` | `public/art` 에서 복사한 그림 |
| `tools/export-data.ts` | `src/data` → JSON |
| `tests/smoke_test.gd` | 헤드리스 자동 테스트: 전투와 총기 |
| `tests/enemies_test.gd` | 헤드리스 자동 테스트: 좀비 15종, 레인, 보스 |
| `scripts/allies.gd`, `ally.gd`, `station_panel.gd` | 백신 주사, 아군 관리·저장, 아군 AI, 연구소·상점 창 |
| `tests/allies_test.gd`, `lab_test.gd` | 헤드리스 자동 테스트: 기절→백신→아군, 백신 제작·교환 |
