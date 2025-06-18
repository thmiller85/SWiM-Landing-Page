// Server-only schema validators
// This file provides validation schemas without exposing drizzle-orm to the client bundle

import { z } from 'zod';

// Post validation schema
export const createPostSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  content: z.string(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  canonicalUrl: z.string().optional(),
  excerpt: z.string().optional(),
  featuredImage: z.string().nullable().optional(),
  featuredImageAlt: z.string().optional(),
  author: z.string().min(1),
  status: z.enum(['draft', 'published']).default('draft'),
  ctaType: z.enum(['consultation', 'download', 'newsletter', 'demo']).default('consultation'),
  category: z.string().min(1),
  tags: z.array(z.string()).default([]),
  targetKeywords: z.array(z.string()).default([]),
  readingTime: z.number().optional().default(0),
  publishedAt: z.string().nullable().optional(),
});

export const updatePostSchema = createPostSchema.partial();

// Image validation schema
export const createImageSchema = z.object({
  filename: z.string().min(1),
  originalName: z.string().min(1),
  url: z.string().min(1),
  size: z.number(),
  mimeType: z.string().min(1),
  altText: z.string().optional(),
  caption: z.string().optional(),
  width: z.number().nullable().optional(),
  height: z.number().nullable().optional(),
});

export const updateImageSchema = z.object({
  altText: z.string().optional(),
  caption: z.string().optional(),
});

// User validation schema
export const createUserSchema = z.object({
  username: z.string().min(1),
  email: z.string().email(),
  passwordHash: z.string().min(1), // This will be the plain password from the API, hashed in storage
  role: z.enum(['admin', 'editor']).default('editor'),
});

// Type exports for server-side use
export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type CreateImageInput = z.infer<typeof createImageSchema>;
export type UpdateImageInput = z.infer<typeof updateImageSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;