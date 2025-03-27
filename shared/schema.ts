import { pgTable, text, serial, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table - for both students and coaches
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  phone: text("phone"),
  profileImage: text("profile_image"),
  bio: text("bio"),
  isCoach: boolean("is_coach").default(false).notNull(),
});

// Coach specific details
export const coaches = pgTable("coaches", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  specializations: text("specializations").array(),
  experience: text("experience"),
  certifications: text("certifications"),
  location: text("location").notNull(),
  hourlyRate: integer("hourly_rate").notNull(),
  rating: integer("rating"),
  reviewCount: integer("review_count").default(0),
});

// Lesson types
export const lessonTypes = pgTable("lesson_types", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
});

// Skill levels
export const skillLevels = pgTable("skill_levels", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
});

// Lessons offered by coaches
export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  coachId: integer("coach_id").notNull().references(() => coaches.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  lessonTypeId: integer("lesson_type_id").references(() => lessonTypes.id),
  skillLevelId: integer("skill_level_id").references(() => skillLevels.id),
  location: text("location").notNull(),
  groupSize: integer("group_size").notNull(),
  duration: integer("duration").notNull(), // in minutes
  price: integer("price").notNull(), // in KRW
  image: text("image"),
  tags: text("tags").array(),
});

// Bookings made by users
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  lessonId: integer("lesson_id").notNull().references(() => lessons.id),
  scheduleDate: timestamp("schedule_date").notNull(),
  status: text("status").notNull().default("pending"), // pending, confirmed, completed, cancelled
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Reviews from users about lessons
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  lessonId: integer("lesson_id").notNull().references(() => lessons.id),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Schedule availability for coaches
export const schedules = pgTable("schedules", {
  id: serial("id").primaryKey(),
  coachId: integer("coach_id").notNull().references(() => coaches.id),
  dayOfWeek: integer("day_of_week").notNull(), // 0 = Sunday, 1 = Monday, etc.
  startTime: text("start_time").notNull(), // Format: "HH:MM"
  endTime: text("end_time").notNull(), // Format: "HH:MM"
  isAvailable: boolean("is_available").default(true).notNull(),
});

// Contact inquiries
export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  resolved: boolean("resolved").default(false).notNull(),
});

// Insert Schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertCoachSchema = createInsertSchema(coaches).omit({ id: true });
export const insertLessonTypeSchema = createInsertSchema(lessonTypes).omit({ id: true });
export const insertSkillLevelSchema = createInsertSchema(skillLevels).omit({ id: true });
export const insertLessonSchema = createInsertSchema(lessons).omit({ id: true });
export const insertBookingSchema = createInsertSchema(bookings).omit({ id: true, createdAt: true });
export const insertReviewSchema = createInsertSchema(reviews).omit({ id: true, createdAt: true });
export const insertScheduleSchema = createInsertSchema(schedules).omit({ id: true });
export const insertInquirySchema = createInsertSchema(inquiries).omit({ id: true, createdAt: true, resolved: true });

// Additional validation for inquiry form
export const contactFormSchema = insertInquirySchema.extend({
  name: z.string().min(2, "이름은 최소 2글자 이상이어야 합니다."),
  email: z.string().email("올바른 이메일 형식을 입력해주세요."),
  phone: z.string().min(10, "올바른 전화번호를 입력해주세요.").optional(),
  subject: z.string().min(3, "제목을 입력해주세요."),
  message: z.string().min(10, "문의 내용은 최소 10글자 이상이어야 합니다."),
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Coach = typeof coaches.$inferSelect;
export type InsertCoach = z.infer<typeof insertCoachSchema>;

export type LessonType = typeof lessonTypes.$inferSelect;
export type InsertLessonType = z.infer<typeof insertLessonTypeSchema>;

export type SkillLevel = typeof skillLevels.$inferSelect;
export type InsertSkillLevel = z.infer<typeof insertSkillLevelSchema>;

export type Lesson = typeof lessons.$inferSelect;
export type InsertLesson = z.infer<typeof insertLessonSchema>;

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

export type Schedule = typeof schedules.$inferSelect;
export type InsertSchedule = z.infer<typeof insertScheduleSchema>;

export type Inquiry = typeof inquiries.$inferSelect;
export type InsertInquiry = z.infer<typeof insertInquirySchema>;
export type ContactFormData = z.infer<typeof contactFormSchema>;

// Extended types
export type CoachWithUser = Coach & { user: User };
export type LessonWithDetails = Lesson & { 
  coach: CoachWithUser; 
  lessonType: LessonType | null;
  skillLevel: SkillLevel | null;
};
