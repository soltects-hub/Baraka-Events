/**
 * Collects raw Search Console data for Baraka Events and writes it as JSON.
 * This script only reads and records real data — it never fabricates numbers.
 * If authentication or a specific API call fails (e.g. the service account has
 * not yet been granted access to the property in Search Console), that failure
 * is recorded in the output rather than thrown, so the report generator can
 * surface it as an actionable technical-SEO item instead of crashing the run.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { posts } from '../../src/lib/posts';
import { services } from '../../src/lib/services';
import { routes } from '../../src/seo';
import {
  SITE_URL,
  SITE_URL_SOURCE,
  PROPERTY_FALLBACKS,
  PRODUCTION_ORIGIN,
  REPORTS_DIR,
  computePeriods,
  isoDate,
} from './config';
import {
  apiRequest,
  checkAuthAvailable,
  listAccessibleProperties,
  searchAnalyticsUrl,
  sitemapsUrl,
  URL_INSPECTION_URL,
} from './search-console-client';
import type {
  AccessibleProperty,
  ApiError,
  PageRow,
  PropertyResolution,
  QueryRow,
  SearchConsoleReportData,
  SearchTotals,
  SitemapStatus,
  UrlInspectionResult,
} from './types';

/**
 * The property every API call in this run uses. Resolved once in main() against
 * what the service account can actually read, rather than trusting the
 * configured value — see resolveProperty().
 */
let activeSiteUrl = SITE_URL;

interface RawRow {
  keys?: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}
interface SearchAnalyticsResponse {
  rows?: RawRow[];
}
interface SitemapsListResponse {
  sitemap?: Array<{
    path: string;
    lastSubmitted?: string;
    lastDownloaded?: string;
    isPending?: boolean;
    isSitemapsIndex?: boolean;
    warnings?: string;
    errors?: string;
    contents?: Array<{ type: string; submitted: string; indexed: string }>;
  }>;
}
interface UrlInspectionResponse {
  inspectionResult?: {
    indexStatusResult?: {
      verdict?: string;
      coverageState?: string;
      robotsTxtState?: string;
      indexingState?: string;
      lastCrawlTime?: string;
      pageFetchState?: string;
      userCanonical?: string;
      googleCanonical?: string;
    };
  };
}

async function queryTotals(startDate: string, endDate: string): Promise<{ totals: SearchTotals; error?: ApiError }> {
  const result = await apiRequest<SearchAnalyticsResponse>(searchAnalyticsUrl(activeSiteUrl), 'POST', {
    startDate,
    endDate,
    dimensions: [],
  });
  if (!result.ok) return { totals: zeroTotals(), error: { status: result.status, message: result.message } };
  const row = result.data.rows?.[0];
  return { totals: row ? toTotals(row) : zeroTotals() };
}

async function queryByDimension(
  startDate: string,
  endDate: string,
  dimension: 'query' | 'page',
  rowLimit = 25
): Promise<{ rows: Array<{ key: string } & SearchTotals>; error?: ApiError }> {
  const result = await apiRequest<SearchAnalyticsResponse>(searchAnalyticsUrl(activeSiteUrl), 'POST', {
    startDate,
    endDate,
    dimensions: [dimension],
    rowLimit,
  });
  if (!result.ok) return { rows: [], error: { status: result.status, message: result.message } };
  const rows = (result.data.rows ?? [])
    .map((r) => ({ key: r.keys?.[0] ?? '', ...toTotals(r) }))
    .sort((a, b) => b.clicks - a.clicks);
  return { rows };
}

function zeroTotals(): SearchTotals {
  return { clicks: 0, impressions: 0, ctr: 0, position: 0 };
}
function toTotals(r: RawRow): SearchTotals {
  return { clicks: r.clicks, impressions: r.impressions, ctr: r.ctr, position: r.position };
}

async function fetchSitemaps(): Promise<{ sitemaps: SitemapStatus[]; error?: ApiError }> {
  const result = await apiRequest<SitemapsListResponse>(sitemapsUrl(activeSiteUrl), 'GET');
  if (!result.ok) return { sitemaps: [], error: { status: result.status, message: result.message } };
  const sitemaps = (result.data.sitemap ?? []).map((s) => ({
    path: s.path,
    lastSubmitted: s.lastSubmitted ?? null,
    lastDownloaded: s.lastDownloaded ?? null,
    isPending: Boolean(s.isPending),
    isSitemapsIndex: Boolean(s.isSitemapsIndex),
    warnings: Number(s.warnings ?? 0),
    errors: Number(s.errors ?? 0),
    contents: (s.contents ?? []).map((c) => ({
      type: c.type,
      submitted: Number(c.submitted ?? 0),
      indexed: Number(c.indexed ?? 0),
    })),
  }));
  return { sitemaps };
}

/**
 * URLs to run through URL Inspection, most commercially important first.
 *
 * The service pages were missing entirely until now — the list only covered the
 * homepage, /blog and the posts — so the report could never say anything about
 * whether the pages the business actually sells from were indexed. They go
 * first because URL Inspection is quota-limited and truncation should drop blog
 * posts, not money pages.
 */
