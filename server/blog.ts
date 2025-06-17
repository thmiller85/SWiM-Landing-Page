import { BlogMetadata } from '../shared/blog';

class BlogService {
  getBlogMetadata(): BlogMetadata {
    return {
      title: "SWiM AI Blog",
      description: "Expert insights on AI marketing automation, workflow optimization, and B2B growth strategies. Discover how leading companies leverage AI to transform their operations and drive measurable results.",
      siteUrl: process.env.SITE_URL || "https://swim-ai.com",
      author: "SWiM AI Team",
      language: "en-US",
      siteName: "SWiM AI",
      categories: [
        "AI Marketing",
        "Workflow Automation", 
        "B2B Strategy",
        "Lead Generation",
        "Marketing Technology",
        "Business Intelligence",
        "Customer Experience",
        "Data Analytics"
      ],
      tags: [
        "AI",
        "Automation",
        "B2B Strategy",
        "Lead Generation",
        "Marketing",
        "Workflow",
        "Analytics",
        "CRM",
        "Sales Optimization",
        "Customer Journey"
      ],
      totalPosts: 0,
      lastUpdated: new Date().toISOString()
    };
  }
}

export const blogService = new BlogService();