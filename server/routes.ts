import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEmailCaptureSchema } from "@shared/schema";
import { z } from "zod";

const emailCaptureRequestSchema = insertEmailCaptureSchema.extend({
  email: z.string().email().transform(email => email.toLowerCase()),
  score: z.number().int().min(0),
  totalQuestions: z.number().int().min(1),
}).omit({ percentage: true }).superRefine((data, ctx) => {
  if (data.score > data.totalQuestions) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Score cannot exceed total questions",
      path: ["score"]
    });
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/email-captures", async (req, res) => {
    try {
      const { email, courseId, courseName, score, totalQuestions } = emailCaptureRequestSchema.parse(req.body);
      
      const percentage = Math.round((score / totalQuestions) * 100);
      
      const emailCapture = await storage.createEmailCapture({
        email,
        courseId,
        courseName,
        score,
        totalQuestions,
        percentage
      });
      
      res.json({ success: true, id: emailCapture.id });
    } catch (error: any) {
      console.error("Error creating email capture:", error);
      res.status(400).json({ error: error.message || "Failed to save email" });
    }
  });

  app.use('/api/*', (_req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  const httpServer = createServer(app);

  return httpServer;
}
