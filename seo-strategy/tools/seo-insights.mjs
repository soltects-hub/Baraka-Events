// SEO module: reads the REAL Search Console snapshots that the repo's GitHub Action
// (.github/workflows/seo-automation.yml, service account) pushes daily to
// origin/seo-report/YYYY-MM-DD, and turns them into week-over-week movement for the
// target keywords, page-1 opportunities, CTR gaps, indexing problems and cannibalisation.
// It does not call Google itself, so it needs no credentials.
import { git, todayPKT, writeEvidence, table, pct } from './lib.mjs';

export const TARGETS = [
  'event planner in lahore', 'event planners in lahore', 'best event planner in lahore', 'event planner lahore',
  'event management company in lahore', 'event management companies in lahore', 'wedding planner in lahore',
  'wedding planner lahore', 'wedding event planner in lahore', 'wedding decorators lahore', 'wedding decorators in lahore',
  'corporate event planner lahore', 'birthday event planner lahore', 'catering services lahore',
];
const BASELINE_DATE = '2026-11-24';

function reportDates() {
  try { git(['fetch', '-q', 'origin', '+refs/heads/seo-report/*:refs/remotes/origin/seo-report/*']); } catch { /* offline: use what we have */ }
  return git(['branch', '-r', '--list', 'origin/seo-report/20*']).split('\n').map((s) => s.trim().replace('origin/seo-report/', ''))
    .filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)).sort();
}

function loadReport(date) {
  const raw = git(['show', `origin/seo-report/${date}:reports/seo/data-${date}.json`]);
  return JSON.parse(raw);
}

const qIndex = (rep) => new Map((rep.current?.allQueries || []).map((r) => [r.query.toLowerCase(), r]));
const f1 = (n) => (n == null ? '—' : Number(n).toFixed(1));

