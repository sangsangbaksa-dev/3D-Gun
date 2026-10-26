# 3D-GUN — Godot 4 이식

웹 게임(`../src`, TypeScript + Three.js)을 Godot 4(GDScript)로 옮기는 작업 폴더입니다.
웹 게임은 그대로 두고, 이 폴더만 따로 자랍니다. 이식 계획은 [PORTING.md](PORTING.md)에 있습니다.

## 지금 되는 것 (첫 플레이 버전)

- 타이틀: 스플래시 그림, 3D-GUN 로고, 출격 버튼(Enter), English / 한국어 전환
- 1인칭 이동: WASD, 마우스 시점, Space 점프, Shift 구르기(무적 시간 포함)
- 권총 1종: 연사, 탄 퍼짐·반동, 우클릭 조준(시야 확대), R 재장전, 머리 명중 1.8배, 거리 감쇠
- 좀비: 웨이브마다 주변에서 나와 플레이어를 쫓아오고, 팔을 들어 때리고, 맞으면 번쩍이고, 죽으면 쓰러짐
  - 3웨이브부터 달리기 좀비 섞임. 웨이브 클리어 보너스 코인
- HUD: 웨이브·처치·코인, 체력 바, 탄약, 퍼짐을 따라 벌어지는 조준선, 명중 표시
- 사망 카드: 기록 표시 후 타이틀로

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

봇이 가장 가까운 좀비를 조준해 쏘면서 웨이브 시작, 처치, 코인, 피격을 확인합니다 (`SMOKE ... -> PASS`).

## 폴더

| 경로 | 내용 |
|------|------|
| `scenes/` | `title.tscn`, `game.tscn` (노드는 스크립트가 만든다) |
| `scripts/game_data.gd` | 자동 로드. `data/game_data.json` 을 읽는다 |
| `scripts/i18n.gd` | 자동 로드. en/ko 문구 |
| `scripts/title.gd` | 타이틀 화면 |
| `scripts/game.gd` | 월드, 웨이브, HUD, 사망 카드 |
| `scripts/player.gd` | 1인칭 이동과 권총 (`src/player/logic` 이식) |
| `scripts/zombie.gd` | 좀비 추적·공격·사망 (`src/enemies/logic` 일부 이식) |
| `assets/art/` | `public/art` 에서 복사한 그림 |
| `tools/export-data.ts` | `src/data` → JSON |
| `tests/smoke_test.gd` | 헤드리스 자동 테스트 |
