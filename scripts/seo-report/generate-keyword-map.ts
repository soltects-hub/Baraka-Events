/**
 * Generates the SEO topical keyword map: ~300 keyword records grounded ONLY
 * in Baraka Events' real, published services, locations, and existing blog
 * content (src/lib/posts.ts, seoConfig.ts, and the live homepage copy this
 * file's clusters were manually verified against — see clusters[].evidence).
 *
 * This is standard topic-cluster keyword research methodology: seed topics x
 * intent modifiers, grouped into clusters that each map to ONE piece of
 * pillar content (never one page per keyword — that would be doorway-page
 * behavior, explicitly disallowed). No search volume is invented; every
 * record marks it "unavailable" because no keyword-volume data source
 * (e.g. Google Ads Keyword Planner API, Search Console beyond impressions)
 * is connected to this project.
 *
 * Run: npm run seo:keywords  (writes data/seo/keyword-map.json)
 */
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { routes, seoConfig } from '../../src/seo';

type FunnelStage = 'awareness' | 'consideration' | 'decision';
type ContentType = 'blog-post' | 'service-section' | 'faq-entry';
type Priority = 'high' | 'medium' | 'low';
type CannibalizationRisk = 'none' | 'low' | 'medium' | 'high';

interface KeywordRecord {
  keyword: string;
  searchIntent: string;
  topicCluster: string;
  proposedUrl: string;
  contentType: ContentType;
  priority: Priority;
  targetFunnelStage: FunnelStage;
  existingCompetingPage: string | null;
  cannibalizationRisk: CannibalizationRisk;
  searchVolume: 'unavailable';
}

interface Cluster {
  name: string;
  /** Where this cluster's content already lives, or should live if new. */
  proposedUrl: string;
  contentType: ContentType;
  /** Existing post slug this cluster maps to, if any — grounds cannibalization checks. */
  existingSlug: string | null;
  /** One-line note on what real site content this cluster is grounded in. */
  evidence: string;
  /** Core seed phrases for this cluster (the "thing" being searched for). */
  seeds: string[];
  /** Modifier templates; {seed} and {loc} are substituted. loc-less modifiers just use {seed}. */
  modifiers: string[];
  locations?: string[];
  basePriority: Priority;
}

const LAHORE_AREAS = ['DHA', 'Gulberg', 'Bahria Town', 'Walled City', 'Model Town'];

