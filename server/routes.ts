import type { Express, Request, Response, NextFunction } from "express";
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

// Simple admin authentication middleware
function adminAuth(req: Request, res: Response, next: NextFunction) {
  const adminKey = req.headers['x-admin-key'];

  if (!process.env.ADMIN_API_KEY) {
    return res.status(500).json({ error: 'Admin API key not configured' });
  }

  if (adminKey !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized: Invalid admin key' });
  }

  next();
}

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

  // Admin routes - protected with API key
  app.get("/api/admin/email-captures", adminAuth, async (_req, res) => {
    try {
      const captures = await storage.getAllEmailCaptures();
      res.json({ data: captures, count: captures.length });
    } catch (error: any) {
      console.error("Error fetching email captures:", error);
      res.status(500).json({ error: "Failed to fetch email captures" });
    }
  });

  app.get("/api/admin/test-results", adminAuth, async (_req, res) => {
    try {
      const results = await storage.getAllTestResults();
      res.json({ data: results, count: results.length });
    } catch (error: any) {
      console.error("Error fetching test results:", error);
      res.status(500).json({ error: "Failed to fetch test results" });
    }
  });

  // Export endpoints for CSV/JSON download
  app.get("/api/admin/export/email-captures", adminAuth, async (req, res) => {
    try {
      const captures = await storage.getAllEmailCaptures();
      const format = req.query.format || 'json';

      if (format === 'csv') {
        // Convert to CSV
        const headers = ['ID', 'Email', 'Course ID', 'Course Name', 'Score', 'Total Questions', 'Percentage', 'Captured At'];
        const rows = captures.map(c => [
          c.id,
          c.email,
          c.courseId,
          c.courseName,
          c.score,
          c.totalQuestions,
          c.percentage,
          c.capturedAt ? new Date(c.capturedAt).toISOString() : ''
        ]);

        const csv = [headers, ...rows].map(row => row.join(',')).join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=email-captures.csv');
        res.send(csv);
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename=email-captures.json');
        res.json(captures);
      }
    } catch (error: any) {
      console.error("Error exporting email captures:", error);
      res.status(500).json({ error: "Failed to export email captures" });
    }
  });

  app.get("/api/admin/export/test-results", adminAuth, async (req, res) => {
    try {
      const results = await storage.getAllTestResults();
      const format = req.query.format || 'json';

      if (format === 'csv') {
        // Convert to CSV
        const headers = ['ID', 'Course ID', 'Score', 'Total Questions', 'Completed At', 'Share ID'];
        const rows = results.map(r => [
          r.id,
          r.courseId,
          r.score,
          r.totalQuestions,
          r.completedAt ? new Date(r.completedAt).toISOString() : '',
          r.shareId || ''
        ]);

        const csv = [headers, ...rows].map(row => row.join(',')).join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=test-results.csv');
        res.send(csv);
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename=test-results.json');
        res.json(results);
      }
    } catch (error: any) {
      console.error("Error exporting test results:", error);
      res.status(500).json({ error: "Failed to export test results" });
    }
  });

  app.use('/api/*', (_req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  const httpServer = createServer(app);

  return httpServer;
}
