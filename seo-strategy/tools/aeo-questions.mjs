// AEO module: collects the real questions people type, from Google Autocomplete
// (Pakistan, English) and from question-style Search Console queries, then checks
// whether the live site already answers each one in an FAQ (FAQPage schema) or a heading.
// Output: new questions since the last snapshot + unanswered questions ranked by evidence.
import { fetchText, todayPKT, writeEvidence, previousSnapshot, table, SITE, parseSitemapLocs, stripTags, DATA_DIR } from './lib.mjs';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const SEEDS = ['event planner lahore', 'wedding planner lahore', 'mehndi event', 'walima event', 'barat event', 'nikkah ceremony', 'wedding catering lahore',
  'wedding decor lahore', 'corporate event lahore', 'birthday party lahore', 'event management company'];
const PREFIXES = ['how much', 'what is', 'how to', 'which', 'best', 'cost of', 'price of', 'who'];
const QUESTION = /^(how|what|which|who|why|when|where|is|are|can|do|does|should|best|cost|price|average)\b/;
// Keep only questions an event buyer asks; drop autocomplete noise (e.g. "baratza grinder", "barat dress").
const RELEVANT = /\b(events?|wedding|shaadi|shadi|mehndi|mehendi|barat|baraat|walima|valima|nikah|nikkah|cater(ing|er|ers)|decor(ation)?|party|planners?|planning|organi[sz]ers?|birthday|venues?|halls?|marquee|conference|seminar|exhibition|corporate|menu|reception|engagement|dholki|qawwali)\b/;
const NOISE = /\b(dress|grinder|coffee|build|game|movie|song|lyrics|wallpaper|hairstyle|makeup|jewel|shoes|cake recipe)\b/;
const STOP = new Set(['in', 'the', 'a', 'an', 'of', 'for', 'to', 'is', 'and', 'what', 'how', 'much', 'does', 'do', 'which', 'who', 'best', 'are', 'can', 'lahore', 'pakistan', 'my', 'i', 'should']);

async function suggest(q) {
  const u = `https://suggestqueries.google.com/complete/search?client=firefox&hl=en&gl=pk&q=${encodeURIComponent(q)}`;
  const r = await fetchText(u, { retries: 1 });
  if (!r.ok) return { q, error: r.status || r.error, items: [] };
  try { return { q, items: JSON.parse(r.text)[1] || [] }; } catch { return { q, error: 'bad json', items: [] }; }
}

const tokens = (s) => s.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter((w) => w.length > 2 && !STOP.has(w));

async function siteAnswers() {
  // Prefer the site-audit crawl of the same day; otherwise fetch FAQ/heading text live.
  const sm = await fetchText(`${SITE}/sitemap.xml`);
  const urls = sm.ok ? parseSitemapLocs(sm.text) : [];
  const answers = [];
  for (const u of urls) {
    const r = await fetchText(u, { retries: 0 });
    if (!r.ok) continue;
    for (const m of r.text.matchAll(/"@type"\s*:\s*"Question"\s*,\s*"name"\s*:\s*"([^"]+)"/g)) answers.push({ url: u.replace(SITE, '') || '/', text: m[1], kind: 'faq' });
    for (const m of r.text.matchAll(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/gi)) answers.push({ url: u.replace(SITE, '') || '/', text: stripTags(m[1]), kind: 'heading' });
  }
  return answers;
}

function bestMatch(q, answers) {
  const qt = tokens(q); if (!qt.length) return null;
  let best = null;
  for (const a of answers) {
    const at = new Set(tokens(a.text));
    const hit = qt.filter((w) => at.has(w)).length / qt.length;
    if (!best || hit > best.score) best = { ...a, score: hit };
  }
  return best && best.score >= 0.6 ? best : null;
}

