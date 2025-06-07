import { users, blogPosts, type User, type InsertUser, type BlogPost, type InsertBlogPost, type UpdateBlogPost } from "@shared/schema";

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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private blogPosts: Map<number, BlogPost>;
  private currentUserId: number;
  private currentBlogPostId: number;

  constructor() {
    this.users = new Map();
    this.blogPosts = new Map();
    this.currentUserId = 1;
    this.currentBlogPostId = 1;
    
    // Add some sample blog posts for development
    this.seedBlogPosts();
  }

  private seedBlogPosts() {
    const samplePosts: InsertBlogPost[] = [
      {
        title: "The Complete Guide to Workflow Automation for B2B Companies",
        slug: "complete-guide-workflow-automation-b2b",
        excerpt: "Discover how B2B companies are reclaiming 20+ hours per week through intelligent workflow automation. Includes downloadable checklist and ROI calculator.",
        content: `# The Complete Guide to Workflow Automation for B2B Companies

Remember the last time you watched an employee manually copy data from one spreadsheet to another? Or waited three days for a simple approval that should take three minutes?

If you're nodding your head, you're not alone.

According to McKinsey, employees spend 61% of their time on repetitive, automatable tasks. That's three full days every week that could be redirected toward growth, innovation, and strategic thinking.

## The True Cost of Manual Workflows

Manual workflows cost B2B companies more than just time:

- **Lost Productivity**: $78,000/year per employee
- **Delayed Projects**: 3-5 weeks on average
- **Employee Burnout**: 67% higher turnover rates

## 5 Workflows Every B2B Company Should Automate First

### 1. Lead Qualification and Routing
Automatically score and route leads to the right sales representatives based on criteria like company size, industry, and behavior.

### 2. Customer Onboarding
Create automated sequences for welcome emails, document collection, and milestone tracking.

### 3. Invoice Processing
Eliminate manual data entry with automated invoice capture, approval routing, and payment tracking.

### 4. Inventory Management
Set up automatic reorder points, supplier notifications, and stock level alerts.

### 5. Report Generation
Automate regular reports for sales, marketing, and operations teams.

## Implementation Framework

Our proven 4-step framework for successful automation:

1. **Audit Current Processes**: Map existing workflows and identify bottlenecks
2. **Prioritize by Impact**: Focus on high-volume, error-prone tasks first
3. **Start Small**: Begin with simple automations and build complexity
4. **Measure and Optimize**: Track results and continuously improve

## Real Results: Self-Storage Company Case Study

We helped a self-storage company automate their pricing analysis workflow:

- **Before**: 20 hours/week of manual price comparisons
- **After**: 30 minutes/week of automated analysis
- **Result**: 15-25% potential revenue increase

## Getting Started Checklist

Download our free Workflow Automation Readiness Checklist to identify your biggest automation opportunities in under 10 minutes.

Ready to reclaim 20+ hours per week through intelligent automation?`,
        featuredImage: "/api/placeholder/800/400",
        seoTitle: "Workflow Automation Guide for B2B Companies | SWiM AI",
        metaDescription: "Complete guide to workflow automation for B2B companies. Learn how to save 20+ hours per week with proven automation strategies and tools.",
        targetKeywords: ["workflow automation", "b2b automation", "business process automation"],
        tags: ["workflow", "automation", "b2b", "productivity"],
        category: "Workflow Automation",
        author: "Ross Stockdale",
        publishedAt: new Date("2024-12-01"),
        status: "published",
        ctaType: "download",
        downloadableResource: "workflow-automation-checklist.pdf"
      },
      {
        title: "AI Implementation Strategy: A Step-by-Step Guide for 2025",
        slug: "ai-implementation-strategy-guide-2025",
        excerpt: "Learn how to create a successful AI implementation plan that aligns with your business goals. Avoid the 70% failure rate with our proven framework.",
        content: `# AI Implementation Strategy: A Step-by-Step Guide for 2025

"We need to implement AI" has become the rallying cry of boardrooms everywhere. But without a clear plan, 70% of AI initiatives fail to deliver meaningful results.

The difference between success and expensive failure? A strategic implementation plan that aligns AI capabilities with actual business needs.

## Why Most AI Projects Fail

Common pitfalls include:
- Lack of clear objectives
- Insufficient data quality
- Poor change management
- Technology-first approach
- Unrealistic expectations

## Our 7-Component AI Implementation Framework

### 1. Business Case Development
Define specific problems AI will solve and quantify expected benefits.

### 2. Data Assessment
Evaluate data quality, accessibility, and governance requirements.

### 3. Technology Selection
Choose the right AI tools and platforms for your use case.

### 4. Pilot Project Design
Start with a focused pilot to prove value and learn.

### 5. Change Management
Prepare your team for new workflows and responsibilities.

### 6. Deployment Strategy
Plan for gradual rollout with success metrics.

### 7. Continuous Optimization
Monitor performance and iterate based on results.

## Implementation Timeline

**Phase 1 (Weeks 1-4): Foundation**
- Stakeholder alignment
- Data audit
- Use case prioritization

**Phase 2 (Weeks 5-12): Pilot**
- MVP development
- Testing and refinement
- Initial results measurement

**Phase 3 (Weeks 13-24): Scale**
- Full deployment
- Team training
- Performance optimization

Ready to create your AI implementation roadmap?`,
        featuredImage: "/api/placeholder/800/400",
        seoTitle: "AI Implementation Strategy Guide 2025 | SWiM AI",
        metaDescription: "Create a successful AI implementation plan with our proven framework. Avoid common pitfalls and achieve measurable results.",
        targetKeywords: ["ai implementation", "ai strategy", "artificial intelligence planning"],
        tags: ["ai", "strategy", "implementation", "planning"],
        category: "AI Solutions",
        author: "Ross Stockdale",
        publishedAt: new Date("2024-12-03"),
        status: "published",
        ctaType: "consultation"
      },
      {
        title: "B2B SaaS Development: Building Custom Solutions That Scale",
        slug: "b2b-saas-development-custom-solutions",
        excerpt: "From concept to scale: Learn how custom B2B SaaS solutions can transform your business operations and drive growth.",
        content: `# B2B SaaS Development: Building Custom Solutions That Scale

In today's competitive landscape, off-the-shelf software often falls short of meeting unique business requirements. Custom B2B SaaS solutions offer the flexibility and functionality needed to drive real business transformation.

## When to Consider Custom SaaS Development

### Signs You Need a Custom Solution:
- Existing tools don't integrate with your workflows
- You're using multiple platforms for connected processes
- Your business model is unique to your industry
- You need specific compliance or security features
- You want to create a competitive advantage

## Our Development Process

### Discovery and Planning (Weeks 1-2)
- Stakeholder interviews
- Requirements gathering
- Technical architecture design
- Project timeline and milestones

### MVP Development (Weeks 3-8)
- Core feature development
- User interface design
- Basic integrations
- Alpha testing

### Enhancement and Testing (Weeks 9-12)
- Advanced features
- Security implementation
- Performance optimization
- Beta testing with real users

### Deployment and Support (Ongoing)
- Production deployment
- User training
- Ongoing maintenance
- Feature enhancements

## Technology Stack Considerations

We use modern, scalable technologies including:
- React/TypeScript for frontend
- Node.js/Python for backend
- PostgreSQL/MongoDB for data
- AWS/Azure for hosting
- CI/CD for deployment

## Success Story: Retail Content Automation

We built a custom SaaS platform for a retail client that:
- Reduced content creation time by 95%
- Increased content output by 3x
- Improved SEO performance by 42%
- Generated $500K+ in additional revenue

Ready to explore custom SaaS development for your business?`,
        featuredImage: "/api/placeholder/800/400",
        seoTitle: "Custom B2B SaaS Development Services | SWiM AI",
        metaDescription: "Build scalable B2B SaaS solutions tailored to your business needs. Expert development services from concept to deployment.",
        targetKeywords: ["b2b saas development", "custom saas", "saas development services"],
        tags: ["saas", "development", "b2b", "custom software"],
        category: "SaaS Development",
        author: "Tom Mitchell",
        publishedAt: new Date("2024-12-05"),
        status: "published",
        ctaType: "demo"
      }
    ];

    samplePosts.forEach(post => {
      const id = this.currentBlogPostId++;
      const blogPost: BlogPost = {
        ...post,
        id,
        createdAt: new Date(),
        updatedAt: new Date(),
        views: Math.floor(Math.random() * 1000) + 100,
        leads: Math.floor(Math.random() * 50) + 5,
        shares: Math.floor(Math.random() * 100) + 10,
        status: post.status || "published",
        featuredImage: post.featuredImage || null,
        seoTitle: post.seoTitle || null,
        metaDescription: post.metaDescription || null,
        targetKeywords: post.targetKeywords || null,
        tags: post.tags || null,
        publishedAt: post.publishedAt || null,
        ctaType: post.ctaType || "consultation",
        downloadableResource: post.downloadableResource || null,
      };
      this.blogPosts.set(id, blogPost);
    });
  }

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
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getBlogPosts(filters?: { category?: string; tag?: string; status?: string; limit?: number; offset?: number }): Promise<BlogPost[]> {
    let posts = Array.from(this.blogPosts.values());
    
    // Apply filters
    if (filters?.category) {
      posts = posts.filter(post => post.category === filters.category);
    }
    if (filters?.tag) {
      posts = posts.filter(post => post.tags?.includes(filters.tag!));
    }
    if (filters?.status && filters.status !== 'all') {
      posts = posts.filter(post => post.status === filters.status);
    }
    
    // Sort by publication date (newest first)
    posts.sort((a, b) => {
      const dateA = a.publishedAt || a.createdAt;
      const dateB = b.publishedAt || b.createdAt;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });
    
    // Apply pagination
    const offset = filters?.offset || 0;
    const limit = filters?.limit || 10;
    return posts.slice(offset, offset + limit);
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogPosts.values()).find(post => post.slug === slug);
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const id = this.currentBlogPostId++;
    const now = new Date();
    const blogPost: BlogPost = {
      ...insertPost,
      id,
      createdAt: now,
      updatedAt: now,
      views: 0,
      leads: 0,
      shares: 0,
      status: insertPost.status || "draft",
      featuredImage: insertPost.featuredImage || null,
      seoTitle: insertPost.seoTitle || null,
      metaDescription: insertPost.metaDescription || null,
      targetKeywords: insertPost.targetKeywords || null,
      tags: insertPost.tags || null,
      publishedAt: insertPost.publishedAt || null,
      ctaType: insertPost.ctaType || "consultation",
      downloadableResource: insertPost.downloadableResource || null,
    };
    this.blogPosts.set(id, blogPost);
    return blogPost;
  }

  async updateBlogPost(id: number, updates: UpdateBlogPost): Promise<BlogPost | undefined> {
    const existing = this.blogPosts.get(id);
    if (!existing) return undefined;
    
    const updated: BlogPost = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    this.blogPosts.set(id, updated);
    return updated;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    return this.blogPosts.delete(id);
  }

  async incrementBlogPostViews(id: number): Promise<void> {
    const post = this.blogPosts.get(id);
    if (post) {
      post.views = (post.views || 0) + 1;
      this.blogPosts.set(id, post);
    }
  }

  async incrementBlogPostLeads(id: number): Promise<void> {
    const post = this.blogPosts.get(id);
    if (post) {
      post.leads = (post.leads || 0) + 1;
      this.blogPosts.set(id, post);
    }
  }

  async incrementBlogPostShares(id: number): Promise<void> {
    const post = this.blogPosts.get(id);
    if (post) {
      post.shares = (post.shares || 0) + 1;
      this.blogPosts.set(id, post);
    }
  }

  async getPopularPosts(limit = 5): Promise<BlogPost[]> {
    const posts = Array.from(this.blogPosts.values())
      .filter(post => post.status === 'published')
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, limit);
    return posts;
  }

  async getRecentPosts(limit = 5): Promise<BlogPost[]> {
    const posts = Array.from(this.blogPosts.values())
      .filter(post => post.status === 'published')
      .sort((a, b) => {
        const dateA = a.publishedAt || a.createdAt;
        const dateB = b.publishedAt || b.createdAt;
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      })
      .slice(0, limit);
    return posts;
  }

  async searchBlogPosts(query: string): Promise<BlogPost[]> {
    const searchTerm = query.toLowerCase();
    return Array.from(this.blogPosts.values())
      .filter(post => 
        post.status === 'published' && (
          post.title.toLowerCase().includes(searchTerm) ||
          post.excerpt.toLowerCase().includes(searchTerm) ||
          post.content.toLowerCase().includes(searchTerm) ||
          post.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
        )
      );
  }
}

export const storage = new MemStorage();
