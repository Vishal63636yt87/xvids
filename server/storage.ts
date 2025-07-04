import { users, videos, ads, adViews, type User, type InsertUser, type Video, type InsertVideo, type Ad, type InsertAd, type AdView, type InsertAdView } from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Video methods
  getVideo(id: number): Promise<Video | undefined>;
  getVideos(category?: string, search?: string): Promise<Video[]>;
  createVideo(video: InsertVideo): Promise<Video>;
  updateVideo(id: number, video: InsertVideo): Promise<Video | undefined>;
  deleteVideo(id: number): Promise<boolean>;
  updateVideoViews(id: number): Promise<void>;
  getTrendingVideos(): Promise<Video[]>;
  
  // Ad methods
  getAd(id: number): Promise<Ad | undefined>;
  getAdsByType(adType: string): Promise<Ad[]>;
  getActiveAds(): Promise<Ad[]>;
  createAd(ad: InsertAd): Promise<Ad>;
  updateAdClicks(id: number): Promise<void>;
  updateAdImpressions(id: number): Promise<void>;
  
  // Ad view methods
  createAdView(adView: InsertAdView): Promise<AdView>;
  getRevenueStats(): Promise<{ today: number; total: number; clickRate: number }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private videos: Map<number, Video>;
  private ads: Map<number, Ad>;
  private adViews: Map<number, AdView>;
  private currentUserId: number;
  private currentVideoId: number;
  private currentAdId: number;
  private currentAdViewId: number;

  constructor() {
    this.users = new Map();
    this.videos = new Map();
    this.ads = new Map();
    this.adViews = new Map();
    this.currentUserId = 1;
    this.currentVideoId = 1;
    this.currentAdId = 1;
    this.currentAdViewId = 1;
    
    this.seedData();
  }

  private loadVideosFromEnv(): InsertVideo[] {
    const videos: InsertVideo[] = [];
    
    // Load videos from environment variables
    for (let i = 1; i <= 20; i++) {
      const title = process.env[`VIDEO_${i}_TITLE`];
      const url = process.env[`VIDEO_${i}_URL`];
      
      if (title && url) {
        videos.push({
          title,
          description: `Video: ${title}`,
          externalUrl: url,
          thumbnail: `https://images.unsplash.com/photo-${1500000000000 + i * 1000}?w=400&h=225&fit=crop`,
          category: "Entertainment",
          creator: "Content Creator",
          tags: ["video"],
          duration: 1800,
          featured: i <= 3,
        });
      }
    }
    
    return videos;
  }

  private seedData() {
    // Load videos from environment variables
    const envVideos = this.loadVideosFromEnv();

    // Use environment videos if available, otherwise add fallback
    if (envVideos.length > 0) {
      envVideos.forEach(video => this.createVideo(video));
    } else {
      // Add single fallback video to show the structure
      this.createVideo({
        title: "Sample Video - Add yours via environment variables",
        description: "Set VIDEO_1_TITLE and VIDEO_1_URL in your environment variables",
        externalUrl: "https://example.com/video",
        thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=225&fit=crop",
        category: "Entertainment",
        creator: "Demo",
        tags: ["demo"],
        duration: 1800,
        featured: true,
      });
    }

    // Create admin user from environment variables
    const adminUsername = process.env.ADMIN_USERNAME || "admin";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    
    this.createUser({
      username: adminUsername,
      password: adminPassword,
      role: "admin",
      createdAt: new Date(),
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      role: insertUser.role || null,
      createdAt: insertUser.createdAt || null
    };
    this.users.set(id, user);
    return user;
  }

  // Video methods
  async getVideo(id: number): Promise<Video | undefined> {
    return this.videos.get(id);
  }

  async getVideos(category?: string, search?: string): Promise<Video[]> {
    let videos = Array.from(this.videos.values());
    
    if (category && category !== 'All') {
      videos = videos.filter(video => video.category === category);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      videos = videos.filter(video => 
        video.title.toLowerCase().includes(searchLower) ||
        video.creator.toLowerCase().includes(searchLower) ||
        video.description?.toLowerCase().includes(searchLower)
      );
    }
    
    return videos.sort((a, b) => new Date(b.uploadTime || 0).getTime() - new Date(a.uploadTime || 0).getTime());
  }

  async createVideo(insertVideo: InsertVideo): Promise<Video> {
    const id = this.currentVideoId++;
    const video: Video = { 
      ...insertVideo, 
      id, 
      views: 0,
      uploadTime: new Date(),
      description: insertVideo.description || null,
      tags: insertVideo.tags || null,
      duration: insertVideo.duration || null,
      featured: insertVideo.featured || null
    };
    this.videos.set(id, video);
    return video;
  }

  async updateVideo(id: number, insertVideo: InsertVideo): Promise<Video | undefined> {
    const existingVideo = this.videos.get(id);
    if (!existingVideo) return undefined;

    const updatedVideo: Video = {
      ...existingVideo,
      ...insertVideo,
      id,
      description: insertVideo.description || null,
      tags: insertVideo.tags || null,
      duration: insertVideo.duration || null,
      featured: insertVideo.featured || null
    };
    this.videos.set(id, updatedVideo);
    return updatedVideo;
  }

  async deleteVideo(id: number): Promise<boolean> {
    return this.videos.delete(id);
  }

  async updateVideoViews(id: number): Promise<void> {
    const video = this.videos.get(id);
    if (video) {
      video.views = (video.views || 0) + 1;
      this.videos.set(id, video);
    }
  }

  async getTrendingVideos(): Promise<Video[]> {
    return Array.from(this.videos.values())
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 5);
  }

  // Ad methods
  async getAd(id: number): Promise<Ad | undefined> {
    return this.ads.get(id);
  }

  async getAdsByType(adType: string): Promise<Ad[]> {
    return Array.from(this.ads.values()).filter(ad => ad.adType === adType && ad.active);
  }

  async getActiveAds(): Promise<Ad[]> {
    return Array.from(this.ads.values()).filter(ad => ad.active);
  }

  async createAd(insertAd: InsertAd): Promise<Ad> {
    const id = this.currentAdId++;
    const ad: Ad = { 
      ...insertAd, 
      id, 
      impressions: 0,
      clicks: 0
    };
    this.ads.set(id, ad);
    return ad;
  }

  async updateAdClicks(id: number): Promise<void> {
    const ad = this.ads.get(id);
    if (ad) {
      ad.clicks = (ad.clicks || 0) + 1;
      this.ads.set(id, ad);
    }
  }

  async updateAdImpressions(id: number): Promise<void> {
    const ad = this.ads.get(id);
    if (ad) {
      ad.impressions = (ad.impressions || 0) + 1;
      this.ads.set(id, ad);
    }
  }

  // Ad view methods
  async createAdView(insertAdView: InsertAdView): Promise<AdView> {
    const id = this.currentAdViewId++;
    const adView: AdView = {
      ...insertAdView,
      id,
      timestamp: new Date()
    };
    this.adViews.set(id, adView);
    return adView;
  }

  async getRevenueStats(): Promise<{ today: number; total: number; clickRate: number }> {
    const adViews = Array.from(this.adViews.values());
    const totalAds = Array.from(this.ads.values());
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayViews = adViews.filter(view => 
      view.timestamp && new Date(view.timestamp) >= today
    );
    
    const todayRevenue = todayViews.reduce((sum, view) => sum + (view.revenue || 0), 0);
    const totalRevenue = adViews.reduce((sum, view) => sum + (view.revenue || 0), 0);
    
    const totalImpressions = totalAds.reduce((sum, ad) => sum + (ad.impressions || 0), 0);
    const totalClicks = totalAds.reduce((sum, ad) => sum + (ad.clicks || 0), 0);
    const clickRate = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
    
    return {
      today: todayRevenue / 100, // Convert from cents to dollars
      total: totalRevenue / 100,
      clickRate: Math.round(clickRate * 10) / 10
    };
  }
}

export const storage = new MemStorage();
