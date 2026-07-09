import { useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { trackMetaPageView } from '@/lib/meta-pixel';

// Fires a Meta Pixel PageView on SPA route changes. The pixel base code in
// index.html already fires the first PageView, so we skip the initial render
// to avoid double-counting (mirrors the GoogleAnalytics component pattern).
export function MetaPixel() {
  const [location] = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    trackMetaPageView();
  }, [location]);

  return null;
}
