// Direct blog API service - makes API calls to server endpoints only
import { BlogPost } from '@/blog-types';

/**
 * Blog service that uses only API calls to avoid any server-side imports
 */
class BlogAPIService {
  private baseUrl = '/api/blog';

  async getAllPosts(options: {
    search?: string;
    category?: string;
    tag?: string;
  } = {}): Promise<BlogPost[]> {
    try {
      const response = await fetch(`${this.baseUrl}/posts/database/all`);
      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.statusText}`);
      }
      
      let posts = await response.json();
      
      // Apply client-side filtering if needed
      if (options.category) {
        posts = posts.filter((post: BlogPost) => post.category.toLowerCase() === options.category!.toLowerCase());
      }
      
      if (options.tag) {
        posts = posts.filter((post: BlogPost) => post.tags.some(tag => tag.toLowerCase() === options.tag!.toLowerCase()));
      }
      
      if (options.search) {
        const searchTerm = options.search.toLowerCase();
        posts = posts.filter((post: BlogPost) => 
          post.title.toLowerCase().includes(searchTerm) ||
          post.excerpt.toLowerCase().includes(searchTerm) ||
          post.content.toLowerCase().includes(searchTerm)
        );
      }
      
      return posts;
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      return [];
    }
  }

  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
      const response = await fetch(`${this.baseUrl}/posts/database/${slug}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Failed to fetch post: ${response.statusText}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Failed to fetch post:', error);
      return null;
    }
  }

  async getRecentPosts(limit: number = 5): Promise<BlogPost[]> {
    const posts = await this.getAllPosts();
    return posts.slice(0, limit);
  }

  async getPostsByCategory(category: string): Promise<BlogPost[]> {
    return this.getAllPosts({ category });
  }

  async getPostsByTag(tag: string): Promise<BlogPost[]> {
    return this.getAllPosts({ tag });
  }

  async searchPosts(query: string): Promise<BlogPost[]> {
    return this.getAllPosts({ search: query });
  }

  async trackView(slug: string): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/track/view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug }),
      });
    } catch (error) {
      console.error('Failed to track view:', error);
    }
  }

  async trackLead(slug: string): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/track/lead`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug }),
      });
    } catch (error) {
      console.error('Failed to track lead:', error);
    }
  }

  async trackShare(slug: string): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/track/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug }),
      });
    } catch (error) {
      console.error('Failed to track share:', error);
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}

export const blogAPIService = new BlogAPIService();