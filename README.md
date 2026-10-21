# 좀비 타이쿤 3D

브라우저에서 플레이하는 3D 좀비 생존·기지 경영 게임입니다. 3인칭 전투와 자원 채집, 기지 건설, 아군화, 웨이브 생존, 런 간 성장 시스템을 모듈형 TypeScript 아키텍처로 구현합니다.

## 현재 구현

- 3인칭 플레이어 이동, 카메라, 무기와 전투
- 자원 채집과 기지 건설·관리
- 좀비 웨이브와 적 AI
- 백신을 통한 아군화
- HUD, 상자 보상, 2D 런 간 성장 시스템
- `?playtest` 쿼리로 통합 플레이테스트 슬라이스 실행

전체 기능 범위와 설계는 [게임 기획서](docs/GAME_DESIGN.md), 모듈 구조는 [아키텍처 문서](docs/ARCHITECTURE.md)를 참고하세요.

## 시작하기

Node.js와 npm이 설치되어 있어야 합니다.

```bash
npm install
npm run dev
```

Vite가 표시하는 로컬 주소(기본값 `http://localhost:5173`)에서 플레이합니다. 통합 플레이테스트 구성을 실행하려면 주소 뒤에 `?playtest`를 붙이세요.

## 빌드

```bash
npm run build
npm run preview
```

빌드는 TypeScript 타입 검사 후 정적 사이트를 `dist/`에 생성합니다. 배포 절차는 [Vercel 배포 문서](docs/DEPLOY.md)를 참고하세요.

## 기술 스택

- TypeScript
- Three.js
- Vite
