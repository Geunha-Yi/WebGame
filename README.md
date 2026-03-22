# WebGame

Vue 3 · Vite · TypeScript로 만든 브라우저 미니게임 모음입니다. 홈에서 14가지 게임을 선택해 플레이할 수 있습니다.

## 로컬 실행

```bash
npm install
npm run dev
```

개발 서버는 `vite.config.ts`의 `base`가 `/WebGame/`으로 설정되어 있으므로, 주소는 `http://localhost:5173/WebGame/` 형태로 열립니다.

## GitHub Pages

`.github/workflows/deploy-pages.yml` 워크플로가 `main` 및 `cursor/vue-3f68` 브랜치에 푸시될 때 빌드 후 GitHub Pages에 배포합니다.

저장소 설정에서 **Pages → Build and deployment → Source**를 **GitHub Actions**로 지정해야 합니다. 배포가 완료되면 다음과 같은 주소로 접속할 수 있습니다.

`https://<사용자명>.github.io/WebGame/`

## 게임 목록

스네이크, 기억력 카드, 두더지 잡기, 2048, 브레이크아웃, 틱택토, 반응 속도, 사이먼, 행맨, 플래피, 퐁, 지뢰찾기, 타자 연습, 가위바위보
