// Client-only blog service adapter - uses static files only to avoid server dependencies
import { staticBlogService } from './static-blog';
import { BlogPost } from '@/blog-types';

/**
 * Blog service adapter that uses only static files to avoid drizzle-orm imports
 */
class BlogServiceAdapter {

  async getAllPosts(options: {
    search?: string;
    category?: string;
    tag?: string;
  } = {}): Promise<BlogPost[]> {
    return staticBlogService.getAllPosts(options);
  }

  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    return staticBlogService.getPostBySlug(slug);
  }

  async getRecentPosts(limit: number = 5): Promise<BlogPost[]> {
    return staticBlogService.getRecentPosts(limit);
  }

  async getPostsByCategory(category: string): Promise<BlogPost[]> {
    return staticBlogService.getPostsByCategory(category);
  }

  async getPostsByTag(tag: string): Promise<BlogPost[]> {
    return staticBlogService.getPostsByTag(tag);
  }

  async searchPosts(query: string): Promise<BlogPost[]> {
    return staticBlogService.searchPosts(query);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Force static mode (useful for debugging)
  forceStaticMode() {
    this.isStaticMode = true;
  }

  // Force dynamic mode (useful for debugging)
  forceDynamicMode() {
    this.isStaticMode = false;
  }
}

export const adaptiveBlogService = new BlogServiceAdapter();