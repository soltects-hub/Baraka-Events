// Shared helpers for the Baraka Events growth collectors.
// Dependency-free (Node >= 20). Every collector writes dated, append-only evidence
// under seo-strategy/data/<module>/YYYY-MM-DD.{json,md}. Nothing here estimates or
// invents numbers: a failed fetch is recorded as an error, never as a zero.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

export const TOOLS_DIR = path.dirname(fileURLToPath(import.meta.url));
export const STRATEGY_DIR = path.resolve(TOOLS_DIR, '..');
export const REPO_DIR = path.resolve(STRATEGY_DIR, '..');
export const DATA_DIR = path.join(STRATEGY_DIR, 'data');
export const SITE = 'https://www.barakaevents.com';
export const UA = 'Mozilla/5.0 (compatible; BarakaGrowthBot/1.0; site-owner audit)';

/** Today's date in Pakistan time, YYYY-MM-DD (override with GROWTH_DATE for tests). */
export function todayPKT() {
  if (process.env.GROWTH_DATE) return process.env.GROWTH_DATE;
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Karachi' }).format(new Date());
}

export function weekdayPKT(date = todayPKT()) {
  return new Date(`${date}T12:00:00+05:00`).toLocaleDateString('en-US', { weekday: 'long', timeZone: 'Asia/Karachi' });
}

export async function fetchText(url, { timeoutMs = 20000, retries = 1, headers = {} } = {}) {
  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const res = await fetch(url, { headers: { 'user-agent': UA, ...headers }, redirect: 'follow', signal: ctrl.signal });
      const text = await res.text();
      return { ok: res.ok, status: res.status, url: res.url, text };
    } catch (e) {
      lastErr = e;
    } finally {
      clearTimeout(t);
    }
  }
  return { ok: false, status: 0, url, text: '', error: String(lastErr?.cause?.code || lastErr?.message || lastErr) };
}

export function moduleDir(mod) {
  const d = path.join(DATA_DIR, mod);
  fs.mkdirSync(d, { recursive: true });
  return d;
}

export function writeEvidence(mod, date, json, md) {
  const d = moduleDir(mod);
  fs.writeFileSync(path.join(d, `${date}.json`), JSON.stringify(json, null, 2) + '\n');
  if (md) fs.writeFileSync(path.join(d, `${date}.md`), md.trimEnd() + '\n');
  return { json: path.relative(REPO_DIR, path.join(d, `${date}.json`)), md: md ? path.relative(REPO_DIR, path.join(d, `${date}.md`)) : null };
}

/** The newest snapshot of a module strictly before `date` (for diffs), or null. */
export function previousSnapshot(mod, date) {
  const d = moduleDir(mod);
  const files = fs.readdirSync(d).filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f) && f.slice(0, 10) < date).sort();
  if (!files.length) return null;
  const f = files[files.length - 1];
  return { date: f.slice(0, 10), data: JSON.parse(fs.readFileSync(path.join(d, f), 'utf8')) };
}

export function snapshotsBetween(mod, from, to) {
  const d = moduleDir(mod);
  return fs.readdirSync(d).filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f) && f.slice(0, 10) >= from && f.slice(0, 10) <= to).sort()
    .map((f) => ({ date: f.slice(0, 10), data: JSON.parse(fs.readFileSync(path.join(d, f), 'utf8')) }));
}

export function git(args) {
  return execFileSync('git', args, { cwd: REPO_DIR, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 });
}

export function parseSitemapLocs(xml) {
  return [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1].replace(/&amp;/g, '&'));
}

export function stripTags(html) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#39;|&rsquo;/g, "'").replace(/\s+/g, ' ').trim();
}

export function pct(n, d) { return d ? `${((100 * n) / d).toFixed(1)}%` : 'n/a'; }

export function table(headers, rows) {
  const esc = (v) => String(v ?? '').replace(/\|/g, '\\|');
  return [`| ${headers.join(' | ')} |`, `|${headers.map(() => '---').join('|')}|`, ...rows.map((r) => `| ${r.map(esc).join(' | ')} |`)].join('\n');
}
