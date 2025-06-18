// Google Analytics helper functions
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// Initialize Google Analytics
export const initializeGA = (measurementId: string) => {
  // Add gtag script to head
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script1);

  // Initialize dataLayer and gtag function
  window.dataLayer = window.dataLayer || [];
  window.gtag = function() {
    window.dataLayer.push(arguments);
  };
  
  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    page_path: window.location.pathname,
    anonymize_ip: true, // For GDPR compliance
  });
};

// Track page views
export const trackPageView = (url?: string) => {
  if (typeof window.gtag !== 'function') return;
  
  window.gtag('config', import.meta.env.VITE_GA4_MEASUREMENT_ID, {
    page_path: url || window.location.pathname,
  });
};

// Track custom events
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window.gtag !== 'function') return;
  
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// Track blog post views with enhanced data
export const trackBlogView = (
  postId: number,
  title: string,
  category: string,
  author: string
) => {
  if (typeof window.gtag !== 'function') return;
  
  window.gtag('event', 'view_item', {
    currency: 'USD',
    value: 0,
    items: [{
      item_id: postId.toString(),
      item_name: title,
      item_category: category,
      item_category2: 'blog',
      item_brand: author,
      price: 0,
      quantity: 1,
    }]
  });
};

// Track conversions (leads)
export const trackConversion = (
  conversionType: 'form_submit' | 'cta_click' | 'download',
  value?: string
) => {
  if (typeof window.gtag !== 'function') return;
  
  window.gtag('event', 'generate_lead', {
    currency: 'USD',
    value: 0,
    event_category: 'engagement',
    event_label: conversionType,
    conversion_type: conversionType,
    conversion_value: value,
  });
};

// Track social shares
export const trackShare = (method: string, contentId?: string) => {
  if (typeof window.gtag !== 'function') return;
  
  window.gtag('event', 'share', {
    method: method,
    content_type: 'blog',
    item_id: contentId,
  });
};

// Track scroll depth
export const trackScrollDepth = (percentage: number) => {
  if (typeof window.gtag !== 'function') return;
  
  window.gtag('event', 'scroll', {
    event_category: 'engagement',
    event_label: 'scroll_depth',
    value: percentage,
  });
};

// Track time on page
export const trackTimeOnPage = (seconds: number, pageTitle: string) => {
  if (typeof window.gtag !== 'function') return;
  
  window.gtag('event', 'page_timing', {
    event_category: 'engagement',
    event_label: pageTitle,
    value: seconds,
  });
};

// Check if GA is loaded and ready
export const isGAReady = (): boolean => {
  return typeof window.gtag === 'function';
};