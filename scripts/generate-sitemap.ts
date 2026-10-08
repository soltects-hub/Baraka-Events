/**
 * Build-time sitemap generator.
 * Derives every indexable URL from the same route/data sources the app renders
 * from (src/seo/seoConfig.ts routes + src/lib/posts.ts), so the sitemap never
 * drifts out of sync with what actually exists on the site.
 *
 * Run via `npm run sitemap`, or automatically as part of `npm run build`.
 */
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { posts } from '../src/lib/posts';
import { services } from '../src/lib/services';
import { publishedVenues } from '../src/lib/venues';
// Build-time-only import — generate-sitemap.ts runs via tsx, never bundled,
// so reading verifiedDate here does not put verification data in the client.
import { getVenueVerification } from '../src/data/venuesVerification';
import { vendors } from '../src/lib/vendors';
import { seoConfig, routes } from '../src/seo';

interface SitemapUrl {
  path: string;
  changefreq: 'daily' | 'weekly' | 'monthly';
  priority: string;
  lastmod?: string;
}

// Static pages don't have a natural per-page "last updated" date the way
// posts do (post.publishedISO) — bump this when their content meaningfully
// changes, month precision is enough for a sitemap.
const staticLastmod = '2026-09';

// Day-precision lastmod for the pages actually edited in the page-2 -> page-1
// pass on 2026-09-09: the homepage and /services H1s, and the four service
// pages that absorbed 301 equity from the legacy blog URLs and were expanded
// from ~200 to ~500-650 words. Everything untouched keeps month precision, so
// lastmod stays a real signal rather than a blanket timestamp.
const editedLastmod = '2026-09-09';
// The homepage changed again on 2026-10-06: every FAQ answer is now in the HTML
// (previously only the open one), two query-driven FAQs were added, and the
// body links to /services/event-management and /services/event-decoration.
// /about gained a link to /services/event-management the same day.
// Day precision, and only for pages that actually changed.
const commercialPassLastmod = '2026-10-06';
// 2026-10-08: an added FAQ on /services/event-management and /services/corporate-events, and the "barat" spelling on
// /services/barat-events. The /services hub renders every service's intro, so it moved with the barat intro.
const servicesPassLastmod = '2026-10-08';
const SERVICE_LASTMOD_OVERRIDES: Record<string, string> = {
  'event-management': servicesPassLastmod,
  'corporate-events': servicesPassLastmod,
  'barat-events': servicesPassLastmod,
};
// All ten now carry day-precision: the first four were expanded on the
// page-2 pass, the remaining six (the individual wedding functions plus
// birthdays) in the follow-up that took them from ~200 to ~500-660 words.
const EDITED_SERVICE_SLUGS = new Set([
  'wedding-planning',
  'event-management',
  'event-decoration',
  'corporate-events',
  'nikkah-events',
  'mehndi-events',
  'barat-events',
  'walima-events',
  'engagement-events',
  'birthday-events',
]);

const staticRoutes: SitemapUrl[] = [
  { path: routes.home, changefreq: 'weekly', priority: '1.0', lastmod: commercialPassLastmod },
  { path: routes.experiences, changefreq: 'weekly', priority: '0.9', lastmod: staticLastmod },
  { path: routes.about, changefreq: 'monthly', priority: '0.8', lastmod: commercialPassLastmod },
  { path: routes.portfolio, changefreq: 'weekly', priority: '0.8', lastmod: staticLastmod },
  { path: routes.gallery, changefreq: 'weekly', priority: '0.7', lastmod: staticLastmod },
  { path: routes.team, changefreq: 'monthly', priority: '0.6', lastmod: staticLastmod },
  { path: routes.contact, changefreq: 'monthly', priority: '0.8', lastmod: staticLastmod },
  { path: routes.blog, changefreq: 'weekly', priority: '0.8', lastmod: editedLastmod },
  { path: routes.services, changefreq: 'weekly', priority: '0.9', lastmod: servicesPassLastmod },
  // /venues and /vendors are deliberately left out while they carry no real
  // listings (both index pages are `noindex` until Phase 2 — see
  // VenuesIndexPage.tsx / VendorsIndexPage.tsx). A sitemap entry for a
  // noindex page is a contradiction worth avoiding. Once either array holds
  // a real, verified entry, its index page belongs here too.
  ...(publishedVenues.length > 0 ? [{ path: routes.venues, changefreq: 'weekly' as const, priority: '0.8', lastmod: staticLastmod }] : []),
  ...(vendors.length > 0 ? [{ path: routes.vendors, changefreq: 'weekly' as const, priority: '0.7', lastmod: staticLastmod }] : []),
];

const postRoutes: SitemapUrl[] = posts.map((post) => ({
  path: routes.blogPost(post.slug),
  changefreq: 'monthly',
  priority: '0.7',
  // updatedISO exists only on posts whose content was genuinely revised after
  // publication; everything else keeps its publish date.
  lastmod: post.updatedISO ?? post.publishedISO,
}));

const serviceRoutes: SitemapUrl[] = services.map((service) => ({
  path: routes.servicePage(service.slug),
  changefreq: 'monthly',
  priority: '0.8',
  lastmod: SERVICE_LASTMOD_OVERRIDES[service.slug] ?? (EDITED_SERVICE_SLUGS.has(service.slug) ? editedLastmod : staticLastmod),
}));

// Empty today (see src/lib/venues.ts / src/lib/vendors.ts) — these produce
// zero URLs until Phase 2 adds real, verified listings, at which point they
// need no further changes here.
const venueRoutes: SitemapUrl[] = publishedVenues.map((venue) => ({
  path: routes.venuePage(venue.slug),
  changefreq: 'monthly',
  priority: '0.7',
  lastmod: getVenueVerification(venue.slug)?.verifiedDate ?? staticLastmod,
}));

const vendorRoutes: SitemapUrl[] = vendors.map((vendor) => ({
  path: routes.vendorPage(vendor.slug),
  changefreq: 'monthly',
  priority: '0.6',
  lastmod: vendor.verifiedDate,
}));

const urls = [...staticRoutes, ...postRoutes, ...serviceRoutes, ...venueRoutes, ...vendorRoutes];

const body = urls
  .map((u) => {
    const loc = `${seoConfig.site.url}${u.path}`;
    const lastmod = u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : '';
    return `  <url>\n    <loc>${loc}</loc>${lastmod}\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`;
  })
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;

const outPath = resolve(process.cwd(), 'public/sitemap.xml');
writeFileSync(outPath, xml, 'utf8');
console.log(`sitemap.xml written to ${outPath} (${urls.length} URLs)`);
