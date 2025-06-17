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
  private isWordPressCom: boolean;

  constructor(baseUrl: string, apiKey?: string) {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
    this.apiKey = apiKey;
    this.isWordPressCom = baseUrl.includes('.wordpress.com');
  }

  private async request<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
    let url: URL;
    
    if (this.isWordPressCom) {
      // Use WordPress.com public API with site ID for better reliability
      url = new URL(`https://public-api.wordpress.com/rest/v1.1/sites/245590138${endpoint}`);
    } else {
      // Use standard WordPress REST API
      url = new URL(`${this.baseUrl}/wp-json/wp/v2${endpoint}`);
      params._embed = 'true'; // Include embedded data for self-hosted sites
    }
    
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

    try {
      const response = await fetch(url.toString(), {
        headers,
        mode: 'cors',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`WordPress API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('WordPress API Request Failed:', error);
      throw error;
    }
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
    if (this.isWordPressCom) {
      // WordPress.com API parameters
      const queryParams: Record<string, any> = {
        status: 'publish',
        order_by: 'date',
        order: 'DESC',
        number: params.per_page || 10,
        offset: params.page ? (params.page - 1) * (params.per_page || 10) : 0,
      };

      if (params.search) {
        queryParams.search = params.search;
      }

      const response = await this.request<any>('/posts', queryParams);
      
      // DEBUG: Log the actual response to see what we're getting
      console.log('FULL WordPress.com API Response:', JSON.stringify(response, null, 2));
      
      // Handle WordPress.com API response structure
      if (response && typeof response === 'object') {
        if (response.posts && Array.isArray(response.posts)) {
          console.log('First post data:', JSON.stringify(response.posts[0], null, 2));
          return this.convertWordPressComPosts(response.posts);
        }
        if (Array.isArray(response)) {
          return this.convertWordPressComPosts(response);
        }
      }
      
      return [];
    } else {
      // Standard WordPress REST API
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
  }

  private convertWordPressComPosts(posts: any[]): WordPressPost[] {
    return posts.map(post => {
      // Enhanced HTML content cleaning specifically for WordPress.com
      const cleanHtmlContent = (htmlContent: string): string => {
        if (!htmlContent) return '';
        
        return htmlContent
          // Remove WordPress.com specific block wrappers first
          .replace(/<div class="wp-block-jetpack-markdown">/g, '')
          .replace(/<div class="wp-block-[^"]*">/g, '')
          .replace(/<\/div>/g, '')
          // Remove paragraph tags but keep content
          .replace(/<p>/g, '')
          .replace(/<\/p>/g, ' ')
          // Remove all other HTML tags
          .replace(/<[^>]*>/g, '')
          // Replace HTML entities
          .replace(/&nbsp;/g, ' ')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&#8217;/g, "'")
          .replace(/&#8220;/g, '"')
          .replace(/&#8221;/g, '"')
          .replace(/&#8211;/g, '–')
          .replace(/&#8212;/g, '—')
          // Clean up multiple spaces and newlines
          .replace(/\n+/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
      };

      // Generate a clean excerpt from content since WordPress.com often has empty excerpts
      const rawContent = post.content || post.excerpt || '';
      const contentText = cleanHtmlContent(rawContent);
      const cleanExcerpt = contentText.length > 200 
        ? contentText.substring(0, 200) + '...' 
        : contentText;

      return {
        id: post.ID,
        date: post.date,
        date_gmt: post.date,
        guid: { rendered: post.URL },
        modified: post.modified,
        modified_gmt: post.modified,
        slug: post.slug,
        status: post.status,
        type: post.type || 'post',
        link: post.URL,
        title: { rendered: post.title },
        content: { rendered: post.content, protected: false },
        excerpt: { rendered: cleanExcerpt, protected: false }, // Use our clean excerpt
        author: post.author?.ID || 1,
        featured_media: post.featured_image ? parseInt(post.featured_image) : 0,
        comment_status: post.comment_status || 'open',
        ping_status: 'open',
        sticky: post.sticky || false,
        template: '',
        format: 'standard',
        meta: post.metadata || {},
        categories: post.categories ? Object.keys(post.categories).map(id => parseInt(id)) : [],
        tags: post.tags ? Object.keys(post.tags).map(id => parseInt(id)) : [],
        _embedded: {
          author: post.author ? [{
            id: post.author.ID,
            name: post.author.name,
            slug: post.author.login,
            avatar_urls: { '96': post.author.avatar_URL }
          }] : [],
          'wp:featuredmedia': post.featured_image ? [{
            id: parseInt(post.featured_image),
            source_url: post.featured_image,
            alt_text: '',
            media_details: { width: 0, height: 0, sizes: {} }
          }] : [],
          'wp:term': [
            post.categories ? Object.values(post.categories).map((cat: any) => ({
              id: cat.ID,
              name: cat.name,
              slug: cat.slug,
              taxonomy: 'category'
            })) : [],
            post.tags ? Object.values(post.tags).map((tag: any) => ({
              id: tag.ID,
              name: tag.name,
              slug: tag.slug,
              taxonomy: 'post_tag'
            })) : []
          ]
        }
      };
    });
  }

  async getPost(slug: string): Promise<WordPressPost> {
    if (this.isWordPressCom) {
      const response = await this.request<{ posts: any[] }>('/posts', { 
        slug,
        status: 'publish',
        number: 1
      });
      
      if (!response.posts.length) {
        throw new Error('Post not found');
      }
      
      const convertedPosts = this.convertWordPressComPosts(response.posts);
      return convertedPosts[0];
    } else {
      const posts = await this.request<WordPressPost[]>('/posts', { 
        slug,
        status: 'publish'
      });
      
      if (!posts.length) {
        throw new Error('Post not found');
      }
      
      return posts[0];
    }
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
// Direct configuration for your WordPress.com site
const WORDPRESS_URL = 'https://tom945f442029a8.wordpress.com';
const WORDPRESS_API_KEY = import.meta.env.VITE_WORDPRESS_API_KEY;

export const wordpressAPI = new WordPressAPI(WORDPRESS_URL, WORDPRESS_API_KEY);

// Define the converted blog post interface
export interface ConvertedBlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  seoTitle: string;
  metaDescription: string;
  author: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  category: string;
  tags: string[];
  ctaType: 'consultation' | 'download' | 'newsletter' | 'demo';
  downloadableResource?: string | null;
  views: number;
  leads: number;
  shares: number;
}

// Helper functions to convert WordPress data to our expected format
export const convertWordPressPost = (wpPost: WordPressPost): ConvertedBlogPost => {
  // Extract category and tags from embedded terms
  const terms = wpPost._embedded?.['wp:term'] || [];
  const categories = terms.flat().filter(term => term.taxonomy === 'category');
  const tags = terms.flat().filter(term => term.taxonomy === 'post_tag');
  
  // Determine CTA type based on categories/content (since custom fields may not be available)
  let ctaType: ConvertedBlogPost['ctaType'] = 'consultation';
  const content = wpPost.content.rendered.toLowerCase();
  const categoryNames = categories.map(cat => cat.name.toLowerCase());
  
  if (content.includes('download') || categoryNames.includes('resources')) {
    ctaType = 'download';
  } else if (content.includes('newsletter') || content.includes('subscribe')) {
    ctaType = 'newsletter';
  } else if (content.includes('demo') || categoryNames.includes('demo')) {
    ctaType = 'demo';
  }

  // Function to clean HTML content and extract plain text - enhanced for WordPress blocks
  const cleanHtmlContent = (htmlContent: string): string => {
    if (!htmlContent) return '';
    
    return htmlContent
      // Remove WordPress block wrappers specifically
      .replace(/<div class="wp-block-[^"]*">/g, '')
      .replace(/<\/div>/g, '')
      // Remove all other HTML tags
      .replace(/<[^>]*>/g, '')
      // Replace HTML entities
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#8217;/g, "'")
      .replace(/&#8220;/g, '"')
      .replace(/&#8221;/g, '"')
      .replace(/&#8211;/g, '–')
      .replace(/&#8212;/g, '—')
      // Clean up whitespace
      .replace(/\s+/g, ' ')
      .trim();
  };

  // Clean excerpt from WordPress
  let finalExcerpt = cleanHtmlContent(wpPost.excerpt.rendered || '');
  
  // If excerpt is empty or too short, generate from content
  if (!finalExcerpt || finalExcerpt.length < 50) {
    const contentText = cleanHtmlContent(wpPost.content.rendered || '');
    finalExcerpt = contentText.length > 200 
      ? contentText.substring(0, 200) + '...' 
      : contentText;
  }

  return {
    id: wpPost.id,
    title: wpPost.title.rendered,
    slug: wpPost.slug,
    excerpt: finalExcerpt,
    content: wpPost.content.rendered,
    featuredImage: wpPost._embedded?.['wp:featuredmedia']?.[0]?.source_url,
    seoTitle: wpPost.yoast_head_json?.title || wpPost.title.rendered,
    metaDescription: wpPost.yoast_head_json?.description || finalExcerpt.substring(0, 160),
    author: wpPost._embedded?.author?.[0]?.name || 'Admin',
    publishedAt: wpPost.date,
    createdAt: wpPost.date,
    updatedAt: wpPost.modified,
    status: wpPost.status,
    category: categories[0]?.name || 'Uncategorized',
    tags: tags.map(tag => tag.name) || [],
    ctaType: (wpPost.meta?.cta_type as ConvertedBlogPost['ctaType']) || ctaType,
    downloadableResource: wpPost.meta?.downloadable_resource || null,
    views: parseInt(wpPost.meta?.views || '0') || 0,
    leads: parseInt(wpPost.meta?.leads || '0') || 0,
    shares: parseInt(wpPost.meta?.shares || '0') || 0,
  };
};

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