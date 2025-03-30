# 축구레슨 매칭 플랫폼 (SoccerCoachFinder) - 백엔드 서버 구조

## 프로젝트 구조

```
soccer-coach-api/
├── src/
│   ├── config/                  # 설정 파일
│   │   ├── database.js          # 데이터베이스 연결 설정
│   │   ├── passport.js          # 인증 전략 설정
│   │   ├── app.js               # Express 앱 설정
│   │   └── env.js               # 환경 변수 관리
│   ├── controllers/             # 컨트롤러 (비즈니스 로직)
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── coachController.js
│   │   ├── lessonController.js
│   │   ├── bookingController.js
│   │   ├── reviewController.js
│   │   ├── chatController.js
│   │   └── notificationController.js
│   ├── middleware/              # 미들웨어
│   │   ├── auth.js              # JWT 인증 미들웨어
│   │   ├── error.js             # 에러 핸들링 미들웨어
│   │   ├── validation.js        # 입력 데이터 검증 미들웨어
│   │   ├── upload.js            # 파일 업로드 미들웨어
│   │   └── role.js              # 역할 기반 권한 미들웨어
│   ├── models/                  # MongoDB 스키마/모델
│   │   ├── User.js
│   │   ├── ParentProfile.js
│   │   ├── CoachProfile.js
│   │   ├── Lesson.js
│   │   ├── Booking.js
│   │   ├── Review.js
│   │   ├── Chat.js
│   │   ├── Message.js
│   │   ├── Notification.js
│   │   └── Certificate.js
│   ├── routes/                  # API 라우트
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── coaches.js
│   │   ├── lessons.js
│   │   ├── bookings.js
│   │   ├── reviews.js
│   │   ├── chats.js
│   │   ├── notifications.js
│   │   └── admin.js
│   ├── services/                # 서비스 레이어
│   │   ├── authService.js
│   │   ├── userService.js
│   │   ├── coachService.js
│   │   ├── lessonService.js
│   │   ├── bookingService.js
│   │   ├── reviewService.js
│   │   ├── chatService.js
│   │   ├── notificationService.js
│   │   ├── emailService.js
│   │   └── paymentService.js
│   ├── utils/                   # 유틸리티 함수
│   │   ├── asyncHandler.js      # 비동기 핸들러
│   │   ├── errorResponse.js     # 에러 응답 클래스
│   │   ├── jwt.js               # JWT 생성/검증
│   │   ├── geocoding.js         # 위치 변환 유틸리티
│   │   ├── validators.js        # 검증 함수들
│   │   └── logger.js            # 로깅 유틸리티
│   ├── websocket/               # 웹소켓 관련 코드
│   │   ├── socket.js            # 소켓 설정 및 연결 관리
│   │   ├── chatHandler.js       # 채팅 메시지 핸들러
│   │   └── notificationHandler.js # 알림 핸들러
│   ├── jobs/                    # 예약된 작업 및 크론 작업
│   │   ├── reminderJob.js       # 수업 알림 작업
│   │   └── cleanupJob.js        # 데이터 정리 작업
│   └── app.js                   # 앱 진입점
├── .env                         # 환경 변수
├── .gitignore                   # Git 무시 파일
├── package.json                 # 의존성 정의
└── README.md                    # 프로젝트 문서
```

## 모델 스키마 정의

### User.js
```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, '이메일을 입력해주세요'],
    unique: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, '유효한 이메일을 입력해주세요']
  },
  password: {
    type: String,
    required: [true, '비밀번호를 입력해주세요'],
    minlength: 6,
    select: false
  },
  name: {
    type: String,
    required: [true, '이름을 입력해주세요']
  },
  role: {
    type: String,
    enum: ['parent', 'coach', 'admin'],
    default: 'parent'
  },
  phone: {
    type: String,
    required: [true, '전화번호를 입력해주세요'],
    match: [/^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/, '유효한 전화번호를 입력해주세요']
  },
  profileImage: {
    type: String,
    default: 'default-profile.jpg'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 비밀번호 암호화
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// JWT 토큰 생성
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// 비밀번호 확인
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
```

