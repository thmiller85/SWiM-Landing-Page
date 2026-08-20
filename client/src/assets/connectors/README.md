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
