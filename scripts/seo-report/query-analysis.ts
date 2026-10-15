/**
 * Reads Search Console rows the way an SEO would, instead of with one flat threshold.
 *
 * Two problems this fixes in the daily report and decision:
 *  1. "CTR below 2%" blamed the title for queries that are simply on page 2. On the 2026-10-15 snapshot, "event planner lahore"
 *     (61 impressions at position 17.3, 1 click) was reported as "title/description likely isn't compelling" — but page 2 earns
 *     about 1% at best, so the limit is the ranking, not the snippet. Queries at position 1-3 with no clicks are a different
 *     case again (a map pack or answer box takes the click; the title is not the problem).
 *  2. Nothing read the page x query data the snapshot has carried since 2026-10-13, so "which page ranks for this query" was a
 *     guess. queryOwnership() answers it, and flags queries two of our own pages compete for and queries a service page
 *     should own but the homepage answers instead.
 *
 * The CTR bands are rough planning thresholds for reading a report, not a forecast and not Baraka's own data; real CTR is
 * whatever Search Console says. With a site this small, almost every query has too few impressions for CTR to mean anything,
 * so a query is only called a snippet problem when the expected click count is large enough that "zero" is a real signal.
 */
import { canonicalPageUrl, mergePageQueryVariants } from './page-variants';
import type { QueryRow, SearchConsoleReportData } from './types';

/** Below this many impressions CTR and position are noise at this site's volume. */
export const MIN_IMPRESSIONS = 10;
/** A page-2 query needs this many impressions before it is worth a content or link change. */
export const MIN_IMPRESSIONS_FOR_RANKING_WORK = 15;

/** Rough organic CTR by average position (planning bands). */
export function expectedCtr(position: number): number {
  if (position <= 1.5) return 0.25;
  if (position <= 3.5) return 0.1;
  if (position <= 5.5) return 0.05;
  if (position <= 10.5) return 0.025;
  if (position <= 20.5) return 0.01;
  if (position <= 30.5) return 0.004;
  return 0.001;
}

export type QueryKind = 'ok' | 'snippet' | 'ranking' | 'serp-feature';

export interface QueryAssessment {
  kind: QueryKind;
  /** Expected CTR for the query's average position, from expectedCtr(). */
  expectedCtr: number;
  /** One sentence the report can print as the reason. */
  note: string;
}

export function isBrandQuery(query: string): boolean {
  return /\bbara[ck]a[hk]?\b|\bbaraku\b|\babk\b|barakaevents/i.test(query);
}

export function assessQuery(q: QueryRow): QueryAssessment {
  const exp = expectedCtr(q.position);
  const expectedClicks = q.impressions * exp;
  if (q.impressions < MIN_IMPRESSIONS) return { kind: 'ok', expectedCtr: exp, note: 'too few impressions to judge' };

  if (q.position <= 3.5) {
    // Shown at the very top yet barely clicked: a map pack, answer box or AI answer takes the click, or the average mixes in
    // those impressions. Rewriting the title would not change that.
    if (expectedClicks >= 3 && q.clicks < expectedClicks * 0.25) {
      return { kind: 'serp-feature', expectedCtr: exp, note: `position ${q.position.toFixed(1)} but ${q.clicks} click(s) from ${q.impressions} impressions — a map pack, answer box or AI answer is probably taking the click; the title is not the limit` };
    }
    return { kind: 'ok', expectedCtr: exp, note: 'top positions, click-through in the normal range' };
  }

  if (q.position <= 10.5) {
    if (expectedClicks >= 3 && q.clicks < expectedClicks * 0.4) {
      return { kind: 'snippet', expectedCtr: exp, note: `page 1 (position ${q.position.toFixed(1)}): about ${expectedClicks.toFixed(1)} clicks expected from ${q.impressions} impressions, ${q.clicks} received — the title/description is the likely limit` };
    }
    return { kind: 'ok', expectedCtr: exp, note: expectedClicks < 3 ? 'expected clicks too low for CTR to be a signal' : 'click-through in the normal range' };
  }

  if (q.position <= 30.5) {
    return { kind: 'ranking', expectedCtr: exp, note: `page ${q.position <= 20.5 ? '2' : '3'} (position ${q.position.toFixed(1)}): even a perfect snippet earns about ${(exp * 100).toFixed(1)}% here — the ranking is the limit, not the title` };
  }
  return { kind: 'ok', expectedCtr: exp, note: 'beyond page 3 — needs a page that targets the query, not a tweak' };
}

// ------------------------------------------------------------------------------------------------------------------------
// page x query ownership
// ------------------------------------------------------------------------------------------------------------------------

export interface OwnerRow {
  page: string;
  impressions: number;
  clicks: number;
  position: number;
}

