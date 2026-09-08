/**
 * Shared config for the SEO reporting scripts.
 *
 * Search Console access is per-property, and a property can be verified either
 * as a URL-prefix property ("https://www.barakaevents.com/") or a Domain
 * property ("sc-domain:barakaevents.com") — these are different identifiers to
 * the API even though they cover the same site. The only property that existed
 * before 2026-09 was a URL-prefix property for the bare apex
 * ("https://barakaevents.com/") — a domain that isn't attached to the Vercel
 * project at all and permanently redirects to www, so it could never see the
 * real site's pages no matter what was submitted to it. Replaced with a Domain
 * property ("sc-domain:barakaevents.com", DNS-verified) so one property covers
 * apex, www, and http/https together going forward. Override via
 * SEARCH_CONSOLE_SITE_URL without touching code if the property setup changes
 * again.
 */
const SITE_URL_OVERRIDE = (process.env.SEARCH_CONSOLE_SITE_URL ?? '').trim();

export const SITE_URL = SITE_URL_OVERRIDE || 'sc-domain:barakaevents.com';

/**
 * Where SITE_URL came from. The CI job passes
 * `SEARCH_CONSOLE_SITE_URL: ${{ vars.SEARCH_CONSOLE_SITE_URL }}`, so a stale
 * repository variable silently wins over the value in this file — worth
 * recording in the report so the two can never be confused again.
 */
export const SITE_URL_SOURCE: 'SEARCH_CONSOLE_SITE_URL' | 'default' =
  SITE_URL_OVERRIDE ? 'SEARCH_CONSOLE_SITE_URL' : 'default';

/**
 * Properties to fall back to, best first, if SITE_URL turns out not to be
 * readable. The Domain property is preferred because it covers apex, www and
 * both protocols at once; the apex URL-prefix property is last because it only
 * ever sees a host that redirects, which is what made the automation report
 * "URL is unknown to Google" for every real page for months.
 */
export const PROPERTY_FALLBACKS = [
  'sc-domain:barakaevents.com',
  'https://www.barakaevents.com/',
  'https://barakaevents.com/',
];

export const PRODUCTION_ORIGIN = 'https://www.barakaevents.com';

export const REPORTS_DIR = 'reports/seo';

/** Search Console data is typically incomplete for the most recent 2-3 days. */
export const DATA_LAG_DAYS = 3;

/** Rolling window length (days) used for both the current and comparison periods. */
export const PERIOD_LENGTH_DAYS = 28;

export function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function addDays(d: Date, days: number): Date {
  const copy = new Date(d.getTime());
  copy.setUTCDate(copy.getUTCDate() + days);
  return copy;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export function computePeriods(now: Date = new Date()): { current: DateRange; previous: DateRange } {
  const end = addDays(now, -DATA_LAG_DAYS);
  const currentStart = addDays(end, -(PERIOD_LENGTH_DAYS - 1));
  const previousEnd = addDays(currentStart, -1);
  const previousStart = addDays(previousEnd, -(PERIOD_LENGTH_DAYS - 1));

  return {
    current: { startDate: isoDate(currentStart), endDate: isoDate(end) },
    previous: { startDate: isoDate(previousStart), endDate: isoDate(previousEnd) },
  };
}
