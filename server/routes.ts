import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEmailCaptureSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/email-captures", async (req, res) => {
    try {
      const validatedData = insertEmailCaptureSchema.parse(req.body);
      const emailCapture = await storage.createEmailCapture(validatedData);
      res.json(emailCapture);
    } catch (error: any) {
      console.error("Error creating email capture:", error);
      res.status(400).json({ error: error.message || "Failed to save email" });
    }
  });

  app.get("/api/email-captures", async (req, res) => {
    try {
      const emailCaptures = await storage.getAllEmailCaptures();
      res.json(emailCaptures);
    } catch (error: any) {
      console.error("Error fetching email captures:", error);
      res.status(500).json({ error: "Failed to fetch email captures" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
