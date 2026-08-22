import type { ConnectorMarkKey } from "@/components/retail/ConnectorMark";

// Section copy for the Retail Planning Suite landing page.
//
// Held apart from the markup so wording can be reviewed and edited without
// reading JSX. The build brief governs this copy and several rules are load
// bearing rather than stylistic — the ones worth knowing before editing:
//
//   - "keep more of what you make" survives verbatim wherever it appears; it is
//     the owner's language, where "cash flow" and "margin retention" are an
//     accountant's.
//   - Lead with the moment and the outcome, never the category name. The page
//     has to be fully legible to someone who has never heard "open-to-buy".
//   - AI is not the headline. It is the answer to "why is this $299 and not
//     $2,000", so it is held for the FAQ.
//   - No customer claims, no outcome numbers, no scarcity, no discounted price,
//     no trial/beta language, and no competitor named anywhere.

export interface HeroVariant {
  /** Query-string value that selects this variant, e.g. ?v=b */
  key: string;
  h1: string;
  /** One line only — this is what has to fit above the fold at 390x844. */
  sub: string;
  /** The rest of the sub, rendered immediately below the fold. */
  subContinued: string;
}

// Three headlines for ad testing. Each should be paired with matching ad
// creative — Meta scores the match between the ad headline and the landing
// page, and a mismatch raises cost per result.
//
// A leads. It names a moment she has personally lived, in her own numbers, and
// does the job of putting the outcome before the capability.
export const HERO_VARIANTS: HeroVariant[] = [
  {
    key: "a",
    h1: "You commit six figures to next season on a spreadsheet and a hunch.",
    sub: "The Retail Planning Suite builds your open-to-buy from your own sales history.",
    subContinued:
      "What to spend, which brands get it, and when to mark down. Plain English in, Excel out. Buy better, mark down less, keep more of what you make.",
  },
  {
    // Proven and warmer. This is the headline from the printed collateral and it
    // tests well after a conversation; for cold traffic it asks the reader to
    // decode a metaphor, so it is the second test rather than the first.
    key: "b",
    h1: "The planning desk your store never had.",
    sub: "It reads your own sales history and builds the buy.",
    subContinued:
      "What to spend, which brands get it, and when to mark down. Plain English in, Excel out. Buy better, mark down less, keep more of what you make.",
  },
  {
    // Fear, and the sharpest of the three.
    key: "c",
    h1: "You'll find out in March whether the fall buy was right.",
    sub: "That's four months too late. This tells you in August.",
    subContinued:
      "The Retail Planning Suite builds your open-to-buy from your own sales history — what to spend, which brands get it, and when to mark down. Buy better, mark down less, keep more of what you make.",
  },
];

export const HERO_EYEBROW = "For independent boutiques · $1M–$25M";

// Section 2 — runs on Claude, works with your stack.
//
// She has spent years being told her POS isn't supported, so this section's job
// is a fast yes: she should find her own system in about a second. That is why
// these are logos rather than a text list — a mark is recognised pre-attentively,
// a word has to be read — and why they sit in one equal row rather than in
// tiers. The earlier tiered layout put Lightspeed, Square, Clover and Heartland
// under a heading that read as a caveat, which quietly told a large share of
// independent apparel retail that they were second-class.
//
// The honesty the tiers were carrying does not disappear; it moves into one
// plain sentence under the row, where it informs without demoting.
//
// Claude is set apart above the row. It is the most recognisable name here and
// it does three jobs at once: it explains how this is affordable without making
// AI the headline, it borrows real credibility, and it discloses the Claude
// requirement early rather than springing it at signup.
//
// Trademark note: "runs inside Claude" and "works with" are factual
// compatibility statements, and neutral monochrome marks in a single row are the
// conservative reading of every one of these companies' brand guidelines.
// Nothing here may imply that any of them built, endorses, certifies or partners
// on this.
export interface StackConnector {
  name: string;
  /** Omit to render as a wordmark — see the note in ConnectorMark.tsx. */
  mark?: ConnectorMarkKey;
  /**
   * Several product marks shown together as one entry, for a suite whose
   * corporate mark must not stand in for the individual services. Kept to one
   * row entry rather than one per product: this row exists so a boutique owner
   * finds her point of sale in about a second, and three Google tiles would
   * outweigh Shopify and Lightspeed, which are the marks that actually carry
   * that job.
   */
  marks?: ConnectorMarkKey[];
  /**
   * True when the artwork is a full lockup that already contains the brand
   * name, so captioning it would print the name twice. Bare logomarks — the
   * Shopify bag, the Square glyph — still need their caption.
   */
  lockup?: boolean;
}

