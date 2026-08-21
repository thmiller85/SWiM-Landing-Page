import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import { trackScrollDepth } from "@/lib/google-analytics";
import BookDemoButton from "@/components/retail/BookDemoButton";
import ConnectorMark from "@/components/retail/ConnectorMark";
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
  STACK_TRADEMARK_NOTE,
  STACK_CONNECTORS,
  WHAT_THIS_ISNT,
} from "./retail-planning-suite/copy";
import { plateSources } from "./retail-planning-suite/plate-sources";
import "./retail-planning-suite/editorial.css";

/**
 * The Retail Planning Suite landing page — "The Buying Guide".
 *
 * Deliberately does not use the site's navy/glass design system. This is an ad
 * destination for owner-operators of independent apparel boutiques arriving
 * cold from Instagram, and the brief forbids every conventional credibility
 * signal — no testimonials, no customer logos, no counts, no case studies. That
 * leaves taste as the only proof available before she reads a word, so the page
 * is set as a seasonal linesheet: two inks on catalogue stock, plate-numbered
 * sections, and photographic plates. The visual system lives in editorial.css,
 * scoped under .rps-editorial so none of it reaches the rest of the site.
 *
 * Copy still comes from copy.ts. The wording is governed by sixteen hard rules
 * in the build brief and is verified against them, so it stays in one reviewed
 * place rather than being inlined into markup.
 */

/** A section's left-hand rail: plate number and running head. */
/** Accessible names for the individual product marks, so each is announced as
 *  the service it identifies rather than as the suite it belongs to. */
const PRODUCT_NAMES: Record<string, string> = {
  gmail: "Gmail",
  drive: "Google Drive",
  calendar: "Google Calendar",
  outlook: "Microsoft Outlook",
  excel: "Microsoft Excel",
};

const Rail: React.FC<{ num: string; run: string; ox?: boolean }> = ({ num, run, ox }) => (
  <div className="rail" style={ox ? { borderColor: "var(--ox)", color: "var(--ox)" } : undefined}>
    <span className="num">{num}</span>
    <span className="label run">{run}</span>
  </div>
);

const RATIOS: Record<string, number> = { "4x5": 4 / 5, "3x2": 3 / 2, "16x9": 16 / 9 };

/**
 * A photographic or video plate.
 *
 * With `image`, it renders the built derivatives. Without one — or before
 * `scripts/build-plate-derivatives.mjs` has run for that name — it falls back
 * to the marked-up box carrying its own art direction, which is more useful to
 * whoever shoots it than a grey rectangle would be.
 *
 * `alt` describes the room rather than the person in it. The page names no
 * customers, and a photograph captioned as one would say what the copy is
 * careful not to.
 */
const Plate: React.FC<{
  no: string;
  ratio: "4x5" | "3x2" | "16x9";
  brief: string;
  image?: string;
  alt?: string;
  sizes?: string;
  priority?: boolean;
  caption?: string;
  style?: React.CSSProperties;
  className?: string;
}> = ({
  no,
  ratio,
  brief,
  image,
  alt,
  sizes,
  priority = false,
  caption = "Photography placeholder.",
  style,
  className,
}) => {
  const sources = image ? plateSources(image, RATIOS[ratio]) : null;

  return (
    <figure className={`plate-fig ${className ?? ""}`} style={style}>
      {sources ? (
        <picture>
          {sources.srcSets.map((set) => (
            <source key={set.type} type={set.type} srcSet={set.srcSet} sizes={sizes} />
          ))}
          <img
            className={`plate-img ar-${ratio}`}
            src={sources.src}
            sizes={sizes}
            width={sources.width}
            height={sources.height}
            alt={alt ?? ""}
            loading={priority ? "eager" : "lazy"}
            decoding={priority ? "sync" : "async"}
            {...(priority ? { fetchPriority: "high" as const } : {})}
          />
        </picture>
      ) : (
        <>
          <div className={`plate-box ar-${ratio}`}>
            <div className="plate-top">
              <span className="label">Plate {no}</span>
              <span className="label">{ratio.replace("x", " : ")}</span>
            </div>
            <p className="plate-brief">{brief}</p>
          </div>
          <figcaption className="plate-cap">{caption}</figcaption>
        </>
      )}
    </figure>
  );
};

