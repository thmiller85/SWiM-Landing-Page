import { BlogPost } from '@/types/blog';

/**
 * Static blog service that reads from exported JSON files
 * This allows static deployment while maintaining CMS functionality
 */
class StaticBlogService {
  private postsCache: BlogPost[] | null = null;
  private metadataCache: any = null;

  async loadPosts(): Promise<BlogPost[]> {
    if (this.postsCache) {
      return this.postsCache;
    }

    try {
      const response = await fetch('/data/posts.json');
      if (!response.ok) {
        throw new Error(`Failed to load posts: ${response.status}`);
      }
      
      this.postsCache = await response.json();
      return this.postsCache || [];
    } catch (error) {
      console.error('Failed to load static blog posts:', error);
      return [];
    }
  }

  async loadMetadata() {
    if (this.metadataCache) {
      return this.metadataCache;
    }

    try {
      const response = await fetch('/data/metadata.json');
      if (!response.ok) {
        throw new Error(`Failed to load metadata: ${response.status}`);
      }
      
      this.metadataCache = await response.json();
      return this.metadataCache;
    } catch (error) {
      console.error('Failed to load blog metadata:', error);
      return {
        totalPosts: 0,
        categories: [],
        tags: [],
        lastExported: null
      };
    }
  }

  async getAllPosts(options: {
    search?: string;
    category?: string;
    tag?: string;
  } = {}): Promise<BlogPost[]> {
    const posts = await this.loadPosts();
    let filteredPosts = posts;

    // Filter by category
    if (options.category) {
      filteredPosts = filteredPosts.filter(post => 
        post.category.toLowerCase() === options.category!.toLowerCase()
      );
    }

    // Filter by tag
    if (options.tag) {
      filteredPosts = filteredPosts.filter(post => 
        post.tags.some(tag => tag.toLowerCase() === options.tag!.toLowerCase())
      );
    }

    // Filter by search query
    if (options.search) {
      const query = options.search.toLowerCase();
      filteredPosts = filteredPosts.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Sort by published date (newest first)
    return filteredPosts.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }

  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
      // Try to load individual post file first (more efficient)
      const response = await fetch(`/data/${slug}.json`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      // Fall back to searching all posts
    }

    const posts = await this.loadPosts();
    return posts.find(post => post.slug === slug) || null;
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

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}

export const staticBlogService = new StaticBlogService();