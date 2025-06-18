import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { initializeGA, trackPageView } from '@/lib/google-analytics';

export function GoogleAnalytics() {
  const [location] = useLocation();
  
  useEffect(() => {
    // Initialize GA4 if measurement ID is provided
    const measurementId = import.meta.env.VITE_GA4_MEASUREMENT_ID;
    if (measurementId && measurementId !== 'YOUR_GA4_MEASUREMENT_ID') {
      initializeGA(measurementId);
    }
  }, []);
  
  useEffect(() => {
    // Track page views on route change
    const measurementId = import.meta.env.VITE_GA4_MEASUREMENT_ID;
    if (measurementId && measurementId !== 'YOUR_GA4_MEASUREMENT_ID') {
      trackPageView(location);
    }
  }, [location]);
  
  return null;
}