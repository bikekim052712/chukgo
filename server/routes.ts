import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { contactFormSchema, insertBookingSchema } from "@shared/schema";
import { ZodError } from "zod";

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

  const httpServer = createServer(app);
  return httpServer;
}
