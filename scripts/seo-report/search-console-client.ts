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

const SCOPES = ['https://www.googleapis.com/auth/webmasters.readonly'];

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; status: number; message: string };

let authClientPromise: ReturnType<GoogleAuth['getClient']> | null = null;

async function getClient() {
  if (!authClientPromise) {
    const auth = new GoogleAuth({ scopes: SCOPES });
    authClientPromise = auth.getClient();
  }
  return authClientPromise;
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

export async function apiRequest<T>(url: string, method: 'GET' | 'POST' = 'GET', data?: unknown): Promise<ApiResult<T>> {
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

export const URL_INSPECTION_URL = 'https://searchconsole.googleapis.com/v1/urlInspection/index:inspect';
