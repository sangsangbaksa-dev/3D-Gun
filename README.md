# 좀비 타이쿤 3D

브라우저에서 플레이하는 3D 좀비 생존·기지 경영 게임입니다. 기본 시점은 1인칭이고, F3로 3인칭 어깨 카메라로 바꿉니다. 자원을 캐고, 좀비를 잡아 코인을 벌고, 교환소에서 코인과 자원을 바꾸며 기지를 키웁니다. 백신으로 좀비를 아군으로 만들고, 50웨이브의 보스 “좀비 왕”을 쓰러뜨리면 엔딩입니다.

플레이: [https://3d-gun.vercel.app](https://3d-gun.vercel.app)

## 현재 구현

- 1인칭 이동·사격. F3로 3인칭 전환
- 머리 명중 시 추가 피해
- 자원 채집, 격자 건설, 포탑·바리케이드·연구소·교환소
- 좀비 웨이브와 적 AI. 처치하면 코인을 얻음
- 연구소에서 백신을 만들고 기절한 좀비를 아군으로 만듦
- 교환소에서 자원을 코인으로 팔거나, 코인으로 자원을 삼
- V 키 강화창에서 코인으로 총기를 사고 강화
- 사망 뒤 이어 하는 2D 성장
- 주소 뒤에 `?playtest` 를 붙이면 통합 플레이테스트

상자 보상은 없습니다. 코인은 전투에서 나옵니다.

전체 설계는 [게임 기획서](docs/GAME_DESIGN.md), 모듈 구조는 [아키텍처 문서](docs/ARCHITECTURE.md)를 참고하세요.

## 조작

WASD 이동 · Shift 대시 · 클릭 사격 · R 재장전 · 1~6 무기 · F3 시점 · E 상호작용 · B 건설 · V 총기 · N 다음 웨이브

## 시작하기

Node.js와 npm이 필요합니다.

```bash
npm install
npm run dev
```

Vite가 띄우는 주소(기본 `http://localhost:5173`)에서 플레이합니다.

## 빌드

```bash
npm run build
npm run preview
```

`npm run build`는 타입 검사 후 `dist/`에 정적 사이트를 만듭니다. 배포 절차는 [Vercel 배포 문서](docs/DEPLOY.md)를 참고하세요. `main`에 올리면 [https://3d-gun.vercel.app](https://3d-gun.vercel.app) 이 갱신됩니다.

## 기술 스택

- TypeScript
- Three.js
- Vite
