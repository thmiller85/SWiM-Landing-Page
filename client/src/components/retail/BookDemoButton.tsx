import React from "react";
import { trackMetaLead } from "@/lib/meta-pixel";
import { trackEvent } from "@/lib/google-analytics";
import {
  BOOKING_URL,
  BOOKING_IS_EXTERNAL,
  CTA_LABEL,
  CONVERSION_CONTENT_NAME,
} from "@/pages/retail-planning-suite/config";

interface BookDemoButtonProps {
  /** Where on the page this instance sits, e.g. "hero" — recorded on the event
   *  so we can tell which section actually earns the booking. */
  placement: string;
  className?: string;
  /** Sticky-bar treatment: the price rides alongside the label. */
  stickyLabel?: boolean;
}

/**
 * The page's only call to action.
 *
 * Every instance renders the same words and goes to the same destination —
 * that consistency is a conversion requirement, not a style preference, so the
 * label and URL come from config rather than from props. Styling comes from the
 * page's own `.cta` class rather than from the site's button component, because
 * this page does not use the site's design system.
 *
 * Fires the booking conversion on click. The event is attached to the booking
 * action rather than to page view, so the campaign is measured on bookings
 * instead of traffic.
 */
const BookDemoButton: React.FC<BookDemoButtonProps> = ({
  placement,
  className = "cta",
  stickyLabel = false,
}) => {
  const handleClick = () => {
    // Tracking must never be what stops her reaching the calendar.
    try {
      const eventId =
        typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

      trackMetaLead(eventId, { content_name: CONVERSION_CONTENT_NAME });
      trackEvent("book_demo", "conversion", `${CONVERSION_CONTENT_NAME}:${placement}`);
    } catch {
      // Ignore — the navigation below still happens.
    }
  };

  return (
    <a
      href={BOOKING_URL}
      onClick={handleClick}
      className={className}
      {...(BOOKING_IS_EXTERNAL ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      data-testid={`book-demo-${placement}`}
    >
      {stickyLabel ? (
        <>
          <span className="amt">$299/mo</span>
          <span>{CTA_LABEL}</span>
        </>
      ) : (
        CTA_LABEL
      )}
    </a>
  );
};

export default BookDemoButton;
