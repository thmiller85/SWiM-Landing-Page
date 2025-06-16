// Production fallback data system
import { BlogPost } from '@shared/schema';

// Sample blog posts that match database structure
export const mockBlogPosts: BlogPost[] = [
  {
    id: 1,
    title: "The Complete Guide to AI Marketing Automation in 2024",
    slug: "complete-guide-ai-marketing-automation-2024",
    excerpt: "Discover how AI marketing automation can transform your business with cutting-edge strategies, tools, and implementation techniques that drive real results.",
    content: `# The Complete Guide to AI Marketing Automation in 2024

AI marketing automation is revolutionizing how businesses connect with customers, optimize campaigns, and drive growth. This comprehensive guide covers everything you need to know about implementing AI-powered marketing strategies.

## Why AI Marketing Automation Matters

In today's competitive landscape, businesses need intelligent systems that can:

- **Personalize at Scale**: Deliver personalized experiences to thousands of customers simultaneously
- **Optimize in Real-Time**: Adjust campaigns based on performance data instantly
- **Predict Customer Behavior**: Anticipate needs and preferences before customers express them
- **Automate Complex Workflows**: Handle multi-step marketing processes without manual intervention

## Key Components of AI Marketing Automation

### 1. Customer Data Platforms (CDPs)
Centralize customer data from multiple touchpoints to create unified customer profiles.

### 2. Predictive Analytics
Use machine learning to forecast customer lifetime value, churn risk, and purchase probability.

### 3. Dynamic Content Optimization
Automatically adjust website content, email campaigns, and ad creative based on user behavior.

### 4. Intelligent Lead Scoring
Score leads based on engagement patterns, demographic data, and behavioral signals.

## Implementation Strategy

**Phase 1: Foundation (Weeks 1-4)**
- Audit existing marketing technology stack
- Implement customer data platform
- Set up basic tracking and analytics

**Phase 2: Intelligence (Weeks 5-8)**
- Deploy predictive analytics models
- Create automated segmentation rules
- Launch personalized email campaigns

**Phase 3: Optimization (Weeks 9-12)**
- Implement real-time optimization
- Launch cross-channel automation
- Measure and refine performance

## Measuring Success

Track these key metrics to measure AI marketing automation success:

- Customer acquisition cost (CAC) reduction
- Customer lifetime value (CLV) increase
- Email engagement rates improvement
- Conversion rate optimization
- Marketing qualified leads (MQL) growth

## Getting Started

Ready to transform your marketing with AI automation? Our team specializes in implementing cutting-edge AI marketing solutions that deliver measurable results.`,
    category: "AI Marketing",
    author: "Ross Stockdale",
    status: "published",
    ctaType: "consultation",
    featuredImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    seoTitle: "AI Marketing Automation Guide 2024 | Complete Implementation Strategy",
    metaDescription: "Master AI marketing automation with our comprehensive 2024 guide. Learn implementation strategies, tools, and techniques that drive real business results.",
    downloadableResource: "",
    views: 1247,
    leads: 89,
    shares: 34,
    tags: ["AI Marketing", "Automation", "Digital Strategy", "Lead Generation"],
    targetKeywords: ["AI marketing automation", "marketing automation tools", "automated marketing campaigns"],
    createdAt: new Date('2024-12-15'),
    updatedAt: new Date('2024-12-15'),
    publishedAt: new Date('2024-12-15')
  },
  {
    id: 2,
    title: "5 AI Tools Every Small Business Should Use in 2024",
    slug: "5-ai-tools-small-business-2024",
    excerpt: "Discover the essential AI tools that can help small businesses compete with larger companies by automating tasks, improving efficiency, and boosting growth.",
    content: `# 5 AI Tools Every Small Business Should Use in 2024

Small businesses can now access enterprise-level AI capabilities at affordable prices. Here are five essential AI tools that can transform your business operations.

## 1. ChatGPT for Business Communications

**Use Cases:**
- Customer service automation
- Content creation and editing
- Email response generation
- Marketing copy development

**ROI Impact:** Save 10-15 hours per week on communication tasks

## 2. Canva AI for Visual Content

**Features:**
- AI-powered design suggestions
- Automated brand kit application
- Smart image background removal
- Text-to-image generation

**ROI Impact:** Reduce design costs by 70% while maintaining professional quality

## 3. HubSpot AI for CRM Management

**Capabilities:**
- Lead scoring automation
- Email sequence optimization
- Sales pipeline prediction
- Customer segmentation

**ROI Impact:** Increase sales conversion rates by 25-30%

## 4. Zapier AI for Workflow Automation

**Benefits:**
- Connect 5,000+ apps without coding
- Automate repetitive tasks
- Create complex multi-step workflows
- Trigger actions based on AI insights

**ROI Impact:** Automate 40+ hours of manual work per month

## 5. Google Analytics AI for Business Intelligence

**Features:**
- Predictive audience insights
- Automated anomaly detection
- Smart goal tracking
- AI-powered recommendations

**ROI Impact:** Improve marketing efficiency by 35%

## Implementation Timeline

**Week 1:** Set up ChatGPT and Canva AI
**Week 2:** Implement HubSpot CRM integration
**Week 3:** Configure Zapier automation workflows
**Week 4:** Deploy Google Analytics AI features

## Getting Expert Help

Need assistance implementing these AI tools? Our team provides comprehensive AI integration services for small businesses.`,
    category: "AI Tools",
    author: "Ross Stockdale", 
    status: "draft",
    ctaType: "demo",
    featuredImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    seoTitle: "5 Essential AI Tools for Small Business Success 2024",
    metaDescription: "Discover the top 5 AI tools that help small businesses compete with larger companies. Implementation guide included.",
    downloadableResource: "https://example.com/ai-tools-checklist.pdf",
    views: 892,
    leads: 45,
    shares: 22,
    tags: ["AI Tools", "Small Business", "Productivity", "Technology"],
    targetKeywords: ["AI tools for small business", "business automation", "AI productivity tools"],
    createdAt: new Date('2024-12-14'),
    updatedAt: new Date('2024-12-16'),
    publishedAt: null
  }
];

// Production-safe API simulation
export const mockApiClient = {
  async getBlogPosts() {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockBlogPosts;
  },

  async getBlogPost(id: number) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockBlogPosts.find(post => post.id === id);
  },

  async getBlogPostBySlug(slug: string) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockBlogPosts.find(post => post.slug === slug);
  },

  async createBlogPost(data: any) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newPost = {
      ...data,
      id: mockBlogPosts.length + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      views: 0,
      leads: 0,
      shares: 0
    };
    mockBlogPosts.push(newPost);
    return newPost;
  },

  async updateBlogPost(id: number, data: any) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = mockBlogPosts.findIndex(post => post.id === id);
    if (index !== -1) {
      mockBlogPosts[index] = { ...mockBlogPosts[index], ...data, updatedAt: new Date() };
      return mockBlogPosts[index];
    }
    return null;
  },

  async deleteBlogPost(id: number) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockBlogPosts.findIndex(post => post.id === id);
    if (index !== -1) {
      mockBlogPosts.splice(index, 1);
      return true;
    }
    return false;
  }
};