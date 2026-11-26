// Competitor intelligence module: snapshots each competitor's public sitemap(s) and
// homepage title/H1, and diffs against the previous snapshot to surface NEW pages
// (new services, new blog posts, new location pages). Read-only; never copies content.
import { fetchText, parseSitemapLocs, stripTags, todayPKT, writeEvidence, previousSnapshot, table } from './lib.mjs';

export const COMPETITORS = [
  { name: 'Tulips Events', site: 'https://tulipsevents.com' },
  { name: 'a2z Events Solutions', site: 'https://a2zeventssolutionz.com' },
  { name: 'Peony Events', site: 'https://peonyeventsplanner.com.pk' },
  { name: 'HJ Planners', site: 'https://hjplanners.pk' },
  { name: 'Black Tie Events & Caters', site: 'https://blacktieeventsandcaters.com' },
];

async function sitemapUrls(site) {
  const tried = [];
  const roots = [`${site}/sitemap.xml`, `${site}/sitemap_index.xml`, `${site}/wp-sitemap.xml`];
  const robots = await fetchText(`${site}/robots.txt`, { retries: 0 });
  if (robots.ok) for (const m of robots.text.matchAll(/^\s*sitemap:\s*(\S+)/gim)) roots.unshift(m[1]);
  for (const root of [...new Set(roots)]) {
    const r = await fetchText(root, { retries: 0 });
    tried.push(`${root} → ${r.status || r.error}`);
    if (!r.ok || !/<(urlset|sitemapindex)/i.test(r.text)) continue;
    let locs = parseSitemapLocs(r.text);
    if (/<sitemapindex/i.test(r.text)) {
      const children = locs.slice(0, 25); locs = [];
      for (const c of children) { const cr = await fetchText(c, { retries: 0 }); if (cr.ok) locs.push(...parseSitemapLocs(cr.text)); }
    }
    return { source: root, urls: [...new Set(locs)].sort(), tried };
  }
  return { source: null, urls: [], tried };
}

const section = (u) => { try { const p = new URL(u).pathname.split('/').filter(Boolean); return p[0] || '/'; } catch { return '?'; } };

export async function run(date = todayPKT()) {
  const prev = previousSnapshot('competitors', date);
  const results = [];
  for (const c of COMPETITORS) {
    const home = await fetchText(c.site, { retries: 0 });
    const sm = await sitemapUrls(c.site);
    const title = stripTags((home.text.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || '');
    const h1 = stripTags((home.text.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1] || '');
    const before = new Set(prev?.data?.competitors?.find((p) => p.name === c.name)?.urls || []);
    const added = prev && before.size ? sm.urls.filter((u) => !before.has(u)) : [];
    const removed = prev && before.size ? [...before].filter((u) => !sm.urls.includes(u)) : [];
    const sections = {}; for (const u of sm.urls) sections[section(u)] = (sections[section(u)] || 0) + 1;
    results.push({ ...c, homeStatus: home.status || home.error, title, h1, sitemap: sm.source, sitemapTried: sm.tried, urlCount: sm.urls.length,
      sections, added, removed, urls: sm.urls });
  }
  const json = { generatedAt: new Date().toISOString(), comparedWith: prev?.date || null, competitors: results };
  const md = `# Competitor monitor — ${date}

Public sitemaps and homepages of ${COMPETITORS.length} competitors.${prev ? ` New/removed pages are against ${prev.date}.` : ' First snapshot: the baseline for future diffs.'}

${table(['Competitor', 'Home', 'Sitemap URLs', 'New pages', 'Removed', 'Homepage title'], results.map((r) => [r.name, r.homeStatus, r.sitemap ? r.urlCount : `none found`, prev ? r.added.length : '—', prev ? r.removed.length : '—', r.title.slice(0, 70)]))}

${results.map((r) => `## ${r.name}
- Sections: ${Object.entries(r.sections).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([k, v]) => `${k} (${v})`).join(', ') || '—'}
${r.added.length ? `- **New pages:**\n${r.added.slice(0, 30).map((u) => `  - ${u}`).join('\n')}` : ''}${r.sitemap ? '' : `\n- No sitemap: ${r.sitemapTried.join('; ')}`}`).join('\n\n')}
`;
  const files = writeEvidence('competitors', date, json, md);
  const newTotal = results.reduce((s, r) => s + r.added.length, 0);
  return { ok: true, summary: `${results.length} competitors, ${results.reduce((s, r) => s + r.urlCount, 0)} sitemap URLs${prev ? `, ${newTotal} new since ${prev.date}` : ' (baseline snapshot)'}`, files };
}

if (import.meta.url === `file://${process.argv[1]}`) run().then((r) => console.log(JSON.stringify(r, null, 2))).catch((e) => { console.error(e); process.exit(1); });
