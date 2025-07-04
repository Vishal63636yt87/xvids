import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import { storage } from "./storage";
import { insertVideoSchema, insertAdViewSchema } from "@shared/schema";
import { z } from "zod";
import { ThumbnailExtractor } from "./thumbnail-extractor";

const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Admin authentication routes
  app.get("/api/admin/status", (req, res) => {
    const adminId = (req.session as any)?.adminId;
    res.json({ isAuthenticated: !!adminId });
  });

  app.post("/api/admin/login", async (req, res) => {
    const { username, password } = req.body;
    
    try {
      // Get admin credentials from environment variables
      const adminUsername = process.env.ADMIN_USERNAME || 'admin';
      const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
      
      if (username === adminUsername && password === adminPassword) {
        // Set admin session
        (req.session as any).adminId = 1; // Simple admin ID
        res.json({ success: true, message: "Login successful" });
      } else {
        console.log(`Login attempt failed - Username: ${username}, Expected: ${adminUsername}`);
        res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/admin/logout", (req, res) => {
    (req.session as any).adminId = null;
    res.json({ success: true });
  });

  // Admin middleware
  const requireAdmin = (req: any, res: any, next: any) => {
    if (!(req.session as any).adminId) {
      return res.status(401).json({ message: "Admin access required" });
    }
    next();
  };

  // Video routes
  app.get("/api/videos", async (req, res) => {
    try {
      const { category, search } = req.query;
      const videos = await storage.getVideos(
        category as string,
        search as string
      );
      res.json(videos);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch videos" });
    }
  });

  app.get("/api/videos/trending", async (req, res) => {
    try {
      const videos = await storage.getTrendingVideos();
      res.json(videos);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trending videos" });
    }
  });

  app.get("/api/videos/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const video = await storage.getVideo(id);
      
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }
      
      // Increment view count
      await storage.updateVideoViews(id);
      
      res.json(video);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch video" });
    }
  });

  app.post("/api/videos", upload.single('video'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No video file uploaded" });
      }

      const videoData = insertVideoSchema.parse({
        title: req.body.title,
        description: req.body.description,
        filename: req.file.filename,
        category: req.body.category || 'Entertainment',
        creator: req.body.creator || 'Anonymous',
        duration: parseInt(req.body.duration) || 0,
      });

      const video = await storage.createVideo(videoData);
      res.json(video);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid video data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to upload video" });
    }
  });

  // Video view tracking for external links
  app.post("/api/videos/:id/view", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.updateVideoViews(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to track view" });
    }
  });

  // Add external video (admin only)
  app.post("/api/videos/external", requireAdmin, async (req, res) => {
    try {
      const { title, description, externalUrl, category, creator, duration, featured } = req.body;
      
      // Extract thumbnail from video URL
      const thumbnailResult = await ThumbnailExtractor.extractThumbnail(externalUrl);
      const thumbnailUrl = thumbnailResult?.url || "placeholder";
      
      const videoData = {
        title,
        description: description || "",
        externalUrl,
        thumbnail: thumbnailUrl,
        category: category || "Premium",
        creator: creator || "Anonymous",
        duration: duration * 60, // Convert minutes to seconds
        featured: featured || false,
      };

      const video = await storage.createVideo(videoData);
      res.json(video);
    } catch (error) {
      res.status(500).json({ message: "Failed to add video" });
    }
  });

  // Update video (admin only)
  app.put("/api/videos/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { title, description, externalUrl, category, creator, duration, featured } = req.body;
      
      const updateData = {
        title,
        description: description || "",
        externalUrl,
        category: category || "Premium",
        creator: creator || "Anonymous",
        duration: duration * 60, // Convert minutes to seconds
        featured: featured || false,
      };

      const video = await storage.updateVideo(id, updateData);
      res.json(video);
    } catch (error) {
      res.status(500).json({ message: "Failed to update video" });
    }
  });

  // Delete video (admin only)
  app.delete("/api/videos/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteVideo(id);
      if (success) {
        res.json({ success: true });
      } else {
        res.status(404).json({ message: "Video not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete video" });
    }
  });

  // Ad network integration routes
  app.get("/api/ads/active", async (req, res) => {
    try {
      const ads = await storage.getActiveAds();
      res.json(ads);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch ads" });
    }
  });

  app.post("/api/ads/:id/impression", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.updateAdImpressions(id);
      
      // Track ad view for revenue
      await storage.createAdView({
        adId: id,
        videoId: null,
        revenue: 0.001, // $1 CPM = $0.001 per impression
      });
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to track impression" });
    }
  });

  // External ad network impression tracking (ExoClick, PopAds)
  app.post("/api/ads/impression", async (req, res) => {
    try {
      const { adType, size, revenue } = req.body;
      
      // Create ad view record for revenue tracking
      const adViewData = {
        adId: null, // External ad networks don't have internal IDs
        videoId: null,
        revenue: revenue || 0.002, // Default $2 CPM
      };
      
      await storage.createAdView(adViewData);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to track external ad impression" });
    }
  });

  // External ad network click tracking
  app.post("/api/ads/click", async (req, res) => {
    try {
      const { adType, size, revenue } = req.body;
      
      // Clicks have higher revenue than impressions
      const clickRevenue = (revenue || 0.002) * 25; // 25x impression value
      const adViewData = {
        adId: null,
        videoId: null,
        revenue: clickRevenue,
      };
      
      await storage.createAdView(adViewData);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to track external ad click" });
    }
  });

  app.post("/api/ads/:id/click", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.updateAdClicks(id);
      
      // Track higher revenue for clicks
      await storage.createAdView({
        adId: id,
        videoId: null,
        revenue: 0.05, // $50 CPM for clicks
      });
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to track click" });
    }
  });

  // Revenue dashboard
  app.get("/api/revenue/stats", requireAdmin, async (req, res) => {
    try {
      const stats = await storage.getRevenueStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch revenue stats" });
    }
  });

  // Ad routes
  app.get("/api/ads", async (req, res) => {
    try {
      const { type } = req.query;
      const ads = type 
        ? await storage.getAdsByType(type as string)
        : await storage.getActiveAds();
      res.json(ads);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch ads" });
    }
  });

  app.post("/api/ads/:id/click", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.updateAdClicks(id);
      
      // Record ad view with revenue
      const adViewData = insertAdViewSchema.parse({
        adId: id,
        videoId: req.body.videoId || null,
        revenue: Math.floor(Math.random() * 50) + 10, // Random revenue between 10-60 cents
      });
      
      await storage.createAdView(adViewData);
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to record ad click" });
    }
  });

  app.post("/api/ads/:id/impression", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.updateAdImpressions(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to record ad impression" });
    }
  });

  // Revenue stats
  app.get("/api/revenue/stats", async (req, res) => {
    try {
      const stats = await storage.getRevenueStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch revenue stats" });
    }
  });

  // Admin routes
  app.get("/api/admin/videos", async (req, res) => {
    try {
      const videos = await storage.getVideos();
      res.json(videos);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch videos" });
    }
  });

  app.post("/api/admin/videos", async (req, res) => {
    try {
      const videoData = insertVideoSchema.parse(req.body);
      const video = await storage.createVideo(videoData);
      res.json(video);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid video data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create video" });
    }
  });

  app.put("/api/admin/videos/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const videoData = insertVideoSchema.parse(req.body);
      const video = await storage.updateVideo(id, videoData);
      
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }
      
      res.json(video);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid video data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update video" });
    }
  });

  app.delete("/api/admin/videos/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteVideo(id);
      
      if (!success) {
        return res.status(404).json({ message: "Video not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete video" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
