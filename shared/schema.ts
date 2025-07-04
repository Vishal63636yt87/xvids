import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").default("user"), // "admin" or "user"
  createdAt: timestamp("created_at").defaultNow(),
});

export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  externalUrl: text("external_url").notNull(), // URL to external video hosting
  thumbnail: text("thumbnail").notNull(),
  category: text("category").notNull(),
  creator: text("creator").notNull(),
  tags: text("tags").array(), // Array of tags for adult content
  views: integer("views").default(0),
  duration: integer("duration"), // in seconds
  featured: boolean("featured").default(false),
  uploadTime: timestamp("upload_time").defaultNow(),
});

export const ads = pgTable("ads", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  clickUrl: text("click_url"),
  adType: text("ad_type").notNull(), // banner, sidebar, preroll, midroll
  active: boolean("active").default(true),
  impressions: integer("impressions").default(0),
  clicks: integer("clicks").default(0),
});

export const adViews = pgTable("ad_views", {
  id: serial("id").primaryKey(),
  adId: integer("ad_id").references(() => ads.id),
  videoId: integer("video_id").references(() => videos.id),
  timestamp: timestamp("timestamp").defaultNow(),
  revenue: integer("revenue"), // in cents
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertVideoSchema = createInsertSchema(videos).omit({
  id: true,
  views: true,
  uploadTime: true,
});

export const insertAdSchema = createInsertSchema(ads).omit({
  id: true,
  impressions: true,
  clicks: true,
});

export const insertAdViewSchema = createInsertSchema(adViews).omit({
  id: true,
  timestamp: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertVideo = z.infer<typeof insertVideoSchema>;
export type Video = typeof videos.$inferSelect;

export type InsertAd = z.infer<typeof insertAdSchema>;
export type Ad = typeof ads.$inferSelect;

export type InsertAdView = z.infer<typeof insertAdViewSchema>;
export type AdView = typeof adViews.$inferSelect;
