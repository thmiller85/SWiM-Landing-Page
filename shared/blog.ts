export interface BlogPost {
  // Frontmatter fields
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
  
  // Content
  content: string;
  
  // Computed fields
  publishedDate: Date;
  updatedDate: Date;
}

export interface BlogMetadata {
  totalPosts: number;
  categories: string[];
  tags: string[];
  recentPosts: BlogPost[];
}