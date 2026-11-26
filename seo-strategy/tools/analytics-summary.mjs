// Leads + demand module. GA4 and Keyword Planner are only reachable through the
// AdvisorPPC connector (an agent tool, not an API this script can call), so the routine
// saves the raw tool results to data/analytics/raw-YYYY-MM-DD.json and
// data/keywords/YYYY-MM-DD.json (see routine-instructions.md), and this script turns them
// into an evidence-based summary:
//  - human sessions (Direct is excluded: its pattern in this property is bot traffic),
//  - WhatsApp leads (outbound wa.me clicks from GA4 enhanced measurement),
//  - demand vs visibility: Keyword Planner monthly searches next to our real Search
//    Console impressions/position for the same phrase.
import fs from 'node:fs';
import path from 'node:path';
import { DATA_DIR, todayPKT, writeEvidence, table } from './lib.mjs';

const newest = (dir, re, upTo) => {
  if (!fs.existsSync(dir)) return null;
  const f = fs.readdirSync(dir).filter((x) => re.test(x) && x.match(/\d{4}-\d{2}-\d{2}/)[0] <= upTo).sort().pop();
  return f ? { file: f, date: f.match(/\d{4}-\d{2}-\d{2}/)[0], data: JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')) } : null;
};
const BOT_CHANNELS = new Set(['Direct', 'Unassigned']);

export async function run(date = todayPKT()) {
  const ga = newest(path.join(DATA_DIR, 'analytics'), /^raw-\d{4}-\d{2}-\d{2}\.json$/, date);
  const kp = newest(path.join(DATA_DIR, 'keywords'), /^\d{4}-\d{2}-\d{2}\.json$/, date);
  const seo = newest(path.join(DATA_DIR, 'seo'), /^\d{4}-\d{2}-\d{2}\.json$/, date);
  if (!ga) return { ok: false, summary: 'no GA4 raw file saved (AdvisorPPC step not run or failed)', files: null };
  const ch = ga.data.channels || [];
  const human = ch.filter((c) => !BOT_CHANNELS.has(c.channel));
  const humanSessions = human.reduce((s, c) => s + c.sessions, 0);
  const allSessions = ch.reduce((s, c) => s + c.sessions, 0);
  const wa = (ga.data.outboundClicks || []).find((o) => o.domain === 'wa.me')?.clicks ?? 0;
  const maps = (ga.data.outboundClicks || []).find((o) => /maps/.test(o.domain))?.clicks ?? 0;
  const formStarts = (ga.data.events || []).find((e) => e.event === 'form_start')?.count ?? 0;
  const sc = new Map((seo?.data?.targets || []).map((t) => [t.query, t]));
  const demand = (kp?.data?.keywords || []).map((k) => {
    const t = sc.get(k.keyword);
    return { keyword: k.keyword, searches: k.searches, impressions: t?.impressions ?? null, position: t?.position ?? null,
      gap: k.searches >= 100 && (!t || !t.impressions) ? 'NOT VISIBLE' : k.searches >= 100 && t.position > 10 ? 'page 2+' : '' };
  });
  const json = { generatedAt: new Date().toISOString(), ga4Source: ga.file, keywordSource: kp?.file || null, seoSource: seo?.file || null,
    dateRange: ga.data.dateRange, humanSessions, allSessions, botShare: allSessions ? +(1 - humanSessions / allSessions).toFixed(3) : null,
    leads: { whatsappClicks: wa, mapsClicks: maps, formStarts, whatsappPerHumanSession: humanSessions ? +(wa / humanSessions).toFixed(3) : null,
      whatsappByChannel: ga.data.whatsappClicksByChannel || [] }, channels: ch, demand };
  const md = `# Leads, traffic quality and demand — ${date}

GA4 property 544826662 (${ga.data.dateRange}), saved ${ga.date}. Keyword Planner (Pakistan) saved ${kp?.date || '—'}. Search Console from SEO insights ${seo?.date || '—'}.

## Traffic quality
${table(['Channel', 'Sessions', 'Engaged', 'Counted as human?'], ch.map((c) => [c.channel, c.sessions, c.engagedSessions, BOT_CHANNELS.has(c.channel) ? 'no (bot pattern)' : 'yes']))}

- **Human sessions: ${humanSessions}** of ${allSessions} recorded (${allSessions ? ((100 * humanSessions) / allSessions).toFixed(1) : '?'}%). Direct is excluded because it shows bot signatures: worldwide countries, every session "engaged", almost no scroll or engagement events.

## Leads (actual clicks, not estimates)
${table(['Lead action', 'Count', 'Source'], [
    ['WhatsApp click (wa.me)', wa, 'GA4 enhanced-measurement outbound click'],
    ['Google Maps click', maps, 'GA4 outbound click'],
    ['Contact form started', formStarts, 'GA4 form_start'],
    ['Phone call', 'not measured', 'tel: clicks are not tracked in GA4']])}

- WhatsApp clicks per human session: **${json.leads.whatsappPerHumanSession ?? '—'}**
- WhatsApp clicks by channel: ${(ga.data.whatsappClicksByChannel || []).map((c) => `${c.channel} ${c.clicks}`).join(', ') || '—'}

## Demand vs visibility (Keyword Planner searches/month vs our Search Console)
${demand.length ? table(['Keyword', 'Searches/mo (PK)', 'Our impressions (28d)', 'Our position', 'Gap'], demand.map((d) => [d.keyword, d.searches, d.impressions ?? '—', d.position == null ? '—' : d.position.toFixed(1), d.gap])) : 'No Keyword Planner data saved.'}
`;
  const files = writeEvidence('analytics', date, json, md);
  return { ok: true, summary: `${humanSessions} human sessions of ${allSessions} (rest bot-pattern Direct); ${wa} WhatsApp clicks, ${formStarts} form starts; ${demand.filter((d) => d.gap).length} high-demand keywords with a visibility gap`, files };
}

if (import.meta.url === `file://${process.argv[1]}`) run().then((r) => console.log(JSON.stringify(r, null, 2))).catch((e) => { console.error(e); process.exit(1); });