export const STACK_CONNECTORS: StackConnector[] = [
  { name: "Shopify", mark: "shopify", lockup: true },
  { name: "Lightspeed", mark: "lightspeed", lockup: true },
  { name: "Square", mark: "square", lockup: true },
  { name: "Clover", mark: "clover", lockup: true },
  { name: "Heartland", mark: "heartland", lockup: true },
  { name: "QuickBooks", mark: "quickbooks", lockup: true },
  { name: "Microsoft 365", marks: ["outlook", "excel"] },
  { name: "Google Workspace", marks: ["gmail", "drive", "calendar"] },
  { name: "Notion", mark: "notion", lockup: true },
  { name: "Stripe", mark: "stripe", lockup: true },
];

// The caveat the tiers used to carry, in one line.
// Seven of the ten connect through Claude's own connectors — Shopify, Square,
// QuickBooks, Notion, Stripe, Microsoft 365 and Google Workspace. Only
// Lightspeed, Clover and Heartland need an export. Naming the three exceptions
// rather than the seven is deliberate: the exception is the information she
// needs, and the row above already lists everything supported.
//
// The connectors are Claude's, not ours, and the sentence says so — SWiM does
// not hold an integration with any of these companies.
export const STACK_CAVEAT =
  "Most of these connect through Claude's own connectors, once you authorise them. Lightspeed, Clover and Heartland read a standard export instead. Either way we wire it up with you on setup, and if yours isn't here we'll tell you straight on the call.";

// Shown under the connector row. Names the marks as their owners' and denies
// the affiliation the row could otherwise be read as implying.
export const STACK_TRADEMARK_NOTE =
  "Product names and logos are trademarks of their respective owners. SWiM is not affiliated with, endorsed by, or sponsored by any of them, and the marks here identify the services the suite works with, nothing more.";

// Section 4 — how it works.
export const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Connect what you have",
    body: "Shopify, Square, QuickBooks, your email and your drive connect through Claude's own connectors, once you authorise them. Lightspeed, Clover and Heartland work from a standard export. The accounting and email side is what adds margin and vendor detail. We do this part with you on a screen share.",
  },
  {
    step: "2",
    title: "Ask in plain English",
    body: "It routes the question, confirms scope, and tells you what it's about to do before it pulls a single number.",
    examples: [
      "Build my fall open-to-buy.",
      "How is Q2 tracking?",
      "Split my dress budget across vendors.",
    ],
  },
  {
    step: "3",
    title: "Get working files",
    body: "Excel workbooks with live formulas. A plain-English summary of assumptions and risks. A one-page review every month. Your files, in your folder — not screenshots in someone else's portal.",
  },
];

// Section 7 — the brands row.
//
// Deliberately mixed. The market lines (Entro, Blu Pepper, Olivaceous, By
// Together, Judy Blue) are the credibility signal: a boutique owner reads those
// and knows we have walked a market. The contemporary lines keep the row
// scannable to everyone else.
//
// Set as TEXT, never logos. Text reads as "we know your floor"; a grid of real
// brand logos reads as a partner wall, invites an endorsement question none of
// these companies have agreed to, and drags twelve separate trademark
// guidelines into the build. These names may only ever appear in this neutral
// context — never labelled overbought, slow, trapped, cut or marked down.
export const BRANDS = [
  "Z Supply",
  "Free People",
  "Rails",
  "Citizens of Humanity",
  "Mother",
  "Entro",
  "Blu Pepper",
  "Olivaceous",
  "Show Me Your Mumu",
  "Judy Blue",
  "By Together",
  "Veronica Beard",
];

// Section 8 — the six skills.
export const SKILLS = [
  {
    title: "Open-to-Buy Plans",
    body: "A season, quarter, or rolling-12 buying budget from your actual sales history — with negative OTB and big assumptions called out, not buried.",
  },
  {
    title: "Vendor Allocation",
    body: "Split category dollars across your brands by their real record in your store — margin, sell-through, GMROI — with order timing by lead time.",
  },
  {
    title: "Markdown Cadence",
    body: "First-markdown timing and depth, week by week, built to hit your sell-through target without giving margin away early.",
  },
  {
    title: "Mid-Season Variance",
    body: "How the plan is actually tracking — and the moves the gaps call for: chase what's hot, slow what's not, each sized in dollars.",
  },
  {
    title: "Business Review",
    body: "A weekly pulse and a monthly deep-dive that end in two or three moves worth making. It remembers every flag, so nothing slips between reviews.",
  },
  {
    title: "Business Profile",
    body: "A few minutes of setup becomes the profile every other workflow reads — your calendar, categories, and goals.",
  },
];

