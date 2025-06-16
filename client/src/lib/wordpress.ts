// WordPress API integration
export interface WordPressPost {
  id: number;
  date: string;
  date_gmt: string;
  guid: {
    rendered: string;
  };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  comment_status: string;
  ping_status: string;
  sticky: boolean;
  template: string;
  format: string;
  meta: any;
  categories: number[];
  tags: number[];
  yoast_head?: string;
  yoast_head_json?: {
    title?: string;
    description?: string;
    canonical?: string;
    og_image?: Array<{
      url: string;
      width: number;
      height: number;
    }>;
  };
  _embedded?: {
    author?: Array<{
      id: number;
      name: string;
      slug: string;
      avatar_urls: {
        [key: string]: string;
      };
    }>;
    'wp:featuredmedia'?: Array<{
      id: number;
      source_url: string;
      alt_text: string;
      media_details: {
        width: number;
        height: number;
        sizes: {
          [key: string]: {
            source_url: string;
            width: number;
            height: number;
          };
        };
      };
    }>;
    'wp:term'?: Array<Array<{
      id: number;
      name: string;
      slug: string;
      taxonomy: string;
    }>>;
  };
}

export interface WordPressCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
}

export interface WordPressTag {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
}

export class WordPressAPI {
  private baseUrl: string;
  private apiKey?: string;

  constructor(baseUrl: string, apiKey?: string) {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
    this.apiKey = apiKey;
  }

  private async request<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
    const url = new URL(`${this.baseUrl}/wp-json/wp/v2${endpoint}`);
    
    // Add common parameters
    params._embed = 'true'; // Include embedded data (author, featured media, etc.)
    
    // Add query parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    const response = await fetch(url.toString(), {
      headers,
    });

    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getPosts(params: {
    page?: number;
    per_page?: number;
    search?: string;
    categories?: number[];
    tags?: number[];
    status?: string;
    orderby?: string;
    order?: 'asc' | 'desc';
  } = {}): Promise<WordPressPost[]> {
    const queryParams: Record<string, any> = {
      status: 'publish',
      orderby: 'date',
      order: 'desc',
      per_page: 10,
      ...params,
    };

    if (params.categories?.length) {
      queryParams.categories = params.categories.join(',');
    }

    if (params.tags?.length) {
      queryParams.tags = params.tags.join(',');
    }

    return this.request<WordPressPost[]>('/posts', queryParams);
  }

  async getPost(slug: string): Promise<WordPressPost> {
    const posts = await this.request<WordPressPost[]>('/posts', { 
      slug,
      status: 'publish'
    });
    
    if (!posts.length) {
      throw new Error('Post not found');
    }
    
    return posts[0];
  }

  async getPostById(id: number): Promise<WordPressPost> {
    return this.request<WordPressPost>(`/posts/${id}`);
  }

  async getCategories(): Promise<WordPressCategory[]> {
    return this.request<WordPressCategory[]>('/categories', {
      per_page: 100,
      orderby: 'name',
      order: 'asc'
    });
  }

  async getTags(): Promise<WordPressTag[]> {
    return this.request<WordPressTag[]>('/tags', {
      per_page: 100,
      orderby: 'name',
      order: 'asc'
    });
  }

  async searchPosts(query: string, params: {
    categories?: number[];
    tags?: number[];
    per_page?: number;
  } = {}): Promise<WordPressPost[]> {
    return this.getPosts({
      search: query,
      ...params,
    });
  }

  // Analytics tracking methods (these would typically be handled by WordPress plugins)
  async trackView(postId: number): Promise<void> {
    // This would typically be handled by a WordPress analytics plugin
    // For now, we'll make a simple request that can be handled by a custom endpoint
    try {
      await fetch(`${this.baseUrl}/wp-json/custom/v1/track-view/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.warn('Analytics tracking failed:', error);
    }
  }

  async trackLead(postId: number): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/wp-json/custom/v1/track-lead/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.warn('Lead tracking failed:', error);
    }
  }

  async trackShare(postId: number): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/wp-json/custom/v1/track-share/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.warn('Share tracking failed:', error);
    }
  }
}

// Create the WordPress API instance
// The base URL should be set via environment variables
const WORDPRESS_URL = import.meta.env.VITE_WORDPRESS_URL || 'https://your-wordpress-site.com';
const WORDPRESS_API_KEY = import.meta.env.VITE_WORDPRESS_API_KEY;

export const wordpressAPI = new WordPressAPI(WORDPRESS_URL, WORDPRESS_API_KEY);

// Helper functions to convert WordPress data to our expected format
export const convertWordPressPost = (wpPost: WordPressPost) => ({
  id: wpPost.id,
  title: wpPost.title.rendered,
  slug: wpPost.slug,
  excerpt: wpPost.excerpt.rendered.replace(/<[^>]*>/g, ''), // Strip HTML tags
  content: wpPost.content.rendered,
  featuredImage: wpPost._embedded?.['wp:featuredmedia']?.[0]?.source_url,
  seoTitle: wpPost.yoast_head_json?.title || wpPost.title.rendered,
  metaDescription: wpPost.yoast_head_json?.description || wpPost.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 160),
  author: wpPost._embedded?.author?.[0]?.name || 'Admin',
  publishedAt: wpPost.date,
  createdAt: wpPost.date,
  updatedAt: wpPost.modified,
  status: wpPost.status,
  category: wpPost._embedded?.['wp:term']?.[0]?.find(term => term.taxonomy === 'category')?.name || 'Uncategorized',
  tags: wpPost._embedded?.['wp:term']?.[0]?.filter(term => term.taxonomy === 'post_tag')?.map(tag => tag.name) || [],
  views: 0, // This would come from analytics plugin
  leads: 0, // This would come from analytics plugin
  shares: 0, // This would come from analytics plugin
});

export const getReadingTime = (content: string): number => {
  const plainText = content.replace(/<[^>]*>/g, '');
  const words = plainText.split(/\s+/).length;
  const readingSpeed = 200; // words per minute
  return Math.ceil(words / readingSpeed);
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};