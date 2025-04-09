# 축고 (ChukGo) 웹 애플리케이션

축구 코칭 서비스 연결 플랫폼

## 개발 시작하기

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (기본 포트: 3000)
npm run dev
```

## 배포

### 수동 배포

**Linux/Mac 사용자:**
```bash
# 변경사항 커밋 및 GitHub 푸시
npm run deploy "커밋 메시지"
```

**Windows 사용자:**
```bash
# PowerShell 스크립트로 배포
npm run deploy:win "커밋 메시지"
```

### 자동 배포

GitHub에 코드를 푸시하면 GitHub Actions가 자동으로 배포 과정을 실행합니다:

1. `main` 브랜치에 코드가 푸시되면 CI/CD 파이프라인이 트리거됩니다.
2. 테스트 및 빌드 과정이 실행됩니다.
3. 빌드가 성공하면 자동으로 배포됩니다.

## 소셜 로그인 설정

### 카카오 로그인

1. [Kakao Developers](https://developers.kakao.com/) 사이트에서 앱 등록
2. 다음 환경 변수 설정:
   - `KAKAO_CLIENT_ID`: 카카오 앱 키
3. 콜백 URL 설정:
   - 개발 환경: `http://localhost:3000/api/auth/kakao/callback` 
   - 운영 환경: `https://chukgo.kr/api/auth/kakao/callback`

### 네이버 로그인

1. [Naver Developers](https://developers.naver.com/apps/#/register) 사이트에서 앱 등록
2. 다음 환경 변수 설정:
   - `NAVER_CLIENT_ID`: 네이버 클라이언트 ID
   - `NAVER_CLIENT_SECRET`: 네이버 클라이언트 시크릿
3. 콜백 URL 설정:
   - 개발 환경: `http://localhost:3000/api/auth/naver/callback`
   - 운영 환경: `https://chukgo.kr/api/auth/naver/callback`

## 도메인 배포 가이드 (chukgo.kr)

### 1. Vercel 계정 설정

1. [Vercel](https://vercel.com) 가입 및 로그인
2. CLI 도구 설치 및 로그인
   ```bash
   npm install -g vercel
   vercel login
   ```

### 2. 프로젝트 배포

1. 프로젝트 루트에서 실행:
   ```bash
   vercel
   ```
2. 배포 후 프로젝트 ID와 조직 ID 확인:
   ```bash
   vercel whoami     # 조직 ID 확인
   vercel projects   # 프로젝트 ID 확인
   ```

### 3. 도메인 연결

1. Vercel 대시보드에서 프로젝트 선택
2. "Settings" > "Domains"에서 "Add Domain" 클릭
3. "chukgo.kr" 입력 후 "Add" 클릭
4. 제공되는 DNS 설정 정보 확인

### 4. DNS 설정

도메인 등록 업체에서 다음 설정 추가:
- A 레코드: @ → 76.76.21.21
- CNAME: www → cname.vercel-dns.com

### 5. 환경 변수 설정

Vercel 대시보드에서 "Settings" > "Environment Variables"에 다음 항목 추가:
```
NODE_ENV=production
SESSION_SECRET=안전한_랜덤_문자열
KAKAO_CLIENT_ID=카카오_앱_키
NAVER_CLIENT_ID=네이버_앱_키
NAVER_CLIENT_SECRET=네이버_앱_시크릿
```

### 6. GitHub 자동 배포 설정

1. GitHub 저장소 "Settings" > "Secrets and variables" > "Actions"에 다음 시크릿 추가:
   - `VERCEL_TOKEN`: Vercel 토큰
   - `VERCEL_PROJECT_ID`: 프로젝트 ID
   - `VERCEL_ORG_ID`: 조직 ID

2. 배포 확인:
   - GitHub 저장소 "Actions" 탭에서 워크플로우 실행 상태 확인
   - `https://chukgo.kr` 접속하여 사이트 확인 