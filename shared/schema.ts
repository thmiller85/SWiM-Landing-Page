import { pgTable, serial, text, varchar, timestamp, integer, boolean, jsonb } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// Blog posts table
export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).unique().notNull(),
  metaTitle: varchar('meta_title', { length: 255 }),
  metaDescription: text('meta_description'),
  excerpt: text('excerpt'),
  content: text('content').notNull(),
  featuredImage: text('featured_image'),
  author: varchar('author', { length: 100 }).notNull(),
  status: varchar('status', { length: 20 }).notNull().default('draft'), // draft, published
  ctaType: varchar('cta_type', { length: 50 }).notNull().default('consultation'), // consultation, download, newsletter, demo
  category: varchar('category', { length: 100 }).notNull(),
  tags: jsonb('tags').$type<string[]>().notNull().default([]),
  targetKeywords: jsonb('target_keywords').$type<string[]>().notNull().default([]),
  readingTime: integer('reading_time').notNull().default(0),
  views: integer('views').notNull().default(0),
  leads: integer('leads').notNull().default(0),
  shares: integer('shares').notNull().default(0),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Image assets table
export const images = pgTable('images', {
  id: serial('id').primaryKey(),
  filename: varchar('filename', { length: 255 }).notNull(),
  originalName: varchar('original_name', { length: 255 }).notNull(),
  altText: text('alt_text'),
  caption: text('caption'),
  url: text('url').notNull(),
  size: integer('size').notNull(),
  mimeType: varchar('mime_type', { length: 100 }).notNull(),
  width: integer('width'),
  height: integer('height'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// User management table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 50 }).unique().notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  role: varchar('role', { length: 20 }).notNull().default('editor'), // admin, editor
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Insert schemas
export const insertPostSchema = createInsertSchema(posts, {
  tags: z.array(z.string()).default([]),
  targetKeywords: z.array(z.string()).default([]),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  views: true,
  leads: true,
  shares: true,
});

export const insertImageSchema = createInsertSchema(images).omit({
  id: true,
  createdAt: true,
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

// Types
export type Post = typeof posts.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;
export type Image = typeof images.$inferSelect;
export type InsertImage = z.infer<typeof insertImageSchema>;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

// Blog post with calculated fields (for compatibility with existing frontend)
export interface BlogPost {
  title: string;
  metaTitle: string;
  metaDescription: string;
  slug: string;
  publishedAt: string;
  updatedAt: string;
  author: string;
  status: 'draft' | 'published';
  ctaType: 'consultation' | 'download' | 'newsletter' | 'demo';
  targetKeywords: string[];
  excerpt: string;
  featuredImage?: string;
  category: string;
  tags: string[];
  readingTime: number;
  content: string;
  publishedDate: Date;
  updatedDate: Date;
}