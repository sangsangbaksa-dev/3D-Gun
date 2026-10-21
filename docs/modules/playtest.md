# playtest (테스트 빌드 수직 슬라이스)

완성된 기능 모듈(W1~W7)이 생기기 전에 한 번에 플레이해 보기 위한 임시 슬라이스. 기능 모듈이 병합되면 해당 부분부터 교체하고 삭제한다.

## 구조
- `src/playtest/logic/sim.ts`: 순수 TS. three/DOM 없음. 시드 가능한 `rng` 주입. 매 프레임 `stepSim(sim, dt, input)` 로 상태를 바꾸고 `sim.events` 에 이벤트를 쌓는다.
- `src/playtest/view/`: Three.js 메시, DOM HUD, WebAudio 합성음. `sim` 상태를 읽어 그리고 이벤트를 소비한다.
- `src/playtest/index.ts`: `PlaytestSystem` (main.ts 한 줄 등록).

## 데이터 모델
- `Sim`: phase(prep/combat/dead/ended), wave, 플레이어 hp, 무기/탄약, 자원(`res`), 골드, 상자 천장(`pity`), `core{hp,maxHp,r}`, `zombies[]`, `nodes[]`(채집), `chests[]`, `structs[]`(포탑/바리케이드)
- `SimInput`: 플레이어 위치/yaw, 발사, 조준 광선(origin/dir), 재장전, 무기 슬롯, E 입력, 강화/치료/설치/웨이브 시작/재시작
- `SimEvent`: toast, banner, shot, hit, kill, hurt, reload, gather, chest, dead, respawn, end, turretShot, built, destroyed
- 수치는 `src/data/index.ts` (무기, 좀비, 상자 확률, 웨이브 공식)

## 포함 범위
사격(히트스캔, 헤드샷), 좀비 3종 + 중간 보스(10웨이브마다) + 50웨이브 좀비 왕과 엔딩, 웨이브/체크포인트/사망 페널티, 기지 코어 방어, 포탑/바리케이드, 채집 5종, 상자(3등급, 확률표, 천장), 공격력 강화(U), 약초 치료(H).
미포함: 백신/아군, 기지 건물(연구소·숙소·상점), 스킬트리, 저장(최고 웨이브만 localStorage).

## Unity 메모
`Sim` → 순수 C# 클래스, `SimEvent` → C# event/struct, `view/` → 프리팹과 UGUI, `rng` → `System.Random(seed)`.
