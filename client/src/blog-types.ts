// Client-only type definitions - completely isolated from server dependencies
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

export interface Post {
  id: number;
  title: string;
  slug: string;
  metaTitle: string | null;
  metaDescription: string | null;
  excerpt: string | null;
  content: string;
  featuredImage: string | null;
  author: string;
  status: string;
  ctaType: string;
  category: string;
  tags: string[];
  targetKeywords: string[];
  readingTime: number;
  views: number;
  leads: number;
  shares: number;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Image {
  id: number;
  filename: string;
  originalName: string;
  altText: string | null;
  caption: string | null;
  url: string;
  size: number;
  mimeType: string;
  width: number | null;
  height: number | null;
  createdAt: Date;
}