/**
 * Thin Search Console (webmasters v3 / searchconsole v1) REST client.
 *
 * Auth comes entirely from Application Default Credentials — in CI this is the
 * short-lived, WIF-exchanged credential that google-github-actions/auth@v3
 * writes and points GOOGLE_APPLICATION_CREDENTIALS at (never a static
 * service-account key). google-auth-library's GoogleAuth() picks it up with
 * no code-level configuration.
 */
import { GoogleAuth } from 'google-auth-library';

const READONLY_SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';
const READWRITE_SCOPE = 'https://www.googleapis.com/auth/webmasters';

/**
 * The daily reporting run only ever reads, so it stays on the read-only scope.
 * The one-shot sitemap remediation needs to submit and delete, which the
 * read-only scope cannot do — it opts in explicitly via requestWriteScope().
 */
let scopes: string[] = [READONLY_SCOPE];

export function requestWriteScope(): void {
  if (authClientPromise) throw new Error('requestWriteScope() must be called before the first API request.');
  scopes = [READWRITE_SCOPE];
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; status: number; message: string };

let authClientPromise: ReturnType<GoogleAuth['getClient']> | null = null;

async function getClient() {
  if (!authClientPromise) {
    const auth = new GoogleAuth({ scopes });
    authClientPromise = auth.getClient();
  }
  return authClientPromise;
}

/**
 * Every Search Console property this principal can read.
 *
 * Access is granted per-property, and a Domain property
 * ("sc-domain:example.com") is a different grant from a URL-prefix property
 * ("https://example.com/") even for the same site. Switching the configured
 * property therefore silently breaks the run unless the service account was
 * separately added to the new one — which is exactly what happened here on
 * 2026-09-05. Listing the properties up front turns that from an opaque wall
 * of 403s into a statement of what access actually exists.
 */
export async function listAccessibleProperties(): Promise<
  ApiResult<{ siteEntry?: Array<{ siteUrl: string; permissionLevel: string }> }>
> {
  return apiRequest<{ siteEntry?: Array<{ siteUrl: string; permissionLevel: string }> }>(
    'https://www.googleapis.com/webmasters/v3/sites',
    'GET'
  );
}

/** Cheap up-front check: can we even obtain Application Default Credentials here? */
export async function checkAuthAvailable(): Promise<ApiResult<{ authenticated: true }>> {
  try {
    const client = await getClient();
    // Force an actual token fetch so a bad/absent credential fails now, not on first API call.
    await client.getAccessToken();
    return { ok: true, data: { authenticated: true } };
  } catch (err) {
    return { ok: false, status: 0, message: describeError(err) };
  }
}

export async function apiRequest<T>(url: string, method: HttpMethod = 'GET', data?: unknown): Promise<ApiResult<T>> {
  try {
    const client = await getClient();
    const res = await client.request<T>({ url, method, data });
    return { ok: true, data: res.data };
  } catch (err) {
    return { ok: false, status: extractStatus(err), message: describeError(err) };
  }
}

function extractStatus(err: unknown): number {
  const e = err as { response?: { status?: number }; status?: number };
  return e?.response?.status ?? e?.status ?? 0;
}

function describeError(err: unknown): string {
  const e = err as { response?: { data?: { error?: { message?: string } } }; message?: string };
  return e?.response?.data?.error?.message ?? e?.message ?? String(err);
}

export function searchAnalyticsUrl(siteUrl: string): string {
  return `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`;
}

export function sitemapsUrl(siteUrl: string): string {
  return `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/sitemaps`;
}

/**
 * A single sitemap resource, for submit (PUT) and delete (DELETE).
 *
 * Both path segments are percent-encoded. That matters more than it looks: the
 * feedpath here is a full URL containing "://", "?" and "&" (the spam feeds are
 * things like /wp-links-opmll.php?s=s&t=1&m=3&cn=37), and leaving any of it raw
 * would either truncate the path at the query separator or 404.
 */
export function sitemapUrl(siteUrl: string, feedpath: string): string {
  return `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/sitemaps/${encodeURIComponent(feedpath)}`;
}

export const URL_INSPECTION_URL = 'https://searchconsole.googleapis.com/v1/urlInspection/index:inspect';