export async function run(date = todayPKT()) {
  const dates = reportDates().filter((d) => d <= date);
  if (!dates.length) throw new Error('no origin/seo-report/* branches found');
  const latest = dates[dates.length - 1];
  const weekAgo = [...dates].reverse().find((d) => (new Date(latest) - new Date(d)) / 864e5 >= 7) || dates[0];
  const cur = loadReport(latest);
  const prev = loadReport(weekAgo);
  const base = dates.includes(BASELINE_DATE) ? loadReport(BASELINE_DATE) : null;
  const ci = qIndex(cur), pi = qIndex(prev), bi = base ? qIndex(base) : new Map();

  // Which page ranks for each query (page x query rows).
  const owners = new Map();
  for (const r of cur.current?.pageQueries || []) {
    const k = r.query.toLowerCase();
    if (!owners.has(k)) owners.set(k, []);
    owners.get(k).push(r);
  }
  const ownerOf = (q) => (owners.get(q) || []).sort((a, b) => b.impressions - a.impressions)[0]?.page?.replace('https://www.barakaevents.com', '') || '—';

  const targets = TARGETS.map((q) => {
    const c = ci.get(q), p = pi.get(q), b = bi.get(q);
    return { query: q, position: c?.position ?? null, impressions: c?.impressions ?? 0, clicks: c?.clicks ?? 0,
      positionWeekAgo: p?.position ?? null, positionBaseline: b?.position ?? null,
      change: c && p ? +(p.position - c.position).toFixed(1) : null, page: ownerOf(q) };
  });

  const all = cur.current?.allQueries || [];
  const opportunities = all.filter((r) => r.position >= 4 && r.position <= 20 && r.impressions >= 10)
    .sort((a, b) => b.impressions - a.impressions).slice(0, 20);
  // CTR gap: page-1 queries (pos <= 10) with impressions but CTR under 2% — the snippet, not the rank, is the limit.
  const ctrGaps = all.filter((r) => r.position <= 10 && r.impressions >= 20 && r.ctr < 0.02).sort((a, b) => b.impressions - a.impressions).slice(0, 10);
  const movers = all.map((r) => ({ ...r, prev: pi.get(r.query.toLowerCase()) }))
    .filter((r) => r.prev && r.impressions >= 10 && Math.abs(r.prev.position - r.position) >= 2)
    .map((r) => ({ query: r.query, from: +r.prev.position.toFixed(1), to: +r.position.toFixed(1), impressions: r.impressions }))
    .sort((a, b) => (b.from - b.to) - (a.from - a.to));
  const cannibal = [...owners.entries()].filter(([, rows]) => rows.filter((r) => r.impressions >= 5).length > 1)
    .map(([q, rows]) => ({ query: q, pages: rows.filter((r) => r.impressions >= 5).map((r) => `${r.page.replace('https://www.barakaevents.com', '') || '/'} (${r.impressions} impr, pos ${f1(r.position)})`) }))
    .slice(0, 15);
  const indexing = (cur.urlInspections || []).filter((u) => u.verdict !== 'PASS')
    .map((u) => ({ url: u.url, verdict: u.verdict, coverage: u.coverageState, googleCanonical: u.googleCanonical }));

  const t = cur.current.totals, pt = prev.current.totals, bt = base?.current?.totals;
  const json = { generatedAt: new Date().toISOString(), source: `origin/seo-report/${latest}`, comparedWith: `origin/seo-report/${weekAgo}`,
    window: cur.periods?.current || null, totals: t, totalsWeekAgo: pt, totalsBaseline: bt || null,
    targets, opportunities, ctrGaps, movers, cannibalisation: cannibal, indexingProblems: indexing, apiErrors: cur.errors || [] };

  const md = `# SEO insights — ${date}

Source: Search Console snapshot \`origin/seo-report/${latest}\` (window ${cur.periods?.current?.startDate || '?'} → ${cur.periods?.current?.endDate || '?'}), compared with \`${weekAgo}\` and the ${BASELINE_DATE} baseline.

${table(['Metric', 'Now', 'Week ago', 'Baseline'], [
    ['Clicks', t.clicks, pt.clicks, bt?.clicks ?? '—'],
    ['Impressions', t.impressions, pt.impressions, bt?.impressions ?? '—'],
    ['CTR', pct(t.clicks, t.impressions), pct(pt.clicks, pt.impressions), bt ? pct(bt.clicks, bt.impressions) : '—'],
    ['Avg position', f1(t.position), f1(pt.position), bt ? f1(bt.position) : '—']])}

## Target keywords
${table(['Query', 'Pos now', 'Week ago', 'Baseline', 'Δ (+ = better)', 'Impr', 'Clicks', 'Ranking page'],
    targets.map((r) => [r.query, f1(r.position), f1(r.positionWeekAgo), f1(r.positionBaseline), r.change ?? '—', r.impressions, r.clicks, r.page]))}

## Page-1 opportunities (position 4–20, ≥10 impressions)
${opportunities.length ? table(['Query', 'Pos', 'Impr', 'Clicks'], opportunities.map((r) => [r.query, f1(r.position), r.impressions, r.clicks])) : 'None.'}

## CTR gaps (position ≤10, ≥20 impressions, CTR <2%)
${ctrGaps.length ? table(['Query', 'Pos', 'Impr', 'CTR'], ctrGaps.map((r) => [r.query, f1(r.position), r.impressions, pct(r.clicks, r.impressions)])) : 'None.'}

## Movers (±2 positions, ≥10 impressions, vs ${weekAgo})
${movers.length ? table(['Query', 'From', 'To', 'Impr'], movers.slice(0, 15).map((r) => [r.query, r.from, r.to, r.impressions])) : 'None.'}

## Cannibalisation (query answered by 2+ of our pages, ≥5 impressions each)
${cannibal.length ? cannibal.map((c) => `- **${c.query}**: ${c.pages.join('; ')}`).join('\n') : 'None.'}

## Indexing problems (URL Inspection verdict ≠ PASS)
${indexing.length ? indexing.map((u) => `- ${u.url}: ${u.verdict} — ${u.coverage}`).join('\n') : `None among ${(cur.urlInspections || []).length} inspected URLs.`}
${(cur.errors || []).length ? `\n## API errors in the snapshot\n${cur.errors.map((e) => `- ${typeof e === 'string' ? e : JSON.stringify(e)}`).join('\n')}` : ''}
`;
  const files = writeEvidence('seo', date, json, md);
  return { ok: true, summary: `SC ${latest}: ${t.clicks} clicks, ${t.impressions} impr, pos ${f1(t.position)}; ${opportunities.length} page-1 opportunities, ${indexing.length} indexing problems, ${cannibal.length} cannibalised queries`, files };
}

if (import.meta.url === `file://${process.argv[1]}`) run().then((r) => console.log(JSON.stringify(r, null, 2))).catch((e) => { console.error(e); process.exit(1); });
