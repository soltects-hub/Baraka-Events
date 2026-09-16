// One-off: emit a 640px-wide variant of every gallery photo wider than 720px,
// alongside the original, as `<name>-640.webp`. The drum renders the centre
// panel at ~576px on a DPR-1 desktop, so the 1200px originals were decoding
// ~4x more pixels than displayed — and at ~5.7MB per decoded frame they
// churned Chrome's decoded-image cache on every filter change. Same WebP
// settings as the rest of public/media (quality 80, effort 6). Re-run after
// adding gallery photos: `node scripts/generate-gallery-variants.mjs`.
import { readdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const dir = path.resolve('public/media/gallery');
const files = readdirSync(dir).filter((f) => /\.webp$/i.test(f) && !/-640\.webp$/i.test(f));
let made = 0, skipped = 0;
for (const f of files) {
  const src = path.join(dir, f);
  const out = path.join(dir, f.replace(/\.webp$/i, '-640.webp'));
  const meta = await sharp(src).metadata();
  if (!meta.width || meta.width <= 720) { skipped++; continue; }
  if (existsSync(out)) { skipped++; continue; }
  await sharp(src).resize({ width: 640, withoutEnlargement: true }).webp({ quality: 80, effort: 6 }).toFile(out);
  made++;
}
console.log(`gallery variants: ${made} written, ${skipped} skipped (already present or ≤720px wide)`);