### ParentProfile.js
```javascript
const mongoose = require('mongoose');

const ChildSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '아이 이름을 입력해주세요']
  },
  age: {
    type: Number,
    required: [true, '아이 나이를 입력해주세요']
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: [true, '아이 성별을 선택해주세요']
  },
  skillLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  }
});

const ParentProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  children: [ChildSchema],
  location: {
    address: {
      type: String,
      required: [true, '주소를 입력해주세요']
    },
    coordinates: {
      type: [Number], // [경도, 위도]
      index: '2dsphere'
    }
  },
  preferences: {
    lessonTypes: [{
      type: String,
      enum: ['private', 'group', 'online', 'offline']
    }],
    preferredDays: [{
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    }],
    preferredTimes: [{
      type: String,
      enum: ['morning', 'afternoon', 'evening']
    }]
  }
});

module.exports = mongoose.model('ParentProfile', ParentProfileSchema);
```

### CoachProfile.js
```javascript
const mongoose = require('mongoose');

const CertificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, '자격증 이름을 입력해주세요']
  },
  issuer: {
    type: String,
    required: [true, '발급 기관을 입력해주세요']
  },
  year: {
    type: Number,
    required: [true, '발급 연도를 입력해주세요']
  },
  verified: {
    type: Boolean,
    default: false
  },
  imageUrl: String
});

const AvailabilitySlotSchema = new mongoose.Schema({
  start: {
    type: String,
    required: [true, '시작 시간을 입력해주세요']
  },
  end: {
    type: String,
    required: [true, '종료 시간을 입력해주세요']
  }
});

const AvailabilitySchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    required: [true, '요일을 선택해주세요']
  },
  slots: [AvailabilitySlotSchema]
});

const CoachProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  bio: {
    type: String,
    required: [true, '자기소개를 입력해주세요'],
    maxlength: [500, '자기소개는 500자 이내로 작성해주세요']
  },
  experience: {
    type: Number,
    required: [true, '경력 년수를 입력해주세요']
  },
  specializations: [{
    type: String,
    enum: [
      '개인 레슨',
      '그룹 레슨',
      '유소년 코칭',
      '성인 코칭',
      '골키퍼 트레이닝',
      '피지컬 트레이닝',
      '전술 트레이닝',
      '기술 트레이닝'
    ],
    required: [true, '전문 분야를 하나 이상 선택해주세요']
  }],
  certifications: [CertificationSchema],
  gallery: [String],
  pricing: {
    hourlyRate: {
      type: Number,
      required: [true, '시간당 요금을 입력해주세요']
    },
    groupDiscount: {
      type: Number,
      default: 0
    }
  },
  location: {
    address: {
      type: String,
      required: [true, '주소를 입력해주세요']
    },
    coordinates: {
      type: [Number], // [경도, 위도]
      index: '2dsphere'
    },
    radius: {
      type: Number,
      default: 10 // 10km
    }
  },
  availability: [AvailabilitySchema],
  isProfileComplete: {
    type: Boolean,
    default: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  averageRating: {
    type: Number,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// 가상 필드 - 리뷰
CoachProfileSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'coach',
  justOne: false
});

module.exports = mongoose.model('CoachProfile', CoachProfileSchema);
```

