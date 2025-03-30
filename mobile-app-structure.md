# 축구레슨 매칭 플랫폼 (SoccerCoachFinder) - 모바일 앱 구조

## 프로젝트 구조

```
soccer-coach-finder/
├── assets/                   # 이미지, 폰트 등 정적 자원
│   ├── fonts/
│   ├── images/
│   └── icons/
├── src/
│   ├── api/                  # API 호출 관련 모듈
│   │   ├── auth.js
│   │   ├── coaches.js
│   │   ├── lessons.js
│   │   ├── bookings.js
│   │   ├── chat.js
│   │   └── index.js
│   ├── components/           # 재사용 가능한 컴포넌트
│   │   ├── common/           # 공통 컴포넌트
│   │   │   ├── Button.js
│   │   │   ├── Card.js
│   │   │   ├── Input.js
│   │   │   ├── Avatar.js
│   │   │   ├── Rating.js
│   │   │   └── ...
│   │   ├── coaches/          # 코치 관련 컴포넌트
│   │   │   ├── CoachCard.js
│   │   │   ├── CoachProfile.js
│   │   │   ├── CoachReviews.js
│   │   │   └── ...
│   │   ├── lessons/          # 레슨 관련 컴포넌트
│   │   │   ├── LessonCard.js
│   │   │   ├── LessonForm.js
│   │   │   └── ...
│   │   └── chat/             # 채팅 관련 컴포넌트
│   │       ├── ChatBubble.js
│   │       ├── ChatInput.js
│   │       └── ...
│   ├── contexts/             # Context API 관련 파일
│   │   ├── AuthContext.js
│   │   └── ...
│   ├── navigation/           # 네비게이션 관련 파일
│   │   ├── AppNavigator.js
│   │   ├── AuthNavigator.js
│   │   ├── ParentNavigator.js
│   │   ├── CoachNavigator.js
│   │   └── ...
│   ├── screens/              # 화면 컴포넌트
│   │   ├── common/           # 공통 화면
│   │   │   ├── SplashScreen.js
│   │   │   ├── OnboardingScreen.js
│   │   │   ├── NotificationsScreen.js
│   │   │   └── SettingsScreen.js
│   │   ├── auth/             # 인증 관련 화면
│   │   │   ├── LoginScreen.js
│   │   │   ├── RegisterScreen.js
│   │   │   ├── ForgotPasswordScreen.js
│   │   │   └── RoleSelectionScreen.js
│   │   ├── parent/           # 학부모용 화면
│   │   │   ├── ParentHomeScreen.js
│   │   │   ├── CoachListScreen.js
│   │   │   ├── CoachDetailScreen.js
│   │   │   ├── LessonRequestScreen.js
│   │   │   ├── BookingsScreen.js
│   │   │   └── ...
│   │   └── coach/            # 코치용 화면
│   │       ├── CoachHomeScreen.js
│   │       ├── ProfileSetupScreen.js
│   │       ├── ScheduleScreen.js
│   │       ├── RequestsScreen.js
│   │       └── ...
│   ├── services/             # 비즈니스 로직
│   │   ├── AuthService.js
│   │   ├── LocationService.js
│   │   ├── NotificationService.js
│   │   └── ...
│   ├── utils/                # 유틸리티 함수
│   │   ├── dateUtils.js
│   │   ├── validationUtils.js
│   │   ├── formatUtils.js
│   │   └── ...
│   ├── hooks/                # 커스텀 훅
│   │   ├── useAuth.js
│   │   ├── useForm.js
│   │   ├── useLocation.js
│   │   └── ...
│   ├── constants/            # 상수
│   │   ├── colors.js
│   │   ├── typography.js
│   │   ├── api.js
│   │   └── ...
│   ├── localization/         # 다국어 지원
│   │   ├── ko.js             # 한국어
│   │   ├── en.js             # 영어
│   │   └── i18n.js
│   └── config/               # 앱 설정
│       ├── appConfig.js
│       └── ...
├── App.js                    # 앱의 진입점
├── app.json                  # Expo 설정 파일
├── babel.config.js           # Babel 설정
├── package.json              # 의존성 정의
└── README.md                 # 프로젝트 문서
```

## 주요 화면 설명

### 1. 공통 화면

#### SplashScreen.js
앱 로딩 시 보여주는 스플래시 화면으로, 앱 로고와 간단한 애니메이션 포함

#### OnboardingScreen.js
첫 시작 시 앱 소개 및 주요 기능 설명 화면 (스와이프 가능한 카드 형태)

#### RoleSelectionScreen.js
사용자 역할 선택 화면 (학부모 / 코치)

### 2. 인증 화면

#### LoginScreen.js
로그인 화면 (이메일/비밀번호, 소셜 로그인 옵션)

#### RegisterScreen.js
회원가입 화면 (기본 정보 입력)

#### ForgotPasswordScreen.js
비밀번호 재설정 화면

### 3. 학부모용 화면

#### ParentHomeScreen.js
학부모 홈 화면 (추천 코치, 활성 레슨, 새로운 메시지 등 표시)

#### CoachListScreen.js
코치 검색 및 목록 화면 (필터링 옵션 포함)

#### CoachDetailScreen.js
코치 상세 정보 화면 (프로필, 리뷰, 레슨 정보 등)

#### LessonRequestScreen.js
레슨 요청 양식 화면 (아이 정보, 레슨 유형, 일정 등 입력)

