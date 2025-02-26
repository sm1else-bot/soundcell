// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
var MemStorage = class {
  packs;
  currentId;
  constructor() {
    this.packs = /* @__PURE__ */ new Map();
    this.currentId = 1;
    this.initializeSampleData();
  }
  initializeSampleData() {
    const samplePacks2 = [
      {
        title: "Neon Nights",
        description: "Cyberpunk-inspired synth leads and atmospheric pads",
        price: 2999,
        imageUrl: "https://images.unsplash.com/photo-1475275166152-f1e8005f9854",
        demoUrl: "https://soundcloud.com/example/neon-nights",
        featured: 1
      },
      {
        title: "Digital Dreams",
        description: "Future bass essentials with glitch percussion",
        price: 1999,
        imageUrl: "https://images.unsplash.com/photo-1471478331149-c72f17e33c73",
        demoUrl: "https://soundcloud.com/example/digital-dreams",
        featured: 0
      },
      {
        title: "Neural Network",
        description: "AI-generated soundscapes and textures",
        price: 2499,
        imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4",
        demoUrl: "https://soundcloud.com/example/neural-network",
        featured: 0
      }
    ];
    samplePacks2.forEach((pack) => {
      this.createSamplePack(pack);
    });
  }
  async getSamplePacks() {
    return Array.from(this.packs.values());
  }
  async getSamplePack(id) {
    return this.packs.get(id);
  }
  async getFeaturedPack() {
    return Array.from(this.packs.values()).find((pack) => pack.featured === 1);
  }
  async createSamplePack(pack) {
    const id = this.currentId++;
    const newPack = { ...pack, id };
    this.packs.set(id, newPack);
    return newPack;
  }
  async updateSamplePack(id, pack) {
    const updatedPack = { ...pack, id };
    this.packs.set(id, updatedPack);
    return updatedPack;
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var samplePacks = pgTable("sample_packs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  imageUrl: text("image_url").notNull(),
  demoUrl: text("demo_url").notNull(),
  featured: integer("featured").default(0)
});
var insertSamplePackSchema = createInsertSchema(samplePacks).omit({
  id: true
});

// server/middleware.ts
function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  if (token !== process.env.ADMIN_TOKEN) {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
}

// server/routes.ts
async function registerRoutes(app2) {
  app2.get("/api/packs", async (_req, res) => {
    const packs = await storage.getSamplePacks();
    res.json(packs);
  });
  app2.get("/api/packs/featured", async (_req, res) => {
    const pack = await storage.getFeaturedPack();
    if (!pack) {
      return res.status(404).json({ message: "No featured pack found" });
    }
    res.json(pack);
  });
  app2.get("/api/packs/:id", async (req, res) => {
    const pack = await storage.getSamplePack(Number(req.params.id));
    if (!pack) {
      return res.status(404).json({ message: "Pack not found" });
    }
    res.json(pack);
  });
  app2.post("/api/packs", requireAdmin, async (req, res) => {
    const result = insertSamplePackSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid pack data", errors: result.error });
    }
    const pack = await storage.createSamplePack(result.data);
    res.status(201).json(pack);
  });
  app2.put("/api/packs/:id", requireAdmin, async (req, res) => {
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
  app2.delete("/api/packs/:id", requireAdmin, async (req, res) => {
    const id = Number(req.params.id);
    const success = await storage.deleteSamplePack(id);
    if (!success) {
      return res.status(404).json({ message: "Pack not found" });
    }
    res.status(204).send();
  });
  app2.post("/api/checkout", async (req, res) => {
    const { packId } = req.body;
    const pack = await storage.getSamplePack(Number(packId));
    if (!pack) {
      return res.status(404).json({ message: "Pack not found" });
    }
    res.json({ success: true, message: "Payment processed successfully" });
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2, { dirname as dirname2 } from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path, { dirname } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared")
    }
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = dirname2(__filename2);
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        __dirname2,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(__dirname2, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
var startServer = async () => {
  try {
    const server = await registerRoutes(app);
    app.use((err, _req, res, _next) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
      console.error(err);
    });
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }
    const port = 3030;
    server.listen(
      {
        port,
        host: "localhost"
        // Changed from "0.0.0.0" to "localhost"
      },
      () => {
        log(`Serving on port ${port}`);
      }
    );
  } catch (error) {
    console.error("Error starting the server:", error);
  }
};
startServer();
