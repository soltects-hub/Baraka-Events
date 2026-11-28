// Technical SEO + conversion + NAP module. Crawls every URL in the LIVE sitemap
// (read-only GET requests, polite concurrency) and records, per page: HTTP status,
// title/meta lengths, H1s, canonical, JSON-LD types, FAQPage, word count, internal
// links, and the lead paths a visitor can actually use (WhatsApp, tel:, contact form).
// It also checks that every page states the same phone number and address (NAP).
import { fetchText, parseSitemapLocs, stripTags, todayPKT, writeEvidence, previousSnapshot, table, SITE } from './lib.mjs';

const PHONE_DIGITS = '923139999039'; // +92 313 9999039 (owner-confirmed, Business Profile)
const ADDRESS_TOKENS = ['big city plaza', 'gulberg']; // the address string the Business Profile uses

const decode = (s) => s.replace(/&nbsp;| /g, ' ').replace(/&amp;/g, '&').replace(/&#39;|&rsquo;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();
const attr = (tag, name) => (tag.match(new RegExp(`${name}\\s*=\\s*"([^"]*)"`, 'i')) || [])[1];

function analyse(url, res) {
  const html = res.text || '';
  const title = decode((html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || '');
  const metaTag = (html.match(/<meta[^>]+name="description"[^>]*>/i) || [])[0] || '';
  const description = decode(attr(metaTag, 'content') || '');
  const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => decode(stripTags(m[1])));
  const canonical = attr((html.match(/<link[^>]+rel="canonical"[^>]*>/i) || [''])[0], 'href') || null;
  const robots = attr((html.match(/<meta[^>]+name="robots"[^>]*>/i) || [''])[0], 'content') || null;
  const ldTypes = [];
  for (const m of html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const walk = (o) => { if (!o || typeof o !== 'object') return; if (Array.isArray(o)) return o.forEach(walk); if (o['@type']) ldTypes.push([].concat(o['@type']).join('/')); Object.values(o).forEach(walk); };
      walk(JSON.parse(m[1]));
    } catch { ldTypes.push('INVALID_JSON'); }
  }
  const hrefs = [...html.matchAll(/<a\b[^>]*href="([^"]+)"/gi)].map((m) => m[1]);
  const internal = new Set(hrefs.filter((h) => h.startsWith('/') || h.startsWith(SITE)).map((h) => h.replace(SITE, '').split('#')[0] || '/'));
  const text = stripTags(html);
  const digits = html.replace(/\D/g, '');
  const lower = text.toLowerCase();
  const leadPaths = {
    whatsapp: hrefs.filter((h) => /wa\.me|api\.whatsapp|whatsapp\.com/i.test(h)).length,
    tel: hrefs.filter((h) => h.startsWith('tel:')).length,
    form: /<form\b/i.test(html),
    contactLink: hrefs.some((h) => /\/contact|#contact/i.test(h)),
  };
  const issues = [];
  if (res.status !== 200) issues.push(`HTTP ${res.status}`);
  if (!title) issues.push('missing title'); else if (title.length > 60) issues.push(`title ${title.length} chars (>60)`);
  if (!description) issues.push('missing meta description'); else if (description.length > 160 || description.length < 70) issues.push(`meta description ${description.length} chars`);
  if (h1s.length !== 1) issues.push(`${h1s.length} H1s`);
  if (!canonical) issues.push('no canonical'); else if (canonical.replace(/\/$/, '') !== url.replace(/\/$/, '')) issues.push(`canonical → ${canonical}`);
  if (robots && /noindex/i.test(robots)) issues.push('noindex');
  if (ldTypes.includes('INVALID_JSON')) issues.push('invalid JSON-LD');
  const conversion = [];
  if (!leadPaths.whatsapp && !leadPaths.tel && !leadPaths.form) conversion.push('no WhatsApp, call or form on the page');
  else if (!leadPaths.tel) conversion.push('no tap-to-call link');
  const nap = { phone: digits.includes(PHONE_DIGITS), address: ADDRESS_TOKENS.every((t) => lower.includes(t)) };
  return { url: url.replace(SITE, '') || '/', status: res.status, title, titleLength: title.length, description, descriptionLength: description.length,
    h1s, canonical, robots, ldTypes: [...new Set(ldTypes)], faq: ldTypes.includes('FAQPage'), words: text.split(' ').length,
    internalLinks: internal.size, leadPaths, nap, issues, conversion };
}

async function pool(items, n, fn) {
  const out = new Array(items.length); let i = 0;
  await Promise.all(Array.from({ length: n }, async () => { while (i < items.length) { const k = i++; out[k] = await fn(items[k]); } }));
  return out;
}

export async function run(date = todayPKT()) {
  const sm = await fetchText(`${SITE}/sitemap.xml`);
  if (!sm.ok) throw new Error(`sitemap fetch failed: HTTP ${sm.status} ${sm.error || ''}`);
  const urls = parseSitemapLocs(sm.text);
  const pages = await pool(urls, 4, async (u) => analyse(u, await fetchText(u)));
  const apex = await fetchText('https://barakaevents.com/', { retries: 0, timeoutMs: 15000 });
  const robots = await fetchText(`${SITE}/robots.txt`);
  const prev = previousSnapshot('site-audit', date);
  const prevIssues = new Map((prev?.data?.pages || []).map((p) => [p.url, new Set(p.issues)]));
  const newIssues = pages.flatMap((p) => p.issues.filter((i) => !prevIssues.get(p.url)?.has(i)).map((i) => `${p.url}: ${i}`));
  const fixed = prev ? prev.data.pages.flatMap((p) => [...(prevIssues.get(p.url) || [])].filter((i) => !(pages.find((q) => q.url === p.url)?.issues || []).includes(i)).map((i) => `${p.url}: ${i}`)) : [];

  const sum = {
    pages: pages.length, non200: pages.filter((p) => p.status !== 200).length,
    withIssues: pages.filter((p) => p.issues.length).length, faqPages: pages.filter((p) => p.faq).length,
    noLeadPath: pages.filter((p) => p.conversion.includes('no WhatsApp, call or form on the page')).length,
    noTel: pages.filter((p) => !p.leadPaths.tel).length, phoneMissing: pages.filter((p) => !p.nap.phone).length,
    addressMissing: pages.filter((p) => !p.nap.address).length,
    apexDomain: apex.error ? `unreachable (${apex.error})` : `HTTP ${apex.status} → ${apex.url}`,
    robotsTxt: robots.ok ? 'OK' : `HTTP ${robots.status}`,
  };
  const json = { generatedAt: new Date().toISOString(), site: SITE, summary: sum, comparedWith: prev?.date || null, newIssues, fixedIssues: fixed, pages };
  const issueRows = pages.filter((p) => p.issues.length).map((p) => [p.url, p.issues.join('; ')]);
  const md = `# Technical SEO, conversion paths and NAP — ${date}

Live crawl of ${pages.length} sitemap URLs on ${SITE} (read-only).${prev ? ` Compared with ${prev.date}.` : ' First snapshot.'}

${table(['Check', 'Result'], [
    ['Pages crawled', sum.pages], ['Non-200 responses', sum.non200], ['Pages with an SEO issue', sum.withIssues],
    ['Pages with FAQPage schema', sum.faqPages], ['Pages with no WhatsApp, call or form', sum.noLeadPath],
    ['Pages with no tap-to-call link', sum.noTel], ['Pages missing the phone +92 313 9999039', sum.phoneMissing],
    ['Pages missing the Big City Plaza, Gulberg address', sum.addressMissing], ['Bare domain barakaevents.com', sum.apexDomain], ['robots.txt', sum.robotsTxt]])}

## New since last snapshot
${newIssues.length ? newIssues.map((i) => `- ${i}`).join('\n') : prev ? 'None.' : 'First snapshot — every issue below is new.'}
${fixed.length ? `\n## Fixed since last snapshot\n${fixed.map((i) => `- ${i}`).join('\n')}` : ''}

## SEO issues by page
${issueRows.length ? table(['Page', 'Issues'], issueRows) : 'None.'}

## Lead paths by page (WhatsApp links / tel links / form)
${table(['Page', 'WhatsApp', 'Call', 'Form', 'Phone shown', 'Address shown'], pages.map((p) => [p.url, p.leadPaths.whatsapp, p.leadPaths.tel, p.leadPaths.form ? 'yes' : 'no', p.nap.phone ? 'yes' : 'NO', p.nap.address ? 'yes' : 'no']))}
`;
  const files = writeEvidence('site-audit', date, json, md);
  return { ok: true, summary: `${sum.pages} pages: ${sum.non200} non-200, ${sum.withIssues} with SEO issues, ${sum.noLeadPath} with no lead path, ${sum.noTel} without tap-to-call, phone missing on ${sum.phoneMissing}; apex ${sum.apexDomain}`, files };
}

if (import.meta.url === `file://${process.argv[1]}`) run().then((r) => console.log(JSON.stringify(r, null, 2))).catch((e) => { console.error(e); process.exit(1); });
