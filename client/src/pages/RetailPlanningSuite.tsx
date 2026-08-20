import React, { useEffect, useMemo } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { fadeIn, staggerContainer } from "@/lib/animations";
import { trackScrollDepth } from "@/lib/google-analytics";
import BookDemoButton from "@/components/retail/BookDemoButton";
import StickyCtaBar from "@/components/retail/StickyCtaBar";
import WorkbookMock from "@/components/retail/WorkbookMock";
import ConnectorMark, { hasConnectorArtwork } from "@/components/retail/ConnectorMark";
import swimLogo from "@/assets/swim-logo-transparent.png";
import {
  CONTACT_EMAIL,
  CTA_TERMS,
  PAGE_DESCRIPTION,
  PAGE_TITLE,
} from "./retail-planning-suite/config";
import {
  BRANDS,
  FAQ,
  HERO_EYEBROW,
  HERO_VARIANTS,
  HOW_IT_WORKS,
  PRICING_ROWS,
  PRICING_SUPPORTING,
  SKILLS,
  STACK_CAVEAT,
  STACK_CONNECTORS,
  WHAT_THIS_ISNT,
} from "./retail-planning-suite/copy";

// Section shell. Every section on this page is a full-width band with the same
// horizontal rhythm; only the background changes, which is what gives the long
// scroll its sense of progress.
const Section: React.FC<{
  className?: string;
  children: React.ReactNode;
  id?: string;
}> = ({ className = "", children, id }) => (
  <section id={id} className={`py-14 md:py-20 relative ${className}`}>
    <div className="container mx-auto px-5 md:px-12 relative z-10">{children}</div>
  </section>
);

const SectionHeading: React.FC<{ children: React.ReactNode; sub?: string }> = ({
  children,
  sub,
}) => (
  <>
    <h2 className="text-[26px] md:text-4xl font-space font-bold leading-tight mb-4">
      {children}
    </h2>
    {sub ? (
      <p className="text-white/75 font-inter text-base md:text-lg mb-8 max-w-2xl">
        {sub}
      </p>
    ) : null}
  </>
);

const reveal = {
  initial: "hidden" as const,
  whileInView: "visible" as const,
  viewport: { once: true, margin: "-80px" },
  variants: fadeIn,
};

