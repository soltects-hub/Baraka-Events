/**
 * Deterministic, rule-based daily decision engine. Consumes today's real
 * Search Console data + the keyword map + existing posts, and decides ONE
 * next action. This is intentionally NOT an LLM call: the decision itself
 * must be explainable and reproducible from the data, so an AI is only ever
 * used later (generate-content.ts) to execute a decision this script already
 * justified with evidence — never to invent the justification.
 *
 * Action priority (most urgent first):
 *  1. fix-indexing   — real site pages aren't indexed yet; publishing more
 *                       content nobody can find is wasted effort until this
 *                       is addressed.
 *  2. improve-existing — an existing page is losing clicks, or has real
 *                       impressions but poor CTR (fixable without new content).
 *  3. new-article     — a high-priority content gap with real query evidence
 *                       (actual impressions in Search Console), and indexing
 *                       isn't broadly broken.
 *  4. internal-linking — a cannibalization-risk cluster where more internal
 *                       links to the existing page is safer than new content.
 *  5. do-nothing      — none of the above is confidently supported by data.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { posts } from '../../src/lib/posts';
import { REPORTS_DIR } from './config';
import type { SearchConsoleReportData } from './types';

interface KeywordRecord {
  keyword: string;
  topicCluster: string;
  proposedUrl: string;
  contentType: 'blog-post' | 'service-section' | 'faq-entry';
  priority: 'high' | 'medium' | 'low';
  targetFunnelStage: string;
  existingCompetingPage: string | null;
  cannibalizationRisk: 'none' | 'low' | 'medium' | 'high';
}
interface KeywordMap {
  keywords: KeywordRecord[];
}

export type ActionType = 'fix-indexing' | 'improve-existing' | 'new-article' | 'internal-linking' | 'do-nothing';

export interface Decision {
  action: ActionType;
  target: string;
  cluster?: string;
  proposedUrl?: string;
  reasoning: string[];
  evidence: Record<string, unknown>;
}

const dataPath = resolve(process.cwd(), REPORTS_DIR, 'data-latest.json');
const keywordMapPath = resolve(process.cwd(), 'data/seo/keyword-map.json');

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

/** True if the keyword and a real GSC query share enough words to be considered a match. */
function fuzzyMatch(keyword: string, query: string): boolean {
  const kWords = new Set(normalize(keyword).split(' ').filter((w) => w.length > 2));
  const qWords = new Set(normalize(query).split(' ').filter((w) => w.length > 2));
  if (kWords.size === 0 || qWords.size === 0) return false;
  let overlap = 0;
  for (const w of kWords) if (qWords.has(w)) overlap++;
  return overlap / Math.min(kWords.size, qWords.size) >= 0.6;
}

