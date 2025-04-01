import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { contactFormSchema, insertBookingSchema, insertUserSchema } from "@shared/schema";
import { ZodError } from "zod";
import { z } from "zod";
import { setupAuth } from "./auth";

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

  const httpServer = createServer(app);
  
  // 웹소켓 서버 설정 (Vite의 HMR 웹소켓과 충돌을 피하기 위해 경로 지정)
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  // 클라이언트 연결 처리
  wss.on('connection', (ws) => {
    console.log('WebSocket 클라이언트가 연결되었습니다.');
    
    // 클라이언트에게 연결 확인 메시지 전송
    ws.send(JSON.stringify({ type: 'connection', message: '축고 웹소켓 서버에 연결되었습니다.' }));
    
    // 메시지 수신 처리
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('메시지 수신:', data);
        
        // 메시지 타입에 따른 처리
        switch(data.type) {
          case 'ping':
            ws.send(JSON.stringify({ type: 'pong', timestamp: new Date().toISOString() }));
            break;
          case 'chat':
            // 다른 모든 클라이언트에게 메시지 브로드캐스트
            wss.clients.forEach(client => {
              if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ 
                  type: 'chat', 
                  userId: data.userId,
                  username: data.username,
                  message: data.message,
                  timestamp: new Date().toISOString()
                }));
              }
            });
            break;
          default:
            ws.send(JSON.stringify({ type: 'error', message: '지원하지 않는 메시지 타입입니다.' }));
        }
      } catch (error) {
        console.error('WebSocket 메시지 처리 오류:', error);
        ws.send(JSON.stringify({ type: 'error', message: '메시지 형식이 올바르지 않습니다.' }));
      }
    });
    
    // 연결 종료 처리
    ws.on('close', () => {
      console.log('WebSocket 클라이언트 연결이 종료되었습니다.');
    });
  });
  
  return httpServer;
}