const clusters: Cluster[] = [
  // ---- Existing-content clusters (map to an already-published post) ----
  {
    name: 'Wedding Venues',
    proposedUrl: routes.blogPost('top-wedding-venues-lahore-2025'),
    contentType: 'blog-post',
    existingSlug: 'top-wedding-venues-lahore-2025',
    evidence: 'Existing post src/lib/posts.ts:top-wedding-venues-lahore-2025',
    seeds: ['wedding venue', 'shaadi venue', 'marquee'],
    modifiers: ['best {seed} in Lahore', '{seed} in {loc}', 'top {seed}s in Lahore', 'luxury {seed} Lahore'],
    locations: LAHORE_AREAS,
    basePriority: 'medium',
  },
  {
    name: 'Mehndi',
    proposedUrl: routes.blogPost('mehndi-themes-lahore-loves'),
    contentType: 'blog-post',
    existingSlug: 'mehndi-themes-lahore-loves',
    evidence: 'Existing post src/lib/posts.ts:mehndi-themes-lahore-loves',
    seeds: ['mehndi theme', 'mehndi decor', 'mehndi function', 'mehndi setup', 'mehndi stage'],
    modifiers: ['{seed} ideas', '{seed} Lahore', 'best {seed} 2025', 'luxury {seed}', '{seed} design'],
    basePriority: 'medium',
  },
  {
    name: 'Shaadi Budget & Cost',
    proposedUrl: routes.blogPost('luxury-shaadi-cost-lahore'),
    contentType: 'blog-post',
    existingSlug: 'luxury-shaadi-cost-lahore',
    evidence: 'Existing post src/lib/posts.ts:luxury-shaadi-cost-lahore',
    seeds: ['wedding cost', 'shaadi budget', 'wedding budget'],
    modifiers: ['{seed} in Lahore', 'how much does a {seed} cost in Lahore', 'average {seed} Pakistan', 'luxury {seed} breakdown'],
    basePriority: 'low',
  },
  {
    name: 'Walima',
    proposedUrl: routes.blogPost('walima-decor-trends-2025'),
    contentType: 'blog-post',
    existingSlug: 'walima-decor-trends-2025',
    evidence: 'Existing post src/lib/posts.ts:walima-decor-trends-2025',
    seeds: ['walima decor', 'walima stage', 'walima reception'],
    modifiers: ['{seed} ideas', '{seed} Lahore', 'best {seed} 2025', 'luxury {seed} design'],
    basePriority: 'medium',
  },
  {
    name: 'Corporate Gala & Events',
    proposedUrl: routes.blogPost('corporate-gala-lahore-checklist'),
    contentType: 'blog-post',
    existingSlug: 'corporate-gala-lahore-checklist',
    evidence: 'Existing post + StickyServices.tsx "Corporate Events" (Launches, Galas & Summits)',
    seeds: ['corporate event planner', 'corporate gala', 'product launch event', 'award ceremony', 'corporate event management company'],
    modifiers: ['{seed} in Lahore', 'best {seed} Lahore', '{seed} checklist', 'how to plan a {seed} in Lahore'],
    basePriority: 'medium',
  },
  {
    name: 'Baraat',
    proposedUrl: routes.blogPost('perfect-baraat-guide'),
    contentType: 'blog-post',
    existingSlug: 'perfect-baraat-guide',
    evidence: 'Existing post src/lib/posts.ts:perfect-baraat-guide',
    seeds: ['baraat', 'baraat entrance', 'dhol for baraat'],
    modifiers: ['{seed} ideas Lahore', 'how to plan {seed}', 'best {seed} timing', '{seed} traditions Pakistan'],
    basePriority: 'low',
  },

  // ---- New clusters — real Baraka services with no dedicated content yet ----
  {
    name: 'Nikkah',
    proposedUrl: routes.blogPost('nikkah-ceremony-planning-lahore'),
    contentType: 'blog-post',
    existingSlug: null,
    evidence: 'StickyServices.tsx details: "Mehndi · Baraat · Nikkah · Walima"',
    seeds: ['nikkah ceremony', 'nikkah stage', 'nikkah venue', 'nikkah decor'],
    modifiers: ['{seed} ideas', '{seed} in Lahore', 'best {seed} 2025', 'simple {seed} setup', 'luxury {seed}'],
    basePriority: 'high',
  },
  {
    name: 'Engagement / Mangni',
    proposedUrl: routes.blogPost('engagement-mangni-ideas-lahore'),
    contentType: 'blog-post',
    existingSlug: null,
    evidence: 'Reasonable extension of "Luxury Shaadis" multi-function coverage (Mehndi/Baraat/Nikkah/Walima) — mangni is a standard pre-wedding function in the same funnel.',
    seeds: ['engagement decor', 'mangni function', 'ring ceremony', 'engagement party'],
    modifiers: ['{seed} ideas', '{seed} Lahore', 'best {seed} themes', 'luxury {seed} setup'],
    basePriority: 'medium',
  },
  {
    name: 'Destination & Multi-Day Shaadis',
    proposedUrl: routes.blogPost('destination-multi-day-shaadi-lahore'),
    contentType: 'blog-post',
    existingSlug: null,
    evidence: 'StickyServices.tsx detail: "Destination & Multi-Day Shaadis"',
    seeds: ['destination wedding', 'multi-day shaadi', 'destination shaadi planner'],
    modifiers: ['{seed} Pakistan', '{seed} planner Lahore', 'how to plan a {seed}', 'luxury {seed} package'],
    basePriority: 'medium',
  },
  {
    name: 'Corporate Product Launch',
    proposedUrl: routes.blogPost('product-launch-event-production-lahore'),
    contentType: 'blog-post',
    existingSlug: null,
    evidence: 'StickyServices.tsx detail: "Launches, Galas & Summits", "Brand Environments & Stage Design"',
    seeds: ['product launch event', 'brand launch event', 'launch event production'],
    modifiers: ['{seed} Lahore', 'best {seed} company', '{seed} ideas', 'corporate {seed} checklist'],
    basePriority: 'medium',
  },
  {
    name: 'Corporate Summit & Conference',
    proposedUrl: routes.blogPost('corporate-summit-conference-planning-lahore'),
    contentType: 'blog-post',
    existingSlug: null,
    evidence: 'StickyServices.tsx detail: "Launches, Galas & Summits"',
    seeds: ['corporate summit', 'business conference', 'executive summit'],
    modifiers: ['{seed} planning Lahore', 'best {seed} venues', '{seed} production company Lahore'],
    basePriority: 'low',
  },
  {
    name: 'VIP & Executive Hospitality',
    proposedUrl: routes.blogPost('corporate-gala-lahore-checklist'),
    contentType: 'blog-post',
    existingSlug: 'corporate-gala-lahore-checklist',
    evidence: 'StickyServices.tsx detail: "VIP & Executive Hospitality" — folds into existing corporate-gala post as a section rather than a new thin page.',
    seeds: ['VIP event hospitality', 'executive event hosting'],
    modifiers: ['{seed} Lahore', 'best {seed} company', '{seed} for corporate events'],
    basePriority: 'low',
  },
  {
    name: 'Milestone Birthdays',
    proposedUrl: routes.blogPost('milestone-birthday-events-lahore'),
    contentType: 'blog-post',
    existingSlug: null,
    evidence: 'StickyServices.tsx detail: "Milestone Birthdays & Anniversaries"; real Search Console query "birthday events lahore" (impressions, 0 clicks) confirms live demand.',
    seeds: ['birthday event', 'birthday party planner', 'milestone birthday celebration'],
    modifiers: ['{seed} Lahore', 'best {seed} company', 'luxury {seed} ideas', '{seed} venues Lahore'],
    basePriority: 'high',
  },
  {
    name: 'Aqeeqah',
    proposedUrl: routes.blogPost('aqeeqah-celebration-planning-lahore'),
    contentType: 'blog-post',
    existingSlug: null,
    evidence: 'StickyServices.tsx detail: "Milestone Birthdays, Aqeeqahs, Anniversaries and mehfils"',
    seeds: ['aqeeqah event', 'aqeeqah celebration'],
    modifiers: ['{seed} planner Lahore', '{seed} ideas', 'best {seed} company Lahore'],
    basePriority: 'medium',
  },
  {
    name: 'Anniversary Celebrations',
    proposedUrl: routes.blogPost('anniversary-celebration-ideas-lahore'),
    contentType: 'blog-post',
    existingSlug: null,
    evidence: 'StickyServices.tsx detail: "Milestone Birthdays & Anniversaries", "Rooftop Dinners & Garden Mehfils"',
    seeds: ['anniversary party', 'rooftop dinner event', 'garden mehfil'],
    modifiers: ['{seed} ideas Lahore', 'best {seed} venues', 'luxury {seed} planner'],
    basePriority: 'low',
  },
  {
    name: 'Event Catering & Menu Direction',
    proposedUrl: routes.blogPost('luxury-event-catering-menu-lahore'),
    contentType: 'blog-post',
    existingSlug: null,
    evidence: 'MenuCarousel.tsx: Live BBQ Station, Grand Mains, Continental & Fusion, Desserts & Mithai — culinary direction is an explicit part of the service.',
    seeds: ['wedding catering', 'event catering menu', 'live BBQ station wedding', 'shaadi menu ideas'],
    modifiers: ['{seed} Lahore', 'best {seed} company', 'luxury {seed} packages'],
    basePriority: 'medium',
  },
  {
    name: 'Event Decor & Floral Design',
    proposedUrl: routes.blogPost('luxury-event-decor-floral-design-lahore'),
    contentType: 'blog-post',
    existingSlug: null,
    evidence: 'StickyServices.tsx detail: "Couture Floral & Stage Design"; distinct from mehndi/walima-specific decor posts — general decor/floral capability page.',
    seeds: ['event decor', 'floral design', 'stage design'],
    modifiers: ['{seed} Lahore', 'best {seed} company', 'luxury {seed} ideas', '{seed} for weddings'],
    basePriority: 'medium',
  },
  {
    name: 'Event Lighting & Production',
    proposedUrl: routes.blogPost('event-lighting-av-production-lahore'),
    contentType: 'blog-post',
    existingSlug: null,
    evidence: 'FAQ.tsx: "technical production"; StickyServices.tsx "Brand Environments & Stage Design"',
    seeds: ['event lighting design', 'AV production company', 'stage lighting for weddings'],
    modifiers: ['{seed} Lahore', 'best {seed}', '{seed} for corporate events'],
    basePriority: 'low',
  },
  {
    name: 'Event Planner (brand/category)',
    proposedUrl: routes.home,
    contentType: 'service-section',
    existingSlug: null,
    evidence: 'Homepage #experiences section covers all three service pillars; a navigational/brand-category term belongs on the homepage, not a new thin page.',
    seeds: ['event planner', 'event management company', 'event planning company'],
    modifiers: ['best {seed} in Lahore', '{seed} in {loc}', 'top {seed} Lahore'],
    locations: LAHORE_AREAS,
    basePriority: 'high',
  },
  {
    name: 'Wedding Planner (brand/category)',
    proposedUrl: routes.home,
    contentType: 'service-section',
    existingSlug: null,
    evidence: 'Homepage #experiences "Luxury Shaadis" pillar; brand-category navigational term.',
    seeds: ['wedding planner', 'shaadi planner'],
    modifiers: ['best {seed} in Lahore', '{seed} in {loc}', 'top {seed} Lahore'],
    locations: LAHORE_AREAS,
    basePriority: 'high',
  },
  {
    name: 'Corporate Event Planner (brand/category)',
    proposedUrl: routes.home,
    contentType: 'service-section',
    existingSlug: null,
    evidence: 'Homepage #experiences "Corporate Events" pillar; brand-category navigational term.',
    seeds: ['corporate event planner', 'corporate event company'],
    modifiers: ['best {seed} in Lahore', '{seed} in {loc}', 'top {seed} Lahore'],
    locations: LAHORE_AREAS,
    basePriority: 'medium',
  },
  {
    name: 'DHA Venue & Events',
    proposedUrl: routes.blogPost('top-wedding-venues-lahore-2025'),
    contentType: 'blog-post',
    existingSlug: 'top-wedding-venues-lahore-2025',
    evidence: 'FAQ.tsx service-area answer names DHA explicitly; existing venues post already covers "DHA & Bahria: marquee country".',
    seeds: ['DHA wedding venue', 'DHA marquee', 'DHA event venue'],
    modifiers: ['best {seed} Lahore', '{seed} for shaadi'],
    basePriority: 'low',
  },
  {
    name: 'Gulberg Venue & Events',
    proposedUrl: routes.blogPost('top-wedding-venues-lahore-2025'),
    contentType: 'blog-post',
    existingSlug: 'top-wedding-venues-lahore-2025',
    evidence: 'FAQ.tsx names Gulberg explicitly; Baraka’s own studio is in Gulberg III (seoConfig.ts address).',
    seeds: ['Gulberg wedding venue', 'Gulberg banquet hall', 'Gulberg event venue'],
    modifiers: ['best {seed}', '{seed} for shaadi'],
    basePriority: 'low',
  },
  {
    name: 'Bahria Town Venue & Events',
    proposedUrl: routes.blogPost('top-wedding-venues-lahore-2025'),
    contentType: 'blog-post',
    existingSlug: 'top-wedding-venues-lahore-2025',
    evidence: 'FAQ.tsx names Bahria Town explicitly; existing venues post already covers "DHA & Bahria: marquee country".',
    seeds: ['Bahria Town wedding venue', 'Bahria Town marquee'],
    modifiers: ['best {seed}', '{seed} for shaadi'],
    basePriority: 'low',
  },
  {
    name: 'Walled City & Haveli Weddings',
    proposedUrl: routes.blogPost('top-wedding-venues-lahore-2025'),
    contentType: 'blog-post',
    existingSlug: 'top-wedding-venues-lahore-2025',
    evidence: 'FAQ.tsx names "historic havelis of the Walled City"; existing venues post has a dedicated "Walled City: havelis with history" section.',
    seeds: ['haveli wedding venue', 'Walled City wedding', 'Androon Shehr shaadi venue'],
    modifiers: ['best {seed} Lahore', '{seed} ideas'],
    basePriority: 'low',
  },
  {
    name: 'Raiwind Road Farmhouse Weddings',
    proposedUrl: routes.blogPost('farmhouse-wedding-raiwind-road-lahore'),
    contentType: 'blog-post',
    existingSlug: null,
    evidence: 'FAQ.tsx names "Raiwind Road farmhouses" explicitly; not yet covered by any existing post.',
    seeds: ['farmhouse wedding venue', 'Raiwind Road farmhouse', 'outdoor farmhouse shaadi'],
    modifiers: ['best {seed} Lahore', '{seed} for shaadi', '{seed} ideas'],
    basePriority: 'medium',
  },
  {
    name: 'Garden & Outdoor Weddings',
    proposedUrl: routes.blogPost('top-wedding-venues-lahore-2025'),
    contentType: 'blog-post',
    existingSlug: 'top-wedding-venues-lahore-2025',
    evidence: 'Existing venues post has a dedicated "The gardens: Shalimar-inspired outdoor ceremonies" section.',
    seeds: ['outdoor wedding venue', 'garden wedding Lahore', 'Shalimar garden wedding'],
    modifiers: ['best {seed}', '{seed} ideas'],
    basePriority: 'low',
  },
  {
    name: 'Booking Timelines & Planning Process',
    proposedUrl: routes.home,
    contentType: 'faq-entry',
    existingSlug: null,
    evidence: 'FAQ.tsx already answers "How far in advance should we book" and "What makes Baraka different" — these queries map to existing FAQ content, not a new page.',
    seeds: ['how far in advance to book a wedding planner', 'wedding planning timeline Lahore', 'event planning process Lahore'],
    modifiers: ['{seed}', '{seed} guide'],
    basePriority: 'low',
  },
];

