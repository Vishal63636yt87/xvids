import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { VideoService } from "./services/videoService";
import { AdService } from "./services/adService";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/health", (req, res) => {
    res.status(200).json({ 
      status: "OK", 
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  });

  // ExoClick verification file
  app.get("/8c90fe5dffbcc3f1ad3154627b107ec6.html", (req, res) => {
    res.type('html').send('8c90fe5dffbcc3f1ad3154627b107ec6');
  });

  // Initialize videos from environment variables
  await VideoService.initializeVideosFromEnvironment();

  // Get all videos with optional category filter
  app.get("/api/videos", async (req, res) => {
    try {
      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      
      const videos = await storage.getVideos(categoryId, limit, offset);
      res.json(videos);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch videos" });
    }
  });

  // Get single video
  app.get("/api/videos/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const video = await storage.getVideo(id);
      
      if (!video) {
        return res.status(404).json({ error: "Video not found" });
      }
      
      res.json(video);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch video" });
    }
  });

  // Update video views
  app.post("/api/videos/:id/view", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const video = await storage.updateVideoViews(id);
      
      if (!video) {
        return res.status(404).json({ error: "Video not found" });
      }
      
      res.json(video);
    } catch (error) {
      res.status(500).json({ error: "Failed to update video views" });
    }
  });

  // Search videos
  app.get("/api/videos/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ error: "Search query required" });
      }
      
      const videos = await storage.searchVideos(query);
      res.json(videos);
    } catch (error) {
      res.status(500).json({ error: "Failed to search videos" });
    }
  });

  // Get all categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  // Get category by slug
  app.get("/api/categories/:slug", async (req, res) => {
    try {
      const slug = req.params.slug;
      const category = await storage.getCategoryBySlug(slug);
      
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      
      res.json(category);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch category" });
    }
  });

  // Get ad scripts
  app.get("/api/ads/scripts", async (req, res) => {
    try {
      const scripts = {
        exoclick: AdService.generateExoClickScript(),
        popads: AdService.generatePopAdsScript(),
        popunder: AdService.generatePopunderAd(),
      };
      res.json(scripts);
    } catch (error) {
      res.status(500).json({ error: "Failed to generate ad scripts" });
    }
  });

  // Get banner ad
  app.get("/api/ads/banner", async (req, res) => {
    try {
      const width = parseInt(req.query.width as string) || 728;
      const height = parseInt(req.query.height as string) || 90;
      const network = (req.query.network as 'exoclick' | 'popads') || 'exoclick';
      
      const bannerHtml = AdService.generateBannerAd(width, height, network);
      res.json({ html: bannerHtml });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate banner ad" });
    }
  });

  // Get popunder ad
  app.get("/api/ads/popunder", async (req, res) => {
    try {
      const popunderHtml = AdService.generatePopunderAd();
      res.json({ html: popunderHtml });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate popunder ad" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
