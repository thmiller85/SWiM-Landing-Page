// Conversion configuration for the Retail Planning Suite landing page.
//
// The page has exactly one conversion — booking a demo — so the button label,
// the terms line under it, and the destination all live here. Keeping them in
// one place is what enforces the "one CTA, same words, same colour, every time"
// rule from the build brief: every button on the page renders from these
// constants via BookDemoButton.

// Where the CTA sends her. A real scheduler beats a mailto for cold traffic, so
// this is expected to become a booking URL — swapping it is a one-line change
// and nothing else on the page needs to move.
export const BOOKING_URL =
  "mailto:grow@swimsolutions.ai?subject=Retail%20Planning%20Suite%20demo";

// True once BOOKING_URL points at a scheduler rather than a mail client.
// Controls whether the link opens in a new tab.
export const BOOKING_IS_EXTERNAL = !BOOKING_URL.startsWith("mailto:");

// The button never carries a duration. "45-minute walkthrough" prices the click
// in her time before she knows what it's worth; the 45 minutes appears once,
// low on the page, as a benefit instead.
export const CTA_LABEL = "Book a demo";

// Sits under every instance of the button.
export const CTA_TERMS =
  "$299/month · month to month · cancel any time · setup included";

// Distinct conversion event name, fired on the booking action rather than on
// page view, so ad spend is measured against bookings and not traffic.
export const CONVERSION_CONTENT_NAME = "retail-planning-suite-demo";

// Contact of record, shown in the page footer.
export const CONTACT_EMAIL = "grow@swimsolutions.ai";

export const PAGE_PATH = "/retail/planning-suite";
export const PAGE_TITLE =
  "Retail Planning Suite | Open-to-Buy Planning for Independent Boutiques | SWiM";
export const PAGE_DESCRIPTION =
  "Build your open-to-buy from your own sales history — what to spend, which brands get it, and when to mark down. Plain English in, Excel out. $299/month, month to month.";
