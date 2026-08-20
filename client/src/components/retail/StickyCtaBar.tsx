import React, { useEffect, useState } from "react";
import BookDemoButton from "./BookDemoButton";

/**
 * Sticky booking bar for the long mobile scroll.
 *
 * On a page this long, the reader who is convinced at the FAQ should not have to
 * scroll hunting for a button — this is the highest-leverage element on the
 * mobile layout. Desktop hides it: the page there is short enough that a CTA is
 * always within reach, and a fixed bar would only cover content.
 *
 * Appears after roughly one viewport so it never competes with the hero CTA,
 * which is already on screen at that point.
 */
const StickyCtaBar: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.9);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-highlight/20 bg-[#00111F]/95 backdrop-blur-md px-4 pt-3 transition-all duration-300 ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-full opacity-0 pointer-events-none"
      }`}
      style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
      aria-hidden={!visible}
    >
      <BookDemoButton placement="sticky-bar" fullWidth />
      <p className="text-white/60 font-inter text-[11px] text-center mt-2">
        $299/month · cancel any time · setup included
      </p>
    </div>
  );
};

export default StickyCtaBar;
