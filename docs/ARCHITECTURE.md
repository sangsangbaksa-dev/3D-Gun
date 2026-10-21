# 구조와 작업 분담

Vite + TypeScript + Three.js. 모든 3D 모델은 프리미티브(박스 등) 조합의 로우폴리.

## 레이아웃

```
src/
  main.ts          systems 배열에 모듈을 한 줄씩 등록만 한다 (기능 로직 금지)
  core/
    game.ts        게임 루프, Ctx 생성, 시스템 init/update 호출
    types.ts       Ctx(공용 컨텍스트), System 인터페이스 {init?, update, dispose?}
    events.ts      타입 있는 EventBus (이벤트는 GameEvents 에 추가)
    input.ts       키/마우스 상태 (읽기 전용으로 사용)
    world.ts       씬, 조명, 지형, 원형 장애물 obstacles / resolveObstacles
    humanoid.ts    사람형 프리미티브 모델 (플레이어/좀비/아군 공용)
    props.ts       임시 기둥 (gathering 이 나무/바위를 만들면 제거)
  data/index.ts    모든 밸런스 수치와 타입. 로직 없음
  player/          플레이어 이동, 대시, 3인칭 카메라 (PlayerSystem)
  enemies/ gathering/ loot/ allies/ base/ skills/ ui/   기능 폴더 (비어 있음)
```

## 규칙

- 기능 모듈은 `System` 하나를 export 하고 `main.ts` 배열에 한 줄만 추가한다. 충돌은 거의 그 한 줄뿐이다.
- 월드의 충돌물은 `obstacles` 에 등록한다. 조준 방향은 `ctx.aimDir`.
- 모듈끼리는 직접 import 대신 `events` 로 통신하고, 공유 게임 상태(자원, 골드 등)는 `src/core/state.ts` 한 곳에 모은다 (처음 필요한 작업이 만든다).
- 수치는 `data/index.ts` 에서만 바꾼다.

## 작업 단위

1. 무기: 사격(히트스캔), 재장전, 무기 3종, 트레이서
2. 좀비: AI, 종류 3종, 기절, 사망 드롭
3. 웨이브: 준비→전투, 체크포인트, 사망 처리, 50웨이브 보스와 엔딩
4. 채집: 자원 노드, E 채집, 재생성
5. 상자: 스폰, 확률 표, 천장, 연출
6. 백신/아군: 제작, 주사, 역할 AI
7. 기지: 격자 건설, 건물 효과
8. 스킬/UI: 스킬트리, HUD, 모달
9. 저장: localStorage
