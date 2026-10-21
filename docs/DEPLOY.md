# Vercel 배포

정적 Vite 빌드를 그대로 올립니다. 서버 코드와 환경 변수는 없습니다.

1. Vercel에서 `sangsangbaksa-dev/3D-Gun` 저장소를 Import 합니다. Framework는 Vite로 자동 인식됩니다(`vercel.json`에도 지정).
2. 빌드 명령 `npm run build`, 출력 폴더 `dist` (기본값 그대로).
3. `main`에 병합되면 프로덕션이, PR마다 미리보기 URL이 자동 생성됩니다.

## 확인할 것
- 로컬에서 `npm run build && npm run preview`로 `dist`가 단독 동작하는지 확인합니다.
- 에셋 경로는 상대 경로입니다. 배포 후 콘솔에 404가 없어야 합니다.
- WebGL이 안 되는 브라우저를 대비해 시작 화면에 안내 문구를 둡니다(W7).