### Lesson.js
```javascript
const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, '레슨 제목을 입력해주세요'],
    trim: true,
    maxlength: [100, '레슨 제목은 100자 이내로 작성해주세요']
  },
  coach: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CoachProfile',
    required: true
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ParentProfile',
    required: true
  },
  childName: {
    type: String,
    required: [true, '아이 이름을 입력해주세요']
  },
  childAge: {
    type: Number,
    required: [true, '아이 나이를 입력해주세요']
  },
  lessonType: {
    type: String,
    enum: ['private', 'group', 'online', 'offline'],
    required: [true, '레슨 유형을 선택해주세요']
  },
  skillLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  location: {
    address: {
      type: String,
      required: [true, '주소를 입력해주세요']
    },
    coordinates: {
      type: [Number], // [경도, 위도]
      index: '2dsphere'
    }
  },
  schedule: {
    date: {
      type: Date,
      required: [true, '날짜를 선택해주세요']
    },
    startTime: {
      type: String,
      required: [true, '시작 시간을 입력해주세요']
    },
    endTime: {
      type: String,
      required: [true, '종료 시간을 입력해주세요']
    },
    duration: {
      type: Number,
      required: [true, '수업 시간을 입력해주세요']
    }
  },
  price: {
    type: Number,
    required: [true, '가격을 입력해주세요']
  },
  status: {
    type: String,
    enum: ['requested', 'confirmed', 'completed', 'cancelled'],
    default: 'requested'
  },
  notes: {
    type: String,
    maxlength: [500, '요청사항은 500자 이내로 작성해주세요']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// 가상 필드 - 리뷰
LessonSchema.virtual('review', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'lesson',
  justOne: true
});

module.exports = mongoose.model('Lesson', LessonSchema);
```

### Review.js
```javascript
const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true
  },
  coach: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CoachProfile',
    required: true
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ParentProfile',
    required: true
  },
  rating: {
    type: Number,
    required: [true, '평점을 입력해주세요'],
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: [true, '리뷰 내용을 입력해주세요'],
    maxlength: [500, '리뷰는 500자 이내로 작성해주세요']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 하나의 레슨에 하나의 리뷰만 작성 가능
ReviewSchema.index({ lesson: 1, parent: 1 }, { unique: true });

// 리뷰 작성시 코치 평점 업데이트
ReviewSchema.statics.getAverageRating = async function(coachId) {
  const obj = await this.aggregate([
    {
      $match: { coach: coachId }
    },
    {
      $group: {
        _id: '$coach',
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 }
      }
    }
  ]);

  try {
    await this.model('CoachProfile').findByIdAndUpdate(coachId, {
      averageRating: obj.length > 0 ? Math.round(obj[0].averageRating * 10) / 10 : 0,
      reviewCount: obj.length > 0 ? obj[0].reviewCount : 0
    });
  } catch (err) {
    console.error(err);
  }
};

// 저장 후 평점 계산
ReviewSchema.post('save', function() {
  this.constructor.getAverageRating(this.coach);
});

// 삭제 후 평점 재계산
ReviewSchema.post('remove', function() {
  this.constructor.getAverageRating(this.coach);
});

module.exports = mongoose.model('Review', ReviewSchema);
```

### Chat.js
```javascript
const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  lastMessage: {
    type: String,
    default: ''
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// 같은 두 사용자 간의 채팅방 중복 생성 방지
ChatSchema.index({ participants: 1 }, { unique: true });

module.exports = mongoose.model('Chat', ChatSchema);
```

### Message.js
```javascript
const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: [true, '메시지 내용을 입력해주세요'],
    trim: true
  },
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 메시지 저장시 채팅방 정보 업데이트
MessageSchema.post('save', async function() {
  await this.model('Chat').findByIdAndUpdate(this.chat, {
    lastMessage: this.content,
    updatedAt: this.createdAt
  });
});

module.exports = mongoose.model('Message', MessageSchema);
```

### Notification.js
```javascript
const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: [
      'lesson_request',
      'lesson_confirmed',
      'lesson_cancelled',
      'new_message',
      'review_received',
      'profile_verified',
      'payment_success',
      'payment_failed',
      'system'
    ],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Notification', NotificationSchema);
```

## API 엔드포인트 상세

### 인증 API
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인
- `GET /api/auth/logout` - 로그아웃
- `GET /api/auth/me` - 현재 로그인 사용자 정보
- `PUT /api/auth/update-password` - 비밀번호 변경
- `POST /api/auth/forgot-password` - 비밀번호 재설정 이메일 발송
- `PUT /api/auth/reset-password/:resetToken` - 비밀번호 재설정

### 사용자 API
- `GET /api/users` - 모든 사용자 조회 (관리자 전용)
- `GET /api/users/:id` - 특정 사용자 조회
- `PUT /api/users/:id` - 사용자 정보 업데이트
- `DELETE /api/users/:id` - 사용자 삭제 (관리자 전용)
- `PUT /api/users/:id/profile-image` - 프로필 이미지 업데이트

