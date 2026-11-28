// Weekly data pack (Sunday). Assembles the last 7 days of REAL collector output into
// the evidence the weekly report is written from: organic performance, keyword movement,
// local/NAP, AI visibility rows, competitor movements, content work on seo/* branches,
// technical issues, authority opportunities, leads, completed work, failures, and three
// rule-based priorities. Never prints customer names or phone numbers.
import fs from 'node:fs';
import path from 'node:path';
import { DATA_DIR, STRATEGY_DIR, todayPKT, writeEvidence, snapshotsBetween, git, table, pct } from './lib.mjs';

const addDays = (d, n) => new Date(new Date(`${d}T12:00:00Z`).getTime() + n * 864e5).toISOString().slice(0, 10);
const latestOf = (arr) => (arr.length ? arr[arr.length - 1] : null);
const f1 = (n) => (n == null ? '—' : Number(n).toFixed(1));

function csvRows(file) {
  if (!fs.existsSync(file)) return [];
  const lines = fs.readFileSync(file, 'utf8').trim().split('\n');
  const head = lines.shift().split(',');
  return lines.map((l) => {
    const cells = []; let cur = '', q = false;
    for (const ch of l) { if (ch === '"') q = !q; else if (ch === ',' && !q) { cells.push(cur); cur = ''; } else cur += ch; }
    cells.push(cur);
    return Object.fromEntries(head.map((h, i) => [h, cells[i] ?? '']));
  });
}

