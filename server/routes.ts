import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSamplePackSchema } from "@shared/schema";
import { requireAdmin } from "./middleware";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/packs", async (_req, res) => {
    const packs = await storage.getSamplePacks();
    res.json(packs);
  });

  app.get("/api/packs/featured", async (_req, res) => {
    const pack = await storage.getFeaturedPack();
    if (!pack) {
      return res.status(404).json({ message: "No featured pack found" });
    }
    res.json(pack);
  });

  app.get("/api/packs/:id", async (req, res) => {
    const pack = await storage.getSamplePack(Number(req.params.id));
    if (!pack) {
      return res.status(404).json({ message: "Pack not found" });
    }
    res.json(pack);
  });

  app.post("/api/packs", requireAdmin, async (req, res) => {
    const result = insertSamplePackSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid pack data", errors: result.error });
    }
    const pack = await storage.createSamplePack(result.data);
    res.status(201).json(pack);
  });

  app.put("/api/packs/:id", requireAdmin, async (req, res) => {
    const id = Number(req.params.id);
    const existingPack = await storage.getSamplePack(id);
    if (!existingPack) {
      return res.status(404).json({ message: "Pack not found" });
    }

    const result = insertSamplePackSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid pack data", errors: result.error });
    }

    const updatedPack = await storage.updateSamplePack(id, result.data);
    res.json(updatedPack);
  });

  app.delete("/api/packs/:id", requireAdmin, async (req, res) => {
    const id = Number(req.params.id);
    const success = await storage.deleteSamplePack(id);
    if (!success) {
      return res.status(404).json({ message: "Pack not found" });
    }
    res.status(204).send();
  });


  app.post("/api/checkout", async (req, res) => {
    const { packId } = req.body;
    const pack = await storage.getSamplePack(Number(packId));
    if (!pack) {
      return res.status(404).json({ message: "Pack not found" });
    }
    // Mock successful payment
    res.json({ success: true, message: "Payment processed successfully" });
  });

  const httpServer = createServer(app);
  return httpServer;
}