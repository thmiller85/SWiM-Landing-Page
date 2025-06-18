// Removed blogService import to eliminate drizzle-orm dependency
import { staticBlogService } from './static-blog';
import { BlogPost } from '@/blog-types';

/**
 * Adaptive blog service that automatically chooses between:
 * - Database service (development/full-stack deployment)
 * - Static file service (static deployment)
 */
class BlogServiceAdapter {
  private isStaticMode: boolean | null = null;

  private async detectMode(): Promise<boolean> {
    // Always use static mode to avoid drizzle-orm imports
    this.isStaticMode = true;
    return this.isStaticMode;
  }

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