import {
  User, InsertUser, Coach, InsertCoach, Lesson, InsertLesson,
  Booking, InsertBooking, Review, InsertReview, Schedule, InsertSchedule,
  Inquiry, InsertInquiry, LessonType, InsertLessonType, SkillLevel, InsertSkillLevel,
  CoachWithUser, LessonWithDetails
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

// Storage interface
export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Coaches
  getCoach(id: number): Promise<Coach | undefined>;
  getCoachWithUser(id: number): Promise<CoachWithUser | undefined>;
  getCoaches(): Promise<CoachWithUser[]>;
  getTopCoaches(limit: number): Promise<CoachWithUser[]>;
  createCoach(coach: InsertCoach): Promise<Coach>;
  
  // Lesson Types
  getLessonTypes(): Promise<LessonType[]>;
  getLessonType(id: number): Promise<LessonType | undefined>;
  createLessonType(lessonType: InsertLessonType): Promise<LessonType>;
  
  // Skill Levels
  getSkillLevels(): Promise<SkillLevel[]>;
  getSkillLevel(id: number): Promise<SkillLevel | undefined>;
  createSkillLevel(skillLevel: InsertSkillLevel): Promise<SkillLevel>;
  
  // Lessons
  getLesson(id: number): Promise<Lesson | undefined>;
  getLessonWithDetails(id: number): Promise<LessonWithDetails | undefined>;
  getLessons(): Promise<Lesson[]>;
  getLessonsByCoach(coachId: number): Promise<Lesson[]>;
  getRecommendedLessons(limit: number): Promise<LessonWithDetails[]>;
  searchLessons(location?: string, lessonTypeId?: number, skillLevelId?: number): Promise<LessonWithDetails[]>;
  createLesson(lesson: InsertLesson): Promise<Lesson>;
  
  // Bookings
  getBooking(id: number): Promise<Booking | undefined>;
  getBookingsByUser(userId: number): Promise<Booking[]>;
  getBookingsByLesson(lessonId: number): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBookingStatus(id: number, status: string): Promise<Booking | undefined>;
  
  // Reviews
  getReview(id: number): Promise<Review | undefined>;
  getReviewsByLesson(lessonId: number): Promise<Review[]>;
  getReviewsByCoach(coachId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  
  // Schedules
  getSchedulesByCoach(coachId: number): Promise<Schedule[]>;
  createSchedule(schedule: InsertSchedule): Promise<Schedule>;
  
  // Inquiries
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
  
  // Session store
  sessionStore: any; // Memorystore/SessionStore
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private coaches: Map<number, Coach>;
  private lessonTypes: Map<number, LessonType>;
  private skillLevels: Map<number, SkillLevel>;
  private lessons: Map<number, Lesson>;
  private bookings: Map<number, Booking>;
  private reviews: Map<number, Review>;
  private schedules: Map<number, Schedule>;
  private inquiries: Map<number, Inquiry>;
  
  readonly sessionStore: any; // Memorystore SessionStore
  
  private userId: number = 1;
  private coachId: number = 1;
  private lessonTypeId: number = 1;
  private skillLevelId: number = 1;
  private lessonId: number = 1;
  private bookingId: number = 1;
  private reviewId: number = 1;
  private scheduleId: number = 1;
  private inquiryId: number = 1;
  
  constructor() {
    this.users = new Map();
    this.coaches = new Map();
    this.lessonTypes = new Map();
    this.skillLevels = new Map();
    this.lessons = new Map();
    this.bookings = new Map();
    this.reviews = new Map();
    this.schedules = new Map();
    this.inquiries = new Map();
    
    const MemoryStore = createMemoryStore(session);
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // 24 hours
    });
    
    this.initializeData();
  }
  
  // Initialize with sample data
  private async initializeData() {
    // Create skill levels
    const skillLevels = [
      { name: "입문", description: "축구를 처음 접하는 초보자" },
      { name: "초급", description: "기본 기술을 익히고 있는 단계" },
      { name: "중급", description: "경기를 즐길 수 있는 수준" },
      { name: "고급", description: "전술과 심화 기술을 배우는 단계" }
    ];
    
    for (const skillLevel of skillLevels) {
      await this.createSkillLevel(skillLevel);
    }
    
    // Create lesson types
    const lessonTypes = [
      { name: "개인 레슨", description: "1:1 맞춤형 레슨" },
      { name: "그룹 레슨", description: "소그룹 단위 수업" },
      { name: "팀 코칭", description: "팀 전체를 위한 체계적인 코칭" },
      { name: "축구 캠프", description: "집중 트레이닝 캠프" }
    ];
    
    for (const lessonType of lessonTypes) {
      await this.createLessonType(lessonType);
    }
    
    // Create some users
    const users = [
      {
        username: "kimcoach",
        password: "password123",
        email: "kim@example.com",
        fullName: "김민수",
        phone: "010-1234-5678",
        profileImage: "https://images.pexels.com/photos/3785424/pexels-photo-3785424.jpeg?auto=compress&cs=tinysrgb&w=800",
        bio: "전 프로축구 선수 출신으로 10년 이상의 코칭 경력을 보유. 기초부터 고급 기술까지 체계적인 교육.",
        isCoach: true
      },
      {
        username: "leejiyeon",
        password: "password123",
        email: "lee@example.com",
        fullName: "이지연",
        phone: "010-2345-6789",
        profileImage: "https://images.pexels.com/photos/6952392/pexels-photo-6952392.jpeg?auto=compress&cs=tinysrgb&w=800",
        bio: "여성 축구 국가대표 출신으로 여성 및 유소년 선수 전문 코치. 친절하고 체계적인 교육 방식으로 인기가 높음.",
        isCoach: true
      },
      {
        username: "parkjunho",
        password: "password123",
        email: "park@example.com",
        fullName: "박준호",
        phone: "010-3456-7890",
        profileImage: "https://images.pexels.com/photos/6551072/pexels-photo-6551072.jpeg?auto=compress&cs=tinysrgb&w=800",
        bio: "AFC A급 라이센스 보유, 중/고급자를 위한 전술 훈련 전문. 팀 코칭 및 개인 기술 향상에 특화.",
        isCoach: true
      },
      {
        username: "student1",
        password: "password123",
        email: "student1@example.com",
        fullName: "이영준",
        isCoach: false
      }
    ];
    
    for (const userData of users) {
      const user = await this.createUser(userData);
      
      if (user.isCoach) {
        // Create coach profile
        let coachData: InsertCoach;
        
        if (user.username === "kimcoach") {
          coachData = {
            userId: user.id,
            specializations: ["개인 레슨", "그룹 레슨", "유소년", "성인"],
            experience: "10년 이상의 코칭 경력, 전 프로축구 선수",
            certifications: "KFA 지도자 라이센스",
            location: "서울 강남구",
            hourlyRate: 50000,
            rating: 49,
            reviewCount: 56
          };
        } else if (user.username === "leejiyeon") {
          coachData = {
            userId: user.id,
            specializations: ["개인 레슨", "여성 특화", "유소년", "피지컬"],
            experience: "여성 국가대표 출신, 8년 코칭 경력",
            certifications: "KFA 여성 축구 지도자",
            location: "서울 송파구",
            hourlyRate: 45000,
            rating: 48,
            reviewCount: 42
          };
        } else {
          coachData = {
            userId: user.id,
            specializations: ["팀 코칭", "전술 훈련", "중/고급자", "GK 특화"],
            experience: "15년 코칭 경력, 프로팀 코치 경험",
            certifications: "AFC A급 라이센스",
            location: "경기 분당구",
            hourlyRate: 60000,
            rating: 47,
            reviewCount: 38
          };
        }
        
        const coach = await this.createCoach(coachData);
        
        // Create lessons for each coach
        if (user.username === "kimcoach") {
          await this.createLesson({
            coachId: coach.id,
            title: "기초부터 배우는 축구 입문 코스",
            description: "축구를 처음 접하는 분들을 위한 기초 기술 교육. 패스, 드리블, 슈팅의 기본기를 배우는 4주 과정.",
            lessonTypeId: 2, // 그룹 레슨
            skillLevelId: 1, // 입문
            location: "서울 강남구",
            groupSize: 5,
            duration: 90, // 90 minutes
            price: 180000, // 4주 과정
            image: "https://images.pexels.com/photos/3041176/pexels-photo-3041176.jpeg?auto=compress&cs=tinysrgb&w=800",
            tags: ["입문자 대상", "소그룹", "기초 기술"]
          });
        } else if (user.username === "leejiyeon") {
          await this.createLesson({
            coachId: coach.id,
            title: "주말 축구 기술 향상 프로그램",
            description: "주말에만 진행되는 집중 기술 향상 프로그램. 드리블, 패스, 슈팅 등 종합적인 기술 훈련.",
            lessonTypeId: 2, // 그룹 레슨
            skillLevelId: 2, // 초급
            location: "서울 송파구",
            groupSize: 8,
            duration: 120, // 120 minutes
            price: 120000, // 월 4회
            image: "https://images.pexels.com/photos/6638829/pexels-photo-6638829.jpeg?auto=compress&cs=tinysrgb&w=800",
            tags: ["주말 수업", "초중급자", "기술 향상"]
          });
        } else {
          await this.createLesson({
            coachId: coach.id,
            title: "전술 마스터 클래스",
            description: "팀 전술과 포지션별 역할에 대한 고급 훈련. 실전 경기 분석 및 전술 응용 능력 향상.",
            lessonTypeId: 3, // 팀 코칭
            skillLevelId: 4, // 고급
            location: "경기 분당구",
            groupSize: 10,
            duration: 150, // 150 minutes
            price: 300000, // 8주 과정
            image: "https://images.pexels.com/photos/4008431/pexels-photo-4008431.jpeg?auto=compress&cs=tinysrgb&w=800",
            tags: ["팀 전술", "고급자", "경기 분석"]
          });
        }
      }
    }
    
    // Add some reviews
    await this.createReview({
      userId: 4, // Student user
      lessonId: 1,
      rating: 5,
      comment: "김민수 코치님의 기초 축구 레슨을 받았어요. 30대 중반에 처음 축구를 시작했는데, 너무 쉽고 재미있게 알려주셔서 빠르게 실력이 향상되었습니다. 개인의 특성에 맞춰 교육해주시는 점이 정말 좋았습니다."
    });
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.username === username) {
        return user;
      }
    }
    return undefined;
  }
  
  async createUser(userData: InsertUser): Promise<User> {
    const id = this.userId++;
    const user = { ...userData, id };
    this.users.set(id, user);
    return user;
  }
  
  // Coach methods
  async getCoach(id: number): Promise<Coach | undefined> {
    return this.coaches.get(id);
  }
  
  async getCoachWithUser(id: number): Promise<CoachWithUser | undefined> {
    const coach = await this.getCoach(id);
    if (!coach) return undefined;
    
    const user = await this.getUser(coach.userId);
    if (!user) return undefined;
    
    return { ...coach, user };
  }
  
  async getCoaches(): Promise<CoachWithUser[]> {
    const coaches: CoachWithUser[] = [];
    
    for (const coach of this.coaches.values()) {
      const user = await this.getUser(coach.userId);
      if (user) {
        coaches.push({ ...coach, user });
      }
    }
    
    return coaches;
  }
  
  async getTopCoaches(limit: number): Promise<CoachWithUser[]> {
    const coaches = await this.getCoaches();
    // Sort by rating and review count
    return coaches
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, limit);
  }
  
  async createCoach(coachData: InsertCoach): Promise<Coach> {
    const id = this.coachId++;
    const coach = { ...coachData, id };
    this.coaches.set(id, coach);
    return coach;
  }
  
  // Lesson Type methods
  async getLessonTypes(): Promise<LessonType[]> {
    return Array.from(this.lessonTypes.values());
  }
  
  async getLessonType(id: number): Promise<LessonType | undefined> {
    return this.lessonTypes.get(id);
  }
  
  async createLessonType(lessonTypeData: InsertLessonType): Promise<LessonType> {
    const id = this.lessonTypeId++;
    const lessonType = { ...lessonTypeData, id };
    this.lessonTypes.set(id, lessonType);
    return lessonType;
  }
  
  // Skill Level methods
  async getSkillLevels(): Promise<SkillLevel[]> {
    return Array.from(this.skillLevels.values());
  }
  
  async getSkillLevel(id: number): Promise<SkillLevel | undefined> {
    return this.skillLevels.get(id);
  }
  
  async createSkillLevel(skillLevelData: InsertSkillLevel): Promise<SkillLevel> {
    const id = this.skillLevelId++;
    const skillLevel = { ...skillLevelData, id };
    this.skillLevels.set(id, skillLevel);
    return skillLevel;
  }
  
  // Lesson methods
  async getLesson(id: number): Promise<Lesson | undefined> {
    return this.lessons.get(id);
  }
  
  async getLessonWithDetails(id: number): Promise<LessonWithDetails | undefined> {
    const lesson = await this.getLesson(id);
    if (!lesson) return undefined;
    
    const coach = await this.getCoachWithUser(lesson.coachId);
    if (!coach) return undefined;
    
    const lessonType = lesson.lessonTypeId ? await this.getLessonType(lesson.lessonTypeId) : null;
    const skillLevel = lesson.skillLevelId ? await this.getSkillLevel(lesson.skillLevelId) : null;
    
    return { ...lesson, coach, lessonType, skillLevel };
  }
  
  async getLessons(): Promise<Lesson[]> {
    return Array.from(this.lessons.values());
  }
  
  async getLessonsByCoach(coachId: number): Promise<Lesson[]> {
    const lessons = [];
    for (const lesson of this.lessons.values()) {
      if (lesson.coachId === coachId) {
        lessons.push(lesson);
      }
    }
    return lessons;
  }
  
  async getRecommendedLessons(limit: number): Promise<LessonWithDetails[]> {
    const allLessons = await this.getLessons();
    const detailedLessons: LessonWithDetails[] = [];
    
    // Get detailed information for each lesson
    for (const lesson of allLessons) {
      const lessonWithDetails = await this.getLessonWithDetails(lesson.id);
      if (lessonWithDetails) {
        detailedLessons.push(lessonWithDetails);
      }
    }
    
    // Return random selection of lessons (in a real system, this would be based on popularity or some other metric)
    return detailedLessons.slice(0, limit);
  }
  
  async searchLessons(location?: string, lessonTypeId?: number, skillLevelId?: number): Promise<LessonWithDetails[]> {
    let lessons = await this.getLessons();
    
    // Apply filters
    if (location && location !== "모든 지역") {
      lessons = lessons.filter(lesson => lesson.location.includes(location));
    }
    
    if (lessonTypeId && lessonTypeId > 0) {
      lessons = lessons.filter(lesson => lesson.lessonTypeId === lessonTypeId);
    }
    
    if (skillLevelId && skillLevelId > 0) {
      lessons = lessons.filter(lesson => lesson.skillLevelId === skillLevelId);
    }
    
    // Get detailed information for filtered lessons
    const detailedLessons: LessonWithDetails[] = [];
    for (const lesson of lessons) {
      const lessonWithDetails = await this.getLessonWithDetails(lesson.id);
      if (lessonWithDetails) {
        detailedLessons.push(lessonWithDetails);
      }
    }
    
    return detailedLessons;
  }
  
  async createLesson(lessonData: InsertLesson): Promise<Lesson> {
    const id = this.lessonId++;
    const lesson = { ...lessonData, id };
    this.lessons.set(id, lesson);
    return lesson;
  }
  
  // Booking methods
  async getBooking(id: number): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }
  
  async getBookingsByUser(userId: number): Promise<Booking[]> {
    const bookings = [];
    for (const booking of this.bookings.values()) {
      if (booking.userId === userId) {
        bookings.push(booking);
      }
    }
    return bookings;
  }
  
  async getBookingsByLesson(lessonId: number): Promise<Booking[]> {
    const bookings = [];
    for (const booking of this.bookings.values()) {
      if (booking.lessonId === lessonId) {
        bookings.push(booking);
      }
    }
    return bookings;
  }
  
  async createBooking(bookingData: InsertBooking): Promise<Booking> {
    const id = this.bookingId++;
    const booking = { 
      ...bookingData, 
      id, 
      createdAt: new Date() 
    };
    this.bookings.set(id, booking);
    return booking;
  }
  
  async updateBookingStatus(id: number, status: string): Promise<Booking | undefined> {
    const booking = await this.getBooking(id);
    if (!booking) return undefined;
    
    const updatedBooking = { ...booking, status };
    this.bookings.set(id, updatedBooking);
    return updatedBooking;
  }
  
  // Review methods
  async getReview(id: number): Promise<Review | undefined> {
    return this.reviews.get(id);
  }
  
  async getReviewsByLesson(lessonId: number): Promise<Review[]> {
    const reviews = [];
    for (const review of this.reviews.values()) {
      if (review.lessonId === lessonId) {
        reviews.push(review);
      }
    }
    return reviews;
  }
  
  async getReviewsByCoach(coachId: number): Promise<Review[]> {
    const reviews = [];
    const lessons = await this.getLessonsByCoach(coachId);
    const lessonIds = lessons.map(lesson => lesson.id);
    
    for (const review of this.reviews.values()) {
      if (lessonIds.includes(review.lessonId)) {
        reviews.push(review);
      }
    }
    return reviews;
  }
  
  async createReview(reviewData: InsertReview): Promise<Review> {
    const id = this.reviewId++;
    const review = { 
      ...reviewData, 
      id, 
      createdAt: new Date() 
    };
    this.reviews.set(id, review);
    
    // Update coach rating
    const lesson = await this.getLesson(reviewData.lessonId);
    if (lesson) {
      const coach = await this.getCoach(lesson.coachId);
      if (coach) {
        const reviews = await this.getReviewsByCoach(coach.id);
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const newRating = Math.round(totalRating / reviews.length * 10); // Scale to 0-50 (0-5 stars with decimal)
        
        const updatedCoach = { 
          ...coach, 
          rating: newRating,
          reviewCount: reviews.length
        };
        
        this.coaches.set(coach.id, updatedCoach);
      }
    }
    
    return review;
  }
  
  // Schedule methods
  async getSchedulesByCoach(coachId: number): Promise<Schedule[]> {
    const schedules = [];
    for (const schedule of this.schedules.values()) {
      if (schedule.coachId === coachId) {
        schedules.push(schedule);
      }
    }
    return schedules;
  }
  
  async createSchedule(scheduleData: InsertSchedule): Promise<Schedule> {
    const id = this.scheduleId++;
    const schedule = { ...scheduleData, id };
    this.schedules.set(id, schedule);
    return schedule;
  }
  
  // Inquiry methods
  async createInquiry(inquiryData: InsertInquiry): Promise<Inquiry> {
    const id = this.inquiryId++;
    const inquiry = { 
      ...inquiryData, 
      id, 
      createdAt: new Date(),
      resolved: false
    };
    this.inquiries.set(id, inquiry);
    return inquiry;
  }
}

export const storage = new MemStorage();
