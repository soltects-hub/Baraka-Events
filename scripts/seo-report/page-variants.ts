/**
 * Search Console reports a page under whichever URL Google last showed in a
 * result, so one real page can appear as several rows: http:// and https://,
 * apex and www, with and without a trailing slash. While Google is moving to the
 * canonical (https://www.), the old variant's clicks "fall" and the canonical's
 * "rise" — compared row by row that reads as a loss on the old URL even though
 * the page itself gained.
 *
 * On the 2026-09-30 data that produced "http://www.barakaevents.com/ clicks
 * -71.4%" (14 -> 4), a daily "improve-existing" decision aimed at the http URL,
 * and a "Losses" entry in the report — while the same page's combined clicks
 * went 32 -> 41. Merge the variants before comparing periods.
 *
 * Query strings are kept: the spam ?JGNS=... URLs are distinct rows on purpose.
 */
import { PRODUCTION_ORIGIN } from './config';
import type { PageRow } from './types';

const OUR_HOSTS = new Set(['barakaevents.com', 'www.barakaevents.com']);

/** https://www.barakaevents.com + path (no trailing slash except the root) + query. */
export function canonicalPageUrl(page: string): string {
  try {
    const u = new URL(page);
    if (!OUR_HOSTS.has(u.hostname)) return page;
    const path = u.pathname.length > 1 ? u.pathname.replace(/\/+$/, '') : u.pathname;
    return `${PRODUCTION_ORIGIN}${path}${u.search}`;
  } catch {
    return page;
  }
}

/** Sum clicks/impressions across variants; position stays impression-weighted, as in Search Console. */
export function mergePageVariants(rows: PageRow[]): PageRow[] {
  const byUrl = new Map<string, PageRow>();
  for (const row of rows) {
    const url = canonicalPageUrl(row.page);
    const existing = byUrl.get(url);
    if (!existing) {
      byUrl.set(url, { ...row, page: url });
      continue;
    }
    const impressions = existing.impressions + row.impressions;
    const clicks = existing.clicks + row.clicks;
    byUrl.set(url, {
      page: url,
      clicks,
      impressions,
      ctr: impressions > 0 ? clicks / impressions : 0,
      position:
        impressions > 0
          ? (existing.position * existing.impressions + row.position * row.impressions) / impressions
          : existing.position,
    });
  }
  return [...byUrl.values()].sort((a, b) => b.clicks - a.clicks || b.impressions - a.impressions);
}
