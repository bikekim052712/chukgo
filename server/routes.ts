import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { contactFormSchema, insertBookingSchema, insertUserSchema } from "@shared/schema";
import { ZodError } from "zod";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
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
  
  // Create a booking
  app.post('/api/bookings', async (req: Request, res: Response) => {
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

  const httpServer = createServer(app);
  return httpServer;
}
