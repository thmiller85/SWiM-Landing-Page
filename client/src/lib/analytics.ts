// Client-side analytics tracking library
import { apiRequest } from './queryClient';
import { trackEvent as trackGAEvent, trackBlogView, trackScrollDepth as trackGAScroll, trackTimeOnPage } from './google-analytics';

interface TrackingData {
  eventType: string;
  eventData?: Record<string, any>;
  postId?: number;
}

class AnalyticsTracker {
  private visitorId: string;
  private sessionId: string;
  private pageStartTime: number;
  private scrollTracking: boolean = false;
  private maxScrollDepth: number = 0;
  private currentPostId: number | null = null;

  constructor() {
    this.visitorId = this.getOrCreateVisitorId();
    this.sessionId = this.getOrCreateSessionId();
    this.pageStartTime = Date.now();
    this.initializeTracking();
  }

  private getOrCreateVisitorId(): string {
    let visitorId = localStorage.getItem('analytics_visitor_id');
    if (!visitorId) {
      visitorId = this.generateId();
      localStorage.setItem('analytics_visitor_id', visitorId);
    }
    return visitorId;
  }

  private getOrCreateSessionId(): string {
    const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
    const sessionData = sessionStorage.getItem('analytics_session');
    
    if (sessionData) {
      const { id, lastActivity } = JSON.parse(sessionData);
      if (Date.now() - lastActivity < SESSION_TIMEOUT) {
        sessionStorage.setItem('analytics_session', JSON.stringify({ id, lastActivity: Date.now() }));
        return id;
      }
    }
    
    const sessionId = this.generateId();
    sessionStorage.setItem('analytics_session', JSON.stringify({ id: sessionId, lastActivity: Date.now() }));
    
    // Track new session after sessionId is set
    setTimeout(() => this.createSession(), 0);
    
    return sessionId;
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private async createSession(): Promise<void> {
    try {
      const sessionData = {
        sessionId: this.sessionId,
        visitorId: this.visitorId,
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        landingPage: window.location.pathname,
        utmSource: this.getUrlParam('utm_source'),
        utmMedium: this.getUrlParam('utm_medium'),
        utmCampaign: this.getUrlParam('utm_campaign'),
        utmTerm: this.getUrlParam('utm_term'),
        utmContent: this.getUrlParam('utm_content'),
      };

      await apiRequest('/api/analytics/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionData),
      });
    } catch (error) {
      console.error('Failed to create analytics session:', error);
    }
  }

  private getUrlParam(param: string): string | null {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get(param);
  }

  private initializeTracking(): void {
    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.trackTimeOnPage();
      } else {
        this.pageStartTime = Date.now();
      }
    });

    // Track before page unload
    window.addEventListener('beforeunload', () => {
      this.trackTimeOnPage();
    });

    // Update session activity
    ['click', 'scroll', 'keypress'].forEach(event => {
      document.addEventListener(event, () => {
        const sessionData = sessionStorage.getItem('analytics_session');
        if (sessionData) {
          const { id } = JSON.parse(sessionData);
          sessionStorage.setItem('analytics_session', JSON.stringify({ id, lastActivity: Date.now() }));
        }
      }, { passive: true });
    });
  }

  // Public methods for tracking
  async trackEvent(data: TrackingData): Promise<void> {
    try {
      const eventData = {
        ...data,
        sessionId: this.sessionId,
        visitorId: this.visitorId,
        url: window.location.pathname,
        referrer: document.referrer,
      };

      await apiRequest('/api/analytics/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      });
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  }

  async trackPageView(postId?: number): Promise<void> {
    this.currentPostId = postId || null;
    this.pageStartTime = Date.now();
    this.maxScrollDepth = 0;
    
    await this.trackEvent({
      eventType: 'page_view',
      postId,
      eventData: {
        title: document.title,
        path: window.location.pathname,
      },
    });

    // Track in Google Analytics if it's a blog post
    if (postId) {
      // Extract blog info from page
      const titleEl = document.querySelector('h1');
      const title = titleEl?.textContent || document.title;
      const categoryEl = document.querySelector('[data-category]');
      const category = categoryEl?.getAttribute('data-category') || 'Uncategorized';
      const authorEl = document.querySelector('[data-author]');
      const author = authorEl?.getAttribute('data-author') || 'Unknown';
      
      trackBlogView(postId, title, category, author);
    }

    // Start scroll tracking
    if (!this.scrollTracking) {
      this.startScrollTracking();
    }
  }

  private startScrollTracking(): void {
    this.scrollTracking = true;
    let ticking = false;

    const updateScrollDepth = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollPercentage = Math.round((scrollTop / (documentHeight - windowHeight)) * 100);
      
      if (scrollPercentage > this.maxScrollDepth) {
        this.maxScrollDepth = scrollPercentage;
        
        // Track milestone scroll depths
        if ([25, 50, 75, 90, 100].includes(this.maxScrollDepth)) {
          this.trackEvent({
            eventType: 'scroll',
            postId: this.currentPostId || undefined,
            eventData: {
              depth: this.maxScrollDepth,
            },
          });
          
          // Also track in Google Analytics
          trackGAScroll(this.maxScrollDepth);
        }
      }
      
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDepth);
        ticking = true;
      }
    }, { passive: true });
  }

  private async trackTimeOnPage(): Promise<void> {
    if (!this.currentPostId) return;
    
    const timeOnPage = Math.round((Date.now() - this.pageStartTime) / 1000);
    
    if (timeOnPage > 0) {
      await this.trackEvent({
        eventType: 'time_on_page',
        postId: this.currentPostId,
        eventData: {
          duration: timeOnPage,
          scrollDepth: this.maxScrollDepth,
        },
      });
      
      // Track in Google Analytics
      trackTimeOnPage(timeOnPage, document.title);
    }
  }

  async trackClick(element: string, postId?: number): Promise<void> {
    await this.trackEvent({
      eventType: 'click',
      postId,
      eventData: {
        element,
        text: element,
      },
    });
  }

  async trackConversion(type: string, postId?: number, data?: Record<string, any>): Promise<void> {
    await this.trackEvent({
      eventType: 'conversion',
      postId,
      eventData: {
        conversionType: type,
        ...data,
      },
    });
  }

  async trackShare(platform: string, postId?: number): Promise<void> {
    await this.trackEvent({
      eventType: 'share',
      postId,
      eventData: {
        platform,
      },
    });
  }

  // Get current session info
  getSessionInfo() {
    return {
      visitorId: this.visitorId,
      sessionId: this.sessionId,
    };
  }
}

// Create singleton instance
export const analytics = new AnalyticsTracker();

// Export convenience functions
export const trackPageView = (postId?: number) => analytics.trackPageView(postId);
export const trackClick = (element: string, postId?: number) => analytics.trackClick(element, postId);
export const trackConversion = (type: string, postId?: number, data?: Record<string, any>) => 
  analytics.trackConversion(type, postId, data);
export const trackShare = (platform: string, postId?: number) => analytics.trackShare(platform, postId);
export const trackEvent = (data: TrackingData) => analytics.trackEvent(data);