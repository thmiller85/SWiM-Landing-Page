#!/usr/bin/env node
/**
 * Prepares the SWiM mark for the Retail Planning Suite page.
 *
 * The page is paper stock (#DCDAD1), and the site's usual logo
 * (swim-logo-transparent.png) cannot go on it: the wave is brand blue but the
 * wordmark is white, so the name disappears against the paper and only the
 * wave survives. swim-logo-navy.png solves that by carrying its own navy
 * ground — it reads as a printed badge on any surface.
 *
 * All this does is resize it for the web. The source is a 1024x1024 PNG at
 * ~820KB, which is roughly thirty times more pixels than the page ever shows.
 *
 * Rerun after the brand logo changes: `node scripts/build-editorial-logo.mjs`
 */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const SRC = path.resolve('client/src/assets/swim-logo-navy.png');
const OUT = path.resolve('client/src/assets/retail/swim-badge.png');

// Largest use on the page is the masthead at 60px, so this covers a 3x display
// with a little headroom. The badge is square and carries its own generous
// internal padding, so there is nothing to trim.
const SIZE = 216;

const { width, height } = await sharp(SRC).metadata();
if (width !== height) {
  console.warn(`⚠ source is ${width}x${height}, not square — the page sizes the badge by height and assumes 1:1`);
}

await sharp(SRC).resize(SIZE, SIZE).png({ compressionLevel: 9 }).toFile(OUT);

const before = (fs.statSync(SRC).size / 1024).toFixed(0);
const after = (fs.statSync(OUT).size / 1024).toFixed(0);
console.log(`✓ swim-badge.png  ${SIZE}x${SIZE}  ${before}KB → ${after}KB`);