const RetailPlanningSuite: React.FC = () => {
  // Hero variant for ad message-match. Meta scores how well the ad's promise
  // matches the landing page, so each ad concept gets a headline that echoes it
  // while everything below the fold stays shared. Read once — it cannot change
  // without a page load.
  const variant = useMemo(() => {
    if (typeof window === "undefined") return HERO_VARIANTS[0];
    const key = new URLSearchParams(window.location.search)
      .get("v")
      ?.toLowerCase();
    return HERO_VARIANTS.find((v) => v.key === key) ?? HERO_VARIANTS[0];
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);

    // The site has no Helmet; pages set their own title on mount so SPA
    // navigations match what the server injects on a cold load.
    const previousTitle = document.title;
    document.title = PAGE_TITLE;

    const metaDescription = document.querySelector('meta[name="description"]');
    const previousDescription = metaDescription?.getAttribute("content") ?? null;
    metaDescription?.setAttribute("content", PAGE_DESCRIPTION);

    return () => {
      document.title = previousTitle;
      if (previousDescription !== null) {
        metaDescription?.setAttribute("content", previousDescription);
      }
    };
  }, []);

  // Scroll-depth milestones. On a page this long the useful question is not how
  // many people bounced but where — at the hero, or at the price.
  useEffect(() => {
    const milestones = [25, 50, 75, 90, 100];
    const fired = new Set<number>();
    let ticking = false;

    const measure = () => {
      ticking = false;
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;

      const percent = Math.round((window.scrollY / scrollable) * 100);
      for (const milestone of milestones) {
        if (percent >= milestone && !fired.has(milestone)) {
          fired.add(milestone);
          trackScrollDepth(milestone);
        }
      }
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(measure);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    // Bottom padding clears the sticky mobile bar so it never covers the footer.
    <div className="bg-primary min-h-screen overflow-x-hidden pb-24 md:pb-0">
      <div className="gradient-bg">
        {/* Minimal header. This is an ad destination, not a brochure — a full
            nav here is a set of escape hatches from the one action the page
            exists to produce. The logo goes home and nothing else does. */}
        <header className="absolute top-0 left-0 w-full z-40">
          <div className="container mx-auto px-5 md:px-12 py-4">
            <Link href="/" className="inline-flex items-center">
              <img src={swimLogo} alt="SWiM" className="h-8 w-auto" />
            </Link>
          </div>
        </header>

        {/* ─── 1 · Hero ─────────────────────────────────────────────────────
            Everything through the terms line has to clear a 390x844 viewport,
            so the sub is one sentence here and finishes below the fold. */}
        <section className="min-h-svh md:min-h-0 flex items-center md:block pt-24 md:pt-32 pb-16 md:pb-10 relative">
          <div className="container mx-auto px-5 md:px-12 relative z-10">
            <motion.div initial="hidden" animate="visible" variants={fadeIn} className="max-w-3xl">
              <span className="font-inter text-[11px] md:text-sm uppercase tracking-widest text-highlight mb-3 block">
                {HERO_EYEBROW}
              </span>
              <h1 className="text-[28px] leading-[1.15] md:text-5xl md:leading-tight font-space font-bold mb-4">
                {variant.h1}
              </h1>
              <p className="text-base md:text-xl text-white/[0.85] font-inter mb-6">
                {variant.sub}
              </p>
              <BookDemoButton placement="hero" className="w-full sm:w-auto" />
              <p className="text-white/60 font-inter text-[13px] md:text-sm mt-3">
                {CTA_TERMS}
              </p>
            </motion.div>

          </div>
        </section>

        {/* The rest of the promise, picked up immediately below the fold. The
            hero above reserves a full viewport so that nothing but the eyebrow,
            headline, one line of sub, the button and the terms competes for the
            three seconds she gives it. */}
        <section className="pb-12 md:pt-0 relative">
          <div className="container mx-auto px-5 md:px-12 relative z-10">
            <motion.p
              {...reveal}
              className="text-white/70 font-inter text-base md:text-lg max-w-2xl"
            >
              {variant.subContinued}
            </motion.p>
          </div>
        </section>

        {/* ─── 2 · Runs on Claude · works with your stack ───────────────────
            Logos, not a text list. She has spent years being told her POS isn't
            supported; the job here is a fast yes, and a mark is recognised
            before a word can be read. One equal row, no tiers — the honesty the
            tiers carried now sits in a single line underneath, where it informs
            without demoting half of independent apparel retail. */}
        <Section className="bg-[#00111F]/60 border-y border-accent/10">
          <motion.div {...reveal}>
            <SectionHeading sub="Nothing to migrate. Nothing to rebuild. We connect it with you on setup.">
              Works with your existing stack.
            </SectionHeading>

            <div className="glass rounded-2xl p-6 md:p-8 mb-8 border border-highlight/25 flex items-start gap-5">
              <ConnectorMark
                connector={{ name: "Claude", mark: "claude" }}
                className="h-10 w-10 md:h-12 md:w-12 text-highlight flex-shrink-0"
              />
              <div>
                <div className="text-xl md:text-2xl font-space font-semibold mb-2">
                  Runs inside Claude.
                </div>
                <p className="text-white/75 font-inter">
                  Built as a private plugin for Claude, the AI assistant from Anthropic.
                </p>
              </div>
            </div>

            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-4 gap-y-6 mb-6">
              {STACK_CONNECTORS.map((connector) => (
                <li
                  key={connector.name}
                  className="flex h-[68px] flex-col items-center justify-center gap-2.5 text-center text-white/65 hover:text-white/90 transition-colors"
                >
                  <ConnectorMark connector={connector} />
                  {/* Caption only a bare logomark. The wordmark fallback and the
                      full lockups already carry the name in the artwork. */}
                  {hasConnectorArtwork(connector.mark) && !connector.lockup ? (
                    <span className="font-inter text-xs text-white/55 leading-tight">
                      {connector.name}
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>

            <p className="text-white/60 font-inter text-sm max-w-2xl">
              {STACK_CAVEAT}
            </p>
          </motion.div>
        </Section>

        {/* ─── 3 · The cost of getting it wrong ─────────────────────────────
            The price anchor. It works on both readers: the owner who has never
            been quoted by a consultant has no retainer to compare against, but
            she does have a category she got stuck with. Frames the cost of the
            status quo — never promises a result. */}
        <Section>
          <motion.div {...reveal} className="max-w-3xl">
            <SectionHeading>You've already paid for this.</SectionHeading>
            <div className="space-y-5 text-white/80 font-inter text-base md:text-lg leading-relaxed">
              <p>
                One category you bought too deep. One season of markdowns you
                didn't plan for. One brand that sold out in March and never got
                reordered.
              </p>
              <p>
                Most owners can name at least one from last year. The difference
                is they found out in hindsight.
              </p>
              <p className="text-white">
                <strong className="font-semibold">
                  $299 a month is $3,588 a year.
                </strong>{" "}
                Think about the last category you got stuck with. It probably cost
                you more than that in one season.
              </p>
            </div>
          </motion.div>
        </Section>

        {/* ─── 4 · How it works ─────────────────────────────────────────────
            Kills the "this sounds complicated" fear. */}
        <Section className="bg-[#002348]">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={staggerContainer}>
            <motion.div variants={fadeIn}>
              <SectionHeading>Three steps. No dashboard to learn.</SectionHeading>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {HOW_IT_WORKS.map((step) => (
                <motion.div
                  key={step.step}
                  variants={fadeIn}
                  className="glass rounded-2xl p-6 border border-accent/20"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-r from-accent to-highlight flex items-center justify-center text-[#00111F] font-bold mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-lg font-space font-semibold mb-3">
                    {step.title}
                  </h3>
                  {step.examples ? (
                    <ul className="space-y-2 mb-3">
                      {step.examples.map((example) => (
                        <li
                          key={example}
                          className="text-highlight/90 font-inter text-[15px] italic"
                        >
                          "{example}"
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  <p className="text-white/75 font-inter text-[15px] leading-relaxed">
                    {step.body}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </Section>

        {/* ─── 5 · The workbook ─────────────────────────────────────────────
            Proof, and the most important section on the page. */}
        <Section className="bg-[#00111F]">
          <motion.div {...reveal}>
            <SectionHeading sub="Open it in Excel. Click any total. The formula is right there.">
              You get a file, not a chat window.
            </SectionHeading>
            <div className="max-w-3xl">
              <WorkbookMock />
            </div>
            <div className="mt-10">
              <BookDemoButton placement="after-workbook" className="w-full sm:w-auto" />
              <p className="text-white/60 font-inter text-[13px] md:text-sm mt-3">
                {CTA_TERMS}
              </p>
            </div>
          </motion.div>
        </Section>

        {/* ─── 6 · H/L honesty ──────────────────────────────────────────────
            The strongest thing on the page, and the one claim no general chatbot
            can match. It gets a full section rather than a line in a grid. */}
        <Section className="bg-gradient-to-br from-[#0A3A5A] to-[#1A8CB7]">
          <motion.div {...reveal} className="max-w-3xl">
            <SectionHeading>It tells you when it's guessing.</SectionHeading>
            <p className="text-white/85 font-inter text-base md:text-lg mb-6">
              Every figure carries a tag.
            </p>
            <div className="space-y-4 mb-6">
              <div className="glass rounded-xl p-5 border border-white/15">
                <span className="inline-block rounded bg-[#d8ecd8] text-[#1c5c38] font-bold px-2 py-0.5 text-sm mb-2">
                  H
                </span>
                <p className="text-white/90 font-inter">
                  This came from your actual sales.
                </p>
              </div>
              <div className="glass rounded-xl p-5 border border-white/15">
                <span className="inline-block rounded bg-[#fbe6c8] text-[#8a5a00] font-bold px-2 py-0.5 text-sm mb-2">
                  L
                </span>
                <p className="text-white/90 font-inter">
                  This came from an industry benchmark, because your history was
                  thin here.
                </p>
              </div>
            </div>
            <p className="text-white font-inter text-base md:text-lg leading-relaxed">
              You always know which numbers are yours and which ones aren't. It
              never dresses a guess up as a fact.
            </p>
          </motion.div>
        </Section>

        {/* ─── 7 · Every brand you carry ────────────────────────────────────
            Kills "is this worth it for a store my size?". Set as text, not
            logos: text reads as "we know your floor", where a logo wall reads as
            a partner wall and implies endorsements nobody has agreed to. */}
        <Section className="bg-[#002348]">
          <motion.div {...reveal}>
            <SectionHeading>Five brands or fifty. Same question, same price.</SectionHeading>
            <p className="text-white/80 font-inter text-base md:text-lg leading-relaxed max-w-3xl mb-8">
              It reads your whole point of sale — every vendor, every category,
              every location. Planning around your top five brands or your top
              fifty is the same question asked once, not a custom report built and
              billed per brand. Add a new line and it already knows.
            </p>
            <div className="flex flex-wrap gap-x-3 gap-y-3">
              {BRANDS.map((brand) => (
                <span
                  key={brand}
                  className="font-space text-[15px] md:text-lg text-white/70 border border-accent/25 rounded-full px-4 py-1.5"
                >
                  {brand}
                </span>
              ))}
            </div>
          </motion.div>
        </Section>

        {/* ─── 8 · The six skills ───────────────────────────────────────────
            Depth for the reader who is now leaning in. */}
        <Section>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={staggerContainer}>
            <motion.div variants={fadeIn}>
              <SectionHeading>Six workflows, one planning rhythm.</SectionHeading>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {SKILLS.map((skill) => (
                <motion.div
                  key={skill.title}
                  variants={fadeIn}
                  className="glass rounded-2xl p-6 border border-accent/20"
                >
                  <h3 className="text-lg font-space font-semibold mb-3 text-highlight">
                    {skill.title}
                  </h3>
                  <p className="text-white/75 font-inter text-[15px] leading-relaxed">
                    {skill.body}
                  </p>
                </motion.div>
              ))}
            </div>
            <motion.p
              variants={fadeIn}
              className="text-white/85 font-inter text-base md:text-lg mt-8 max-w-3xl"
            >
              <strong className="font-semibold text-white">
                Every recommendation is sized in dollars.
              </strong>{" "}
              Not "cancel some POs" — "cancel ~$8K of October commitments on
              Dresses." That's what separates this from advice.
            </motion.p>
          </motion.div>
        </Section>

        {/* ─── 9 · Pricing ──────────────────────────────────────────────────
            One price, said plainly. The Claude subscription is disclosed here,
            above the CTA — a surprise second subscription discovered at signup
            is a trust problem you don't recover from. */}
        <Section id="pricing" className="bg-[#00111F]">
          <motion.div {...reveal} className="max-w-3xl">
            <SectionHeading>$299 a month. Cancel any time.</SectionHeading>
            <p className="text-white/75 font-inter mb-8">
              One price. No tiers, no toggle, no "contact us for enterprise."
            </p>

            <div className="glass rounded-2xl border border-highlight/25 overflow-hidden mb-8">
              {PRICING_ROWS.map((row, i) => (
                <div
                  key={row.label}
                  className={`flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6 px-5 md:px-6 py-4 ${
                    i > 0 ? "border-t border-accent/15" : ""
                  }`}
                >
                  <div className="text-[11px] uppercase tracking-widest text-highlight/90 font-inter sm:w-48 sm:flex-shrink-0">
                    {row.label}
                  </div>
                  <div
                    className={`font-inter text-white ${
                      row.label === "Price"
                        ? "text-2xl md:text-3xl font-space font-bold"
                        : "text-[15px] text-white/85"
                    }`}
                  >
                    {row.value}
                  </div>
                </div>
              ))}
            </div>

            <ul className="space-y-4 mb-8">
              {PRICING_SUPPORTING.map((item) => (
                <li key={item.lead} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-highlight flex-shrink-0 mt-0.5" />
                  <p className="text-white/80 font-inter text-[15px]">
                    <em className="text-white not-italic font-semibold">
                      {item.lead}
                    </em>{" "}
                    {item.body}
                  </p>
                </li>
              ))}
            </ul>

            {/* Disclosed before the CTA, deliberately — not buried in the FAQ. */}
            <div className="glass rounded-2xl p-5 md:p-6 border border-highlight/30 mb-8">
              <p className="text-white font-inter font-semibold mb-2">
                You'll also need a Claude subscription.
              </p>
              <p className="text-white/75 font-inter text-[15px] leading-relaxed">
                The suite runs inside Claude, so that's billed to you by Anthropic,
                separate from this. Claude Pro at $20/month covers it, and it's
                yours to use for everything else too.
              </p>
            </div>

            <BookDemoButton placement="after-pricing" className="w-full sm:w-auto" />
            <p className="text-white/60 font-inter text-[13px] md:text-sm mt-3">
              {CTA_TERMS}
            </p>
          </motion.div>
        </Section>

        {/* ─── 10 · What this isn't ─────────────────────────────────────────*/}
        <Section className="bg-[#002348]">
          <motion.div {...reveal}>
            <SectionHeading>What this isn't.</SectionHeading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl">
              {WHAT_THIS_ISNT.map((item) => (
                <div
                  key={item.title}
                  className="glass rounded-2xl p-6 border border-accent/20"
                >
                  <h3 className="font-space font-semibold text-lg mb-2">
                    {item.title}
                  </h3>
                  <p className="text-white/75 font-inter text-[15px] leading-relaxed">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </Section>

        {/* ─── 11 · FAQ ─────────────────────────────────────────────────────*/}
        <Section>
          <motion.div {...reveal} className="max-w-3xl">
            <SectionHeading>Questions worth asking.</SectionHeading>
            <Accordion type="single" collapsible className="w-full">
              {FAQ.map((item, i) => (
                <AccordionItem
                  key={item.q}
                  value={`faq-${i}`}
                  className="border-accent/20"
                >
                  <AccordionTrigger className="text-left font-space font-semibold text-white hover:text-highlight text-base md:text-lg">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-white/75 font-inter text-[15px] leading-relaxed">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </Section>

        {/* ─── 12 · Final CTA ───────────────────────────────────────────────
            Closes on her buying calendar rather than on scarcity. She is heading
            to market at a fixed time whether she books or not — that's honest,
            it's specific, and it doesn't expire. */}
        <Section className="bg-[#00111F]">
          <motion.div {...reveal}>
            <div className="rounded-2xl bg-gradient-to-r from-[#0A3A5A] to-[#1A8CB7] p-7 md:p-14 text-center max-w-4xl mx-auto">
              <h2 className="text-[26px] md:text-[42px] font-space font-bold mb-4 leading-tight">
                Your next market is already on the calendar.
                <br className="hidden md:block" /> Go with a plan.
              </h2>
              <div className="mt-7 flex justify-center">
                <BookDemoButton placement="final" className="w-full sm:w-auto" />
              </div>
              <p className="text-white/75 font-inter text-[13px] md:text-sm mt-3">
                month to month · cancel any time · setup included
              </p>
            </div>
          </motion.div>
        </Section>

        {/* Slim footer. The privacy policy has to be linked, but the site's full
            footer is a wall of escape hatches this page can't afford. */}
        <footer className="border-t border-accent/20 py-8">
          <div className="container mx-auto px-5 md:px-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <Link href="/">
                  <img src={swimLogo} alt="SWiM" className="h-7 w-auto" />
                </Link>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-white/60 hover:text-highlight transition-colors font-inter text-sm"
                >
                  {CONTACT_EMAIL}
                </a>
              </div>
              <div className="flex items-center gap-5">
                <Link
                  href="/privacy-policy"
                  className="text-white/50 hover:text-white transition-colors font-inter text-sm"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms-of-service"
                  className="text-white/50 hover:text-white transition-colors font-inter text-sm"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
            <p className="text-white/40 font-inter text-xs mt-6">
              © {new Date().getFullYear()} SWiM AI, LLC. All rights reserved.
              Product names referenced are trademarks of their respective owners.
            </p>
          </div>
        </footer>

        <StickyCtaBar />
      </div>
    </div>
  );
};

export default RetailPlanningSuite;
