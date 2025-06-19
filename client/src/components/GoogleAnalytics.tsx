import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { trackPageView } from '@/lib/google-analytics';

export function GoogleAnalytics() {
  const [location] = useLocation();
  
  useEffect(() => {
    // Track page views on route change
    // GA is now initialized directly in index.html
    if (typeof window !== 'undefined' && window.gtag) {
      trackPageView(location);
    }
  }, [location]);
  
  return null;
}