### 학부모 프로필 API
- `POST /api/parents` - 학부모 프로필 생성
- `GET /api/parents/:id` - 학부모 프로필 조회
- `PUT /api/parents/:id` - 학부모 프로필 업데이트
- `POST /api/parents/:id/children` - 자녀 정보 추가
- `PUT /api/parents/:id/children/:childId` - 자녀 정보 업데이트
- `DELETE /api/parents/:id/children/:childId` - 자녀 정보 삭제

### 코치 프로필 API
- `POST /api/coaches` - 코치 프로필 생성
- `GET /api/coaches` - 코치 목록 조회 (필터링 가능)
- `GET /api/coaches/:id` - 특정 코치 프로필 조회
- `PUT /api/coaches/:id` - 코치 프로필 업데이트
- `POST /api/coaches/:id/gallery` - 갤러리 이미지 추가
- `DELETE /api/coaches/:id/gallery/:imageId` - 갤러리 이미지 삭제
- `POST /api/coaches/:id/certifications` - 자격증 추가
- `PUT /api/coaches/:id/certifications/:certId` - 자격증 업데이트
- `DELETE /api/coaches/:id/certifications/:certId` - 자격증 삭제
- `PUT /api/coaches/:id/availability` - 가용 시간 업데이트
- `GET /api/coaches/:id/reviews` - 코치 리뷰 조회
- `GET /api/coaches/nearby` - 주변 코치 검색

### 레슨 API
- `POST /api/lessons` - 레슨 요청 생성
- `GET /api/lessons` - 레슨 목록 조회
- `GET /api/lessons/:id` - 특정 레슨 조회
- `PUT /api/lessons/:id` - 레슨 정보 업데이트
- `PUT /api/lessons/:id/status` - 레슨 상태 업데이트 (수락, 거절, 완료)
- `GET /api/parents/:id/lessons` - 학부모의 레슨 목록
- `GET /api/coaches/:id/lessons` - 코치의 레슨 목록

### 리뷰 API
- `POST /api/reviews` - 리뷰 작성
- `GET /api/reviews` - 리뷰 목록 조회
- `GET /api/reviews/:id` - 특정 리뷰 조회
- `PUT /api/reviews/:id` - 리뷰 수정
- `DELETE /api/reviews/:id` - 리뷰 삭제
- `GET /api/lessons/:id/reviews` - 레슨 리뷰 조회
- `GET /api/coaches/:id/reviews` - 코치 리뷰 조회

### 채팅 API
- `GET /api/chats` - 사용자의 채팅방 목록
- `POST /api/chats` - 새 채팅방 생성
- `GET /api/chats/:id` - 특정 채팅방 정보 조회
- `GET /api/chats/:id/messages` - 채팅방 메시지 조회
- `POST /api/chats/:id/messages` - 메시지 전송
- `PUT /api/messages/:id/read` - 메시지 읽음 처리

### 알림 API
- `GET /api/notifications` - 사용자 알림 목록
- `PUT /api/notifications/:id/read` - 알림 읽음 처리
- `PUT /api/notifications/read-all` - 모든 알림 읽음 처리

### 관리자 API
- `GET /api/admin/dashboard` - 관리자 대시보드 데이터
- `GET /api/admin/users` - 사용자 관리
- `PUT /api/admin/coaches/:id/verify` - 코치 인증 승인
- `GET /api/admin/certifications` - 자격증 인증 대기 목록
- `PUT /api/admin/certifications/:id/verify` - 자격증 인증 승인
- `GET /api/admin/stats` - 통계 데이터

## 웹소켓 이벤트

### 채팅 이벤트
- `join_chat` - 채팅방 참여
- `leave_chat` - 채팅방 나가기
- `send_message` - 메시지 전송
- `received_message` - 메시지 수신
- `typing` - 타이핑 중
- `stop_typing` - 타이핑 중지

### 알림 이벤트
- `notification` - 알림 발생