import { users, blogPosts, type User, type InsertUser, type BlogPost, type InsertBlogPost, type UpdateBlogPost } from "@shared/schema";
import { db } from "./db";
import { eq, desc, ilike, or, and, sql } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Blog post methods
  getBlogPosts(filters?: { category?: string; tag?: string; status?: string; limit?: number; offset?: number }): Promise<BlogPost[]>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, updates: UpdateBlogPost): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<boolean>;
  incrementBlogPostViews(id: number): Promise<void>;
  incrementBlogPostLeads(id: number): Promise<void>;
  incrementBlogPostShares(id: number): Promise<void>;
  getPopularPosts(limit?: number): Promise<BlogPost[]>;
  getRecentPosts(limit?: number): Promise<BlogPost[]>;
  searchBlogPosts(query: string): Promise<BlogPost[]>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    this.initializeDatabase();
  }

  private async initializeDatabase() {
    try {
      const existingPosts = await db.select().from(blogPosts).limit(1);
      if (existingPosts.length === 0) {
        await this.seedBlogPosts();
      }
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  }

  private async seedBlogPosts() {
    const samplePost: InsertBlogPost = {
      title: "AI-Powered Marketing Automation: The Future Is Here",
      slug: "ai-powered-marketing-automation-future",
      excerpt: "Discover how AI is revolutionizing marketing automation and helping businesses scale their growth with intelligent, data-driven strategies.",
      content: `# AI-Powered Marketing Automation: The Future Is Here

The marketing landscape has evolved dramatically over the past decade, and artificial intelligence is at the forefront of this transformation. Today's businesses are leveraging AI-powered marketing automation to create more personalized, efficient, and effective campaigns than ever before.

## The Power of Intelligent Automation

AI-powered marketing automation goes beyond simple rule-based workflows. It uses machine learning algorithms to analyze customer behavior, predict preferences, and automatically optimize campaigns in real-time. This means your marketing efforts become smarter and more effective without constant manual intervention.

### Key Benefits:
- **Personalization at Scale**: AI can analyze thousands of data points to create highly personalized experiences for each customer
- **Predictive Analytics**: Anticipate customer needs and behaviors before they happen
- **Automated Optimization**: Campaigns continuously improve themselves based on performance data
- **Enhanced Lead Scoring**: More accurate identification of high-quality prospects

## Implementation Strategies

Successfully implementing AI-powered marketing automation requires a strategic approach:

1. **Data Foundation**: Ensure your customer data is clean, organized, and accessible
2. **Tool Selection**: Choose platforms that integrate well with your existing tech stack
3. **Team Training**: Invest in educating your team on AI capabilities and best practices
4. **Gradual Rollout**: Start with simple automations and gradually increase complexity

## The Results Speak for Themselves

Companies implementing AI-powered marketing automation typically see:
- 80% increase in lead generation
- 77% increase in conversions
- 50% reduction in customer acquisition costs
- 45% improvement in customer retention rates

## Ready to Transform Your Marketing?

The future of marketing is intelligent, automated, and incredibly powerful. By embracing AI-powered marketing automation, you're not just keeping up with the competition – you're staying ahead of it.

*Contact our team today to learn how we can help you implement AI-powered marketing automation that drives real results for your business.*`,
      category: "AI Marketing",
      author: "Marketing Team",
      status: "published",
      publishedAt: new Date(),
      ctaType: "consultation",
      tags: ["AI", "Marketing", "Automation"],
      targetKeywords: ["AI marketing", "marketing automation", "artificial intelligence"]
    };

    try {
      await db.insert(blogPosts).values(samplePost);
      console.log('Sample blog post seeded successfully');
    } catch (error) {
      console.error('Error seeding blog posts:', error);
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Blog post methods
  async getBlogPosts(filters?: { category?: string; tag?: string; status?: string; limit?: number; offset?: number }): Promise<BlogPost[]> {
    let query = db.select().from(blogPosts);

    if (filters?.status) {
      query = query.where(eq(blogPosts.status, filters.status as any));
    }

    if (filters?.category) {
      query = query.where(eq(blogPosts.category, filters.category));
    }

    if (filters?.tag) {
      query = query.where(sql`${filters.tag} = ANY(${blogPosts.tags})`);
    }

    query = query.orderBy(desc(blogPosts.createdAt));

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.offset(filters.offset);
    }

    return await query;
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    const result = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
    return result[0];
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const result = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
    return result[0];
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const result = await db.insert(blogPosts).values({
      ...insertPost,
      views: 0,
      leads: 0,
      shares: 0
    }).returning();
    return result[0];
  }

  async updateBlogPost(id: number, updates: UpdateBlogPost): Promise<BlogPost | undefined> {
    const result = await db
      .update(blogPosts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(blogPosts.id, id))
      .returning();
    return result[0];
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    const result = await db.delete(blogPosts).where(eq(blogPosts.id, id));
    return result.rowCount > 0;
  }

  async incrementBlogPostViews(id: number): Promise<void> {
    await db
      .update(blogPosts)
      .set({ views: sql`${blogPosts.views} + 1` })
      .where(eq(blogPosts.id, id));
  }

  async incrementBlogPostLeads(id: number): Promise<void> {
    await db
      .update(blogPosts)
      .set({ leads: sql`${blogPosts.leads} + 1` })
      .where(eq(blogPosts.id, id));
  }

  async incrementBlogPostShares(id: number): Promise<void> {
    await db
      .update(blogPosts)
      .set({ shares: sql`${blogPosts.shares} + 1` })
      .where(eq(blogPosts.id, id));
  }

  async getPopularPosts(limit = 5): Promise<BlogPost[]> {
    return await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.status, 'published'))
      .orderBy(desc(blogPosts.views))
      .limit(limit);
  }

  async getRecentPosts(limit = 5): Promise<BlogPost[]> {
    return await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.status, 'published'))
      .orderBy(desc(blogPosts.createdAt))
      .limit(limit);
  }

  async searchBlogPosts(query: string): Promise<BlogPost[]> {
    const searchTerm = `%${query.toLowerCase()}%`;
    return await db
      .select()
      .from(blogPosts)
      .where(
        and(
          eq(blogPosts.status, 'published'),
          or(
            ilike(blogPosts.title, searchTerm),
            ilike(blogPosts.excerpt, searchTerm),
            ilike(blogPosts.content, searchTerm)
          )
        )
      )
      .orderBy(desc(blogPosts.createdAt));
  }
}

export const storage = new DatabaseStorage();