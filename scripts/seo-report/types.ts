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

export interface SearchConsoleReportData {
  generatedAt: string;
  siteUrl: string;
  periods: {
    current: { startDate: string; endDate: string };
    previous: { startDate: string; endDate: string };
  };
  auth: { ok: true } | { ok: false; error: ApiError };
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
