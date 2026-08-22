# Plate originals — Retail Planning Suite

Raw, full-size generations for the photographic plates on
`/retail/planning-suite`. **Originals only** — uncropped and uncompressed.

These are deliberately outside `client/`. Anything under `client/src` gets
swept up by Vite's asset globs and Tailwind's content scan; anything under
`client/public` is copied verbatim into the build and served on the public
web, which is not where a 3 MB uncropped source belongs. Keeping the
originals in the repo means a crop can be redone later without regenerating.

The build never reads this directory. Cropped, optimised derivatives are
generated from these into `client/src/assets/retail/` (page plates) and
`client/public/` (the share card).

## Filenames

| File                             | Plate | Final ratio | Where it appears           |
|----------------------------------|-------|-------------|----------------------------|
| `plate-01-shop-floor-a.png`      | 01    | 4:5         | Hero, beside the headline  |
| `plate-01-shop-floor-b.png`      | 01    | 4:5         | Alternate take, no figure  |
| `plate-03-market-appointment.png`| 03    | 3:2         | Vendor section             |
| `plate-04-after-close.png`       | 04    | 4:5         | Final section, under CTA   |
| `share-card.png`                 | —     | 1.91:1      | og:image / link preview    |

Plate 02 is a screen recording of the workbook, not a generated image. It
lands in `client/public/assets/` alongside the other video, where the
existing `.mp4` assets live.

Drop several takes of the same plate in as `-1`, `-2`, `-3` if it's useful to
compare them; only the selected take gets a derivative built from it.
