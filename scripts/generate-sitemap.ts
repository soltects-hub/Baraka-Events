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
  { path: routes.home, changefreq: 'weekly', priority: '1.0', lastmod: editedLastmod },
  { path: routes.experiences, changefreq: 'weekly', priority: '0.9', lastmod: staticLastmod },
  { path: routes.about, changefreq: 'monthly', priority: '0.8', lastmod: staticLastmod },
  { path: routes.portfolio, changefreq: 'weekly', priority: '0.8', lastmod: staticLastmod },
  { path: routes.gallery, changefreq: 'weekly', priority: '0.7', lastmod: staticLastmod },
  { path: routes.team, changefreq: 'monthly', priority: '0.6', lastmod: staticLastmod },
  { path: routes.contact, changefreq: 'monthly', priority: '0.8', lastmod: staticLastmod },
  { path: routes.blog, changefreq: 'weekly', priority: '0.8', lastmod: editedLastmod },
  { path: routes.services, changefreq: 'weekly', priority: '0.9', lastmod: editedLastmod },
];

const postRoutes: SitemapUrl[] = posts.map((post) => ({
  path: routes.blogPost(post.slug),
  changefreq: 'monthly',
  priority: '0.7',
  lastmod: post.publishedISO,
}));

const serviceRoutes: SitemapUrl[] = services.map((service) => ({
  path: routes.servicePage(service.slug),
  changefreq: 'monthly',
  priority: '0.8',
  lastmod: EDITED_SERVICE_SLUGS.has(service.slug) ? editedLastmod : staticLastmod,
}));

const urls = [...staticRoutes, ...postRoutes, ...serviceRoutes];

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
