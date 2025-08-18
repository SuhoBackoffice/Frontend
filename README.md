# 수호테크 물류 자동화 시스템 🚚

수호테크의 물류 자동화 시스템을 위한 프론트엔드 프로젝트입니다.

<br/>

## ✨ 주요 기능

- **제작 프로젝트 관리**: 현재 진행중인 프로젝트와 진행 완료된 프로젝트를 관리합니다.
- **물량 리스트 자동 생성**: 생산에 필요한 물량리스트를 자동으로 생성합니다. Excel or web view

<br/>

## 🛠️ 기술 스택

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI**: shadcn/ui, lucide-react
- **State Management**: Zustand

<br/>

## ⚙️ 시작하기

### 1. 레포지토리 클론

```bash
git clone https://github.com/SuhoBackoffice/Frontend.git
cd <프로젝트_폴더명>
```

### 2. 패키지 설치

```bash
# npm 사용 시
npm install

# yarn 사용 시
yarn install
```

### 3. 환경변수 설정

프로젝트를 실행하기 전, API 서버와 통신하기 위한 환경변수 설정이 필수적입니다.

1. 프로젝트 최상단 루트 경로에 .env 파일을 생성하세요.
2. 아래 내용을 파일에 추가하고 저장하세요.

```bash
NEXT_PUBLIC_API_SERVER_URL=http://localhost:8080
```

> Note: NEXT_PUBLIC_API_SERVER_URL은 프론트엔드가 데이터를 요청할 백엔드 API 서버의 주소입니다. 로컬 환경이 아닌 다른 환경에서 테스트할 경우 해당 주소로 변경해주세요.

## 실행 방법

> 내부적으로, `NEXT_PUBLIC_API_SERVER_URL`에 해당하는 Api 서버가 실행중인 상태여야 정상적으로 동작합니다.
> [Api서버](https://github.com/SuhoBackoffice/Backend) 를 먼저 작동해 주세요.

### 개발 모드 실행

- 개발 서버를 실행합니다. 파일이 변경될 때마다 자동으로 새로고침이 적용됩니다.

```bash
npm run dev
# 또는
yarn dev
```

> 서버가 성공적으로 실행되면 터미널에 표시된 주소(기본값: http://localhost:3000)로 접속하여 확인할 수 있습니다.

### 프로덕션 빌드

배포를 위한 프로덕션 버전으로 프로젝트를 빌드합니다. 최적화된 정적 파일들이 .next 폴더에 생성됩니다.

```bash
npm run build
# 또는
yarn build
```

### 프로덕션 모드 실행

```
npm start
# 또는
yarn start
```