/** Heading block shared by every numbered section. */
const Sec: React.FC<{
  id: string;
  num: string;
  run: string;
  head?: string;
  sub?: string;
  className?: string;
  railOx?: boolean;
  children: React.ReactNode;
}> = ({ id, num, run, head, sub, className = "sec ruled", railOx, children }) => (
  <section className={className} id={id}>
    <div className="wrap">
      <div className="grid">
        <Rail num={num} run={run} ox={railOx} />
        <div>
          {head ? <h2 className="head">{head}</h2> : null}
          {sub ? <p className="sub-head">{sub}</p> : null}
          {children}
        </div>
      </div>
    </div>
  </section>
);

const RetailPlanningSuite: React.FC = () => {
  const [stuck, setStuck] = useState(false);
  const heroRef = useRef<HTMLElement | null>(null);

  // Hero variant for ad message-match. Read once — it cannot change without a
  // page load, and Meta scores how well the ad's promise matches the page.
  const variant = useMemo(() => {
    if (typeof window === "undefined") return HERO_VARIANTS[0];
    const key = new URLSearchParams(window.location.search).get("v")?.toLowerCase();
    return HERO_VARIANTS.find((v) => v.key === key) ?? HERO_VARIANTS[0];
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    const previousTitle = document.title;
    document.title = PAGE_TITLE;
    const meta = document.querySelector('meta[name="description"]');
    const previousDescription = meta?.getAttribute("content") ?? null;
    meta?.setAttribute("content", PAGE_DESCRIPTION);
    return () => {
      document.title = previousTitle;
      if (previousDescription !== null) meta?.setAttribute("content", previousDescription);
    };
  }, []);

  // The sticky bar appears once the hero has left the screen, so it never
  // competes with the CTA already visible in the hero.
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      ([entry]) => setStuck(!entry.isIntersecting),
      { rootMargin: "-40px 0px 0px 0px", threshold: 0 }
    );
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  // Scroll-depth milestones. On a page this long the useful question is not how
  // many people bounced but where — at the hero, or at the price.
  useEffect(() => {
    const milestones = [25, 50, 75, 90, 100];
    const fired = new Set<number>();
    let ticking = false;
    const measure = () => {
      ticking = false;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const percent = Math.round((window.scrollY / scrollable) * 100);
      for (const m of milestones) {
        if (percent >= m && !fired.has(m)) {
          fired.add(m);
          trackScrollDepth(m);
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

  const ctaRow = (placement: string) => (
    <div className="cta-row">
      <BookDemoButton placement={placement} className="cta" />
      <p className="terms">{CTA_TERMS}</p>
    </div>
  );

  return (
    <div className="rps-editorial">
      {/* The masthead is a logo and nothing else. A full nav on an ad
          destination is a set of escape hatches from the one action the page
          exists to produce. */}
      <header className="masthead">
        <div className="wrap">
          <Link href="/" className="logo">
            SW<i>i</i>M
          </Link>
        </div>
      </header>

      <main>
        {/* ═══ 01 · HERO ═══════════════════════════════════════════════════
            Everything through the terms line clears a 390×844 viewport. The
            sub is one sentence here and finishes immediately below the fold. */}
        <div className="wrap">
          <div className="hero-spread">
            <section className="hero" ref={heroRef as React.RefObject<HTMLElement>}>
              <p className="label eyebrow">{HERO_EYEBROW}</p>
              <h1>{variant.h1}</h1>
              <p className="lede">{variant.sub}</p>
              {ctaRow("hero")}
            </section>

            <Plate
              no="01"
              ratio="4x5"
              className="hero-plate"
              image="plate-01-shop-floor"
              alt="The sales floor of a small independent boutique before opening, racks of muted knitwear and linen in flat morning window light."
              sizes="(min-width: 900px) 430px, 92vw"
              priority
              brief="Editorial photo — the owner on her own shop floor, mid-morning, before the doors open. Racks in soft focus behind her. Natural light, no stock-photo smile."
            />
          </div>
        </div>

        <div className="wrap">
          <div className="sub-continued">
            <p>{variant.subContinued}</p>
          </div>
        </div>

        {/* ═══ 02 · STACK ══════════════════════════════════════════════════ */}
        <Sec
          id="stack"
          num="02"
          run="Compatibility"
          head="Works with your existing stack."
          sub="Nothing to migrate. Nothing to rebuild. We connect it with you on setup."
        >
          {/* Claude sits above the connector grid and larger than the marks in
              it, as the brief specifies. It is the most recognisable name here
              and does three jobs at once: it explains how this is affordable
              without making AI the headline, it borrows real credibility, and
              it discloses the Claude requirement early rather than springing it
              at signup. */}
          <div className="claude-panel">
            <ConnectorMark
              connector={{ name: "Claude", mark: "claude" }}
              className="claude-mark"
            />
            <div>
              <p className="kicker">Runs inside Claude.</p>
              <p>Built as a private plugin for Claude, the AI assistant from Anthropic.</p>
            </div>
          </div>

          <div className="stockists">
            {STACK_CONNECTORS.map((c) => (
                <div className="stockist" key={c.name}>
                  {c.marks ? (
                    // A suite shown by its product marks. They sit together as
                    // one entry so the row still reads as ten services rather
                    // than fourteen, and the caption names the suite.
                    <span className="product-marks">
                      {c.marks.map((m) => (
                        <ConnectorMark
                          key={m}
                          connector={{ name: PRODUCT_NAMES[m] ?? c.name, mark: m }}
                        />
                      ))}
                    </span>
                  ) : (
                    <ConnectorMark connector={c} />
                  )}
                  {/* The name is set in the page's own type rather than left to
                      the mark. A lockup already carries its name in the artwork,
                      so captioning it would print the name twice; a group of
                      product marks needs the suite named. */}
                  {c.lockup ? null : <span className="stockist-name">{c.name}</span>}
                </div>
            ))}
          </div>

          <p className="caveat">{STACK_CAVEAT}</p>
            <p className="tm-note">{STACK_TRADEMARK_NOTE}</p>
        </Sec>

        {/* ═══ 03 · PRICE ANCHOR ═══════════════════════════════════════════
            Frames the cost of the status quo. It never promises a result. */}
        <Sec id="anchor" num="03" run="The cost of getting it wrong" head="You've already paid for this.">
          <ul className="anchor-list">
            <li>One category you bought too deep.</li>
            <li>One season of markdowns you didn't plan for.</li>
            <li>One brand that sold out in March and never got reordered.</li>
          </ul>
          <p className="body-copy">
            Most owners can name at least one from last year. The difference is they found out in
            hindsight.
          </p>
          <div className="anchor-figure">
            <p className="fig">
              <span className="cur">$</span>3,588
            </p>
            <p className="anchor-note">
              <b>$299 a month is $3,588 a year.</b> Think about the last category you got stuck
              with. It probably cost you more than that in one season.
            </p>
          </div>
        </Sec>

        {/* ═══ 04 · HOW IT WORKS ═══════════════════════════════════════════ */}
        <Sec id="how" num="04" run="How it works" head="Three steps. No dashboard to learn.">
          <div className="steps">
            {HOW_IT_WORKS.map((step) => (
              <div className="step" key={step.step}>
                <span className="n">{step.step}</span>
                <h3>{step.title}</h3>
                {step.examples ? (
                  <ul className="asks">
                    {step.examples.map((e) => (
                      <li key={e}>&ldquo;{e}&rdquo;</li>
                    ))}
                  </ul>
                ) : null}
                <p style={step.examples ? { marginTop: 14 } : undefined}>{step.body}</p>
              </div>
            ))}
          </div>
        </Sec>

        {/* ═══ 05 · THE WORKBOOK ═══════════════════════════════════════════
            The proof, and the section the page is built around. Flooding the
            band in ink makes the plain white spreadsheet the loudest object
            here — the design doing the argument rather than asserting it. */}
        <section className="sec field-ink" id="workbook">
          <div className="wrap">
            <div className="grid">
              <Rail num="05" run="The output" />
              <div>
                <h2 className="head">You get a file, not a chat window.</h2>
                <p className="sub-head" style={{ color: "var(--muted)" }}>
                  Open it in Excel. Click any total. The formula is right there.
                </p>

                <div className="xl-shell">
                  <div className="xl-scroll">
                    <div className="xl">
                      <div className="xl-title">
                        <span className="xl-dots">
                          <i /><i /><i />
                        </span>
                        <span className="xl-fname">Open-to-Buy Plan.xlsx</span>
                      </div>

                      <div className="xl-bar">
                        <span className="xl-namebox">B6</span>
                        <span className="xl-fx">fx</span>
                        <span className="xl-formula">=SUM(B2:B5)</span>
                      </div>

                      <table className="xl-grid">
                        <tbody>
                          <tr className="xl-colhead">
                            <th className="xl-rowhead" />
                            <th className="c-a">A</th>
                            <th className="c-b sel">B</th>
                            <th className="c-c">C</th>
                            <th className="c-d">D</th>
                            <th className="c-e">E</th>
                            <th className="c-f">F</th>
                          </tr>
                          <tr className="hdr">
                            <th className="xl-rowhead">1</th>
                            <td>Category</td>
                            <td className="num">Receipt $</td>
                            <td className="num">vs LY</td>
                            <td className="mid">Conf</td>
                            <td /><td />
                          </tr>
                          {[
                            ["2", "Dresses", "$148,400", "+12%", "H"],
                            ["3", "Denim", "$86,200", "−4%", "H"],
                            ["4", "Knits", "$64,900", "+9%", "L"],
                            ["5", "Accessories", "$38,750", "+6%", "H"],
                          ].map(([r, cat, receipt, vs, conf]) => (
                            <tr key={r}>
                              <th className="xl-rowhead">{r}</th>
                              <td>{cat}</td>
                              <td className="num">{receipt}</td>
                              <td className="num">{vs}</td>
                              <td className="mid">{conf}</td>
                              <td /><td />
                            </tr>
                          ))}
                          <tr className="total">
                            <th className="xl-rowhead sel">6</th>
                            <td>Open-to-buy</td>
                            <td className="num selcell">$338,250</td>
                            <td className="num" />
                            <td className="mid" />
                            <td /><td />
                          </tr>
                          {["7", "8"].map((r) => (
                            <tr key={r}>
                              <th className="xl-rowhead">{r}</th>
                              <td /><td /><td /><td /><td /><td />
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      <div className="xl-tabs">
                        <span className="on">Open-to-Buy</span>
                        <span>Vendor Split</span>
                        <span>Markdown</span>
                        <span>Assumptions</span>
                      </div>
                    </div>
                  </div>

                  <div className="xl-meta">
                    <span className="label">Illustrative figures</span>
                    <span className="label">Scroll the sheet &rarr;</span>
                  </div>
                </div>

                <p className="body-copy" style={{ marginTop: 26 }}>
                  Column D carries the confidence tag on every line. Cell B6 is a live{" "}
                  <span style={{ fontFamily: "var(--ui)", fontSize: ".92em" }}>=SUM()</span>, not a
                  number typed in by someone else. The file has no logo on it, because it is your
                  document, not ours.
                </p>

                <Plate
                  no="02"
                  ratio="16x9"
                  style={{ marginTop: 34 }}
                  caption="Video placeholder."
                  brief="Video placeholder — screen recording, no voiceover: the workbook opening in Excel, a click on the total, the formula appearing in the bar. Twelve seconds, looping."
                />

                <div className="wrap">
                  <div className="grid">
                    <Rail num="·" run="The call" ox />
                    <div>
                      <p className="line">
                        We'll build one of these with your numbers, on the call.
                      </p>
                      {ctaRow("after-workbook")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ 06 · H / L ══════════════════════════════════════════════════
            The one claim no general chatbot can match. Gets the second ink. */}
        <section className="sec field-ox" id="honesty">
          <div className="wrap">
            <div className="grid">
              <Rail num="06" run="Confidence tags" />
              <div>
                <h2 className="head">It tells you when it's guessing.</h2>
                <p className="sub-head" style={{ color: "var(--muted)" }}>
                  Every figure carries a tag.
                </p>
                <div className="tags">
                  <div className="tag">
                    <span className="glyph">H</span>
                    <p>This came from your actual sales.</p>
                  </div>
                  <div className="tag">
                    <span className="glyph">L</span>
                    <p>
                      This came from an industry benchmark, because your history was thin here.
                    </p>
                  </div>
                </div>
                <p className="hl-close">
                  You always know which numbers are yours and which ones aren't. It never dresses a
                  guess up as a fact.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ 07 · BRANDS ═════════════════════════════════════════════════
            Set as text, never logos: a wall of fashion logos reads as a partner
            wall and implies endorsements none of these companies have given. */}
        <Sec
          id="brands"
          num="07"
          run="Every vendor on your floor"
          head="Five brands or fifty. Same question, same price."
          className="sec"
        >
          <p className="body-copy" style={{ marginBottom: 30 }}>
            It reads your whole point of sale — every vendor, every category, every location.
            Planning around your top five brands or your top fifty is the same question asked once,
            not a custom report built and billed per brand. Add a new line and it already knows.
          </p>
          <ul className="linesheet">
            {BRANDS.map((brand, i) => (
              <li key={brand}>
                <span className="idx">{String(i + 1).padStart(2, "0")}</span>
                <span className="nm">{brand}</span>
              </li>
            ))}
          </ul>
          <Plate
            no="03"
            ratio="3x2"
            style={{ marginTop: 36 }}
            image="plate-03-market"
            alt="A showroom table during a buying appointment, seen from overhead: overlapping lookbook pages, a ring of fabric swatches, a spiral pad and a coffee cup."
            sizes="(min-width: 900px) 870px, 92vw"
            brief="Editorial photo — a market appointment in progress: linesheets, swatch cards and a marked-up order pad on a showroom table. Overhead, hard light, no faces."
          />
        </Sec>

        {/* ═══ 08 · WORKFLOWS ══════════════════════════════════════════════ */}
        <Sec id="workflows" num="08" run="The suite" head="Six workflows, one planning rhythm.">
          <div className="workflows">
            {SKILLS.map((skill, i) => (
              <div className="wf" key={skill.title}>
                <span className="n">{String(i + 1).padStart(2, "0")}</span>
                <h3>{skill.title}</h3>
                <p>{skill.body}</p>
              </div>
            ))}
          </div>
          <blockquote className="pullquote">
            <p>
              Every recommendation is sized in dollars. Not <em>&ldquo;cancel some POs&rdquo;</em> —{" "}
              <em>&ldquo;cancel ~$8K of October commitments on Dresses.&rdquo;</em>
            </p>
          </blockquote>
        </Sec>

        {/* ═══ 09 · PRICING ════════════════════════════════════════════════
            The Claude subscription is disclosed here, above the CTA. A surprise
            second subscription found at signup is a trust problem you do not
            recover from. */}
        <Sec id="pricing" num="09" run="Terms" head="$299 a month. Cancel any time.">
          <div className="price-head">
            <p className="fig">
              <span className="cur">$</span>299
            </p>
            <span className="per">a month</span>
          </div>

          <table className="terms-table">
            <tbody>
              {PRICING_ROWS.map((row) => (
                <tr key={row.label}>
                  <th>{row.label}</th>
                  <td>{row.label === "Price" ? <strong>{row.value}</strong> : row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <ul className="supporting">
            {PRICING_SUPPORTING.map((item) => (
              <li key={item.lead}>
                <b>{item.lead}</b> {item.body}
              </li>
            ))}
          </ul>

          <div className="disclose">
            <span className="label">Before you book — one more line item</span>
            <p>
              <b>You'll also need a Claude subscription.</b> The suite runs inside Claude, so
              that's billed to you by Anthropic, separate from this. Claude Pro at $20/month covers
              it, and it's yours to use for everything else too.
            </p>
          </div>

          {ctaRow("after-pricing")}
        </Sec>

        {/* ═══ 10 · WHAT THIS ISN'T ════════════════════════════════════════ */}
        <Sec id="isnt" num="10" run="Plainly" head="What this isn't.">
          <div className="isnt">
            {WHAT_THIS_ISNT.map((item) => (
              <div className="isnt-item" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            ))}
          </div>
        </Sec>

        {/* ═══ 11 · FAQ ════════════════════════════════════════════════════ */}
        <Sec id="faq" num="11" run="Questions" head="The rest of it.">
          <div className="faq">
            {FAQ.map((item, i) => (
              <details key={item.q} open={i === 0}>
                <summary>
                  <span className="qn">{String(i + 1).padStart(2, "0")}</span>
                  <span className="q">{item.q}</span>
                  <span className="mk">+</span>
                </summary>
                <p className="a">{item.a}</p>
              </details>
            ))}
          </div>
        </Sec>

        {/* ═══ 12 · CLOSE ══════════════════════════════════════════════════
            Closes on her buying calendar, not on scarcity. She is heading to
            market at a fixed time whether she books or not. */}
        <section className="sec ruled final" id="book">
          <div className="wrap">
            <div className="grid">
              <Rail num="12" run="Go with a plan" />
              <div>
                <p className="close">
                  Your next market is already on the calendar. <em>Go with a plan.</em>
                </p>
                {ctaRow("final")}
                <Plate
                  no="04"
                  ratio="4x5"
                  style={{ marginTop: 40 }}
                  brief="Editorial photo — a printed plan on the counter after close, marked up in pen beside a coffee cup and a stack of packing slips. Hands only. Low, warm light."
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="foot">
        <div className="wrap foot-in">
          <div>
            <Link href="/" className="logo">
              SW<i>i</i>M
            </Link>
            <p className="meta" style={{ margin: "12px 0 0" }}>
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              <Link href="/privacy-policy">Privacy policy</Link>
              <Link href="/terms-of-service">Terms of service</Link>
            </p>
          </div>
            {/* The page names ten companies and shows their marks. None of
                them has endorsed anything, and the notice says so where a
                reader would look for it. */}
            <p className="colophon">
              The Retail Planning Suite. Set in Literata and Archivo. Figures throughout are
              illustrative. Google Workspace, Gmail, Google Drive and Google Calendar are
              trademarks of Google LLC; Microsoft 365, Outlook and Excel are trademarks of
              Microsoft Corporation; all other product names and logos are trademarks of their
              respective owners. SWiM is not affiliated with, endorsed by, or sponsored by any
              of them.
            </p>
        </div>
      </footer>

      <div className={`sticky${stuck ? " up" : ""}`} aria-hidden={!stuck}>
        <BookDemoButton placement="sticky-bar" stickyLabel />
      </div>
    </div>
  );
};

export default RetailPlanningSuite;
