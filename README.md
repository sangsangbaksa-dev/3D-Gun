# 좀비 타이쿤 3D

3D 3인칭 슈터 + 자원 채집 + 상자깡 + 좀비 백신(아군화) + 기지 경영 + 스킬트리. 50웨이브에서 보스 “좀비 왕”을 쓰러뜨리면 엔딩.

- 기획서: [docs/GAME_DESIGN.md](docs/GAME_DESIGN.md)
- 구조와 작업 분담: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

## 실행

```bash
npm install
npm run dev     # http://localhost:5173
npm run build   # 타입체크 + 배포 빌드(dist/)
```

현재 상태: 스캐폴드 (3D 월드, 3인칭 카메라, 이동/대시). 나머지 기능은 모듈별로 추가한다.
