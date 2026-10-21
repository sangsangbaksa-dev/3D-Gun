# 작업자 브리프

공통: 저장소 `sangsangbaksa-dev/3D-Gun`의 `main`(조율 PR #1 병합 후)에서 `feat/<모듈>` 브랜치를 따서 작업하고, 완료하면 `main`으로 PR을 엽니다.
시작 전 `docs/GAME_DESIGN.md`, `docs/ARCHITECTURE.md`, `docs/COORDINATION.md`를 읽고, **소유 경로만** 수정합니다. 한국어로 보고합니다.
끝나기 전 `npm run build` 통과와 브라우저 실제 플레이 확인(Playwright 스크린샷 가능)을 하고, PR 설명에 확인 방법을 적습니다.

**Unity 이식 규칙(전원 필수):** 나중에 Unity로 옮깁니다. `src/<모듈>/logic/`(순수 TS, `three`·DOM import 금지)과 `src/<모듈>/view/`(Three.js·DOM)를 분리하고, 수치·표는 `src/data/`의 직렬화 가능한 객체로 둡니다. PR에 `docs/modules/<모듈>.md`(데이터 모델, 이벤트, C# 대응 메모)를 추가합니다. 자세한 내용은 `docs/COORDINATION.md` 1-b, `docs/UNITY_PORT.md`.

**배포 규칙(전원 필수):** Vercel 정적 배포입니다. 서버·환경 변수 없이 `npm run build`의 `dist/`로 동작해야 하고, 에셋은 상대 경로로 번들에 포함하며, 큰 외부 에셋·무거운 의존성은 추가하지 않습니다(오디오는 WebAudio 합성).

**맵 규칙(전원 필수):** 맵은 크고 3D입니다. 위치는 하드코딩하지 말고 `src/data/map.ts`의 `MAP`(zones, lanes, resourceNodes, chests, core, buildRadius)을 읽으세요. 높이는 `getGroundY(x, z)`(없으면 0). 자세한 내용은 `docs/COORDINATION.md` 1-d.

## W1 무기/전투 (`feat/player`, `src/player/`)
좌클릭 히트스캔 사격(`zombies` 목록 대상 레이캐스트, `hit(dmg*state.stats.dmgMul, false)`), 무기 3종(`WEAPONS`, 권총만 시작 보유, 1/2/3 교체), R 재장전(`reloadMul`, `magMul` 반영), 트레이서·총구 이펙트. `player:hit` 이벤트로 체력 감소(대시 무적 `iframes` 존중), 0이면 `player:dead`. `state.mode`가 build/modal이면 사격 정지. `weapon:fired` 발행. 무기 획득 방식(상자 보상 등)은 `state`에 보유 무기 필드를 추가해 W4와 맞춥니다.

## W2 좀비/웨이브/보스 (`feat/enemies`, `src/enemies/`)
일반/달리기/뚱보 좀비(휴머노이드 재사용, `zombieStats`)가 플레이어·아군·건물을 쫓아 공격(플레이어는 `player:hit`). `zombies` 목록과 `ZombieRef.hit/stunned` 구현(체력 낮을 때 `stunBonus` 반영 기절, `zombie:stunned`). 웨이브: 준비 단계(`state.phase`)→전투, `wave:start/clear`, 동시 `MAX_ALIVE`, 5웨이브 체크포인트, 사망 시 체크포인트 복귀+자원 30% 손실, 10/20/30/40 중간 보스, 50웨이브 좀비 왕과 처치 시 `game:end`. 초반 5~8웨이브에서 대부분 쓰러지는 난이도. 처치 시 `enemy:killed`. **디펜스:** 4개 스폰 지점에서 레인을 따라 핵(`structures`의 `kind:'core'`)을 향해 이동, 가까운 플레이어·아군이 없으면 핵과 방어 건물(바리케이드, 포탑)을 공격. 핵 파괴(`core:destroyed`)는 플레이어 사망과 같은 체크포인트 복귀. 웨이브 사이 준비 시간과 "다음 웨이브 시작" 호출. `zombie:converted` 수신 시 해당 좀비를 목록에서 빼고 메시는 씬에 유지.

**디펜스 규칙(W2, W6 중심):** 기지 중앙의 핵을 지키는 타워 디펜스 느낌이 있습니다. 자세한 내용은 `docs/COORDINATION.md` 1-a.

## W3 채집 (`feat/gathering`, `src/gathering/`)
나무/바위/철광/약초/폐차(부품) 노드를 3D 프리미티브로 배치(`obstacles` 등록), `addInteractable`로 E 길게 눌러 채집(`gatherSpeed`, `gatherExtra` 반영), 재생성, `gain()`으로 지급, `resource:gathered`. `core/props.ts` 기둥을 대체하고 삭제. `enemy:killed`에서 샘플 드롭(일반류 `state.samples`, 보스 `samplesSp`). 아군 채집병이 쓸 노드 목록을 export.

## W4 보물상자 (`feat/loot`, `src/loot/`)
맵 곳곳과 웨이브 클리어·보스 처치 보상으로 상자 스폰(나무/철/황금). E로 열기(철·황금은 `keys`/`goldKeys` 소모), 등급 확률표를 열기 전에 표시, `PITY_LIMIT` 천장(`state.pity`), 열기 연출, 보상(자원, 샘플, 백신, 골드, 스킬 포인트, 무기 등)을 `state`로 지급, `chest:opened`. 현금 결제 없음.

## W5 백신/아군 (`feat/allies`, `src/allies/`)
`interact:lab` 수신 시 백신 3등급 제작 창(`VACCINES`, `vacCostMul`). 기절한 좀비에 E로 주사: 성공률 = 백신 `rate` + `vacBonus` − 체력 비율 보정, 실패해도 백신 소모. 성공 시 `zombie:converted`, 아군화(`allies` 목록, 휴머노이드 색 변경). 역할 4종 AI(전투병/채집병/경비병/연구보조), 상한 = `stats.allyCap + allyCapBonus`, `allyDmg`·`allyHp` 반영, `ally:dead`.

## W6 기지/타이쿤 (`feat/base`, `src/base/`)
B로 건설 모드(`state.mode='build'`), 격자 스냅 배치 미리보기, 1~5 건물 선택, `BUILDINGS` 비용을 `spend()`로 지불, `structures` 등록(체력, 좀비 공격 대상), `building:placed/destroyed`. 효과: 연구소 E→`interact:lab`, 숙소→`allyCapBonus +3`, 바리케이드 장애물, 감시탑 자동 사격, 상점 E→자원 판매(`RES_PRICE`)와 열쇠 구매 창. 건물은 준비 단계에만 배치. **디펜스:** 맵 중앙에 기지 핵(`state.coreHp`, `kind:'core'`, 수리 가능)을 만들고 `core:damaged/destroyed`를 낸다. 방어 건물을 강화: 바리케이드(좀비가 먼저 부숨, 수리), 감시탑 레벨업, 기관포탑·슬로우 트랩 같은 포탑 종류를 `BUILDINGS`에 추가, 사거리 표시, 레인 입구 배치 유도. 전투 중에는 수리·보충만 허용.

## W7 스킬/UI/오디오 (`feat/ui`, `src/skills/`, `src/ui/`, `src/audio/`, `index.html`)
HUD(체력/탄약/웨이브·단계/핵 체력바/자원/골드/열쇠/아군 수, `state:changed`와 이벤트로 갱신), `interact:prompt` 안내, `toast`, 보스 체력바, Tab 스킬트리 창(4가지 가지, `SKILLS`, 포인트 소모, 리스펙, `recalcStats()`), `xp:gain`→스킬 포인트, 게임오버·엔딩 화면(`game:end`), `ui:modal` 처리(포인터 락 해제/복귀, `state.mode`). WebAudio 합성 효과음(사격, 피격, 웨이브, 상자). 다른 모듈의 전용 창은 각 작업자가 만들므로 공용 모달 스타일(CSS 클래스)만 제공.

## W8 2D 업그레이드 타이쿤 (`feat/tycoon2d`, `src/tycoon2d/`, `src/core/meta.ts`, `src/data/tycoon2d.ts`)
**런 흐름은 `docs/COORDINATION.md` 1-e를 먼저 읽으세요.** 플레이어 사망/핵 파괴 → `run:over` → 당신의 2D 화면 → "출격" → `run:start`.
- `run:over` 수신: 도달 웨이브, 처치 수, 골드, 보스 처치로 화폐 계산 → `meta.currency` 증가, `meta.bestWave/bestCheckpoint/totalRuns` 갱신, `saveMeta()`. `state.mode='modal'`, `ui:modal`로 포인터 락 해제.
- 2D 화면(Canvas 2D 또는 DOM, Three.js 사용 금지): 시설(연구소, 공장, 병원 등)이 시간당 화폐를 생산(`meta.lastSeen` 방치 수익, 상한), 영구 업그레이드 구매: 총 품질(무기별 레벨), 최대 체력, 핵 체력, 채집 효율, 시작 골드·자원, 아군 상한, 준비 시간 +, 시작 웨이브(`bestCheckpoint`까지), 상자 운. 비용은 단계마다 증가. 구매 효과가 보이는 UI, 누른 느낌이 있는 연출.
- 출격: 업그레이드를 `state.statMods`(recalcStats가 적용)와 `state.start`(시작 골드/자원/시작 웨이브/핵 체력/준비 시간 보너스)에 반영하고 `run:start` 발행. `loadMeta()`는 게임 시작 때 한 번.
- 첫 실행(`meta`가 비어 있을 때)에는 바로 3D 런을 시작하고, 죽은 뒤부터 2D 화면을 보여줍니다.
- 수치는 전부 `src/data/tycoon2d.ts`의 직렬화 가능한 표. logic/view 분리와 `docs/modules/tycoon2d.md` 작성은 다른 모듈과 같습니다.

## 추가 후속 작업
- **W2**: (1) `run:over`/`run:start` 흐름으로 `defeat()` 교체(제자리 체크포인트 복귀 삭제, `phase='ended'`로 멈추고 `run:over` 발행, `run:start` 수신 시 `state.start.startWave`부터 새 런), (2) `prepTime`을 모든 웨이브 30초(+`state.start.prepBonus`)로, (3) 몬스터 6종 추가(스피터, 자폭병, 크롤러, 중장갑, 스크리머, 독성 좀비) 데이터·AI·모델.
- **W1**: 총 품질 강화. 무기별 레벨(`state.weaponLv`)이 공격력·연사·탄창·재장전·산탄에 반영되고, 총기 모델/반동/총구 화염/탄피/사운드 연동으로 사격감을 제대로 만들기. `run:start`에서 무기 보유 초기화.
- **W3~W7 공통**: `run:start`를 받으면 자기 런 상태(자원, 건물, 아군, 스킬 포인트, 상자 천장 등)를 초기화.
