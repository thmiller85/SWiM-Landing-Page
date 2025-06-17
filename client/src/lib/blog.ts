import { BlogPost, BlogMetadata } from '@shared/blog';

class BlogService {
  private baseUrl = '/api/blog';

  async getAllPosts(params?: {
    category?: string;
    tag?: string;
    search?: string;
    limit?: number;
  }): Promise<BlogPost[]> {
    // Use database endpoint for real-time data
    const response = await fetch(`${this.baseUrl}/posts/database`);
    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.statusText}`);
    }
    
    let posts = await response.json();
    
    // Apply client-side filtering if needed
    if (params?.category) {
      posts = posts.filter((post: BlogPost) => post.category.toLowerCase() === params.category!.toLowerCase());
    }
    
    if (params?.tag) {
      posts = posts.filter((post: BlogPost) => post.tags.some(tag => tag.toLowerCase() === params.tag!.toLowerCase()));
    }
    
    if (params?.search) {
      const searchTerm = params.search.toLowerCase();
      posts = posts.filter((post: BlogPost) => 
        post.title.toLowerCase().includes(searchTerm) ||
        post.excerpt.toLowerCase().includes(searchTerm) ||
        post.content.toLowerCase().includes(searchTerm)
      );
    }
    
    if (params?.limit) {
      posts = posts.slice(0, params.limit);
    }
    
    return posts;
  }

  async getPostBySlug(slug: string): Promise<BlogPost> {
    const response = await fetch(`${this.baseUrl}/posts/database/${slug}`);
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