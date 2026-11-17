/**
 * Checks the prerendered pages in dist/ after `npm run build`.
 *
 * Guards the Phase 1 performance fixes (Nov 2026) against silent regressions:
 * - the Google Fonts stylesheet must stay non-blocking (media="print" plus the onload swap); a snapshot that
 *   saved media="all" made every page wait for Google Fonts before its first paint;
 * - every page keeps exactly one <h1> and a canonical link, which the prerender exists to serve.
 *
 * Run: npm run verify:prerender
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = join(process.cwd(), 'dist');

function htmlFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return name === 'assets' ? [] : htmlFiles(p);
    return name.endsWith('.html') ? [p] : [];
  });
}

// 404.html and the bare index shell are not prerendered routes.
const SKIP = new Set(['404.html']);
const errors: string[] = [];
let checked = 0;

for (const file of htmlFiles(DIST)) {
  const name = relative(DIST, file);
  if (SKIP.has(name)) continue;
  const html = readFileSync(file, 'utf8');
  if (!html.includes('id="root"><')) continue; // not prerendered (empty shell)
  checked++;

  // the <noscript> fallback link is meant to load normally (it only applies with JavaScript off)
  const fontLinks = html.replace(/<noscript>[\s\S]*?<\/noscript>/g, '').match(/<link[^>]*rel="stylesheet"[^>]*fonts\.googleapis\.com[^>]*>/g) ?? [];
  for (const link of fontLinks) {
    if (!/media="print"/.test(link)) errors.push(`${name}: Google Fonts stylesheet is render-blocking (${link.match(/media="[^"]*"/)?.[0] ?? 'no media'})`);
  }

  const h1s = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1s !== 1) errors.push(`${name}: expected 1 <h1>, found ${h1s}`);

  if (!/<link[^>]*rel="canonical"[^>]*href="https:\/\/www\.barakaevents\.com/.test(html)) errors.push(`${name}: missing canonical link`);
}

if (checked === 0) errors.push('no prerendered pages found in dist/ (run npm run build first)');

if (errors.length) {
  console.error(`Prerender check failed with ${errors.length} problem(s):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(`Prerender check passed: ${checked} pages, non-blocking fonts, one <h1> and a canonical link each.`);
