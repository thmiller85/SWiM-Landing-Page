import React from "react";
import { Button } from "@/components/ui/button";
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
  size?: "default" | "sm" | "lg";
  fullWidth?: boolean;
}

/**
 * The page's only call to action.
 *
 * Every instance renders the same words in the same colour and goes to the same
 * destination — that consistency is a conversion requirement, not a style
 * preference, so the label and URL come from config rather than from props.
 *
 * Fires the booking conversion on click. The event is deliberately attached to
 * the booking action rather than to page view, so the campaign is measured on
 * bookings instead of traffic. The event id matches the shape used by the
 * server-side Conversions API elsewhere in the site, which lets Meta deduplicate
 * if a server event is ever added for this action too.
 */
const BookDemoButton: React.FC<BookDemoButtonProps> = ({
  placement,
  className = "",
  size = "lg",
  fullWidth = false,
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
    <Button
      asChild
      size={size}
      className={`bg-highlight hover:bg-highlight/90 text-[#00111F] font-semibold hover:-translate-y-0.5 transition-all duration-300 ${
        fullWidth ? "w-full" : ""
      } ${className}`}
    >
      <a
        href={BOOKING_URL}
        onClick={handleClick}
        {...(BOOKING_IS_EXTERNAL
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
        data-testid={`book-demo-${placement}`}
      >
        {CTA_LABEL}
      </a>
    </Button>
  );
};

export default BookDemoButton;
