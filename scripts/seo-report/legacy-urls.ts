/**
 * Classifies historical URLs that Search Console has ever shown for this
 * property (via top pages / sitemaps / URL inspection) into a safe,
 * evidence-based recommendation. This module NEVER changes routing,
 * redirects, or HTTP status codes itself — it only classifies and records a
 * recommendation for a human to review and implement deliberately (e.g. via
 * vercel.json, or Search Console's Removals tool).
 *
 * Why this exists: Search Console for barakaevents.com carries a mix of
 * (a) the site's real current React routes, (b) legacy WordPress-era content
 * URLs from before this rebuild, and (c) spam-injection artifacts (classic
 * WordPress malware/black-hat-SEO patterns: `wp-links-*.php`, `?JGNS=...`
 * query strings, `index.php?r=s&t=1&m=3&cn=...` fake sitemap paths). These
 * three categories require very different handling, and getting it wrong is
 * actively harmful (e.g. redirecting spam URLs to the homepage can transfer
 * spam signal instead of curing it).
 */
import { routes } from '../../src/seo';
import { posts } from '../../src/lib/posts';

export type LegacyUrlClassification =
  | 'current-valid' // matches an existing real route — not legacy at all
  | 'redirect-candidate' // legacy content with a clear, evidence-based current equivalent
  | 'spam-410' // matches a known spam/malware-injection URL pattern
  | 'investigate'; // legacy URL with real search demand but no confident mapping

export interface LegacyUrlRecord {
  url: string;
  classification: LegacyUrlClassification;
  reason: string;
  /** Only set for 'redirect-candidate'. A relative path on the current site. */
  proposedTarget?: string;
  /** Only set for 'investigate'. What a human should look into. */
  investigationNote?: string;
}

/** Known spam/malware-injection URL signatures seen in this property's real Search Console data. */
const SPAM_PATTERNS: RegExp[] = [
  /wp-links-[a-z0-9]+\.php/i, // e.g. wp-links-opmll.php — not a real WordPress core file
  /[?&]JGNS=/i, // classic WP spam-redirect campaign query param
  /index\.php\?r=s&t=\d+&m=\d+&cn=\d+/i, // fake spam sitemap path pattern
];

/**
 * Legacy WordPress-era content URLs with a clear, evidence-based mapping to
 * the current site (verified against real anchor IDs in the current
 * homepage components — not guessed). Curated by hand; extend deliberately
 * as new legitimate legacy URLs are confirmed, never auto-derived.
 */
const KNOWN_REDIRECT_CANDIDATES: Record<string, string> = {
  '/about-us/': '/#about',
  '/contact-us/': '/#contact',
  '/gallery/': '/#gallery',
  '/corporate-event-planner/': '/#experiences',
  '/event-planner/': '/#experiences',
  '/wedding-planner/': '/#experiences',
};

/** URLs known to need human investigation rather than an automatic rule. */
const KNOWN_INVESTIGATE: Record<string, string> = {
  '/birthday-planners/':
    'Real search demand exists ("birthday events lahore" appears in current-period queries). Private Celebrations already covers milestone birthdays, but there is no dedicated page. Consider: (a) a redirect to /#experiences now, or (b) a dedicated birthday-events content page later (see keyword map) — a human should decide based on demand, not this script.',
};

function currentValidPaths(): Set<string> {
  const paths = new Set<string>([routes.home, routes.blog, '/robots.txt', '/sitemap.xml', '/googlebc2c622c6923c88b.html']);
  for (const post of posts) paths.add(routes.blogPost(post.slug));
  return paths;
}

export function classifyUrl(rawUrl: string): LegacyUrlRecord {
  let path: string;
  try {
    path = new URL(rawUrl).pathname;
  } catch {
    path = rawUrl;
  }

  if (SPAM_PATTERNS.some((re) => re.test(rawUrl))) {
    return {
      url: rawUrl,
      classification: 'spam-410',
      reason:
        'Matches a known WordPress spam/malware-injection URL signature (not a page this site, past or present, ever legitimately served).',
    };
  }

  if (currentValidPaths().has(path) || path === '/') {
    return { url: rawUrl, classification: 'current-valid', reason: 'Matches an existing current route.' };
  }

  const normalized = path.endsWith('/') ? path : `${path}/`;
  if (KNOWN_REDIRECT_CANDIDATES[normalized]) {
    return {
      url: rawUrl,
      classification: 'redirect-candidate',
      reason: 'Legacy WordPress-era content URL with a clear current-site equivalent (verified anchor exists).',
      proposedTarget: KNOWN_REDIRECT_CANDIDATES[normalized],
    };
  }

  if (KNOWN_INVESTIGATE[normalized]) {
    return {
      url: rawUrl,
      classification: 'investigate',
      reason: 'Has real search demand but no confident automatic mapping.',
      investigationNote: KNOWN_INVESTIGATE[normalized],
    };
  }

  return {
    url: rawUrl,
    classification: 'investigate',
    reason: 'Unrecognized legacy URL — not yet classified. Needs a human look before any action.',
    investigationNote: 'First time this script has seen this URL. Add it to legacy-urls.ts once classified.',
  };
}

export function classifyUrls(urls: string[]): LegacyUrlRecord[] {
  const seen = new Set<string>();
  const out: LegacyUrlRecord[] = [];
  for (const url of urls) {
    if (seen.has(url)) continue;
    seen.add(url);
    out.push(classifyUrl(url));
  }
  return out;
}
