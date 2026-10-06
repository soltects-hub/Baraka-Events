/**
 * Defensive CI check: parses the built sitemap.xml and asserts every URL is
 * a real, current route (a static page, blog index, an existing post or
 * service slug, or a published venue/vendor listing) — never a legacy/spam
 * URL, a query string, or a duplicate. This
 * matters more once the content pipeline can add new posts automatically:
 * this is the guardrail that stops a bad post entry from ever reaching the
 * public sitemap undetected.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { posts } from '../../src/lib/posts';
import { services } from '../../src/lib/services';
import { publishedVenues } from '../../src/lib/venues';
import { vendors } from '../../src/lib/vendors';
import { seoConfig, routes } from '../../src/seo';

const sitemapPath = resolve(process.cwd(), 'dist/sitemap.xml');
const xml = readFileSync(sitemapPath, 'utf8');

const locs = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);

const staticRoutes = [
  routes.home,
  routes.about,
  routes.experiences,
  routes.portfolio,
  routes.gallery,
  routes.team,
  routes.contact,
  routes.blog,
  routes.services,
];

// Mirrors scripts/generate-sitemap.ts: the /venues and /vendors index pages and
// their detail pages are in the sitemap once real, verified listings exist.
// This verifier has to know about them — without that, every venue the
// directory publishes is reported as an "unknown route", the check fails on a
// healthy sitemap, and the daily Search Console report PR is never opened.
const directoryRoutes = [
  ...(publishedVenues.length > 0 ? [routes.venues] : []),
  ...publishedVenues.map((v) => routes.venuePage(v.slug)),
  ...(vendors.length > 0 ? [routes.vendors] : []),
  ...vendors.map((v) => routes.vendorPage(v.slug)),
];

const expected = new Set<string>([
  ...staticRoutes.map((r) => `${seoConfig.site.url}${r}`),
  ...directoryRoutes.map((r) => `${seoConfig.site.url}${r}`),
  ...posts.map((p) => `${seoConfig.site.url}${routes.blogPost(p.slug)}`),
  ...services.map((s) => `${seoConfig.site.url}${routes.servicePage(s.slug)}`),
]);

const errors: string[] = [];

if (locs.length === 0) {
  errors.push('Sitemap contains zero <loc> entries.');
}

const seen = new Set<string>();
for (const loc of locs) {
  if (seen.has(loc)) {
    errors.push(`Duplicate URL in sitemap: ${loc}`);
  }
  seen.add(loc);

  if (!loc.startsWith(seoConfig.site.url)) {
    errors.push(`URL does not use the production origin ${seoConfig.site.url}: ${loc}`);
  }
  if (loc.includes('?') || loc.includes('#')) {
    errors.push(`URL contains a query string or fragment (not allowed in sitemap): ${loc}`);
  }
  if (!expected.has(loc)) {
    errors.push(`URL is not a known current route (a static page, /blog, a real post or service slug, or a published venue/vendor): ${loc}`);
  }
}

for (const url of expected) {
  if (!seen.has(url)) {
    errors.push(`Expected current route missing from sitemap: ${url}`);
  }
}

if (errors.length > 0) {
  console.error(`sitemap.xml verification failed with ${errors.length} problem(s):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exitCode = 1;
} else {
  console.log(`sitemap.xml verified: ${locs.length} URLs, all current and valid, no duplicates.`);
}
