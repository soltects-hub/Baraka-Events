// Daily runner. Usage: node seo-strategy/tools/run.mjs [auto|all|<module> ...]
//   auto (default): the modules for today's weekday in Pakistan time.
// Every module runs in isolation: one failure is recorded and the rest still run.
// Writes data/run-log.jsonl (append-only) and data/daily/YYYY-MM-DD.md, and prints
// a JSON summary for the routine's log entry and notification.
import fs from 'node:fs';
import path from 'node:path';
import { DATA_DIR, todayPKT, weekdayPKT, moduleDir } from './lib.mjs';

const MODULES = {
  seo: () => import('./seo-insights.mjs'),
  'site-audit': () => import('./site-audit.mjs'),
  competitors: () => import('./competitors.mjs'),
  aeo: () => import('./aeo-questions.mjs'),
  analytics: () => import('./analytics-summary.mjs'),
  weekly: () => import('./weekly-pack.mjs'),
};
// Daily: SEO + technical/conversion/NAP crawl + leads summary. Plus the day's speciality.
const DAILY = ['seo', 'site-audit', 'analytics'];
const BY_DAY = { Monday: [], Tuesday: ['competitors'], Wednesday: ['aeo'], Thursday: [], Friday: [], Saturday: [], Sunday: ['competitors', 'aeo', 'weekly'] };

const date = todayPKT();
const day = weekdayPKT(date);
const args = process.argv.slice(2);
let list = !args.length || args[0] === 'auto' ? [...DAILY, ...BY_DAY[day]] : args[0] === 'all' ? Object.keys(MODULES) : args;
list = [...new Set(list)];
if (list.includes('weekly')) list = [...list.filter((m) => m !== 'weekly'), 'weekly']; // weekly reads the others' output

const results = [];
for (const name of list) {
  const started = Date.now();
  try {
    if (!MODULES[name]) throw new Error(`unknown module "${name}"`);
    const mod = await MODULES[name]();
    const r = await mod.run(date);
    results.push({ module: name, ok: r.ok !== false, summary: r.summary, files: r.files, ms: Date.now() - started });
  } catch (e) {
    results.push({ module: name, ok: false, summary: `ERROR: ${e.message}`, ms: Date.now() - started });
  }
}

fs.mkdirSync(DATA_DIR, { recursive: true });
fs.appendFileSync(path.join(DATA_DIR, 'run-log.jsonl'), results.map((r) => JSON.stringify({ date, day, at: new Date().toISOString(), ...r })).join('\n') + '\n');
const md = `# Collector run — ${date} (${day})

| Module | Result | Summary | Evidence |
|---|---|---|---|
${results.map((r) => `| ${r.module} | ${r.ok ? 'OK' : 'FAILED'} | ${String(r.summary).replace(/\|/g, '/')} | ${r.files?.md || r.files?.json || '—'} |`).join('\n')}
`;
fs.writeFileSync(path.join(moduleDir('daily'), `${date}.md`), md);
const status = results.every((r) => r.ok) ? 'OK' : results.some((r) => r.ok) ? 'PARTIAL' : 'FAILED';
console.log(JSON.stringify({ date, day, status, results }, null, 2));