#### BookingsScreen.js
예약 및 레슨 히스토리 화면

### 4. 코치용 화면

#### CoachHomeScreen.js
코치 홈 화면 (예정된 레슨, 새로운 요청, 메시지 등 표시)

#### ProfileSetupScreen.js
코치 프로필 설정 화면 (경력, 자격증, 갤러리 등 입력)

#### ScheduleScreen.js
일정 관리 화면 (캘린더 뷰)

#### RequestsScreen.js
레슨 요청 관리 화면 (수락/거절 등)

## 주요 컴포넌트 설명

### CoachCard.js
코치 정보를 보여주는 카드 컴포넌트 (이름, 전문 분야, 평점, 위치 등)

### LessonCard.js
레슨 정보를 보여주는 카드 컴포넌트 (제목, 날짜, 시간, 장소 등)

### ChatBubble.js
채팅 메시지를 표시하는 버블 컴포넌트

### Rating.js
평점을 표시하고 입력받는 컴포넌트

## 주요 기능 및 화면 흐름

### 학부모 사용자 흐름:
1. 스플래시 → 온보딩 → 역할 선택(학부모) → 로그인/회원가입
2. 홈 화면 → 코치 검색 → 코치 상세 → 레슨 요청
3. 홈 화면 → 예약 관리 → 레슨 상세 → 코치와 채팅
4. 홈 화면 → 알림 → 레슨 확정/변경 확인

### 코치 사용자 흐름:
1. 스플래시 → 온보딩 → 역할 선택(코치) → 로그인/회원가입
2. 프로필 설정 → 자격증 업로드 → 승인 대기
3. 홈 화면 → 레슨 요청 → 요청 수락/거절 → 일정 확인
4. 홈 화면 → 채팅 → 학부모와 대화

## 데이터 모델 (프론트엔드)

### User
```javascript
{
  id: string,
  email: string,
  name: string,
  role: 'parent' | 'coach',
  profileImage: string,
  phone: string,
  createdAt: Date
}
```

### ParentProfile
```javascript
{
  userId: string,
  children: [
    {
      name: string,
      age: number,
      gender: string,
      skillLevel: string
    }
  ],
  location: {
    address: string,
    latitude: number,
    longitude: number
  },
  preferences: {
    lessonTypes: string[],
    preferredDays: string[],
    preferredTimes: string[]
  }
}
```

### CoachProfile
```javascript
{
  userId: string,
  bio: string,
  experience: number, // 년 단위
  specializations: string[], // ['개인 레슨', '그룹 레슨', '골키퍼 트레이닝', ...]
  certifications: [
    {
      title: string,
      issuer: string,
      year: number,
      verified: boolean,
      imageUrl: string
    }
  ],
  gallery: string[], // 이미지 URL 배열
  pricing: {
    hourlyRate: number,
    groupDiscount: number
  },
  location: {
    address: string,
    latitude: number,
    longitude: number,
    radius: number // 서비스 제공 반경 (km)
  },
  availability: [
    {
      day: string, // 'monday', 'tuesday', ...
      slots: [
        {
          start: string, // '09:00'
          end: string // '10:30'
        }
      ]
    }
  ],
  rating: number, // 평균 평점
  reviewCount: number
}
```

### Lesson
```javascript
{
  id: string,
  title: string,
  coachId: string,
  parentId: string,
  childName: string,
  childAge: number,
  lessonType: string, // '1:1', '그룹', '온라인'
  skillLevel: string, // '초보', '중급', '고급'
  location: {
    address: string,
    latitude: number,
    longitude: number
  },
  schedule: {
    date: Date,
    startTime: string,
    endTime: string,
    duration: number // 분 단위
  },
  price: number,
  status: string, // 'requested', 'confirmed', 'completed', 'cancelled'
  notes: string,
  createdAt: Date
}
```

### Review
```javascript
{
  id: string,
  lessonId: string,
  coachId: string,
  parentId: string,
  rating: number,
  comment: string,
  createdAt: Date
}
```

### Message
```javascript
{
  id: string,
  chatId: string,
  senderId: string,
  receiverId: string,
  content: string,
  read: boolean,
  createdAt: Date
}
```

### Chat
```javascript
{
  id: string,
  participants: string[], // [userId1, userId2]
  lastMessage: string,
  updatedAt: Date
}
```

## 주요 API 엔드포인트

### 인증 API
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/forgot-password
- PUT /api/auth/reset-password
- GET /api/auth/me

### 사용자 API
- GET /api/users/:id
- PUT /api/users/:id
- PUT /api/users/:id/profile-image

### 코치 API
- GET /api/coaches
- GET /api/coaches/:id
- POST /api/coaches (프로필 생성)
- PUT /api/coaches/:id (프로필 업데이트)
- POST /api/coaches/:id/certifications
- GET /api/coaches/:id/reviews
- GET /api/coaches/:id/availability

### 레슨 API
- POST /api/lessons (요청 생성)
- GET /api/lessons
- GET /api/lessons/:id
- PUT /api/lessons/:id (상태 업데이트)
- GET /api/parents/:id/lessons
- GET /api/coaches/:id/lessons

### 리뷰 API
- POST /api/reviews
- GET /api/lessons/:id/reviews

### 채팅 API
- GET /api/chats
- GET /api/chats/:id/messages
- POST /api/chats/:id/messages
- PUT /api/messages/:id/read

### 알림 API
- GET /api/notifications
- PUT /api/notifications/:id/read