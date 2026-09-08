/**
 * One-shot Search Console sitemap remediation. NOT part of the daily cron.
 *
 * This domain previously ran a compromised WordPress install. Two spam feeds
 * were submitted to Search Console in November 2025 and are still registered:
 *
 *   https://barakaevents.com/wp-links-opmll.php?s=s&t=1&m=3&cn=37   (37 URLs, 0 indexed)
 *   https://barakaevents.com/index.php?r=s&t=1&m=3&cn=32            (32 URLs, 0 indexed)
 *
 * Alongside them sits an apex sitemap (https://barakaevents.com/sitemap.xml)
 * listing 8 URLs on a host that only ever 308s to www.
 *
 * What this script does, in order:
 *   1. Snapshots the current sitemaps.list to reports/seo/ before touching
 *      anything, because deletion is not reversible from here.
 *   2. Submits the real sitemap, https://www.barakaevents.com/sitemap.xml.
 *   3. Deletes the two spam feeds, and the apex sitemap only if the submit in
 *      step 2 succeeded — never leaving the property with no sitemap at all.
 *
 * Deliberately NOT claimed: deleting a sitemap does not remove its URLs from
 * Google's index. Search Console's own documentation is explicit that "Google
 * won't forget the sitemap or any URLs listed in it". This is hygiene — it stops
 * Google refetching the spam feeds and cleans the Sitemaps report. The spam URLs
 * themselves stop mattering because they now return a real 404.
 *
 * Requires WRITE scope and Full/Owner permission on the property, so it runs
 * only via the manual `sitemap-remediation` workflow_dispatch job. Pass
 * --dry-run to print the plan without calling the API.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { PRODUCTION_ORIGIN, REPORTS_DIR, SITE_URL, isoDate } from './config';
import { apiRequest, listAccessibleProperties, requestWriteScope, sitemapUrl, sitemapsUrl } from './search-console-client';

// Must happen before any request so the auth client is built with write scope.
requestWriteScope();

const CANONICAL_SITEMAP = `${PRODUCTION_ORIGIN}/sitemap.xml`;

const SPAM_FEEDS = [
  'https://barakaevents.com/wp-links-opmll.php?s=s&t=1&m=3&cn=37',
  'https://barakaevents.com/index.php?r=s&t=1&m=3&cn=32',
];

const STALE_APEX_SITEMAP = 'https://barakaevents.com/sitemap.xml';

interface SitemapsListResponse {
  sitemap?: Array<{ path: string; lastSubmitted?: string; contents?: Array<{ submitted: string; indexed: string }> }>;
}

const dryRun = process.argv.includes('--dry-run');

async function main() {
  console.log(`Property: ${SITE_URL}${dryRun ? '  (DRY RUN — no writes)' : ''}`);

  const access = await listAccessibleProperties();
  if (!access.ok) {
    console.error(`::error::Cannot list properties (${access.status}: ${access.message}).`);
    process.exitCode = 1;
    return;
  }
  const entry = (access.data.siteEntry ?? []).find((s) => s.siteUrl === SITE_URL);
  if (!entry) {
    console.error(
      `::error::Service account has no access to "${SITE_URL}". Readable: ` +
        `${(access.data.siteEntry ?? []).map((s) => `${s.siteUrl} (${s.permissionLevel})`).join(', ') || 'none'}.`
    );
    process.exitCode = 1;
    return;
  }
  // Submitting and deleting sitemaps are write operations; a restricted user
  // can read the property but cannot perform them.
  if (entry.permissionLevel !== 'siteOwner' && entry.permissionLevel !== 'siteFullUser') {
    console.error(
      `::error::Permission on "${SITE_URL}" is "${entry.permissionLevel}". Sitemap submit/delete needs siteOwner or siteFullUser.`
    );
    process.exitCode = 1;
    return;
  }

  const before = await apiRequest<SitemapsListResponse>(sitemapsUrl(SITE_URL), 'GET');
  if (!before.ok) {
    console.error(`::error::Could not read sitemaps (${before.status}: ${before.message}).`);
    process.exitCode = 1;
    return;
  }
  const registered = (before.data.sitemap ?? []).map((s) => s.path);
  console.log(`Registered sitemaps (${registered.length}):`);
  for (const p of registered) console.log(`  - ${p}`);

  mkdirSync(resolve(process.cwd(), REPORTS_DIR), { recursive: true });
  const snapshotPath = resolve(process.cwd(), REPORTS_DIR, `sitemaps-before-remediation-${isoDate(new Date())}.json`);
  writeFileSync(snapshotPath, JSON.stringify(before.data, null, 2));
  console.log(`Snapshot written to ${snapshotPath}`);

  let failures = 0;

  // Submit first, so the property is never left without a valid sitemap.
  let submitted = registered.includes(CANONICAL_SITEMAP);
  if (submitted) {
    console.log(`Already registered, not resubmitting: ${CANONICAL_SITEMAP}`);
  } else if (dryRun) {
    console.log(`WOULD SUBMIT: ${CANONICAL_SITEMAP}`);
    submitted = true;
  } else {
    const res = await apiRequest(sitemapUrl(SITE_URL, CANONICAL_SITEMAP), 'PUT');
    if (res.ok) {
      console.log(`SUBMITTED: ${CANONICAL_SITEMAP}`);
      submitted = true;
    } else {
      console.error(`::error::Submit failed for ${CANONICAL_SITEMAP} (${res.status}: ${res.message})`);
      failures++;
    }
  }

  const toDelete = [...SPAM_FEEDS];
  if (submitted) {
    toDelete.push(STALE_APEX_SITEMAP);
  } else {
    console.warn(`::warning::Keeping ${STALE_APEX_SITEMAP} — the replacement sitemap was not submitted successfully.`);
  }

  for (const feed of toDelete) {
    if (!registered.includes(feed)) {
      console.log(`Not registered, nothing to delete: ${feed}`);
      continue;
    }
    if (dryRun) {
      console.log(`WOULD DELETE: ${feed}`);
      continue;
    }
    const res = await apiRequest(sitemapUrl(SITE_URL, feed), 'DELETE');
    if (res.ok) {
      console.log(`DELETED: ${feed}`);
    } else {
      console.error(`::error::Delete failed for ${feed} (${res.status}: ${res.message})`);
      failures++;
    }
  }

  if (!dryRun) {
    const after = await apiRequest<SitemapsListResponse>(sitemapsUrl(SITE_URL), 'GET');
    if (after.ok) {
      console.log('Sitemaps now registered:');
      for (const s of after.data.sitemap ?? []) console.log(`  - ${s.path}`);
    }
  }

  if (failures > 0) process.exitCode = 1;
}

main().catch((err) => {
  console.error('Unexpected failure during sitemap remediation:', err);
  process.exitCode = 1;
});
