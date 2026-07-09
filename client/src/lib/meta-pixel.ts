// Meta (Facebook) Pixel helper functions.
// The base pixel (fbq init + initial PageView) is loaded in client/index.html,
// mirroring how the gtag base code is set up. These helpers fire additional
// events from the app and share an event_id with the server-side Conversions
// API so Meta can deduplicate the browser and server events.

declare global {
  interface Window {
    fbq: (...args: any[]) => void;
  }
}

// The public Meta Pixel ID (also hardcoded in client/index.html).
export const META_PIXEL_ID = '1727254495132850';

// Fire a PageView. Used on SPA route changes; the initial load is already
// tracked by the base code in index.html.
export const trackMetaPageView = (): void => {
  if (typeof window.fbq !== 'function') return;
  window.fbq('track', 'PageView');
};

// Fire a Lead event. eventId is shared with the CAPI call for deduplication.
export const trackMetaLead = (
  eventId: string,
  data?: { content_name?: string }
): void => {
  if (typeof window.fbq !== 'function') return;
  window.fbq('track', 'Lead', data || {}, { eventID: eventId });
};

// Read a cookie value by name (returns undefined if absent or not in browser).
const readCookie = (name: string): string | undefined => {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(
    new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)')
  );
  return match ? decodeURIComponent(match[1]) : undefined;
};

// Meta browser cookies used for attribution. Set by the pixel (_fbp) and by
// the pixel when an fbclid is present (_fbc). Passed to the server for CAPI.
export const getFbCookies = (): { fbp?: string; fbc?: string } => ({
  fbp: readCookie('_fbp'),
  fbc: readCookie('_fbc'),
});
