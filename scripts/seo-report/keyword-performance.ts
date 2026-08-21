/**
 * Phase 9: tracks each keyword-map keyword's real Search Console position
 * over time by matching it against real query rows and appending a dated
 * snapshot to reports/seo/keyword-history.json (append-only, one entry per
 * keyword per day it had a real match — never a synthetic/estimated row).
 * Buckets are descriptive of *today's real position*, never a claim about
 * future rankings.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { REPORTS_DIR, isoDate } from './config';
import type { SearchConsoleReportData } from './types';

type Bucket = 'defend' | 'optimize-aggressively' | 'strengthen' | 'improve-topical-authority' | 'evaluate' | 'no-impressions';

interface HistoryEntry {
  date: string;
  keyword: string;
  topicCluster: string;
  matchedQuery: string;
  position: number;
  clicks: number;
  impressions: number;
  bucket: Bucket;
}

function bucketFor(position: number | null): Bucket {
  if (position === null) return 'no-impressions';
  if (position <= 3) return 'defend';
  if (position <= 10) return 'optimize-aggressively';
  if (position <= 20) return 'strengthen';
  if (position <= 50) return 'improve-topical-authority';
  return 'evaluate';
}

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function fuzzyMatch(keyword: string, query: string): boolean {
  const kWords = new Set(normalize(keyword).split(' ').filter((w) => w.length > 2));
  const qWords = new Set(normalize(query).split(' ').filter((w) => w.length > 2));
  if (kWords.size === 0 || qWords.size === 0) return false;
  let overlap = 0;
  for (const w of kWords) if (qWords.has(w)) overlap++;
  return overlap / Math.min(kWords.size, qWords.size) >= 0.6;
}

function main() {
  const dataPath = resolve(process.cwd(), REPORTS_DIR, 'data-latest.json');
  const keywordMapPath = resolve(process.cwd(), 'data/seo/keyword-map.json');
  const historyPath = resolve(process.cwd(), REPORTS_DIR, 'keyword-history.json');

  if (!existsSync(dataPath) || !existsSync(keywordMapPath)) {
    console.log('Missing Search Console data or keyword map — skipping keyword performance tracking.');
    return;
  }

  const data: SearchConsoleReportData = JSON.parse(readFileSync(dataPath, 'utf8'));
  const keywordMap = JSON.parse(readFileSync(keywordMapPath, 'utf8')) as { keywords: { keyword: string; topicCluster: string }[] };
  const history: HistoryEntry[] = existsSync(historyPath) ? JSON.parse(readFileSync(historyPath, 'utf8')) : [];

  if (!data.current) {
    console.log('No current-period data available — skipping keyword performance tracking.');
    return;
  }

  const today = isoDate(new Date());
  const newEntries: HistoryEntry[] = [];

  for (const kw of keywordMap.keywords) {
    const match = data.current.topQueries.find((q) => fuzzyMatch(kw.keyword, q.query));
    if (!match) continue; // no real evidence for this keyword today — don't fabricate a "no impressions" row for every one of 300+ keywords daily; only record real matches.
    newEntries.push({
      date: today,
      keyword: kw.keyword,
      topicCluster: kw.topicCluster,
      matchedQuery: match.query,
      position: match.position,
      clicks: match.clicks,
      impressions: match.impressions,
      bucket: bucketFor(match.position),
    });
  }

  const combined = [...history.filter((h) => h.date !== today), ...newEntries];
  mkdirSync(resolve(process.cwd(), REPORTS_DIR), { recursive: true });
  writeFileSync(historyPath, JSON.stringify(combined, null, 2));
  console.log(`Keyword performance: ${newEntries.length} keyword(s) matched real queries today, ${combined.length} total history rows.`);
}

main();