function scQuestions() {
  // Question-style queries from the newest SEO insights snapshot's source report (real impressions).
  const dir = path.join(DATA_DIR, 'seo');
  if (!fs.existsSync(dir)) return [];
  const f = fs.readdirSync(dir).filter((x) => x.endsWith('.json')).sort().pop();
  if (!f) return [];
  const src = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')).source?.replace('origin/', '');
  try {
    const date = src.split('/')[1];
    const raw = execFileSync('git', ['show', `origin/${src}:reports/seo/data-${date}.json`], { encoding: 'utf8', maxBuffer: 1 << 28 });
    return (JSON.parse(raw).current?.allQueries || []).filter((r) => (QUESTION.test(r.query) || /\b(price|cost|rate|charges|package)\b/.test(r.query)) && RELEVANT.test(r.query) && !NOISE.test(r.query))
      .map((r) => ({ q: r.query, impressions: r.impressions, position: +r.position.toFixed(1) }));
  } catch { return []; }
}

export async function run(date = todayPKT()) {
  const queries = [];
  for (const s of SEEDS) { queries.push(s); for (const p of PREFIXES) queries.push(`${p} ${s}`); }
  const results = [];
  for (const q of queries) { results.push(await suggest(q)); await new Promise((r) => setTimeout(r, 150)); }
  const errors = results.filter((r) => r.error);
  const auto = [...new Set(results.flatMap((r) => r.items))].filter((s) => (QUESTION.test(s) || /\b(price|cost|rate|charges|package|menu)\b/.test(s)) && RELEVANT.test(s) && !NOISE.test(s));
  const sc = scQuestions();
  const answers = await siteAnswers();
  const all = new Map();
  for (const q of auto) all.set(q, { question: q, source: 'autocomplete', impressions: null, position: null });
  for (const r of sc) all.set(r.q, { question: r.q, source: all.has(r.q) ? 'autocomplete+search-console' : 'search-console', impressions: r.impressions, position: r.position });
  const rows = [...all.values()].map((r) => { const m = bestMatch(r.question, answers); return { ...r, answered: !!m, answeredBy: m ? `${m.url} (${m.kind}: ${m.text.slice(0, 60)})` : null }; });
  const prev = previousSnapshot('aeo', date);
  const before = new Set((prev?.data?.questions || []).map((r) => r.question));
  const fresh = prev ? rows.filter((r) => !before.has(r.question)) : [];
  const unanswered = rows.filter((r) => !r.answered).sort((a, b) => (b.impressions || 0) - (a.impressions || 0) || a.question.localeCompare(b.question));
  const json = { generatedAt: new Date().toISOString(), autocompleteRequests: queries.length, autocompleteErrors: errors.length, siteAnswerSnippets: answers.length,
    comparedWith: prev?.date || null, questions: rows, newQuestions: fresh.map((r) => r.question) };
  const md = `# AEO question research — ${date}

Google Autocomplete (Pakistan, English): ${queries.length} requests, ${errors.length} errors → ${auto.length} question/price-style suggestions. Search Console question-style queries: ${sc.length}. Site FAQ questions and H2/H3 headings checked: ${answers.length}.

- Answered on the site (≥60% keyword match to an FAQ or heading): **${rows.filter((r) => r.answered).length}** of ${rows.length}
- Unanswered: **${unanswered.length}**${prev ? `\n- New since ${prev.date}: **${fresh.length}**` : '\n- First snapshot (baseline for "new questions").'}

## Unanswered questions (Search Console impressions first)
${table(['Question', 'Source', 'SC impressions', 'SC position'], unanswered.slice(0, 40).map((r) => [r.question, r.source, r.impressions ?? '—', r.position ?? '—']))}
${fresh.length ? `\n## New since ${prev.date}\n${fresh.map((r) => `- ${r.question} (${r.source})`).join('\n')}` : ''}

## Already answered (sample)
${rows.filter((r) => r.answered).slice(0, 15).map((r) => `- ${r.question} → ${r.answeredBy}`).join('\n') || 'None.'}
`;
  const files = writeEvidence('aeo', date, json, md);
  if (errors.length === queries.length) return { ok: false, summary: `Autocomplete failed for all ${queries.length} requests (${errors[0]?.error})`, files };
  return { ok: true, summary: `${rows.length} real questions (${auto.length} autocomplete, ${sc.length} Search Console); ${unanswered.length} unanswered${prev ? `, ${fresh.length} new` : ''}`, files };
}

if (import.meta.url === `file://${process.argv[1]}`) run().then((r) => console.log(JSON.stringify(r, null, 2))).catch((e) => { console.error(e); process.exit(1); });
