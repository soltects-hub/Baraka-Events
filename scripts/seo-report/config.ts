/**
 * Shared config for the SEO reporting scripts.
 *
 * Search Console access is per-property, and a property can be verified either
 * as a URL-prefix property ("https://www.barakaevents.com/") or a Domain
 * property ("sc-domain:barakaevents.com") — these are different identifiers to
 * the API even though they cover the same site. Default to the URL-prefix form
 * for the canonical host (the apex barakaevents.com is not attached to the
 * Vercel project and permanently redirects to www — every URL Inspection this
 * automation ever ran against the apex came back "Page with redirect" or
 * "URL is unknown to Google" for exactly that reason, even though Google's own
 * response data confirms www is the canonical host it actually crawls). Let
 * this be overridden via SEARCH_CONSOLE_SITE_URL without touching code, in
 * case the property was verified as a Domain property instead.
 */
export const SITE_URL = process.env.SEARCH_CONSOLE_SITE_URL || 'https://www.barakaevents.com/';

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
