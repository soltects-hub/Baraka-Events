/**
 * Turns the raw JSON written by fetch-search-console.ts into a human-readable
 * Markdown report. Every number here comes straight from that JSON file —
 * this script does no fabrication and calls no AI model. It only aggregates,
 * diffs, and thresholds real Search Console data. The optional AI step
 * (ai-summary.ts) runs after this and only adds prose on top of what's here.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { REPORTS_DIR, isoDate } from './config';
import type { PageRow, QueryRow, SearchConsoleReportData } from './types';

const DECLINE_THRESHOLD = -0.2; // flag a >=20% drop
const GROWTH_THRESHOLD = 0.2; // flag a >=20% gain
const MIN_CLICKS_FOR_TREND = 5; // ignore noise from near-zero-traffic pages
const LOW_CTR_THRESHOLD = 0.02; // 2%
const MIN_IMPRESSIONS_FOR_OPPORTUNITY = 10;

function pct(n: number): string {
  return `${n >= 0 ? '+' : ''}${(n * 100).toFixed(1)}%`;
}
function pctPoint(n: number): string {
  return `${(n * 100).toFixed(2)}%`;
}
function change(current: number, previous: number): number | null {
  if (previous === 0) return current > 0 ? Infinity : null;
  return (current - previous) / previous;
}

function pageDelta(current: PageRow[], previous: PageRow[]) {
  const byPage = new Map<string, { current: PageRow | null; previous: PageRow | null }>();
  for (const p of current) byPage.set(p.page, { current: p, previous: null });
  for (const p of previous) {
    const existing = byPage.get(p.page);
    if (existing) existing.previous = p;
    else byPage.set(p.page, { current: null, previous: p });
  }
  return [...byPage.entries()].map(([page, v]) => {
    const curClicks = v.current?.clicks ?? 0;
    const prevClicks = v.previous?.clicks ?? 0;
    return { page, curClicks, prevClicks, delta: change(curClicks, prevClicks), current: v.current, previous: v.previous };
  });
}

function renderAuthFailure(data: SearchConsoleReportData): string {
  const err = data.auth.ok ? null : data.auth.error;
  return `# Baraka Events SEO Report — ${data.generatedAt.slice(0, 10)}

## Status: Search Console data unavailable

This run could not authenticate to Google Cloud at all (Application Default
Credentials were not available). This should not happen in the GitHub Actions
workflow itself, since it authenticates via \`google-github-actions/auth@v3\`
before this script runs — it most likely means this script was run outside
that workflow (e.g. a local dev machine with no GCP credentials configured).

${err ? `**Error:** \`${err.status || 'n/a'}\` ${err.message}\n` : ''}

No SEO data was collected. No further sections were generated.
`;
}

function renderPermissionFailure(data: SearchConsoleReportData): string {
  const relevant = data.errors.find((e) => e.status === 403 || e.status === 404) ?? data.errors[0];
  return `# Baraka Events SEO Report — ${data.generatedAt.slice(0, 10)}

## Status: Search Console API access is not yet granted

Google Cloud authentication succeeded (Workload Identity Federation is working), but the Search Console API call itself failed:

- **Site queried:** \`${data.siteUrl}\`
- **HTTP status:** ${relevant?.status ?? 'unknown'}
- **Message:** ${relevant?.message ?? 'unknown error'}

### Exact manual action required

A Cloud IAM role does **not** grant access to a Search Console property — Search Console has its own, separate access-control list. To fix this:

1. Open [Google Search Console](https://search.google.com/search-console) for the \`${data.siteUrl}\` property (as an existing owner).
2. Go to **Settings → Users and permissions → Add user**.
3. Add this exact email as a user: \`baraka-seo-automation@baraka-events-seo-automation.iam.gserviceaccount.com\`
4. Grant it **Restricted** access (read-only is sufficient for this report; use **Full** only if a future phase needs to submit sitemaps or request indexing on this identity).
5. Also confirm the **Google Search Console API** (\`searchconsole.googleapis.com\`) is enabled on the \`baraka-events-seo-automation\` Google Cloud project — Cloud Console → APIs & Services → Library → "Google Search Console API" → Enable. (If it were disabled, the error above would be a 403 with a message about the API not being enabled, rather than a permission error — but it's worth confirming either way.)
6. If \`${data.siteUrl}\` is not actually how the property is verified in Search Console (e.g. it's verified as a Domain property instead), set the \`SEARCH_CONSOLE_SITE_URL\` repository variable to \`sc-domain:barakaevents.com\` and re-run.

No fabricated data follows — this report stops here until access is granted.
`;
}

function main() {
  const inPath = resolve(process.cwd(), REPORTS_DIR, 'data-latest.json');
  if (!existsSync(inPath)) {
    console.error(`No Search Console data found at ${inPath} — run fetch-search-console.ts first.`);
    process.exitCode = 1;
    return;
  }
  const data: SearchConsoleReportData = JSON.parse(readFileSync(inPath, 'utf8'));

  let markdown: string;

  if (!data.auth.ok) {
    markdown = renderAuthFailure(data);
  } else if (!data.current || !data.previous) {
    markdown = renderPermissionFailure(data);
  } else {
    markdown = renderFullReport(data);
  }

  mkdirSync(resolve(process.cwd(), REPORTS_DIR), { recursive: true });
  const outPath = resolve(process.cwd(), REPORTS_DIR, `report-${isoDate(new Date())}.md`);
  writeFileSync(outPath, markdown);
  writeFileSync(resolve(process.cwd(), REPORTS_DIR, 'latest.md'), markdown);
  console.log(`Report written to ${outPath}`);
}

function renderFullReport(data: SearchConsoleReportData): string {
  const { current, previous, periods } = data;
  if (!current || !previous) return renderPermissionFailure(data);

  const clicksDelta = change(current.totals.clicks, previous.totals.clicks);
  const impressionsDelta = change(current.totals.impressions, previous.totals.impressions);
  const ctrDelta = current.totals.ctr - previous.totals.ctr;
  const positionDelta = current.totals.position - previous.totals.position; // negative = improved (lower is better)

  const pageDeltas = pageDelta(current.topPages, previous.topPages);
  const declining = pageDeltas
    .filter((d) => d.prevClicks >= MIN_CLICKS_FOR_TREND && d.delta !== null && d.delta <= DECLINE_THRESHOLD)
    .sort((a, b) => (a.delta ?? 0) - (b.delta ?? 0));
  const winning = pageDeltas
    .filter((d) => (d.prevClicks >= MIN_CLICKS_FOR_TREND || d.curClicks >= MIN_CLICKS_FOR_TREND) && d.delta !== null && (d.delta === Infinity || d.delta >= GROWTH_THRESHOLD))
    .sort((a, b) => (b.curClicks - b.prevClicks) - (a.curClicks - a.prevClicks));

  const opportunities: QueryRow[] = current.topQueries
    .filter((q) => q.impressions >= MIN_IMPRESSIONS_FOR_OPPORTUNITY && q.ctr < LOW_CTR_THRESHOLD)
    .sort((a, b) => b.impressions - a.impressions);

  const technicalIssues: string[] = [];
  for (const sm of data.sitemaps ?? []) {
    if (sm.errors > 0 || sm.warnings > 0) {
      technicalIssues.push(`Sitemap \`${sm.path}\`: ${sm.errors} error(s), ${sm.warnings} warning(s).`);
    }
    if (sm.isPending) {
      technicalIssues.push(`Sitemap \`${sm.path}\` is still pending processing by Google.`);
    }
  }
  const badInspections = (data.urlInspections ?? []).filter(
    (u) => !u.error && u.coverageState && !/submitted and indexed/i.test(u.coverageState)
  );
  for (const u of badInspections) {
    technicalIssues.push(`\`${u.url}\`: coverage state is "${u.coverageState}" (verdict: ${u.verdict ?? 'unknown'}).`);
  }
  const inspectionErrors = (data.urlInspections ?? []).filter((u) => u.error);
  for (const u of inspectionErrors) {
    technicalIssues.push(`URL inspection failed for \`${u.url}\`: ${u.error}`);
  }
  for (const e of data.errors) {
    technicalIssues.push(`API error [${e.status}]: ${e.message}`);
  }

  const recommendedActions: string[] = [];
  for (const d of declining.slice(0, 5)) {
    recommendedActions.push(
      `Investigate \`${d.page}\` — clicks ${d.delta === Infinity ? 'appeared' : pct(d.delta ?? 0)} (${d.prevClicks} → ${d.curClicks} clicks over the last ${periods.current.startDate} to ${periods.current.endDate} vs the prior period).`
    );
  }
  for (const q of opportunities.slice(0, 5)) {
    recommendedActions.push(
      `Improve title/meta description for the query "${q.query}" — ${q.impressions} impressions but only ${pctPoint(q.ctr)} CTR (position ${q.position.toFixed(1)}).`
    );
  }
  for (const issue of technicalIssues.slice(0, 5)) {
    recommendedActions.push(`Fix: ${issue}`);
  }
  if (recommendedActions.length === 0) {
    recommendedActions.push('No evidence-based action items this period — metrics and technical checks are within normal range.');
  }

  const lines: string[] = [];
  lines.push(`# Baraka Events SEO Report — ${data.generatedAt.slice(0, 10)}`);
  lines.push('');
  lines.push(`Site: \`${data.siteUrl}\` · Current period: ${periods.current.startDate} to ${periods.current.endDate} (28 days) · Compared to: ${periods.previous.startDate} to ${periods.previous.endDate}`);
  lines.push('');

  lines.push('## Overview');
  lines.push('');
  lines.push('| Metric | Current | Previous | Change |');
  lines.push('|---|---|---|---|');
  lines.push(`| Clicks | ${current.totals.clicks} | ${previous.totals.clicks} | ${clicksDelta === null ? 'n/a' : clicksDelta === Infinity ? 'new' : pct(clicksDelta)} |`);
  lines.push(`| Impressions | ${current.totals.impressions} | ${previous.totals.impressions} | ${impressionsDelta === null ? 'n/a' : impressionsDelta === Infinity ? 'new' : pct(impressionsDelta)} |`);
  lines.push(`| CTR | ${pctPoint(current.totals.ctr)} | ${pctPoint(previous.totals.ctr)} | ${pctPoint(ctrDelta)} pts |`);
  lines.push(`| Avg. position | ${current.totals.position.toFixed(1)} | ${previous.totals.position.toFixed(1)} | ${positionDelta <= 0 ? 'improved by ' : 'worsened by '}${Math.abs(positionDelta).toFixed(1)} |`);
  lines.push('');

  lines.push('## Wins');
  lines.push('');
  if (winning.length === 0) {
    lines.push('No pages grew clicks by 20%+ this period.');
  } else {
    for (const w of winning.slice(0, 10)) {
      lines.push(`- \`${w.page}\`: ${w.prevClicks} → ${w.curClicks} clicks (${w.delta === Infinity ? 'new traffic' : pct(w.delta ?? 0)})`);
    }
  }
  lines.push('');

  lines.push('## Losses / pages needing attention');
  lines.push('');
  if (declining.length === 0) {
    lines.push('No pages dropped clicks by 20%+ this period.');
  } else {
    for (const d of declining.slice(0, 10)) {
      lines.push(`- \`${d.page}\`: ${d.prevClicks} → ${d.curClicks} clicks (${pct(d.delta ?? 0)})`);
    }
  }
  lines.push('');

  lines.push('## Top queries (current period)');
  lines.push('');
  lines.push('| Query | Clicks | Impressions | CTR | Avg. position |');
  lines.push('|---|---|---|---|---|');
  for (const q of current.topQueries.slice(0, 10)) {
    lines.push(`| ${q.query} | ${q.clicks} | ${q.impressions} | ${pctPoint(q.ctr)} | ${q.position.toFixed(1)} |`);
  }
  lines.push('');

  lines.push('## Top pages (current period)');
  lines.push('');
  lines.push('| Page | Clicks | Impressions | CTR | Avg. position |');
  lines.push('|---|---|---|---|---|');
  for (const p of current.topPages.slice(0, 10)) {
    lines.push(`| ${p.page} | ${p.clicks} | ${p.impressions} | ${pctPoint(p.ctr)} | ${p.position.toFixed(1)} |`);
  }
  lines.push('');

  lines.push('## Keyword opportunities');
  lines.push('');
  lines.push(`Queries with meaningful visibility (${MIN_IMPRESSIONS_FOR_OPPORTUNITY}+ impressions) but low click-through (<${LOW_CTR_THRESHOLD * 100}%) — usually a sign the title/description isn't compelling for what people are already seeing it for:`);
  lines.push('');
  if (opportunities.length === 0) {
    lines.push('No low-CTR, high-impression queries found this period.');
  } else {
    for (const q of opportunities.slice(0, 10)) {
      lines.push(`- "${q.query}" — ${q.impressions} impressions, ${pctPoint(q.ctr)} CTR, position ${q.position.toFixed(1)}`);
    }
  }
  lines.push('');

  lines.push('## Technical SEO issues');
  lines.push('');
  if (technicalIssues.length === 0) {
    lines.push('No sitemap errors/warnings and no indexing coverage issues detected on inspected URLs.');
  } else {
    for (const issue of technicalIssues) lines.push(`- ${issue}`);
  }
  lines.push('');

  lines.push('## Indexing status (URL Inspection)');
  lines.push('');
  if (!data.urlInspections || data.urlInspections.length === 0) {
    lines.push('Not collected this run.');
  } else {
    lines.push('| URL | Coverage state | Verdict | Last crawl |');
    lines.push('|---|---|---|---|');
    for (const u of data.urlInspections) {
      lines.push(`| ${u.url} | ${u.coverageState ?? (u.error ? 'error' : 'unknown')} | ${u.verdict ?? '—'} | ${u.lastCrawlTime ?? '—'} |`);
    }
  }
  lines.push('');

  lines.push('## Sitemap status');
  lines.push('');
  if (!data.sitemaps || data.sitemaps.length === 0) {
    lines.push('No sitemaps found for this property in Search Console.');
  } else {
    for (const sm of data.sitemaps) {
      lines.push(`- \`${sm.path}\` — last downloaded: ${sm.lastDownloaded ?? 'never'}, errors: ${sm.errors}, warnings: ${sm.warnings}${sm.isPending ? ' (pending)' : ''}`);
      for (const c of sm.contents) {
        lines.push(`  - ${c.type}: ${c.indexed}/${c.submitted} indexed`);
      }
    }
  }
  lines.push('');

  lines.push('## Recommended actions');
  lines.push('');
  for (const action of recommendedActions) lines.push(`- ${action}`);
  lines.push('');

  lines.push('---');
  lines.push('_Generated automatically from live Search Console data. No numbers in this report are AI-generated or estimated._');
  lines.push('');

  return lines.join('\n');
}

main();