function allSiteUrls(): string[] {
  return [
    `${PRODUCTION_ORIGIN}${routes.home}`,
    `${PRODUCTION_ORIGIN}${routes.services}`,
    ...services.map((s) => `${PRODUCTION_ORIGIN}${routes.servicePage(s.slug)}`),
    `${PRODUCTION_ORIGIN}${routes.blog}`,
    ...posts.map((p) => `${PRODUCTION_ORIGIN}${routes.blogPost(p.slug)}`),
  ];
}

/**
 * Decide which property to query, given what the service account can read.
 *
 * A Search Console property grant is per-property: being added to
 * "https://barakaevents.com/" conveys nothing for "sc-domain:barakaevents.com".
 * When the configured property changed on 2026-09-05 the service account had no
 * grant on the new one, every call started returning 403, and because the old
 * auth check only proved a token could be minted, the run still reported
 * "auth ok" and simply produced nothing for three days.
 *
 * So: list the real grants, use the configured property if it is among them,
 * otherwise fall back to the best one that is — loudly — rather than going dark.
 */
export function chooseProperty(accessible: AccessibleProperty[]): PropertyResolution {
  const resolution: PropertyResolution = {
    requested: SITE_URL,
    requestedFrom: SITE_URL_SOURCE,
    resolved: null,
    usedFallback: false,
    accessible,
  };

  const readable = new Set(
    accessible.filter((p) => p.permissionLevel !== 'siteUnverifiedUser').map((p) => p.siteUrl)
  );

  if (readable.has(SITE_URL)) {
    resolution.resolved = SITE_URL;
    return resolution;
  }

  const fallback = PROPERTY_FALLBACKS.find((p) => readable.has(p));
  if (fallback) {
    resolution.resolved = fallback;
    resolution.usedFallback = true;
    resolution.problem =
      `Configured property "${SITE_URL}" (from ${SITE_URL_SOURCE}) is not readable by this service account. ` +
      `Fell back to "${fallback}". Grant the service account access to "${SITE_URL}" in Search Console ` +
      `(Settings > Users and permissions > Add user), or set the SEARCH_CONSOLE_SITE_URL repository variable to a property that is granted.`;
    return resolution;
  }

  resolution.problem =
    `No usable Search Console property. Configured "${SITE_URL}" (from ${SITE_URL_SOURCE}) is not readable, ` +
    `and neither is any known fallback. Properties this service account can read: ` +
    `${accessible.length ? accessible.map((p) => `${p.siteUrl} (${p.permissionLevel})`).join(', ') : 'NONE'}. ` +
    `Fix: in Search Console, open the property, then Settings > Users and permissions > Add user, ` +
    `and add the service account as an Owner or Full user.`;
  return resolution;
}

async function resolveProperty(): Promise<{ resolution: PropertyResolution; error?: ApiError }> {
  const listed = await listAccessibleProperties();

  if (!listed.ok) {
    const resolution = chooseProperty([]);
    resolution.problem =
      `Could not list Search Console properties (${listed.status}: ${listed.message}). ` +
      `The service account may not be granted on any property, or the Search Console API may be disabled on the GCP project.`;
    return { resolution, error: { status: listed.status, message: listed.message } };
  }

  const accessible: AccessibleProperty[] = (listed.data.siteEntry ?? []).map((s) => ({
    siteUrl: s.siteUrl,
    permissionLevel: s.permissionLevel,
  }));
  return { resolution: chooseProperty(accessible) };
}

async function inspectUrl(url: string): Promise<UrlInspectionResult> {
  const result = await apiRequest<UrlInspectionResponse>(URL_INSPECTION_URL, 'POST', {
    inspectionUrl: url,
    siteUrl: activeSiteUrl,
  });
  if (!result.ok) {
    return {
      url,
      verdict: null,
      coverageState: null,
      robotsTxtState: null,
      indexingState: null,
      lastCrawlTime: null,
      pageFetchState: null,
      userCanonical: null,
      googleCanonical: null,
      error: `${result.status}: ${result.message}`,
    };
  }
  const idx = result.data.inspectionResult?.indexStatusResult;
  return {
    url,
    verdict: idx?.verdict ?? null,
    coverageState: idx?.coverageState ?? null,
    robotsTxtState: idx?.robotsTxtState ?? null,
    indexingState: idx?.indexingState ?? null,
    lastCrawlTime: idx?.lastCrawlTime ?? null,
    pageFetchState: idx?.pageFetchState ?? null,
    userCanonical: idx?.userCanonical ?? null,
    googleCanonical: idx?.googleCanonical ?? null,
  };
}