export async function run(date = todayPKT()) {
  const from = addDays(date, -6);
  const seo = snapshotsBetween('seo', from, date), audit = snapshotsBetween('site-audit', from, date);
  const comp = snapshotsBetween('competitors', from, date), aeo = snapshotsBetween('aeo', from, date), ana = snapshotsBetween('analytics', from, date);
  const s = latestOf(seo)?.data, a = latestOf(audit)?.data, an = latestOf(ana)?.data, q = latestOf(aeo)?.data;

  // AI visibility rows tested this week.
  const ai = csvRows(path.join(STRATEGY_DIR, 'sprint-2', '6-ai-visibility-tracker.csv')).filter((r) => r.date_tested >= from && r.date_tested <= date);
  const byPlatform = {};
  for (const r of ai) { const p = (byPlatform[r.platform] ||= { tested: 0, mentioned: 0, untested: 0 }); if (r.status === 'tested') { p.tested++; if (r.baraka_appears === 'Y') p.mentioned++; } else p.untested++; }
  // Reviews (counts only).
  const reviews = csvRows(path.join(STRATEGY_DIR, 'execution', 'review-tracker.csv')).filter((r) => /^\d{4}-/.test(r.review_date) && r.review_date >= from && r.review_date <= date);
  // Competitor new pages this week.
  const compNew = comp.flatMap((c) => c.data.competitors.map((x) => ({ date: c.date, name: x.name, added: x.added }))).filter((x) => x.added.length);
  // Content work on seo/* branches this week.
  let content = [];
  try {
    content = git(['log', '--remotes=origin/seo/*', `--since=${from}T00:00:00+05:00`, '--format=%h|%ad|%s|%D', '--date=short']).trim().split('\n').filter(Boolean)
      .map((l) => { const [h, d, subj, refs] = l.split('|'); return { hash: h, date: d, subject: subj, refs }; });
  } catch { /* no remote branches */ }
  // Daily log headings and failed collector runs this week.
  const log = fs.readFileSync(path.join(STRATEGY_DIR, 'ops', 'daily-log.md'), 'utf8');
  const entries = [...log.matchAll(/^## (\d{4}-\d{2}-\d{2})[^\n]*$/gm)].filter((m) => m[1] >= from && m[1] <= date).map((m) => m[0].slice(3));
  const runLogFile = path.join(DATA_DIR, 'run-log.jsonl');
  const runs = fs.existsSync(runLogFile) ? fs.readFileSync(runLogFile, 'utf8').trim().split('\n').filter(Boolean).map((l) => JSON.parse(l)).filter((r) => r.date >= from && r.date <= date) : [];
  const failed = runs.filter((r) => !r.ok);
  const outreach = fs.existsSync(path.join(STRATEGY_DIR, 'sprint-2', '3-authority-outreach.md'))
    ? (fs.readFileSync(path.join(STRATEGY_DIR, 'sprint-2', '3-authority-outreach.md'), 'utf8').match(/^\| *\d+ *\|/gm) || []).length : 0;

  // Rule-based priorities from this week's evidence (not opinions).
  const priorities = [];
  const gap = an?.demand?.filter((d) => d.gap).sort((x, y) => y.searches - x.searches)[0];
  if (gap) priorities.push(`Demand gap: "${gap.keyword}" has ${gap.searches} searches/month in Pakistan; we have ${gap.impressions ?? 0} impressions${gap.position ? ` at position ${f1(gap.position)}` : ''}.`);
  const opp = s?.opportunities?.[0];
  if (opp) priorities.push(`Page-1 push: "${opp.query}" at position ${f1(opp.position)} with ${opp.impressions} impressions (28 days).`);
  const uq = q?.questions?.filter((r) => !r.answered && r.impressions).sort((x, y) => y.impressions - x.impressions)[0];
  if (uq) priorities.push(`Unanswered question with real impressions: "${uq.question}" (${uq.impressions} impressions, position ${uq.position}).`);
  if (a?.summary?.apexDomain && !/HTTP 200|HTTP 30/.test(a.summary.apexDomain)) priorities.push(`Bare domain barakaevents.com: ${a.summary.apexDomain} (owner fix O4).`);

  const json = { generatedAt: new Date().toISOString(), week: { from, to: date }, seo: s ? { source: s.source, totals: s.totals, totalsWeekAgo: s.totalsWeekAgo, totalsBaseline: s.totalsBaseline } : null,
    targets: s?.targets || [], movers: s?.movers || [], technical: a?.summary || null, newTechnicalIssues: a?.newIssues || [], fixedTechnicalIssues: a?.fixedIssues || [],
    leads: an?.leads || null, humanSessions: an?.humanSessions ?? null, aiVisibility: byPlatform, aiRows: ai.length, reviewsThisWeek: reviews.length,
    competitorNewPages: compNew, contentCommits: content, logEntries: entries, collectorRuns: runs.length, collectorFailures: failed, outreachOpportunities: outreach, priorities: priorities.slice(0, 3) };

  const t = s?.totals, w = s?.totalsWeekAgo, b = s?.totalsBaseline;
  const md = `# Weekly data pack — ${from} to ${date}

Built from this week's collector snapshots (seo ${seo.length}, site-audit ${audit.length}, competitors ${comp.length}, aeo ${aeo.length}, analytics ${ana.length}), the AI tracker, the review tracker (counts only), seo/* branch commits and the daily log.

## 1. Google organic performance (Search Console, rolling 28 days)
${t ? table(['Metric', 'This week', 'Week ago', 'Baseline 24 Nov'], [['Clicks', t.clicks, w?.clicks, b?.clicks ?? '—'], ['Impressions', t.impressions, w?.impressions, b?.impressions ?? '—'], ['CTR', pct(t.clicks, t.impressions), w ? pct(w.clicks, w.impressions) : '—', b ? pct(b.clicks, b.impressions) : '—'], ['Avg position', f1(t.position), f1(w?.position), f1(b?.position)]]) : 'No SEO snapshot this week.'}

## 2. Keyword movement (targets)
${s ? table(['Query', 'Now', 'Week ago', 'Δ', 'Page'], s.targets.filter((r) => r.position != null).map((r) => [r.query, f1(r.position), f1(r.positionWeekAgo), r.change ?? '—', r.page])) : '—'}
${s?.movers?.length ? `\nOther movers (±2, ≥10 impressions): ${s.movers.slice(0, 8).map((m) => `${m.query} ${m.from}→${m.to}`).join('; ')}` : ''}

## 3. Local SEO
- NAP on our own pages: phone missing on ${a?.summary?.phoneMissing ?? '?'} of ${a?.summary?.pages ?? '?'} pages, address missing on ${a?.summary?.addressMissing ?? '?'}.
- New Google reviews logged this week: ${reviews.length} (review tracker). Business Profile insights: not available (no API access).
- Maps clicks from the site: ${an?.leads?.mapsClicks ?? '—'} (GA4, 28 days).

## 4. AI visibility and citations (only platforms actually tested)
${Object.keys(byPlatform).length ? table(['Platform', 'Tested', 'Baraka mentioned', 'Untested'], Object.entries(byPlatform).map(([p, v]) => [p, v.tested, v.mentioned, v.untested])) : 'No AI tracker rows dated this week.'}

## 5. Competitor movements
${compNew.length ? compNew.map((c) => `- ${c.date} ${c.name}: ${c.added.length} new pages, e.g. ${c.added.slice(0, 3).join(', ')}`).join('\n') : comp.length ? 'No new competitor pages detected this week.' : 'No competitor snapshot this week.'}

## 6. Content improvements (seo/* branches, not live until approved)
${content.length ? content.map((c) => `- ${c.date} \`${c.hash}\` ${c.subject} (${c.refs || 'branch'})`).join('\n') : 'No new commits on seo/* branches this week.'}

## 7. Technical issues
${a ? `${a.summary.pages} pages crawled · ${a.summary.non200} non-200 · ${a.summary.withIssues} with SEO issues · bare domain: ${a.summary.apexDomain}.` : '—'}
${a?.newIssues?.length ? `New: ${a.newIssues.join('; ')}` : ''}${a?.fixedIssues?.length ? `\nFixed: ${a.fixedIssues.join('; ')}` : ''}

## 8. Authority and backlink opportunities
- Verified opportunities in the outreach list: ${outreach} (none sent; each needs owner approval).

## 9. Leads and conversions (GA4, 28 days)
${an ? `- Human sessions ${an.humanSessions} (bot-pattern Direct excluded) · WhatsApp clicks ${an.leads.whatsappClicks} · form starts ${an.leads.formStarts} · calls not measured.` : '- No analytics snapshot this week.'}

## 10. Work completed (daily log)
${entries.map((e) => `- ${e}`).join('\n') || '—'}

## 11. Failed or blocked collector runs
${failed.length ? failed.map((f) => `- ${f.date} ${f.module}: ${f.summary}`).join('\n') : `None (${runs.length} module runs).`}

## 12. Top 3 priorities (rule-based from the evidence above)
${priorities.slice(0, 3).map((p, i) => `${i + 1}. ${p}`).join('\n') || '—'}
`;
  const files = writeEvidence('weekly', date, json, md);
  return { ok: true, summary: `week ${from}→${date}: ${seo.length + audit.length + comp.length + aeo.length + ana.length} snapshots, ${ai.length} AI rows, ${failed.length} failed runs, ${priorities.length} priorities`, files };
}

if (import.meta.url === `file://${process.argv[1]}`) run().then((r) => console.log(JSON.stringify(r, null, 2))).catch((e) => { console.error(e); process.exit(1); });
