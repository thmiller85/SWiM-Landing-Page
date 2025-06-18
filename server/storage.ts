import { db } from './db';
import { posts, images, users, type Post, type InsertPost, type Image, type InsertImage, type User, type InsertUser } from '../shared/schema';
import { eq, desc, like, and, or, sql } from 'drizzle-orm';
import bcrypt from 'bcrypt';

export interface IStorage {
  // Post management
  getAllPosts(): Promise<Post[]>;
  getPublishedPosts(): Promise<Post[]>;
  getPostById(id: number): Promise<Post | undefined>;
  getPostBySlug(slug: string): Promise<Post | undefined>;
  createPost(post: InsertPost): Promise<Post>;
  updatePost(id: number, post: Partial<InsertPost>): Promise<Post | undefined>;
  deletePost(id: number): Promise<boolean>;
  
  // Blog-compatible methods
  getPostsByCategory(category: string): Promise<Post[]>;
  getPostsByTag(tag: string): Promise<Post[]>;
  getRecentPosts(limit?: number): Promise<Post[]>;
  searchPosts(query: string): Promise<Post[]>;
  
  // Analytics
  trackView(postId: number): Promise<void>;
  trackLead(postId: number): Promise<void>;
  trackShare(postId: number): Promise<void>;
  
  // Image management
  getAllImages(): Promise<Image[]>;
  getImageById(id: number): Promise<Image | undefined>;
  createImage(image: InsertImage): Promise<Image>;
  updateImage(id: number, image: Partial<InsertImage>): Promise<Image | undefined>;
  deleteImage(id: number): Promise<boolean>;
  
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  validateUser(username: string, password: string): Promise<User | null>;
}

export class DatabaseStorage implements IStorage {
  // Post management
  async getAllPosts(): Promise<Post[]> {
    return await db.select().from(posts).orderBy(desc(posts.createdAt));
  }

  async getPublishedPosts(): Promise<Post[]> {
    return await db.select().from(posts)
      .where(eq(posts.status, 'published'))
      .orderBy(desc(posts.publishedAt));
  }

  async getPostById(id: number): Promise<Post | undefined> {
    const [post] = await db.select().from(posts).where(eq(posts.id, id));
    return post;
  }

  async getPostBySlug(slug: string): Promise<Post | undefined> {
    const [post] = await db.select().from(posts).where(eq(posts.slug, slug));
    return post;
  }

  async createPost(post: InsertPost): Promise<Post> {
    const readingTime = this.calculateReadingTime(post.content);
    const [newPost] = await db.insert(posts).values({
      ...post,
      readingTime,
      updatedAt: new Date(),
    }).returning();
    return newPost;
  }

  async updatePost(id: number, post: Partial<InsertPost>): Promise<Post | undefined> {
    const updates: any = { ...post, updatedAt: new Date() };
    if (post.content) {
      updates.readingTime = this.calculateReadingTime(post.content);
    }
    
    const [updatedPost] = await db.update(posts)
      .set(updates)
      .where(eq(posts.id, id))
      .returning();
    return updatedPost;
  }

  async deletePost(id: number): Promise<boolean> {
    const result = await db.delete(posts).where(eq(posts.id, id));
    return result.rowCount > 0;
  }

  // Blog-compatible methods
  async getPostsByCategory(category: string): Promise<Post[]> {
    return await db.select().from(posts)
      .where(and(eq(posts.category, category), eq(posts.status, 'published')))
      .orderBy(desc(posts.publishedAt));
  }

  async getPostsByTag(tag: string): Promise<Post[]> {
    return await db.select().from(posts)
      .where(and(
        sql`${posts.tags} @> ${JSON.stringify([tag])}`,
        eq(posts.status, 'published')
      ))
      .orderBy(desc(posts.publishedAt));
  }

  async getRecentPosts(limit: number = 5): Promise<Post[]> {
    return await db.select().from(posts)
      .where(eq(posts.status, 'published'))
      .orderBy(desc(posts.publishedAt))
      .limit(limit);
  }

  async searchPosts(query: string): Promise<Post[]> {
    const searchPattern = `%${query}%`;
    return await db.select().from(posts)
      .where(and(
        or(
          like(posts.title, searchPattern),
          like(posts.content, searchPattern),
          like(posts.excerpt, searchPattern)
        ),
        eq(posts.status, 'published')
      ))
      .orderBy(desc(posts.publishedAt));
  }

  // Analytics
  async trackView(postId: number): Promise<void> {
    await db.update(posts)
      .set({ views: sql`${posts.views} + 1` })
      .where(eq(posts.id, postId));
  }

  async trackLead(postId: number): Promise<void> {
    await db.update(posts)
      .set({ leads: sql`${posts.leads} + 1` })
      .where(eq(posts.id, postId));
  }

  async trackShare(postId: number): Promise<void> {
    await db.update(posts)
      .set({ shares: sql`${posts.shares} + 1` })
      .where(eq(posts.id, postId));
  }

  // Image management
  async getAllImages(): Promise<Image[]> {
    return await db.select().from(images).orderBy(desc(images.createdAt));
  }

  async getImageById(id: number): Promise<Image | undefined> {
    const [image] = await db.select().from(images).where(eq(images.id, id));
    return image;
  }

  async createImage(image: InsertImage): Promise<Image> {
    const [newImage] = await db.insert(images).values(image).returning();
    return newImage;
  }

  async updateImage(id: number, image: Partial<InsertImage>): Promise<Image | undefined> {
    const [updatedImage] = await db.update(images)
      .set(image)
      .where(eq(images.id, id))
      .returning();
    return updatedImage;
  }

  async deleteImage(id: number): Promise<boolean> {
    const result = await db.delete(images).where(eq(images.id, id));
    return result.rowCount > 0;
  }

  // User management
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const passwordHash = await bcrypt.hash(user.passwordHash, 10);
    const [newUser] = await db.insert(users).values({
      ...user,
      passwordHash,
    }).returning();
    return newUser;
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.getUserByUsername(username);
    if (!user) return null;
    
    const isValid = await bcrypt.compare(password, user.passwordHash);
    return isValid ? user : null;
  }

  // Helper methods
  private calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  }

  // Convert database post to client format for frontend compatibility
  convertToClientFormat(post: Post): any {
    return {
      title: post.title,
      metaTitle: post.metaTitle || post.title,
      metaDescription: post.metaDescription || post.excerpt || '',
      slug: post.slug,
      publishedAt: post.publishedAt?.toISOString() || post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      author: post.author,
      status: post.status as 'draft' | 'published',
      ctaType: post.ctaType as 'consultation' | 'download' | 'newsletter' | 'demo',
      targetKeywords: post.targetKeywords || [],
      excerpt: post.excerpt || '',
      featuredImage: post.featuredImage || undefined,
      category: post.category,
      tags: post.tags || [],
      readingTime: post.readingTime,
      content: post.content,
      publishedDate: post.publishedAt || post.createdAt,
      updatedDate: post.updatedAt,
    };
  }
}

export const storage = new DatabaseStorage();