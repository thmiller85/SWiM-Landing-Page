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
      // Use WordPress.com WP REST API v2 for full content access
      url = new URL(`https://public-api.wordpress.com/wp/v2/sites/245590138${endpoint}`);
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
      // Use standard WordPress REST API v2 format for WordPress.com
      const queryParams: Record<string, any> = {
        status: 'publish',
        orderby: 'date',
        order: 'desc',
        per_page: params.per_page || 10,
        page: params.page || 1,
        _embed: true, // Include embedded data
      };

      if (params.search) {
        queryParams.search = params.search;
      }

      const response = await this.request<WordPressPost[]>('/posts', queryParams);
      return Array.isArray(response) ? response : [];
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
      // Enhanced HTML content cleaning that preserves formatting
      const cleanHtmlContent = (htmlContent: string): string => {
        if (!htmlContent) return '';
        
        let cleaned = htmlContent.trim();
        
        // Remove WordPress.com specific block wrappers but keep content
        cleaned = cleaned.replace(/<div[^>]*class="wp-block-jetpack-markdown"[^>]*>/gi, '');
        cleaned = cleaned.replace(/<div[^>]*class="wp-block-[^"]*"[^>]*>/gi, '');
        cleaned = cleaned.replace(/<\/div>/gi, '');
        
        // Convert headings with proper spacing
        cleaned = cleaned.replace(/<h([1-6])[^>]*>([^<]*)<\/h[1-6]>/g, (match, level, content) => {
          const hashes = '#'.repeat(parseInt(level));
          return `\n\n${hashes} ${content.trim()}\n\n`;
        });
        
        // Convert lists with proper formatting
        cleaned = cleaned.replace(/<ul[^>]*>/g, '\n\n');
        cleaned = cleaned.replace(/<\/ul>/g, '\n\n');
        cleaned = cleaned.replace(/<ol[^>]*>/g, '\n\n');
        cleaned = cleaned.replace(/<\/ol>/g, '\n\n');
        cleaned = cleaned.replace(/<li[^>]*>([^<]*)<\/li>/g, '• $1\n');
        
        // Convert paragraphs with proper spacing
        cleaned = cleaned.replace(/<p[^>]*>/g, '\n\n');
        cleaned = cleaned.replace(/<\/p>/g, '');
        
        // Convert formatting tags
        cleaned = cleaned.replace(/<strong[^>]*>([^<]*)<\/strong>/g, '**$1**');
        cleaned = cleaned.replace(/<b[^>]*>([^<]*)<\/b>/g, '**$1**');
        cleaned = cleaned.replace(/<em[^>]*>([^<]*)<\/em>/g, '*$1*');
        cleaned = cleaned.replace(/<i[^>]*>([^<]*)<\/i>/g, '*$1*');
        
        // Convert line breaks
        cleaned = cleaned.replace(/<br[^>]*>/gi, '\n');
        
        // Remove any remaining HTML tags
        cleaned = cleaned.replace(/<[^>]*>/g, '');
        
        // Replace HTML entities
        cleaned = cleaned.replace(/&nbsp;/g, ' ');
        cleaned = cleaned.replace(/&amp;/g, '&');
        cleaned = cleaned.replace(/&lt;/g, '<');
        cleaned = cleaned.replace(/&gt;/g, '>');
        cleaned = cleaned.replace(/&quot;/g, '"');
        cleaned = cleaned.replace(/&#8217;/g, "'");
        cleaned = cleaned.replace(/&#8220;/g, '"');
        cleaned = cleaned.replace(/&#8221;/g, '"');
        cleaned = cleaned.replace(/&#8211;/g, '–');
        cleaned = cleaned.replace(/&#8212;/g, '—');
        
        // Clean up excessive line breaks but preserve structure
        cleaned = cleaned.replace(/\n{4,}/g, '\n\n\n');
        cleaned = cleaned.replace(/^\n+/, '');
        cleaned = cleaned.replace(/\n+$/, '');
        
        return cleaned.trim();
      };

      // WordPress.com returns content in the 'content' field, no separate excerpt
      const rawContent = post.content || '';
      const contentText = cleanHtmlContent(rawContent);
      
      // Generate excerpt from cleaned content
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
        content: { rendered: contentText, protected: false },
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
    const posts = await this.request<WordPressPost[]>('/posts', { 
      slug,
      status: 'publish',
      _embed: true
    });
    
    if (!posts.length) {
      throw new Error('Post not found');
    }
    
    return posts[0];
  }

  async getPostById(id: number): Promise<WordPressPost> {
    return this.request<WordPressPost>(`/posts/${id}`, { _embed: true });
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
    // Skip analytics tracking for WordPress.com to avoid CORS issues
    if (this.isWordPressCom) {
      return;
    }
    
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
    // Skip analytics tracking for WordPress.com to avoid CORS issues
    if (this.isWordPressCom) {
      return;
    }
    
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
    // Skip analytics tracking for WordPress.com to avoid CORS issues
    if (this.isWordPressCom) {
      return;
    }
    
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

  // Function to clean HTML content and convert to markdown format
  const cleanHtmlContent = (htmlContent: string): string => {
    if (!htmlContent) return '';
    
    let cleaned = htmlContent.trim();
    
    // Remove WordPress.com specific block wrappers
    cleaned = cleaned.replace(/<div[^>]*class="wp-block-jetpack-markdown"[^>]*>/gi, '');
    cleaned = cleaned.replace(/<div[^>]*class="wp-block-[^"]*"[^>]*>/gi, '');
    cleaned = cleaned.replace(/<\/div>/gi, '');
    
    // Convert headings with proper spacing
    cleaned = cleaned.replace(/<h([1-6])[^>]*>([^<]*)<\/h[1-6]>/g, (match, level, content) => {
      const hashes = '#'.repeat(parseInt(level));
      return `\n\n${hashes} ${content.trim()}\n\n`;
    });
    
    // Convert lists with proper formatting
    cleaned = cleaned.replace(/<ul[^>]*>/g, '\n\n');
    cleaned = cleaned.replace(/<\/ul>/g, '\n\n');
    cleaned = cleaned.replace(/<ol[^>]*>/g, '\n\n');
    cleaned = cleaned.replace(/<\/ol>/g, '\n\n');
    cleaned = cleaned.replace(/<li[^>]*>([^<]*)<\/li>/g, '• $1\n');
    
    // Convert paragraphs with proper spacing
    cleaned = cleaned.replace(/<p[^>]*>/g, '\n\n');
    cleaned = cleaned.replace(/<\/p>/g, '');
    
    // Convert formatting tags
    cleaned = cleaned.replace(/<strong[^>]*>([^<]*)<\/strong>/g, '**$1**');
    cleaned = cleaned.replace(/<b[^>]*>([^<]*)<\/b>/g, '**$1**');
    cleaned = cleaned.replace(/<em[^>]*>([^<]*)<\/em>/g, '*$1*');
    cleaned = cleaned.replace(/<i[^>]*>([^<]*)<\/i>/g, '*$1*');
    
    // Convert line breaks
    cleaned = cleaned.replace(/<br[^>]*>/gi, '\n');
    
    // Remove any remaining HTML tags
    cleaned = cleaned.replace(/<[^>]*>/g, '');
    
    // Replace HTML entities
    cleaned = cleaned.replace(/&nbsp;/g, ' ');
    cleaned = cleaned.replace(/&amp;/g, '&');
    cleaned = cleaned.replace(/&lt;/g, '<');
    cleaned = cleaned.replace(/&gt;/g, '>');
    cleaned = cleaned.replace(/&quot;/g, '"');
    cleaned = cleaned.replace(/&#8217;/g, "'");
    cleaned = cleaned.replace(/&#8220;/g, '"');
    cleaned = cleaned.replace(/&#8221;/g, '"');
    cleaned = cleaned.replace(/&#8211;/g, '–');
    cleaned = cleaned.replace(/&#8212;/g, '—');
    
    // Clean up excessive line breaks but preserve structure
    cleaned = cleaned.replace(/\n{4,}/g, '\n\n\n');
    cleaned = cleaned.replace(/^\n+/, '');
    cleaned = cleaned.replace(/\n+$/, '');
    
    return cleaned.trim();
  };

  // Clean content and excerpt from WordPress
  const cleanedContent = cleanHtmlContent(wpPost.content.rendered || '');
  let finalExcerpt = cleanHtmlContent(wpPost.excerpt.rendered || '');
  
  // If excerpt is empty or too short, generate from content
  if (!finalExcerpt || finalExcerpt.length < 50) {
    finalExcerpt = cleanedContent.length > 200 
      ? cleanedContent.substring(0, 200) + '...' 
      : cleanedContent;
  }

  return {
    id: wpPost.id,
    title: wpPost.title.rendered,
    slug: wpPost.slug,
    excerpt: finalExcerpt,
    content: cleanedContent,
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