async function main() {
  const { current, previous } = computePeriods();
  const errors: ApiError[] = [];

  const data: SearchConsoleReportData = {
    generatedAt: new Date().toISOString(),
    siteUrl: SITE_URL,
    periods: { current, previous },
    auth: { ok: true },
    errors,
  };

  const authCheck = await checkAuthAvailable();
  if (!authCheck.ok) {
    data.auth = { ok: false, error: { status: authCheck.status, message: authCheck.message } };
    mkdirSync(resolve(process.cwd(), REPORTS_DIR), { recursive: true });
    const outPath = resolve(process.cwd(), REPORTS_DIR, `data-${isoDate(new Date())}.json`);
    writeFileSync(outPath, JSON.stringify(data, null, 2));
    writeFileSync(resolve(process.cwd(), REPORTS_DIR, 'data-latest.json'), JSON.stringify(data, null, 2));
    console.error('Google authentication is not available in this environment — wrote auth-failure record.');
    console.error(authCheck.message);
    // Non-zero exit so CI makes the failure visible, but the JSON is still written for the report step to read.
    process.exitCode = 1;
    return;
  }

  // Holding a token is not the same as being allowed to read a property, and
  // conflating the two is what let this run silently produce nothing.
  const { resolution, error: propertyError } = await resolveProperty();
  data.property = resolution;
  if (propertyError) errors.push(propertyError);

  if (!resolution.resolved) {
    mkdirSync(resolve(process.cwd(), REPORTS_DIR), { recursive: true });
    const outPath = resolve(process.cwd(), REPORTS_DIR, `data-${isoDate(new Date())}.json`);
    writeFileSync(outPath, JSON.stringify(data, null, 2));
    writeFileSync(resolve(process.cwd(), REPORTS_DIR, 'data-latest.json'), JSON.stringify(data, null, 2));
    console.error(`::error::${resolution.problem}`);
    process.exitCode = 1;
    return;
  }

  activeSiteUrl = resolution.resolved;
  data.siteUrl = activeSiteUrl;
  if (resolution.problem) console.error(`::warning::${resolution.problem}`);
  console.log(
    `Search Console property: ${activeSiteUrl}` +
      (resolution.usedFallback ? ` (FALLBACK — configured "${resolution.requested}" is not accessible)` : '') +
      ` | readable properties: ${resolution.accessible.map((p) => p.siteUrl).join(', ') || 'none'}`
  );

  const [currentTotals, previousTotals, currentQueries, currentPages, previousPages, sitemapResult] = await Promise.all([
    queryTotals(current.startDate, current.endDate),
    queryTotals(previous.startDate, previous.endDate),
    queryByDimension(current.startDate, current.endDate, 'query', 25),
    queryByDimension(current.startDate, current.endDate, 'page', 25),
    queryByDimension(previous.startDate, previous.endDate, 'page', 25),
    fetchSitemaps(),
  ]);

  for (const r of [currentTotals, previousTotals, currentQueries, currentPages, previousPages, sitemapResult]) {
    if (r.error) errors.push(r.error);
  }

  const topQueries: QueryRow[] = currentQueries.rows.map((r) => ({ query: r.key, clicks: r.clicks, impressions: r.impressions, ctr: r.ctr, position: r.position }));
  const currentTopPages: PageRow[] = currentPages.rows.map((r) => ({ page: r.key, clicks: r.clicks, impressions: r.impressions, ctr: r.ctr, position: r.position }));
  const previousTopPages: PageRow[] = previousPages.rows.map((r) => ({ page: r.key, clicks: r.clicks, impressions: r.impressions, ctr: r.ctr, position: r.position }));

  data.current = { totals: currentTotals.totals, topQueries, topPages: currentTopPages };
  data.previous = { totals: previousTotals.totals, topPages: previousTopPages };
  data.sitemaps = sitemapResult.sitemaps;

  // Only worth inspecting indexing status if the core queries actually worked —
  // otherwise we already know it's a permissions problem and 8 more failing
  // calls add nothing.
  if (!currentTotals.error && !sitemapResult.error) {
    const urls = allSiteUrls();
    data.urlInspections = [];
    for (const url of urls) {
      // Sequential on purpose: URL Inspection has a modest per-minute quota and
      // this site only has 8 URLs, so there's no need to parallelize.
      data.urlInspections.push(await inspectUrl(url));
    }
  }

  mkdirSync(resolve(process.cwd(), REPORTS_DIR), { recursive: true });
  const outPath = resolve(process.cwd(), REPORTS_DIR, `data-${isoDate(new Date())}.json`);
  writeFileSync(outPath, JSON.stringify(data, null, 2));
  writeFileSync(resolve(process.cwd(), REPORTS_DIR, 'data-latest.json'), JSON.stringify(data, null, 2));

  if (errors.length > 0) {
    console.error(`Search Console data collected with ${errors.length} API error(s):`);
    for (const e of errors) console.error(`  [${e.status}] ${e.message}`);
    process.exitCode = 1;
  } else {
    console.log(`Search Console data written to ${outPath}`);
  }
}

// Only run when invoked as the entrypoint, so chooseProperty() can be imported
// and tested without the import firing a whole Search Console collection run
// (and overwriting the last good data file).
const invokedDirectly =
  process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;

if (invokedDirectly) {
  main().catch((err) => {
    console.error('Unexpected failure collecting Search Console data:', err);
    process.exitCode = 1;
  });
}
