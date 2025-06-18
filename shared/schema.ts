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
  canonicalUrl: varchar('canonical_url', { length: 500 }),
  excerpt: text('excerpt'),
  content: text('content').notNull(),
  featuredImage: text('featured_image'),
  featuredImageAlt: varchar('featured_image_alt', { length: 255 }),
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
export const insertPostSchema = createInsertSchema(posts).omit({
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

// Analytics Events table
export const analyticsEvents = pgTable('analytics_events', {
  id: serial('id').primaryKey(),
  eventType: varchar('event_type', { length: 50 }).notNull(),
  eventData: jsonb('event_data'),
  postId: integer('post_id').references(() => posts.id, { onDelete: 'cascade' }),
  sessionId: varchar('session_id', { length: 100 }),
  visitorId: varchar('visitor_id', { length: 100 }),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  referrer: text('referrer'),
  utmSource: varchar('utm_source', { length: 100 }),
  utmMedium: varchar('utm_medium', { length: 100 }),
  utmCampaign: varchar('utm_campaign', { length: 100 }),
  utmTerm: varchar('utm_term', { length: 100 }),
  utmContent: varchar('utm_content', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Visitor Sessions table
export const visitorSessions = pgTable('visitor_sessions', {
  id: serial('id').primaryKey(),
  sessionId: varchar('session_id', { length: 100 }).unique().notNull(),
  visitorId: varchar('visitor_id', { length: 100 }).notNull(),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  deviceType: varchar('device_type', { length: 50 }),
  browser: varchar('browser', { length: 50 }),
  os: varchar('os', { length: 50 }),
  country: varchar('country', { length: 2 }),
  city: varchar('city', { length: 100 }),
  region: varchar('region', { length: 100 }),
  landingPage: text('landing_page'),
  exitPage: text('exit_page'),
  pageViews: integer('page_views').default(0),
  duration: integer('duration'), // in seconds
  bounce: boolean('bounce').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Page Views table
export const pageViews = pgTable('page_views', {
  id: serial('id').primaryKey(),
  postId: integer('post_id').references(() => posts.id, { onDelete: 'cascade' }),
  sessionId: varchar('session_id', { length: 100 }),
  visitorId: varchar('visitor_id', { length: 100 }),
  timeOnPage: integer('time_on_page'), // in seconds
  scrollDepth: integer('scroll_depth'), // percentage
  exitRate: boolean('exit_rate').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Conversions table
export const conversions = pgTable('conversions', {
  id: serial('id').primaryKey(),
  conversionType: varchar('conversion_type', { length: 50 }).notNull(),
  postId: integer('post_id').references(() => posts.id, { onDelete: 'cascade' }),
  sessionId: varchar('session_id', { length: 100 }),
  visitorId: varchar('visitor_id', { length: 100 }),
  attributionSource: varchar('attribution_source', { length: 100 }),
  attributionData: jsonb('attribution_data'),
  formData: jsonb('form_data'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Analytics Aggregates table
export const analyticsAggregates = pgTable('analytics_aggregates', {
  id: serial('id').primaryKey(),
  postId: integer('post_id').references(() => posts.id, { onDelete: 'cascade' }),
  periodType: varchar('period_type', { length: 20 }).notNull(),
  periodStart: timestamp('period_start').notNull(),
  views: integer('views').default(0),
  uniqueVisitors: integer('unique_visitors').default(0),
  avgTimeOnPage: integer('avg_time_on_page').default(0),
  avgScrollDepth: integer('avg_scroll_depth').default(0),
  bounceRate: varchar('bounce_rate', { length: 10 }).default('0'),
  conversionRate: varchar('conversion_rate', { length: 10 }).default('0'),
  conversions: integer('conversions').default(0),
  shares: integer('shares').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Insert schemas for analytics tables
export const insertAnalyticsEventSchema = createInsertSchema(analyticsEvents).omit({
  id: true,
  createdAt: true,
});

export const insertVisitorSessionSchema = createInsertSchema(visitorSessions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPageViewSchema = createInsertSchema(pageViews).omit({
  id: true,
  createdAt: true,
});

export const insertConversionSchema = createInsertSchema(conversions).omit({
  id: true,
  createdAt: true,
});

// Types for analytics tables
export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;
export type InsertAnalyticsEvent = z.infer<typeof insertAnalyticsEventSchema>;
export type VisitorSession = typeof visitorSessions.$inferSelect;
export type InsertVisitorSession = z.infer<typeof insertVisitorSessionSchema>;
export type PageView = typeof pageViews.$inferSelect;
export type InsertPageView = z.infer<typeof insertPageViewSchema>;
export type Conversion = typeof conversions.$inferSelect;
export type InsertConversion = z.infer<typeof insertConversionSchema>;
export type AnalyticsAggregate = typeof analyticsAggregates.$inferSelect;

// Note: BlogPost interface moved to client-only types to avoid drizzle-orm imports in client bundle