// Section 9 — pricing. One price, no tiers, no toggle, no "contact us".
export const PRICING_ROWS = [
  { label: "Price", value: "$299 / month" },
  { label: "Terms", value: "Month to month · no contract · no minimum · no cancellation fee" },
  { label: "Setup", value: "Included. We do it with you." },
  {
    label: "Everything included",
    value: "All six workflows, every store, every vendor, every update.",
  },
];

export const PRICING_SUPPORTING = [
  {
    lead: "Nothing to install alone.",
    body: "We set it up with you: connectors, your profile, your first plan. Included.",
  },
  {
    lead: "Every workflow we add while you're subscribed is included.",
    body: "The suite grows, your price doesn't.",
  },
  {
    lead: "Cancel from the link on your receipt.",
    body: "No contract, no minimum term, no cancellation fee.",
  },
];

// Section 10 — what this isn't. Pre-empts the four biggest objections.
export const WHAT_THIS_ISNT = [
  {
    title: "Not consulting.",
    body: "It builds the plan and shows its work. The buying decisions stay yours.",
  },
  {
    title: "Not a dashboard.",
    body: "Nothing new to log into, no report builder to learn, no portal holding your numbers.",
  },
  {
    title: "Not billed per brand.",
    body: "Five vendors or fifty, same question asked once — and the same $299.",
  },
  {
    title: "Not a trial.",
    body: "It's the full suite from day one.",
  },
];

// Section 11 — FAQ.
//
// Note what is deliberately absent: the honest answer on a live call to "what's
// the catch" is "you're early — you'll hit rough edges". That is the right thing
// to say to someone you are talking to, and unprompted anti-proof on a public
// page. Never volunteer immaturity to cold traffic.
export const FAQ = [
  {
    q: "Isn't this just ChatGPT?",
    a: "You could ask ChatGPT for an open-to-buy and get something that looks right. Four differences. The retail math is built in — the OTB equation, GMROI, sell-through, a 4-5-4 calendar. It reads your actual sales history instead of guessing. You get an Excel file with live formulas, not a wall of text. And it tells you which numbers came from your data and which are benchmarks it fell back on. A general chatbot will never volunteer that it wasn't sure.",
  },
  {
    q: "What if the numbers are wrong?",
    a: "Every figure is tagged H or L, and you can see which is which right in the workbook. Everything comes out as Excel with live formulas, so you can trace any number back to what built it. It's deliberately not a black box — you shouldn't commit six figures to something you can't check.",
  },
  {
    q: "My data's a mess.",
    a: "Everyone's is, and it's the first place this pays for itself. Missing categories and missing costs are the two most common gaps, and they quietly understate your margin. It finds them, tells you plainly what's broken, and plans around them using whatever is clean. You see the data problems before you see a plan.",
  },
  {
    q: "My rep already builds my plan.",
    a: "And they're good at it — at selling their line. That's their job, not a knock. What they can't do is look across all sixty of your brands at once and tell you which three you should be pulling back from. It also asks what share you're willing to put with any one vendor. No rep is going to raise that question.",
  },
  {
    q: "What does it cost to run, really?",
    a: "$299 a month here, plus a Claude subscription billed by Anthropic — Claude Pro at $20/month covers it. No setup fee, no per-brand fee, no per-seat fee.",
  },
  {
    q: "I've worked with a planning consultant before.",
    a: "Then you already know what a real plan is worth, and what it costs. This covers the same ground on the numbers — the buying budget, the vendor split, the markdown calendar, the mid-season check — without an hourly rate and without the work walking out the door when the engagement ends. You keep the files, and you can run it again next season without booking anyone.",
  },
  {
    q: "Why is it $299 when a planner costs thousands?",
    a: "Because AI does the analysis a planner would bill you for. You're paying for the retail math and the output files, not for someone's hours. It isn't a stripped-down version of something bigger — it's the whole suite.",
  },
  {
    q: "How hard is setup?",
    a: "About forty-five minutes on a screen share. There's some plumbing to get it onto your machine — we drive that, you click approve a couple of times. Then we connect your POS, build your profile, and you have your first plan the same week.",
  },
  {
    q: "What happens to my data?",
    a: "It goes from your point of sale into Claude and comes back as files on your own computer. There's no SWiM portal and no SWiM database holding your numbers.",
  },
  {
    q: "$299 seems low for what it does. What's the catch?",
    a: "No catch, and no contract protecting us from you finding one. It's month to month — if it isn't earning its place, you cancel from the link on your receipt. The price is what it is because AI does the analysis, not because this is a lighter version of something bigger.",
  },
];
