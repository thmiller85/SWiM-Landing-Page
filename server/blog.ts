import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { BlogPost, BlogMetadata } from '@shared/blog';

const BLOG_CONTENT_DIR = path.join(process.cwd(), 'content', 'blog');

export class BlogService {
  private static instance: BlogService;
  private postsCache: Map<string, BlogPost> = new Map();
  private lastCacheUpdate = 0;
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  static getInstance(): BlogService {
    if (!BlogService.instance) {
      BlogService.instance = new BlogService();
    }
    return BlogService.instance;
  }

  private shouldRefreshCache(): boolean {
    return Date.now() - this.lastCacheUpdate > this.CACHE_TTL;
  }

  private parseMarkdownFile(filePath: string): BlogPost | null {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data: frontmatter, content } = matter(fileContent);

      // Validate required frontmatter fields
      const requiredFields = ['title', 'slug', 'publishedAt', 'status'];
      for (const field of requiredFields) {
        if (!frontmatter[field]) {
          console.warn(`Missing required field '${field}' in ${filePath}`);
          return null;
        }
      }

      const post: BlogPost = {
        title: frontmatter.title,
        metaTitle: frontmatter.metaTitle || frontmatter.title,
        metaDescription: frontmatter.metaDescription || frontmatter.excerpt || '',
        slug: frontmatter.slug,
        publishedAt: frontmatter.publishedAt,
        updatedAt: frontmatter.updatedAt || frontmatter.publishedAt,
        author: frontmatter.author || 'SWiM AI Team',
        status: frontmatter.status,
        ctaType: frontmatter.ctaType || 'consultation',
        targetKeywords: frontmatter.targetKeywords || [],
        excerpt: frontmatter.excerpt || '',
        featuredImage: frontmatter.featuredImage,
        category: frontmatter.category || 'General',
        tags: frontmatter.tags || [],
        readingTime: frontmatter.readingTime || this.calculateReadingTime(content),
        content: content.trim(),
        publishedDate: new Date(frontmatter.publishedAt),
        updatedDate: new Date(frontmatter.updatedAt || frontmatter.publishedAt)
      };

      return post;
    } catch (error) {
      console.error(`Error parsing markdown file ${filePath}:`, error);
      return null;
    }
  }

  private calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  private loadAllPosts(): BlogPost[] {
    if (!fs.existsSync(BLOG_CONTENT_DIR)) {
      console.warn(`Blog content directory does not exist: ${BLOG_CONTENT_DIR}`);
      return [];
    }

    const files = fs.readdirSync(BLOG_CONTENT_DIR);
    const posts: BlogPost[] = [];

    for (const file of files) {
      if (!file.endsWith('.md')) continue;

      const filePath = path.join(BLOG_CONTENT_DIR, file);
      const post = this.parseMarkdownFile(filePath);
      
      if (post && post.status === 'published') {
        posts.push(post);
      }
    }

    // Sort by published date (newest first)
    posts.sort((a, b) => b.publishedDate.getTime() - a.publishedDate.getTime());

    // Update cache
    this.postsCache.clear();
    posts.forEach(post => this.postsCache.set(post.slug, post));
    this.lastCacheUpdate = Date.now();

    return posts;
  }

  getAllPosts(): BlogPost[] {
    if (this.shouldRefreshCache() || this.postsCache.size === 0) {
      return this.loadAllPosts();
    }
    return Array.from(this.postsCache.values()).sort(
      (a, b) => b.publishedDate.getTime() - a.publishedDate.getTime()
    );
  }

  getPostBySlug(slug: string): BlogPost | null {
    if (this.shouldRefreshCache()) {
      this.loadAllPosts();
    }
    return this.postsCache.get(slug) || null;
  }

  getPostsByCategory(category: string): BlogPost[] {
    return this.getAllPosts().filter(post => 
      post.category.toLowerCase() === category.toLowerCase()
    );
  }

  getPostsByTag(tag: string): BlogPost[] {
    return this.getAllPosts().filter(post => 
      post.tags.some(t => t.toLowerCase() === tag.toLowerCase())
    );
  }

  getRecentPosts(limit: number = 5): BlogPost[] {
    return this.getAllPosts().slice(0, limit);
  }

  searchPosts(query: string): BlogPost[] {
    const searchTerm = query.toLowerCase();
    return this.getAllPosts().filter(post => 
      post.title.toLowerCase().includes(searchTerm) ||
      post.excerpt.toLowerCase().includes(searchTerm) ||
      post.content.toLowerCase().includes(searchTerm) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
      post.targetKeywords.some(keyword => keyword.toLowerCase().includes(searchTerm))
    );
  }

  getBlogMetadata(): BlogMetadata {
    const posts = this.getAllPosts();
    const categories = Array.from(new Set(posts.map(post => post.category)));
    const tags = Array.from(new Set(posts.flatMap(post => post.tags)));

    return {
      totalPosts: posts.length,
      categories,
      tags,
      recentPosts: posts.slice(0, 5)
    };
  }
}

export const blogService = BlogService.getInstance();