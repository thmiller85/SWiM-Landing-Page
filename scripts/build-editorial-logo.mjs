#!/usr/bin/env node
/**
 * Builds the single-ink SWiM mark used on the Retail Planning Suite page.
 *
 * The shipped logo (client/src/assets/swim-logo-transparent.png) is drawn for
 * the navy site: the wave is brand blue but the wordmark is white (#F8FAFB),
 * so on that page's #DCDAD1 paper stock the name disappears entirely and only
 * the wave survives. That page is also a strict two-ink system — ink and
 * oxblood — where a cyan would read as a third ink fighting the CTA.
 *
 * So the mark is printed in one ink, the way it would be on an actual
 * linesheet. The artwork is unchanged: this fills the logo's own alpha channel
 * with a flat colour, which keeps every curve and counter exactly as drawn.
 *
 * Deliberately not `filter: brightness(0)` in CSS. A filter maps colours, so it
 * would drag the white glow behind the wordmark down to grey along with
 * everything else and print it as a halo. Using alpha as a stencil takes the
 * shape without the shading.
 *
 * Rerun after the brand logo changes: `node scripts/build-editorial-logo.mjs`
 */
import sharp from 'sharp';
import path from 'path';

const SRC = path.resolve('client/src/assets/swim-logo-transparent.png');
const OUT = path.resolve('client/src/assets/retail');

// The source is a 1024x1024 canvas that is 59% empty. These are the bounds of
// its opaque pixels — trimming them is what lets the mark be positioned by its
// own edges rather than by invisible padding.
const CONTENT = { left: 78, top: 179, width: 866, height: 630 };

// Tall enough for a 3x display at the largest use on the page (the masthead,
// at 34px), with headroom.
const HEIGHT = 300;

const INKS = {
  'swim-ink': '#141518',
  // Built alongside it so switching the mark to the page's second ink is a
  // one-line change rather than another round trip through this script.
  'swim-ox': '#6B1F2A',
};

const trimmed = await sharp(SRC).extract(CONTENT).toBuffer();
const alpha = await sharp(trimmed)
  .extractChannel('alpha')
  .resize(null, HEIGHT)
  .toBuffer();
const { width, height } = await sharp(alpha).metadata();

for (const [name, hex] of Object.entries(INKS)) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  await sharp({ create: { width, height, channels: 3, background: { r, g, b } } })
    .joinChannel(alpha)
    .png({ compressionLevel: 9, palette: true })
    .toFile(path.join(OUT, `${name}.png`));
  console.log(`✓ ${name}.png  ${width}x${height}  ${hex}`);
}
