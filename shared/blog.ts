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

export interface BlogMetadata {
  title: string;
  description: string;
  siteUrl: string;
  author: string;
  language: string;
  siteName: string;
  categories: string[];
  tags: string[];
  totalPosts: number;
  lastUpdated: string;
}

export interface BlogCategory {
  name: string;
  slug: string;
  description: string;
  postCount: number;
}

export interface BlogTag {
  name: string;
  slug: string;
  postCount: number;
}