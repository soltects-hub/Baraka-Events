export interface SearchTotals {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface QueryRow extends SearchTotals {
  query: string;
}

export interface PageRow extends SearchTotals {
  page: string;
}

export interface SitemapStatus {
  path: string;
  lastSubmitted: string | null;
  lastDownloaded: string | null;
  isPending: boolean;
  isSitemapsIndex: boolean;
  warnings: number;
  errors: number;
  contents: Array<{ type: string; submitted: number; indexed: number }>;
}

export interface UrlInspectionResult {
  url: string;
  verdict: string | null;
  coverageState: string | null;
  robotsTxtState: string | null;
  indexingState: string | null;
  lastCrawlTime: string | null;
  pageFetchState: string | null;
  /** The canonical URL this site declares (via <link rel="canonical">) for this page, per Google. */
  userCanonical: string | null;
  /** The canonical URL Google actually selected — may differ from userCanonical, which is the real signal for canonicalization/redirect problems. */
  googleCanonical: string | null;
  error?: string;
}

export interface ApiError {
  status: number;
  message: string;
}

/** One Search Console property the authenticated principal can actually read. */
export interface AccessibleProperty {
  siteUrl: string;
  permissionLevel: string;
}

/**
 * Which property the run ended up querying, and how it got there.
 *
 * Obtaining a token and having access to a property are different things: the
 * old auth check only proved the former, so a run against a property the
 * service account had never been granted could still report auth ok and then
 * fail every call. Recording the resolution makes that failure self-describing.
 */
export interface PropertyResolution {
  /** The property the config asked for. */
  requested: string;
  /** Where that value came from — the env override or the code default. */
  requestedFrom: 'SEARCH_CONSOLE_SITE_URL' | 'default';
  /** The property actually queried (differs from `requested` only on fallback). */
  resolved: string | null;
  /** True when `requested` was not in the accessible list and a fallback was used. */
  usedFallback: boolean;
  /** Every property the service account can read, straight from sites.list. */
  accessible: AccessibleProperty[];
  /** Populated when nothing usable was accessible — this is the actionable message. */
  problem?: string;
}

export interface SearchConsoleReportData {
  generatedAt: string;
  siteUrl: string;
  periods: {
    current: { startDate: string; endDate: string };
    previous: { startDate: string; endDate: string };
  };
  auth: { ok: true } | { ok: false; error: ApiError };
  property?: PropertyResolution;
  current?: {
    totals: SearchTotals;
    topQueries: QueryRow[];
    topPages: PageRow[];
  };
  previous?: {
    totals: SearchTotals;
    topPages: PageRow[];
  };
  sitemaps?: SitemapStatus[];
  urlInspections?: UrlInspectionResult[];
  errors: ApiError[];
}