function intentFor(modifier: string, cluster: Cluster): { intent: string; funnel: FunnelStage } {
  const m = modifier.toLowerCase();
  if (/(cost|price|packages?|near me|book|hire)/.test(m)) {
    return { intent: 'transactional/commercial — ready to compare or book', funnel: 'decision' };
  }
  if (/(best|top|luxury)/.test(m)) {
    return { intent: 'commercial investigation — comparing providers/venues', funnel: 'decision' };
  }
  if (/(ideas|themes|checklist|guide|how to|traditions|process|timeline)/.test(m)) {
    return { intent: 'informational — researching before deciding', funnel: cluster.existingSlug || cluster.contentType !== 'blog-post' ? 'awareness' : 'consideration' };
  }
  return { intent: 'informational — general research', funnel: 'awareness' };
}

function cannibalizationFor(cluster: Cluster): { risk: CannibalizationRisk; competing: string | null } {
  if (!cluster.existingSlug) return { risk: 'none', competing: null };
  const competing = `${seoConfig.site.url}${routes.blogPost(cluster.existingSlug)}`;
  return { risk: 'medium', competing };
}

function priorityFor(base: Priority, funnel: FunnelStage): Priority {
  if (funnel === 'decision' && base !== 'low') return 'high';
  return base;
}

