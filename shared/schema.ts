import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const courses = pgTable("courses", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
});

export const questions = pgTable("questions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  courseId: varchar("course_id").notNull(),
  question: text("question").notNull(),
  options: jsonb("options").notNull(), // string[]
  correctAnswer: integer("correct_answer").notNull(),
  explanation: text("explanation").notNull(),
  topic: text("topic").notNull(),
});

export const testResults = pgTable("test_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  courseId: varchar("course_id").notNull(),
  score: integer("score").notNull(),
  totalQuestions: integer("total_questions").notNull(),
  answers: jsonb("answers").notNull(), // { questionId: string, selectedAnswer: number, correct: boolean }[]
  completedAt: timestamp("completed_at").defaultNow(),
  shareId: varchar("share_id").unique(),
});

export const emailCaptures = pgTable("email_captures", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull(),
  courseId: varchar("course_id").notNull(),
  courseName: text("course_name").notNull(),
  score: integer("score").notNull(),
  totalQuestions: integer("total_questions").notNull(),
  percentage: integer("percentage").notNull(),
  capturedAt: timestamp("captured_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
});

export const insertQuestionSchema = createInsertSchema(questions).omit({
  id: true,
});

export const insertTestResultSchema = createInsertSchema(testResults).omit({
  id: true,
  completedAt: true,
  shareId: true,
});

export const insertEmailCaptureSchema = createInsertSchema(emailCaptures).omit({
  id: true,
  capturedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Course = typeof courses.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Question = typeof questions.$inferSelect;
export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type TestResult = typeof testResults.$inferSelect;
export type InsertTestResult = z.infer<typeof insertTestResultSchema>;
export type EmailCapture = typeof emailCaptures.$inferSelect;
export type InsertEmailCapture = z.infer<typeof insertEmailCaptureSchema>;

// Frontend types for test flow
export type TestQuestion = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  topic: string;
};

export type TestAnswer = {
  questionId: string;
  selectedAnswer: number;
  correct: boolean;
};

export type TestSession = {
  courseId: string;
  questions: TestQuestion[];
  currentQuestion: number;
  answers: TestAnswer[];
  score: number;
  completed: boolean;
};