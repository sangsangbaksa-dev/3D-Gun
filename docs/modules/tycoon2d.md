# tycoon2d (W8): 사망 후 2D 업그레이드 타이쿤

## 흐름
`run:over`(또는 아직 W2가 안 냈을 때 `player:dead`/`core:destroyed` 대체 감지) → `bankRun` 정산 → 2D 화면(`state.mode='modal'`, 포인터 락 해제) → "출격" → `state.statMods`/`state.start` 갱신 → `run:start` 발행 → 다른 모듈이 런 상태를 비운 뒤 `seedRun()`이 시작 골드·자원·스킬·무기·핵 체력을 얹는다.

## 데이터 모델
- 영구 상태 `Meta`(`src/core/meta.ts`, localStorage `zt3d.meta.v1`): `wallet`(gold, wood, stone, iron, herb, parts, samples, samplesSp, skillPoints), `upgrades`, `facilities`, `skills`(SKILLS 노드 영구 레벨), `bestWave/bestCheckpoint/totalRuns/totalKills`, `lastSeen`.
- 표 `src/data/tycoon2d.ts`: `UPGRADES`(효과 kind별 `per`), `PRODUCERS`(방치 생산), `IDLE`, `KEEP_BASE` 등. 함수 없음.
- 스킬 노드는 `data/index.ts`의 `SKILLS`를 그대로 읽는다(복제 없음). 구매 비용은 스킬 포인트(1+현재 레벨).
- `state.start`에 추가된 필드: `samples, skillPoints, weapons, weaponLv(총 품질), turretDmgMul`. W1은 `weaponLv`를, W6는 `turretDmgMul`/`coreHp`를 읽어 반영하면 된다.
- 준비 시간: `prepTime()`은 30초 고정, 업그레이드 보너스는 `state.start.prepBonus`.

## 정산 규칙
남은 재화 × 회수율(기본 70%, 업그레이드로 증가) + 웨이브 보너스(`(wave-1)×15 + 처치×0.5` 골드). 스킬 포인트는 100% 보존. 방치 수익은 시설 레벨 × perSec × 수입 배율, 오프라인은 최대 4시간, 50%.

## 구조
`logic/economy.ts`(순수, DOM·three 없음) / `view/panel.ts`·`style.ts`(DOM) / `index.ts`(System 접착).

## Unity 이식 메모
`Meta` → JSON 저장 클래스(`persistentDataPath`), `UPGRADES/PRODUCERS` → ScriptableObject, `economy.ts` → 정적 C# 서비스, `panel.ts` → UGUI 화면, `state.statMods`(클로저) → `List<Action<Stats>>` 또는 보너스 구조체.
