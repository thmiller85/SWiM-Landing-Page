import { blogService } from './blog';
import { staticBlogService } from './static-blog';
import { BlogPost } from '@shared/blog';

/**
 * Adaptive blog service that automatically chooses between:
 * - Database service (development/full-stack deployment)
 * - Static file service (static deployment)
 */
class BlogServiceAdapter {
  private isStaticMode: boolean | null = null;

  private async detectMode(): Promise<boolean> {
    if (this.isStaticMode !== null) {
      return this.isStaticMode;
    }

    try {
      // Try to make an API call to detect if server is available
      const response = await fetch('/api/blog/posts', { 
        method: 'HEAD',
        signal: AbortSignal.timeout(2000) // 2 second timeout
      });
      this.isStaticMode = !response.ok;
    } catch (error) {
      // If API call fails, we're in static mode
      this.isStaticMode = true;
    }

    return this.isStaticMode;
  }

  async getAllPosts(options: {
    search?: string;
    category?: string;
    tag?: string;
  } = {}): Promise<BlogPost[]> {
    const isStatic = await this.detectMode();
    
    if (isStatic) {
      return staticBlogService.getAllPosts(options);
    } else {
      return blogService.getAllPosts(options);
    }
  }

  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    const isStatic = await this.detectMode();
    
    if (isStatic) {
      return staticBlogService.getPostBySlug(slug);
    } else {
      return blogService.getPostBySlug(slug);
    }
  }

  async getRecentPosts(limit: number = 5): Promise<BlogPost[]> {
    const isStatic = await this.detectMode();
    
    if (isStatic) {
      return staticBlogService.getRecentPosts(limit);
    } else {
      return blogService.getRecentPosts(limit);
    }
  }

  async getPostsByCategory(category: string): Promise<BlogPost[]> {
    const isStatic = await this.detectMode();
    
    if (isStatic) {
      return staticBlogService.getPostsByCategory(category);
    } else {
      return blogService.getPostsByCategory(category);
    }
  }

  async getPostsByTag(tag: string): Promise<BlogPost[]> {
    const isStatic = await this.detectMode();
    
    if (isStatic) {
      return staticBlogService.getPostsByTag(tag);
    } else {
      return blogService.getPostsByTag(tag);
    }
  }

  async searchPosts(query: string): Promise<BlogPost[]> {
    const isStatic = await this.detectMode();
    
    if (isStatic) {
      return staticBlogService.searchPosts(query);
    } else {
      return blogService.searchPosts(query);
    }
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