export interface QueryOwnership {
  query: string;
  impressions: number;
  clicks: number;
  position: number;
  owner: OwnerRow;
  others: OwnerRow[];
  /** Another of our own pages has a real share of the same query (not flagged for brand queries, where several pages are normal). */
  cannibalized: boolean;
  /** The service page that should own this topic, when the topic has one. */
  servicePage?: string;
  /** The service page's own row for this query, if it ranked at all. */
  servicePageRow?: OwnerRow;
  /** True when the homepage owns the query but the topical service page ranks far behind it or not at all. */
  serviceGap: boolean;
}

const TOPIC_TO_SERVICE: Array<[RegExp, string]> = [
  [/corporate|conference|product launch|annual dinner|\bagm\b/i, '/services/corporate-events'],
  [/event manage|events manage|event organi[sz]er|event managers?\b/i, '/services/event-management'],
  [/wedding plan|wedding event plan|wedding organi[sz]|shaadi plan/i, '/services/wedding-planning'],
  [/decor|stage|floral|lighting|bridal room|wedding setup/i, '/services/event-decoration'],
  [/mehndi|dholki|mehendi/i, '/services/mehndi-events'],
  [/\bbaraa?t\b/i, '/services/barat-events'],
  [/walima|reception/i, '/services/walima-events'],
  [/nikkah|nikah/i, '/services/nikkah-events'],
  [/engagement|ring ceremony|rokka/i, '/services/engagement-events'],
  [/birthday|party planner|kids party/i, '/services/birthday-events'],
];

/** Queries from people who are not shopping for a planner (training, jobs, software): no service page should chase them. */
const NON_COMMERCIAL = /\b(courses?|training|jobs?|salary|degree|diploma|software|apps?|templates?|pdf|certificate|how to become)\b/i;

/** A service-page gap needs real volume (at this site's size one impression says nothing about ownership)... */
const MIN_IMPRESSIONS_FOR_GAP = 5;
/** ...and a homepage that is not already winning the query: at position 1-5 there is nothing for a service page to fix. */
const GAP_ONLY_BELOW_POSITION = 5;

export function serviceFor(query: string): string | undefined {
  if (NON_COMMERCIAL.test(query)) return undefined;
  return TOPIC_TO_SERVICE.find(([re]) => re.test(query))?.[1];
}

function path(page: string): string {
  return canonicalPageUrl(page).replace('https://www.barakaevents.com', '') || '/';
}

/**
 * One entry per query that has page x query rows, most-impressions first. Page keys are merged across http/https,
 * apex/www and trailing-slash variants (mergePageQueryVariants) before ranking pages.
 */
export function queryOwnership(data: SearchConsoleReportData): QueryOwnership[] {
  const rows = data.current?.pageQueries;
  if (!rows || rows.length === 0) return [];
  const byQuery = new Map<string, OwnerRow[]>();
  for (const r of mergePageQueryVariants(rows)) {
    const list = byQuery.get(r.query) ?? [];
    list.push({ page: path(r.page), impressions: r.impressions, clicks: r.clicks, position: r.position });
    byQuery.set(r.query, list);
  }
  const out: QueryOwnership[] = [];
  for (const [query, list] of byQuery) {
    const ranked = [...list].sort((a, b) => b.impressions - a.impressions || a.position - b.position);
    const [owner, ...others] = ranked;
    const impressions = list.reduce((n, r) => n + r.impressions, 0);
    const clicks = list.reduce((n, r) => n + r.clicks, 0);
    const position = impressions > 0 ? list.reduce((n, r) => n + r.position * r.impressions, 0) / impressions : owner.position;
    const cannibalized = !isBrandQuery(query) && others.some((o) => o.impressions >= 2 && o.impressions >= owner.impressions * 0.25);
    const servicePage = serviceFor(query);
    const servicePageRow = servicePage ? ranked.find((r) => r.page === servicePage) : undefined;
    const serviceGap =
      !!servicePage &&
      !isBrandQuery(query) &&
      impressions >= MIN_IMPRESSIONS_FOR_GAP &&
      position > GAP_ONLY_BELOW_POSITION &&
      owner.page === '/' &&
      (!servicePageRow || servicePageRow.position > owner.position + 10);
    out.push({ query, impressions, clicks, position, owner, others, cannibalized, servicePage, servicePageRow, serviceGap });
  }
  return out.sort((a, b) => b.impressions - a.impressions);
}

/** The owning page of one query, or undefined when there is no page x query data for it. */
export function ownerOf(data: SearchConsoleReportData, query: string): QueryOwnership | undefined {
  return queryOwnership(data).find((o) => o.query === query);
}

/** Queries the daily report should consider: every query when the snapshot has them, otherwise the top-100 list. */
export function queriesOf(data: SearchConsoleReportData): QueryRow[] {
  const all = data.current?.allQueries;
  return all && all.length > 0 ? all : (data.current?.topQueries ?? []);
}
