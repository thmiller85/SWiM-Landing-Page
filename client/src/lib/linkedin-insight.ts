// LinkedIn Insight Tag helper functions.
// The base tag (partner id + insight.min.js loader) is installed in
// client/index.html, mirroring how the gtag and Meta Pixel base code is set
// up. These helpers fire event-specific conversions from the app.

declare global {
  interface Window {
    lintrk: (action: string, data?: Record<string, unknown>) => void;
  }
}

// Conversion defined in LinkedIn Campaign Manager for lead form submissions.
export const LINKEDIN_LEAD_CONVERSION_ID = 27805932;

// Fire the lead conversion. Safe to call before the Insight Tag script has
// loaded — the base tag's stub queues calls until insight.min.js is ready.
export const trackLinkedInLead = (): void => {
  if (typeof window.lintrk !== 'function') return;
  window.lintrk('track', { conversion_id: LINKEDIN_LEAD_CONVERSION_ID });
};
