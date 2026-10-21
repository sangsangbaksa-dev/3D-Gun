# 작업자 브리프

공통: 저장소 `sangsangbaksa-dev/3D-Gun`의 `main`(조율 PR #1 병합 후)에서 `feat/<모듈>` 브랜치를 따서 작업하고, 완료하면 `main`으로 PR을 엽니다.
시작 전 `docs/GAME_DESIGN.md`, `docs/ARCHITECTURE.md`, `docs/COORDINATION.md`를 읽고, **소유 경로만** 수정합니다. 한국어로 보고합니다.
끝나기 전 `npm run build` 통과와 브라우저 실제 플레이 확인(Playwright 스크린샷 가능)을 하고, PR 설명에 확인 방법을 적습니다.

**Unity 이식 규칙(전원 필수):** 나중에 Unity로 옮깁니다. `src/<모듈>/logic/`(순수 TS, `three`·DOM import 금지)과 `src/<모듈>/view/`(Three.js·DOM)를 분리하고, 수치·표는 `src/data/`의 직렬화 가능한 객체로 둡니다. PR에 `docs/modules/<모듈>.md`(데이터 모델, 이벤트, C# 대응 메모)를 추가합니다. 자세한 내용은 `docs/COORDINATION.md` 1-b, `docs/UNITY_PORT.md`.

**배포 규칙(전원 필수):** Vercel 정적 배포입니다. 서버·환경 변수 없이 `npm run build`의 `dist/`로 동작해야 하고, 에셋은 상대 경로로 번들에 포함하며, 큰 외부 에셋·무거운 의존성은 추가하지 않습니다(오디오는 WebAudio 합성).

## W1 무기/전투 (`feat/player`, `src/player/`)
좌클릭 히트스캔 사격(`zombies` 목록 대상 레이캐스트, `hit(dmg*state.stats.dmgMul, false)`), 무기 3종(`WEAPONS`, 권총만 시작 보유, 1/2/3 교체), R 재장전(`reloadMul`, `magMul` 반영), 트레이서·총구 이펙트. `player:hit` 이벤트로 체력 감소(대시 무적 `iframes` 존중), 0이면 `player:dead`. `state.mode`가 build/modal이면 사격 정지. `weapon:fired` 발행. 무기 획득 방식(상자 보상 등)은 `state`에 보유 무기 필드를 추가해 W4와 맞춥니다.

## W2 좀비/웨이브/보스 (`feat/enemies`, `src/enemies/`)
일반/달리기/뚱보 좀비(휴머노이드 재사용, `zombieStats`)가 플레이어·아군·건물을 쫓아 공격(플레이어는 `player:hit`). `zombies` 목록과 `ZombieRef.hit/stunned` 구현(체력 낮을 때 `stunBonus` 반영 기절, `zombie:stunned`). 웨이브: 준비 단계(`state.phase`)→전투, `wave:start/clear`, 동시 `MAX_ALIVE`, 5웨이브 체크포인트, 사망 시 체크포인트 복귀+자원 30% 손실, 10/20/30/40 중간 보스, 50웨이브 좀비 왕과 처치 시 `game:end`. 초반 5~8웨이브에서 대부분 쓰러지는 난이도. 처치 시 `enemy:killed`. `zombie:converted` 수신 시 해당 좀비를 목록에서 빼고 메시는 씬에 유지.

## W3 채집 (`feat/gathering`, `src/gathering/`)
나무/바위/철광/약초/폐차(부품) 노드를 3D 프리미티브로 배치(`obstacles` 등록), `addInteractable`로 E 길게 눌러 채집(`gatherSpeed`, `gatherExtra` 반영), 재생성, `gain()`으로 지급, `resource:gathered`. `core/props.ts` 기둥을 대체하고 삭제. `enemy:killed`에서 샘플 드롭(일반류 `state.samples`, 보스 `samplesSp`). 아군 채집병이 쓸 노드 목록을 export.

## W4 보물상자 (`feat/loot`, `src/loot/`)
맵 곳곳과 웨이브 클리어·보스 처치 보상으로 상자 스폰(나무/철/황금). E로 열기(철·황금은 `keys`/`goldKeys` 소모), 등급 확률표를 열기 전에 표시, `PITY_LIMIT` 천장(`state.pity`), 열기 연출, 보상(자원, 샘플, 백신, 골드, 스킬 포인트, 무기 등)을 `state`로 지급, `chest:opened`. 현금 결제 없음.

## W5 백신/아군 (`feat/allies`, `src/allies/`)
`interact:lab` 수신 시 백신 3등급 제작 창(`VACCINES`, `vacCostMul`). 기절한 좀비에 E로 주사: 성공률 = 백신 `rate` + `vacBonus` − 체력 비율 보정, 실패해도 백신 소모. 성공 시 `zombie:converted`, 아군화(`allies` 목록, 휴머노이드 색 변경). 역할 4종 AI(전투병/채집병/경비병/연구보조), 상한 = `stats.allyCap + allyCapBonus`, `allyDmg`·`allyHp` 반영, `ally:dead`.

## W6 기지/타이쿤 (`feat/base`, `src/base/`)
B로 건설 모드(`state.mode='build'`), 격자 스냅 배치 미리보기, 1~5 건물 선택, `BUILDINGS` 비용을 `spend()`로 지불, `structures` 등록(체력, 좀비 공격 대상), `building:placed/destroyed`. 효과: 연구소 E→`interact:lab`, 숙소→`allyCapBonus +3`, 바리케이드 장애물, 감시탑 자동 사격, 상점 E→자원 판매(`RES_PRICE`)와 열쇠 구매 창. 건물은 준비 단계에만 배치.

## W7 스킬/UI/오디오 (`feat/ui`, `src/skills/`, `src/ui/`, `src/audio/`, `index.html`)
HUD(체력/탄약/웨이브·단계/자원/골드/열쇠/아군 수, `state:changed`와 이벤트로 갱신), `interact:prompt` 안내, `toast`, 보스 체력바, Tab 스킬트리 창(4가지 가지, `SKILLS`, 포인트 소모, 리스펙, `recalcStats()`), `xp:gain`→스킬 포인트, 게임오버·엔딩 화면(`game:end`), `ui:modal` 처리(포인터 락 해제/복귀, `state.mode`). WebAudio 합성 효과음(사격, 피격, 웨이브, 상자). 다른 모듈의 전용 창은 각 작업자가 만들므로 공용 모달 스타일(CSS 클래스)만 제공.
