import { BlogPost, BlogMetadata } from '@shared/blog';

class BlogService {
  private baseUrl = '/api/blog';

  async getAllPosts(params?: {
    category?: string;
    tag?: string;
    search?: string;
    limit?: number;
  }): Promise<BlogPost[]> {
    const searchParams = new URLSearchParams();
    
    if (params?.category) searchParams.append('category', params.category);
    if (params?.tag) searchParams.append('tag', params.tag);
    if (params?.search) searchParams.append('search', params.search);
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    
    const url = `${this.baseUrl}/posts${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.statusText}`);
    }
    
    return response.json();
  }

  async getPostBySlug(slug: string): Promise<BlogPost> {
    const response = await fetch(`${this.baseUrl}/posts/${slug}`);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Post not found');
      }
      throw new Error(`Failed to fetch post: ${response.statusText}`);
    }
    
    return response.json();
  }

  async getRecentPosts(limit: number = 5): Promise<BlogPost[]> {
    const response = await fetch(`${this.baseUrl}/recent?limit=${limit}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch recent posts: ${response.statusText}`);
    }
    
    return response.json();
  }

  async getBlogMetadata(): Promise<BlogMetadata> {
    const response = await fetch(`${this.baseUrl}/metadata`);
    if (!response.ok) {
      throw new Error(`Failed to fetch blog metadata: ${response.statusText}`);
    }
    
    return response.json();
  }

  async searchPosts(query: string): Promise<BlogPost[]> {
    return this.getAllPosts({ search: query });
  }

  async getPostsByCategory(category: string): Promise<BlogPost[]> {
    return this.getAllPosts({ category });
  }

  async getPostsByTag(tag: string): Promise<BlogPost[]> {
    return this.getAllPosts({ tag });
  }

  // Utility functions
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  generateExcerpt(content: string, maxLength: number = 160): string {
    // Remove markdown formatting for excerpt
    const plainText = content
      .replace(/#{1,6}\s/g, '') // Remove headings
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1') // Remove italic
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links
      .replace(/```[\s\S]*?```/g, '') // Remove code blocks
      .replace(/`([^`]+)`/g, '$1') // Remove inline code
      .replace(/\n+/g, ' ') // Replace line breaks with spaces
      .trim();

    if (plainText.length <= maxLength) {
      return plainText;
    }

    return plainText.substring(0, maxLength).replace(/\s+\w*$/, '') + '...';
  }
}

export const blogService = new BlogService();