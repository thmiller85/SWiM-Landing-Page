#!/usr/bin/env node
/**
 * Builds the web derivatives for the landing page's photographic plates.
 *
 * Sources live in design/plates/ as full-size PNGs straight from the
 * generator; they are never served. This crops each to its final ratio and
 * writes AVIF, WebP and JPEG at the widths the page actually renders, into
 * client/src/assets/retail/ where Vite fingerprints and bundles them.
 *
 * Rerun after replacing a source: `node scripts/build-plate-derivatives.mjs`
 *
 * Widths are capped at each source's native width — upscaling only adds bytes.
 * Measured render widths: hero plate peaks at 724px (tablet), vendor plate at
 * 870px (desktop), so these cover 1x everywhere and 2x on phones.
 */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const SRC = path.resolve('design/plates');
const OUT = path.resolve('client/src/assets/retail');

/**
 * `crop` is the top offset needed to reach the target ratio; sources that
 * already arrive at the right ratio use 0. Trimming from the top in both
 * cases: it is the emptiest part of each frame.
 */
/**
 * `enabled: false` keeps a source in the list without emitting it. The page's
 * asset glob is eager, so anything sitting in the output directory ends up in
 * the bundle whether or not the page references it — an unused alternate take
 * would ship to every visitor for nothing. Flip the flag and rerun to switch.
 *
 * The 800px step exists because the plates render at 92vw below the 900px
 * breakpoint: a 428px phone at 2x asks for ~788px, and without it the browser
 * jumps to the 1024 file.
 */
const PLATES = [
  { src: 'plate-01-shop-floor-a.png', out: 'plate-01-shop-floor', ratio: 4 / 5, crop: 'top', widths: [400, 800, 1024], enabled: true },
  { src: 'plate-01-shop-floor-b.png', out: 'plate-01-shop-floor-alt', ratio: 4 / 5, crop: 'top', widths: [400, 800, 1024], enabled: false },
  { src: 'plate-03-market-appointment.png', out: 'plate-03-market', ratio: 3 / 2, crop: 'top', widths: [500, 900, 1448], enabled: true },
  { src: 'plate-04-after-close.png', out: 'plate-04-after-close', ratio: 4 / 5, crop: 'top', widths: [400, 800, 1024], enabled: true },
];

fs.mkdirSync(OUT, { recursive: true });

for (const plate of PLATES) {
  if (plate.enabled === false) {
    console.log(`· held  ${plate.out} (enabled: false — reserve take, not bundled)`);
    continue;
  }

  const file = path.join(SRC, plate.src);
  if (!fs.existsSync(file)) {
    console.log(`· skipped ${plate.src} (not in design/plates yet)`);
    continue;
  }

  const meta = await sharp(file).metadata();
  // Fit the target ratio inside the source without ever upscaling: keep the
  // full width and trim height, or keep the full height and trim width.
  let w = meta.width;
  let h = Math.round(w / plate.ratio);
  if (h > meta.height) {
    h = meta.height;
    w = Math.round(h * plate.ratio);
  }
  const top = plate.crop === 'top' ? meta.height - h : Math.round((meta.height - h) / 2);
  const left = Math.round((meta.width - w) / 2);

  const base = sharp(file).extract({ left, top, width: w, height: h });
  const widths = plate.widths.filter((x) => x <= w);
  if (!widths.includes(w) && widths[widths.length - 1] !== w) widths.push(w);

  for (const width of widths) {
    const resized = base.clone().resize(width);
    const stem = path.join(OUT, `${plate.out}-${width}`);
    await resized.clone().avif({ quality: 58 }).toFile(`${stem}.avif`);
    await resized.clone().webp({ quality: 78 }).toFile(`${stem}.webp`);
    await resized.clone().jpeg({ quality: 80, mozjpeg: true }).toFile(`${stem}.jpg`);
  }

  const bytes = widths.reduce(
    (sum, width) => sum + fs.statSync(path.join(OUT, `${plate.out}-${width}.avif`)).size, 0);
  console.log(
    `✓ ${plate.out}  ${meta.width}×${meta.height} → ${w}×${h}  ` +
    `[${widths.join(', ')}]  avif total ${(bytes / 1024).toFixed(0)}KB`);
}
