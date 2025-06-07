import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").unique().notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  featuredImage: text("featured_image"),
  seoTitle: text("seo_title"),
  metaDescription: text("meta_description"),
  targetKeywords: text("target_keywords").array(),
  tags: text("tags").array(),
  category: text("category").notNull(),
  author: text("author").notNull(),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  status: text("status", { enum: ["draft", "published", "scheduled"] }).default("draft").notNull(),
  ctaType: text("cta_type", { enum: ["consultation", "download", "newsletter", "demo"] }).default("consultation"),
  downloadableResource: text("downloadable_resource"),
  views: integer("views").default(0),
  leads: integer("leads").default(0),
  shares: integer("shares").default(0),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  views: true,
  leads: true,
  shares: true,
});

export const updateBlogPostSchema = insertBlogPostSchema.partial();

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type UpdateBlogPost = z.infer<typeof updateBlogPostSchema>;
