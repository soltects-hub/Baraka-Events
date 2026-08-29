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
import { seoConfig, routes } from '../src/seo';

interface SitemapUrl {
  path: string;
  changefreq: 'daily' | 'weekly' | 'monthly';
  priority: string;
  lastmod?: string;
}

const staticRoutes: SitemapUrl[] = [
  { path: routes.home, changefreq: 'weekly', priority: '1.0' },
  { path: routes.experiences, changefreq: 'weekly', priority: '0.9' },
  { path: routes.about, changefreq: 'monthly', priority: '0.8' },
  { path: routes.portfolio, changefreq: 'weekly', priority: '0.8' },
  { path: routes.gallery, changefreq: 'weekly', priority: '0.7' },
  { path: routes.team, changefreq: 'monthly', priority: '0.6' },
  { path: routes.contact, changefreq: 'monthly', priority: '0.8' },
  { path: routes.blog, changefreq: 'weekly', priority: '0.8' },
];

const postRoutes: SitemapUrl[] = posts.map((post) => ({
  path: routes.blogPost(post.slug),
  changefreq: 'monthly',
  priority: '0.7',
  lastmod: post.publishedISO,
}));

const urls = [...staticRoutes, ...postRoutes];

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