function buildCluster(cluster: Cluster): KeywordRecord[] {
  const records: KeywordRecord[] = [];
  const { risk, competing } = cannibalizationFor(cluster);

  for (const seed of cluster.seeds) {
    for (const modifierTpl of cluster.modifiers) {
      const usesLoc = modifierTpl.includes('{loc}');
      const locs = usesLoc ? cluster.locations ?? [] : [null];
      for (const loc of locs) {
        if (usesLoc && !loc) continue;
        const keyword = modifierTpl.replace('{seed}', seed).replace('{loc}', loc ?? '').trim().replace(/\s+/g, ' ');
        const { intent, funnel } = intentFor(modifierTpl, cluster);
        records.push({
          keyword,
          searchIntent: intent,
          topicCluster: cluster.name,
          proposedUrl: cluster.proposedUrl,
          contentType: cluster.contentType,
          priority: priorityFor(cluster.basePriority, funnel),
          targetFunnelStage: funnel,
          existingCompetingPage: competing,
          cannibalizationRisk: risk,
          searchVolume: 'unavailable',
        });
      }
    }
  }
  return records;
}

function dedupe(records: KeywordRecord[]): KeywordRecord[] {
  const seen = new Set<string>();
  const out: KeywordRecord[] = [];
  for (const r of records) {
    const key = r.keyword.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(r);
  }
  return out;
}

const all = dedupe(clusters.flatMap(buildCluster)).sort((a, b) => a.topicCluster.localeCompare(b.topicCluster) || a.keyword.localeCompare(b.keyword));

const output = {
  generatedAt: new Date().toISOString(),
  methodology:
    'Topic-cluster keyword research: seed terms x intent modifiers, grounded in Baraka Events\' real published services (StickyServices.tsx, MenuCarousel.tsx), real FAQ-stated service areas (FAQ.tsx), and existing blog content (src/lib/posts.ts). No search-volume data source is connected to this project — searchVolume is always "unavailable", never estimated.',
  clusterCount: clusters.length,
  keywordCount: all.length,
  keywords: all,
};

const outPath = resolve(process.cwd(), 'data/seo/keyword-map.json');
writeFileSync(outPath, JSON.stringify(output, null, 2));
console.log(`Keyword map written to ${outPath}: ${all.length} keywords across ${clusters.length} clusters.`);