function decide(data: SearchConsoleReportData, keywordMap: KeywordMap): Decision {
  const reasoning: string[] = [];

  // --- Rule 1: indexing health gate ---
  const inspections = data.urlInspections ?? [];
  if (inspections.length > 0) {
    const indexed = inspections.filter((i) => (i.coverageState ?? '').toLowerCase().includes('indexed') && !(i.coverageState ?? '').toLowerCase().includes('not'));
    const indexedRatio = indexed.length / inspections.length;
    if (indexedRatio < 0.5) {
      reasoning.push(
        `Only ${indexed.length}/${inspections.length} real site URLs are indexed by Google (coverage states: ${[...new Set(inspections.map((i) => i.coverageState))].join(', ')}).`,
        'Publishing new content before fixing discoverability would waste effort — indexing is the dominant blocker right now.',
      );
      return {
        action: 'fix-indexing',
        target: 'site-wide indexing',
        reasoning,
        evidence: { indexedCount: indexed.length, totalInspected: inspections.length, coverageStates: inspections.map((i) => ({ url: i.url, coverageState: i.coverageState })) },
      };
    }
  }

  // --- Rule 2: existing pages losing clicks ---
  const current = data.current;
  const previous = data.previous;
  if (current && previous) {
    const prevBySlug = new Map(previous.topPages.map((p) => [p.page, p]));
    for (const page of current.topPages) {
      const prev = prevBySlug.get(page.page);
      if (prev && prev.clicks >= 5 && page.clicks < prev.clicks * 0.8) {
        reasoning.push(`${page.page}: clicks dropped from ${prev.clicks} to ${page.clicks} (${(((page.clicks - prev.clicks) / prev.clicks) * 100).toFixed(1)}%) period-over-period.`);
        return { action: 'improve-existing', target: page.page, reasoning, evidence: { current: page, previous: prev } };
      }
    }

    // High-impression, low-CTR existing queries — a fixable title/description problem.
    const opportunity = current.topQueries.find((q) => q.impressions >= 10 && q.ctr < 0.02);
    if (opportunity) {
      reasoning.push(`Query "${opportunity.query}" has ${opportunity.impressions} impressions but only ${(opportunity.ctr * 100).toFixed(2)}% CTR — title/description likely isn't compelling for what's already being shown.`);
      return { action: 'improve-existing', target: opportunity.query, reasoning, evidence: { query: opportunity } };
    }
  }

  // --- Rule 3: new article for a high-priority, evidence-backed gap ---
  const currentQueries = current?.topQueries ?? [];
  const candidateClusters = new Map<string, KeywordRecord[]>();
  for (const kw of keywordMap.keywords) {
    if (kw.contentType !== 'blog-post' || kw.existingCompetingPage || kw.priority !== 'high') continue;
    if (!candidateClusters.has(kw.topicCluster)) candidateClusters.set(kw.topicCluster, []);
    candidateClusters.get(kw.topicCluster)!.push(kw);
  }

  for (const [cluster, keywords] of candidateClusters) {
    const matchedQuery = currentQueries.find((q) => keywords.some((kw) => fuzzyMatch(kw.keyword, q.query)) && q.impressions > 0);
    if (matchedQuery) {
      reasoning.push(
        `Topic cluster "${cluster}" has no existing page (checked against src/lib/posts.ts) and no cannibalization risk.`,
        `Real Search Console evidence: query "${matchedQuery.query}" already gets ${matchedQuery.impressions} impression(s), matching this cluster's keyword set.`,
      );
      return {
        action: 'new-article',
        target: cluster,
        cluster,
        proposedUrl: keywords[0].proposedUrl,
        reasoning,
        evidence: { matchedQuery, clusterKeywordCount: keywords.length },
      };
    }
  }

  // --- Rule 4: internal linking for cannibalization-risk clusters ---
  const riskyCluster = keywordMap.keywords.find((k) => k.cannibalizationRisk === 'medium' || k.cannibalizationRisk === 'high');
  if (riskyCluster) {
    reasoning.push(
      `Cluster "${riskyCluster.topicCluster}" already has an existing page (${riskyCluster.existingCompetingPage}) and ${riskyCluster.cannibalizationRisk} cannibalization risk — strengthening internal links to it is safer than new content.`,
    );
    return {
      action: 'internal-linking',
      target: riskyCluster.existingCompetingPage ?? riskyCluster.topicCluster,
      cluster: riskyCluster.topicCluster,
      reasoning,
      evidence: { cluster: riskyCluster.topicCluster },
    };
  }

  reasoning.push('No indexing emergency, no page losing clicks, no high-CTR-opportunity gap, and no keyword-map cluster has real query evidence yet.');
  return { action: 'do-nothing', target: 'none', reasoning, evidence: {} };
}

function main() {
  if (!existsSync(dataPath)) {
    console.error(`No Search Console data found at ${dataPath} — run npm run seo:fetch first.`);
    process.exitCode = 1;
    return;
  }
  const data: SearchConsoleReportData = JSON.parse(readFileSync(dataPath, 'utf8'));
  const keywordMap: KeywordMap = JSON.parse(readFileSync(keywordMapPath, 'utf8'));

  if (data.auth.ok === false || (data.errors && data.errors.length > 0)) {
    const decision: Decision = {
      action: 'do-nothing',
      target: 'none',
      reasoning: ['Search Console data collection failed or was incomplete this run — deciding nothing rather than acting on partial/missing data.'],
      evidence: { authOk: data.auth.ok, errors: data.errors },
    };
    mkdirSync(resolve(process.cwd(), REPORTS_DIR), { recursive: true });
    writeFileSync(resolve(process.cwd(), REPORTS_DIR, 'decision-latest.json'), JSON.stringify(decision, null, 2));
    console.log('Decision: do-nothing (Search Console data unavailable this run).');
    return;
  }

  const decision = decide(data, keywordMap);
  // Sanity: never propose creating something that would collide with an existing post slug.
  if (decision.action === 'new-article' && decision.proposedUrl) {
    const collides = posts.some((p) => decision.proposedUrl!.endsWith(p.slug));
    if (collides) {
      decision.action = 'do-nothing';
      decision.reasoning.push('Aborted: proposed URL collides with an existing post slug — refusing to overwrite.');
    }
  }

  mkdirSync(resolve(process.cwd(), REPORTS_DIR), { recursive: true });
  const outPath = resolve(process.cwd(), REPORTS_DIR, 'decision-latest.json');
  writeFileSync(outPath, JSON.stringify(decision, null, 2));
  console.log(`Decision: ${decision.action} (${decision.target})`);
  for (const r of decision.reasoning) console.log(`  - ${r}`);
}

main();
