# Connector brand marks

Drop official brand SVGs here to complete the connector row in the Retail
Planning Suite landing page (§4.2 of the build brief). They are picked up
automatically — no code change is needed.

## Filenames

The filename must match the connector's `mark` key exactly:

| File | Brand |
|---|---|
| `lightspeed.svg` | Lightspeed |
| `clover.svg` | Clover |
| `heartland.svg` | Heartland |
| `microsoft365.svg` | Microsoft 365 |

A brand with no file here falls back to a wordmark set in the page's own type,
so a missing or misnamed file degrades quietly rather than breaking the row.

## Which variant to supply

The row sits on a dark navy ground (`#00111F`). Supply the variant each brand
publishes **for use on dark backgrounds** — usually labelled "reverse", "white",
or "on dark" in their brand kit.

This matters: a mark drawn in near-black is invisible here. Square and Notion hit
exactly this problem and are rendered in their prescribed reversed white form for
that reason. If a brand only publishes one full-colour mark, check it still reads
against the navy before committing it.

These files are rendered as-is, so whatever colour is in the file is what ships.

### Reversed on arrival

The four files here arrived as light-background lockups, so their dark text was
reversed to white to survive the navy. Measured against `#00111F`:

| Brand | Was | Contrast | Now |
|---|---|---|---|
| Lightspeed | `#040707` | 1.06 — invisible | `#FFFFFF` |
| Clover | `#5A5A5A` | 2.77 — dim | `#FFFFFF` |
| Microsoft 365 | `#737373` | 4.03 — legible | `#FFFFFF` |
| Heartland | `#BB2530` | 3.11 — passes | unchanged |

Only near-neutral text was reversed; no brand colour was altered — Lightspeed's
red flame, Clover's green leaves, the Microsoft squares and Heartland's red are
all untouched. This reproduces the reverse/on-dark variant each of these brands
publishes. If you have their official reverse artwork, prefer it and overwrite
these outright.

## Lockups vs. logomarks

Artwork containing the brand name needs `lockup: true` on its entry in
`STACK_CONNECTORS`, which suppresses the caption underneath — otherwise the name
prints twice. All four files here are lockups. A bare logomark (the Shopify bag,
the Square glyph) keeps its caption.

## Sizing

Any viewBox works — each mark is scaled to a 28px (mobile) / 32px (desktop) box
and centred. Square-ish artwork sits best next to the existing marks; a very wide
wordmark will render small to fit the box, so prefer the logomark over a full
horizontal lockup where a brand offers both.

## Before publish

The brief's §4.2 trademark check applies to anything added here. These are used
to state factual "works with" compatibility, which is what each company's brand
guidelines permit. Nothing may imply partnership, endorsement, or certification —
no badge treatments, no "official" or "certified" wording, and no single mark
shown larger than its neighbours.


## Checking a new file

Run `python3 scripts/validate-connector-marks.py` from the repo root. It reports
each file's dimensions and aspect ratio and flags the failure modes below. All
of them render as something plausible rather than as an error, which is why
they cost several rounds to find by eye.

## What makes an export unusable

Three real failures hit this folder, all of them silent — the page renders, the
mark just looks wrong. Check an export against these before committing it.

**A placed raster.** An SVG whose body is `<image xlink:href="something.png">`
is a wrapper, not a vector. It cannot work here even with the PNG alongside it:
an SVG loaded through `<img>` is sandboxed and cannot fetch subresources.
Export outlines, not a linked bitmap.

**A baked white background.** Auto-traces often emit a full-canvas white shape —
`d="M0,0h1920v1050H0V0Z…"` — with the letter counters as subpaths of that same
compound path, so the mark renders as a white box on the stock and the
background cannot be removed without taking the counters with it. Near-white
fills scattered through the file (`#fffdfd`, `#fefeff`, `#fffffe`) are the
giveaway. Ask for the vendor's real vector rather than a trace of a screenshot.

**A viewBox with no width/height.** That gives the file a ratio but no intrinsic
size, and in a flex row with auto dimensions it resolves to zero — the mark
disappears while still taking up space. Five files arrived this way; their sizes
are now declared. The row also sets a definite height as a backstop.

Also worth checking: that the artwork fills its canvas rather than sitting in
a wide empty margin, and that it is the product lockup you meant — a file
reading "Google" is not "Google Workspace".

**A corporate mark standing in for a service.** Google's and Microsoft's
guidance is that the mark used must identify the particular product an
integration touches — so Google Workspace and Microsoft 365 are shown by their
product marks (Gmail, Drive, Calendar; Outlook, Excel) grouped as one row
entry, not by the Google "G" or a corporate lockup. Marks are shown at the same
scale as their neighbours, never larger, and the row carries a trademark and
non-affiliation notice underneath.
