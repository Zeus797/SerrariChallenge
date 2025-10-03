import { users, emailCaptures, type User, type InsertUser, type EmailCapture, type InsertEmailCapture } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import 'dotenv/config';

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createEmailCapture(emailCapture: InsertEmailCapture): Promise<EmailCapture>;
  getEmailCapturesByEmail(email: string): Promise<EmailCapture[]>;
  getAllEmailCaptures(): Promise<EmailCapture[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createEmailCapture(insertEmailCapture: InsertEmailCapture): Promise<EmailCapture> {
    const [emailCapture] = await db
      .insert(emailCaptures)
      .values(insertEmailCapture)
      .returning();
    return emailCapture;
  }

  async getEmailCapturesByEmail(email: string): Promise<EmailCapture[]> {
    return await db.select().from(emailCaptures).where(eq(emailCaptures.email, email));
  }

  async getAllEmailCaptures(): Promise<EmailCapture[]> {
    return await db.select().from(emailCaptures);
  }
}

export const storage = new DatabaseStorage();
