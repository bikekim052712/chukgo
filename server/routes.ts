import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { contactFormSchema, insertBookingSchema, insertReviewSchema, insertUserSchema, insertCompanyInfoSchema } from "@shared/schema";
import { ZodError } from "zod";
import { z } from "zod";
import { setupAuth } from "./auth";
import { WebSocketServer } from "ws";
import WebSocket from "ws";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up auth with session and passport
  const { requireAuth, requireCoach } = setupAuth(app);
  // Get all lesson types
  app.get('/api/lesson-types', async (req: Request, res: Response) => {
    try {
      const lessonTypes = await storage.getLessonTypes();
      res.json(lessonTypes);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching lesson types' });
    }
  });
  
  // Get all skill levels
  app.get('/api/skill-levels', async (req: Request, res: Response) => {
    try {
      const skillLevels = await storage.getSkillLevels();
      res.json(skillLevels);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching skill levels' });
    }
  });
  
  // Get top coaches
  app.get('/api/coaches/top', async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 3;
      const coaches = await storage.getTopCoaches(limit);
      res.json(coaches);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching top coaches' });
    }
  });
  
  // Get all coaches
  app.get('/api/coaches', async (req: Request, res: Response) => {
    try {
      const coaches = await storage.getCoaches();
      res.json(coaches);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching coaches' });
    }
  });
  
  // Get coach by ID
  app.get('/api/coaches/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const coach = await storage.getCoachWithUser(id);
      
      if (!coach) {
        return res.status(404).json({ message: 'Coach not found' });
      }
      
      res.json(coach);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching coach' });
    }
  });
  
  // Get recommended lessons
  app.get('/api/lessons/recommended', async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 3;
      const lessons = await storage.getRecommendedLessons(limit);
      res.json(lessons);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching recommended lessons' });
    }
  });
  
  // Search lessons
  app.get('/api/lessons/search', async (req: Request, res: Response) => {
    try {
      const location = req.query.location as string;
      const lessonTypeId = req.query.lessonTypeId ? parseInt(req.query.lessonTypeId as string) : undefined;
      const skillLevelId = req.query.skillLevelId ? parseInt(req.query.skillLevelId as string) : undefined;
      
      const lessons = await storage.searchLessons(location, lessonTypeId, skillLevelId);
      res.json(lessons);
    } catch (error) {
      res.status(500).json({ message: 'Error searching lessons' });
    }
  });
  
  // Get lessons by coach
  app.get('/api/coaches/:id/lessons', async (req: Request, res: Response) => {
    try {
      const coachId = parseInt(req.params.id);
      const lessons = await storage.getLessonsByCoach(coachId);
      res.json(lessons);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching coach lessons' });
    }
  });
  
  // Get lesson by ID
  app.get('/api/lessons/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const lesson = await storage.getLessonWithDetails(id);
      
      if (!lesson) {
        return res.status(404).json({ message: 'Lesson not found' });
      }
      
      res.json(lesson);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching lesson' });
    }
  });
  
  // Get all lessons
  app.get('/api/lessons', async (req: Request, res: Response) => {
    try {
      const lessons = await storage.getLessons();
      res.json(lessons);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching lessons' });
    }
  });
  
  // Create a booking (로그인 필요)
  app.post('/api/bookings', requireAuth, async (req: Request, res: Response) => {
    try {
      const bookingData = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(bookingData);
      res.status(201).json(booking);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: 'Invalid booking data', errors: error.errors });
      }
      res.status(500).json({ message: 'Error creating booking' });
    }
  });
  
  // Submit contact form
  app.post('/api/contact', async (req: Request, res: Response) => {
    try {
      const inquiryData = contactFormSchema.parse(req.body);
      const inquiry = await storage.createInquiry(inquiryData);
      res.status(201).json({ success: true, inquiry });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: 'Invalid form data', errors: error.errors });
      }
      res.status(500).json({ message: 'Error submitting contact form' });
    }
  });
  
  // Get all reviews
  app.get('/api/reviews', async (req: Request, res: Response) => {
    try {
      // 코치 ID 필터링
      const coachId = req.query.coachId ? parseInt(req.query.coachId as string) : undefined;
      
      // 레슨 유형 필터링
      const lessonTypeId = req.query.lessonTypeId ? parseInt(req.query.lessonTypeId as string) : undefined;
      
      let reviews = [];
      
      if (coachId) {
        reviews = await storage.getReviewsByCoach(coachId);
      } else if (req.query.lessonId) {
        const lessonId = parseInt(req.query.lessonId as string);
        reviews = await storage.getReviewsByLesson(lessonId);
      } else {
        // 모든 리뷰 (나중에 필터링/페이지네이션 추가 예정)
        const lessons = await storage.getLessons();
        reviews = [];
        
        for (const lesson of lessons) {
          const lessonReviews = await storage.getReviewsByLesson(lesson.id);
          if (lessonReviews.length > 0) {
            reviews.push(...lessonReviews);
          }
        }
      }
      
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching reviews' });
    }
  });
  
  // Get review by ID
  app.get('/api/reviews/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const review = await storage.getReview(id);
      
      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }
      
      res.json(review);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching review' });
    }
  });
  
  // Create review (요청 인증)
  app.post('/api/reviews', requireAuth, async (req: Request, res: Response) => {
    try {
      const reviewData = insertReviewSchema.parse(req.body);
      
      // 레슨이 존재하는지 확인
      const lesson = await storage.getLesson(reviewData.lessonId);
      if (!lesson) {
        return res.status(404).json({ message: 'Lesson not found' });
      }
      
      // 리뷰 작성 권한 확인 (사용자가 이 레슨을 예약했는지)
      const userBookings = await storage.getBookingsByUser(reviewData.userId);
      const hasBooked = userBookings.some(booking => 
        booking.lessonId === reviewData.lessonId && booking.status === 'completed'
      );
      
      // 실제 환경에서는 아래 조건을 활성화해야 합니다
      // if (!hasBooked) {
      //   return res.status(403).json({ message: 'You must complete this lesson before reviewing it' });
      // }
      
      // 리뷰 중복 작성 방지 (이미 리뷰를 작성했는지 확인)
      const lessonReviews = await storage.getReviewsByLesson(reviewData.lessonId);
      const alreadyReviewed = lessonReviews.some(review => review.userId === reviewData.userId);
      
      // 실제 환경에서는 아래 조건을 활성화해야 합니다
      // if (alreadyReviewed) {
      //   return res.status(400).json({ message: 'You have already reviewed this lesson' });
      // }
      
      // 리뷰 생성
      const review = await storage.createReview(reviewData);
      
      // 코치 평점 업데이트 (평균 평점 계산)
      const coach = await storage.getCoach(lesson.coachId);
      if (coach) {
        // 코치의 모든 레슨 가져오기
        const coachLessons = await storage.getLessonsByCoach(coach.id);
        
        let totalRating = 0;
        let reviewCount = 0;
        
        // 각 레슨별 리뷰 평점 집계
        for (const coachLesson of coachLessons) {
          const reviews = await storage.getReviewsByLesson(coachLesson.id);
          
          reviews.forEach(review => {
            totalRating += review.rating;
            reviewCount++;
          });
        }
        
        // 평균 평점 및 리뷰 수 업데이트 (실제 환경에서는 storage에 updateCoachRating 메소드를 추가해야 함)
        // await storage.updateCoachRating(coach.id, totalRating / reviewCount, reviewCount);
      }
      
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: 'Invalid review data', errors: error.errors });
      }
      res.status(500).json({ message: 'Error creating review' });
    }
  });
  
  // 이전 인증 라우트는 setupAuth()로 대체되었습니다
  
  /* 
  // 회원가입 API 엔드포인트 
  const registerSchema = insertUserSchema.extend({
    password: z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다.")
  });
  
  app.post('/api/auth/register', async (req: Request, res: Response) => {
    try {
      const userData = registerSchema.parse(req.body);
      
      // 이미 존재하는 이메일 체크
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: '이미 사용 중인 이메일입니다.' });
      }
      
      // 사용자 생성 - 실제 환경에서는 암호화 처리 필요
      const user = await storage.createUser(userData);
      
      // 비밀번호 필드 제외하고 응답
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: '유효하지 않은 회원 정보', errors: error.errors });
      }
      console.error('Register error:', error);
      res.status(500).json({ message: '회원가입 처리 중 오류가 발생했습니다.' });
    }
  });
  
  // 로그인 API 엔드포인트
  const loginSchema = z.object({
    email: z.string().email("유효한 이메일 주소를 입력해 주세요."),
    password: z.string().min(1, "비밀번호를 입력해 주세요.")
  });
  
  app.post('/api/auth/login', async (req: Request, res: Response) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      // 여기에서는 이메일이 username으로 저장되었다고 가정
      const user = await storage.getUserByUsername(email);
      
      // 사용자가 존재하지 않거나 비밀번호가 일치하지 않으면 401 에러
      if (!user || user.password !== password) {
        return res.status(401).json({ message: '이메일 또는 비밀번호가 일치하지 않습니다.' });
      }
      
      // 비밀번호 필드 제외하고 응답
      const { password: _, ...userWithoutPassword } = user;
      res.json({ 
        user: userWithoutPassword,
        message: '로그인 성공'
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: '유효하지 않은 로그인 정보', errors: error.errors });
      }
      console.error('Login error:', error);
      res.status(500).json({ message: '로그인 처리 중 오류가 발생했습니다.' });
    }
  });
  */
  
  // 코치 가입 API 엔드포인트
  const registerSchema = insertUserSchema.extend({
    password: z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다.")
  });
  
  const coachRegisterSchema = registerSchema.extend({
    fullName: z.string().min(2, "이름은 2자 이상이어야 합니다."),
    phoneNumber: z.string().regex(/^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/, "올바른 휴대폰 번호를 입력해 주세요."),
    specializations: z.array(z.string()).min(1, "최소 1개 이상의 전문 분야를 선택해 주세요."),
    experience: z.string(),
    introduction: z.string().min(30, "자기소개는 최소 30자 이상 작성해 주세요.")
  });
  
  app.post('/api/auth/coach-register', async (req: Request, res: Response) => {
    try {
      const coachData = coachRegisterSchema.parse(req.body);
      
      // 이미 존재하는 이메일 체크
      const existingUser = await storage.getUserByUsername(coachData.username);
      if (existingUser) {
        return res.status(400).json({ message: '이미 사용 중인 이메일입니다.' });
      }
      
      // 사용자 생성
      const { experience, introduction, specializations, phoneNumber, ...userData } = coachData;
      const user = await storage.createUser({
        ...userData,
        phone: phoneNumber,
        bio: introduction,
        isCoach: true
      });
      
      // 코치 정보 생성
      const coach = await storage.createCoach({
        userId: user.id,
        specializations,
        experience,
        location: "서울특별시", // 기본값
        hourlyRate: 50000, // 기본값
        rating: 0,
        reviewCount: 0
      });
      
      res.status(201).json({
        message: '코치 가입 신청이 완료되었습니다. 검토 후 승인 결과를 안내해 드리겠습니다.',
        coachId: coach.id
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: '유효하지 않은 코치 정보', errors: error.errors });
      }
      console.error('Coach register error:', error);
      res.status(500).json({ message: '코치 가입 처리 중 오류가 발생했습니다.' });
    }
  });

  // Admin middleware
  function requireAdmin(req: Request, res: Response, next: NextFunction) {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "로그인이 필요합니다." });
    }
    
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "관리자 권한이 필요합니다." });
    }
    
    next();
  }
  
  // Company info routes
  // Get all company info
  app.get('/api/company-info', async (req: Request, res: Response) => {
    try {
      const companyInfos = await storage.getCompanyInfos();
      res.json(companyInfos);
    } catch (error) {
      res.status(500).json({ message: '회사 정보를 가져오는 중 오류가 발생했습니다.' });
    }
  });
  
  // Get company info by ID
  app.get('/api/company-info/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const companyInfo = await storage.getCompanyInfo(id);
      
      if (!companyInfo) {
        return res.status(404).json({ message: '회사 정보를 찾을 수 없습니다.' });
      }
      
      res.json(companyInfo);
    } catch (error) {
      res.status(500).json({ message: '회사 정보를 가져오는 중 오류가 발생했습니다.' });
    }
  });
  
  // Create company info (Admin only)
  app.post('/api/company-info', requireAdmin, async (req: Request, res: Response) => {
    try {
      const infoData = insertCompanyInfoSchema.parse(req.body);
      const companyInfo = await storage.createCompanyInfo(infoData);
      res.status(201).json(companyInfo);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: '유효하지 않은 회사 정보', errors: error.errors });
      }
      res.status(500).json({ message: '회사 정보를 생성하는 중 오류가 발생했습니다.' });
    }
  });
  
  // Update company info (Admin only)
  app.put('/api/company-info/:id', requireAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const infoData = insertCompanyInfoSchema.parse(req.body);
      
      const updatedInfo = await storage.updateCompanyInfo(id, infoData);
      
      if (!updatedInfo) {
        return res.status(404).json({ message: '회사 정보를 찾을 수 없습니다.' });
      }
      
      res.json(updatedInfo);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: '유효하지 않은 회사 정보', errors: error.errors });
      }
      res.status(500).json({ message: '회사 정보를 업데이트하는 중 오류가 발생했습니다.' });
    }
  });
  
  // Delete company info (Admin only)
  app.delete('/api/company-info/:id', requireAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteCompanyInfo(id);
      
      if (!success) {
        return res.status(404).json({ message: '회사 정보를 찾을 수 없습니다.' });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: '회사 정보를 삭제하는 중 오류가 발생했습니다.' });
    }
  });

  const httpServer = createServer(app);
  
  // 토큰 기반 단일 로그인 시스템 설정
  const wss = new WebSocketServer({ 
    server: httpServer, 
    path: '/ws/auth'
  });
  
  // 웹소켓 연결 처리
  wss.on('connection', function connection(ws) {
    console.log('WebSocket 연결됨 - Auth Channel');
    
    ws.on('message', function incoming(message) {
      try {
        const data = JSON.parse(message.toString());
        console.log('메시지 수신:', data);
        
        // 토큰 동기화 메시지 처리
        if (data.type === 'auth_sync' && data.token) {
          console.log('토큰 동기화 요청:', data.token);
          
          // 모든 클라이언트에게 토큰 브로드캐스트
          wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({
                type: 'auth_token',
                token: data.token
              }));
            }
          });
        }
      } catch (error) {
        console.error('메시지 처리 에러:', error);
      }
    });
  });
  
  return httpServer;
}
