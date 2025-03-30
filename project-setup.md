# 축구레슨 매칭 플랫폼 (SoccerCoachFinder) - 프로젝트 설정 가이드

## 1. 프로젝트 초기화

### React Native + Expo 설정

```bash
# 1. Expo CLI 전역 설치
npm install -g expo-cli

# 2. 프로젝트 생성
npx create-expo-app soccer-coach-finder
cd soccer-coach-finder

# 3. 기본 의존성 설치
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context
npm install @react-native-async-storage/async-storage
npm install axios
npm install react-native-maps
npm install nativewind
npm install --save-dev tailwindcss

# 4. NativeWind 설정
npx tailwindcss init
```

### TailwindCSS 설정 (tailwind.config.js)

```javascript
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#6b21ff", // 주 색상
        secondary: "#4d04b0", // 보조 색상
        accent: "#fde047", // 강조 색상
        background: "#f8fafc", // 배경 색상
        surface: "#ffffff", // 표면 색상
        text: "#1e293b", // 텍스트 색상
        error: "#ef4444", // 오류 색상
        success: "#22c55e", // 성공 색상
        warning: "#f59e0b", // 경고 색상
        info: "#3b82f6" // 정보 색상
      },
      fontFamily: {
        sans: ["NotoSansKR-Regular"],
        medium: ["NotoSansKR-Medium"],
        bold: ["NotoSansKR-Bold"]
      }
    }
  },
  plugins: []
}
```

### babel.config.js 업데이트

```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ["nativewind/babel"]
  };
};
```

### app.json 설정

```json
{
  "expo": {
    "name": "축구 레슨 매칭",
    "slug": "soccer-coach-finder",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#6b21ff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.yourcompany.soccercoachfinder"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#6b21ff"
      },
      "package": "com.yourcompany.soccercoachfinder",
      "permissions": [
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION",
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE"
      ]
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      [
        "expo-location",
        {
          "locationAlwaysAndWhenInUsePermission": "앱이 위치 정보를 사용하여 주변 코치를 찾습니다."
        }
      ]
    ]
  }
}
```

## 2. 백엔드 설정

### Node.js + Express + MongoDB 설정

```bash
# 1. 프로젝트 디렉토리 생성
mkdir soccer-coach-api
cd soccer-coach-api

# 2. 패키지 초기화
npm init -y

# 3. 기본 의존성 설치
npm install express mongoose dotenv cors jsonwebtoken bcryptjs multer
npm install morgan helmet express-rate-limit express-mongo-sanitize
npm install nodemon --save-dev

# 4. 환경 변수 파일 생성
touch .env
```

### .env 설정

```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/soccer-coach-finder
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30
```

### package.json 스크립트 설정

```json
{
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js"
  }
}
```

## 3. 폴더 구조 설정

### 프론트엔드 폴더 구조 생성

```bash
# src 폴더 및 하위 폴더 생성
mkdir -p src/api
mkdir -p src/components/common
mkdir -p src/components/coaches
mkdir -p src/components/lessons
mkdir -p src/components/chat
mkdir -p src/contexts
mkdir -p src/navigation
mkdir -p src/screens/common
mkdir -p src/screens/auth
mkdir -p src/screens/parent
mkdir -p src/screens/coach
mkdir -p src/services
mkdir -p src/utils
mkdir -p src/hooks
mkdir -p src/constants
mkdir -p src/localization

# 에셋 폴더 생성
mkdir -p assets/fonts
mkdir -p assets/images
mkdir -p assets/icons
```

### 백엔드 폴더 구조 생성

```bash
# src 폴더 및 하위 폴더 생성
mkdir -p src/config
mkdir -p src/controllers
mkdir -p src/middleware
mkdir -p src/models
mkdir -p src/routes
mkdir -p src/services
mkdir -p src/utils
mkdir -p src/websocket
mkdir -p src/jobs
```

## 4. 필요한 추가 패키지 설치

### 프론트엔드 추가 패키지

```bash
# 폼 및 검증
npm install formik yup

# 상태 관리
npm install zustand

# 날짜 처리
npm install date-fns

# 이미지 처리
npm install expo-image-picker
npm install expo-file-system

# 푸시 알림
npm install expo-notifications

# 위치 서비스
npm install expo-location

# 다국어 지원
npm install i18n-js

# 폰트
npx expo install expo-font
npx expo install @expo-google-fonts/noto-sans-kr

# 기타 UI 라이브러리
npm install react-native-gesture-handler
npm install react-native-reanimated
npm install react-native-svg
npm install react-native-calendars
```

### 백엔드 추가 패키지

```bash
# 파일 업로드
npm install multer aws-sdk

# 이메일 발송
npm install nodemailer

# 데이터 검증
npm install joi

# 보안
npm install xss-clean helmet hpp cookie-parser

# 작업 예약
npm install node-cron

# 실시간 통신
npm install socket.io

# 이미지 처리
npm install sharp

# 로깅
npm install winston
```

## 5. 실행 및 개발 방법

### 프론트엔드 실행

```bash
# 개발 서버 실행
npx expo start

# iOS 시뮬레이터로 실행
npx expo start --ios

# Android 에뮬레이터로 실행
npx expo start --android

# Expo Go 앱으로 실행
npx expo start --tunnel
```

### 백엔드 실행

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 서버 실행
npm start
```

## 6. 배포 준비

### 프론트엔드 배포 (Expo)

```bash
# EAS CLI 설치
npm install -g eas-cli

# Expo 계정 로그인
eas login

# 빌드 설정
eas build:configure

# 개발 빌드 생성
eas build --profile development --platform ios
eas build --profile development --platform android

# 프로덕션 빌드 생성
eas build --platform ios
eas build --platform android

# 앱 스토어 제출
eas submit --platform ios
eas submit --platform android
```

### 백엔드 배포 (Replit)

1. Replit에서 Node.js 템플릿으로 새 프로젝트 생성
2. 백엔드 코드 업로드
3. 환경 변수 설정 (.env)
4. 실행 명령어 설정 (package.json의 start 스크립트)
5. 상시 실행 설정 (Always On)

## 7. 기타 설정

### Git 초기화

```bash
git init
echo "node_modules/" >> .gitignore
echo ".env" >> .gitignore
echo ".expo/" >> .gitignore
git add .
git commit -m "Initial commit"
```

### MongoDB Atlas 설정 (클라우드 DB)

1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) 계정 생성
2. 새 클러스터 생성
3. 데이터베이스 액세스 설정 (사용자 생성)
4. 네트워크 액세스 설정 (IP 화이트리스트)
5. 연결 문자열 복사하여 .env 파일의 MONGO_URI에 설정

### Firebase 설정 (푸시 알림)

1. [Firebase Console](https://console.firebase.google.com/) 계정 생성
2. 새 프로젝트 생성
3. Cloud Messaging 설정
4. 구성 파일 다운로드 (google-services.json, GoogleService-Info.plist)
5. Expo 프로젝트에 통합