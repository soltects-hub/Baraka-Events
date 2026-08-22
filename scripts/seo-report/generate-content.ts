/**
 * Executes a 'new-article' decision from decide-action.ts by generating a
 * full content package via the Claude API — ONLY when ANTHROPIC_API_KEY is
 * configured. If it isn't, this writes a clear "skipped, secret required"
 * record instead of pretending to generate anything, and exits 0 (this is
 * an expected, reportable state, not a failure).
 *
 * The system prompt hard-grounds Claude in verified real facts about Baraka
 * Events (services, service area, positioning, published stats) and
 * forbids fabricating anything not provided — prices beyond the qualitative
 * range already public, testimonials, client names, awards, or statistics.
 * Output reuses the *existing* Post data model (src/lib/posts.ts) exactly —
 * this is not a parallel content system, it's one more entry in the same
 * array the site already renders from.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { posts, type Post, type PostBlock } from '../../src/lib/posts';
import { REPORTS_DIR } from './config';
import { pickImageForCluster } from './article-images';
import type { Decision } from './decide-action';

const decisionPath = resolve(process.cwd(), REPORTS_DIR, 'decision-latest.json');
const proposalPath = resolve(process.cwd(), REPORTS_DIR, 'content-proposal-latest.json');

/** Facts verified by reading the live site this session — never extend or round these up. */
const VERIFIED_FACTS = `
- Company: Baraka Events, a design and production atelier (not a coordination service) based in Gulberg III, Lahore, Pakistan.
- Serves Lahore exclusively: Walled City / Androon Shehr havelis, Shalimar-inspired gardens, DHA, Gulberg, Bahria Town, and Raiwind Road farmhouses.
- Three service pillars (do not invent others):
  1. Luxury Shaadis — Mehndi, Baraat, Nikkah, Walima, destination & multi-day shaadis, couture floral & stage design.
  2. Corporate Events — launches, galas, summits, brand environments & stage design, VIP & executive hospitality.
  3. Private Celebrations — milestone birthdays, aqeeqahs, anniversaries, rooftop dinners, garden mehfils, discreet celebrity/VIP events.
- Also offers: in-house culinary/menu direction (live BBQ, grand mains, continental/fusion, desserts), event lighting/AV production, floral & stage design.
- Published stats (reuse verbatim if relevant, never inflate): "450+ Events Produced", "120+ Lahore Venues", "12 Years of Craft", "98% Client Return Rate".
- Booking guidance: full multi-function shaadis 9–14 months ahead; intimate celebrations 3–6 months; can occasionally deliver on 6-week timelines.
- Budget positioning: full multi-function shaadi productions "typically begin in the mid seven figures (PKR)" — never state a more specific number than this.
- Will collaborate with a client's own venue/vendors, integrating them into Baraka's production system.
- Contact: Booking@barakaevents.com, +92 313 9999039.
`.trim();

interface KeywordRecord {
  keyword: string;
  topicCluster: string;
  proposedUrl: string;
}
interface KeywordMap {
  keywords: KeywordRecord[];
}

interface GeneratedArticle {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  blocks: PostBlock[];
}

function existingPostSummaries(): string {
  return posts.map((p) => `- ${p.slug} (${p.category}): "${p.title}" — ${p.excerpt}`).join('\n');
}

function buildPrompt(decision: Decision, keywords: string[]): string {
  return `You are writing ONE new blog article for the Baraka Events website (barakaevents.com), a Lahore luxury event-design atelier.

VERIFIED FACTS ABOUT BARAKA EVENTS (use only these — never invent prices, testimonials, client names, awards, or statistics beyond what's listed):
${VERIFIED_FACTS}

TOPIC CLUSTER TO COVER: "${decision.cluster}"
Representative target keywords for this cluster (for topical coverage, not for keyword-stuffing — never repeat a keyword phrase unnaturally):
${keywords.map((k) => `- ${k}`).join('\n')}

EXISTING ARTICLES ALREADY ON THE SITE (do not duplicate their angle; you may reference them but must not repeat their content):
${existingPostSummaries()}

Write in the same voice as the existing articles: confident, editorial, specific to Lahore, produced by people who actually run these events — never generic AI filler ("In today's fast-paced world...", "When it comes to..."). Ground every claim in the verified facts above or in genuinely useful, general event-planning knowledge that doesn't require inventing Baraka-specific data.

Respond with ONLY a single JSON object (no markdown fences, no commentary) matching exactly this shape:
{
  "slug": "kebab-case-slug",
  "title": "Compelling, specific title, 45-65 characters",
  "excerpt": "1-2 sentence hook/meta description, 120-155 characters",
  "category": "One short category label (e.g. 'Venues', 'Design', 'Planning', 'Corporate', 'Traditions')",
  "readTime": "N min read",
  "blocks": [
    { "p": "Opening paragraph, no heading." },
    { "h": "First H2 heading" },
    { "p": "Paragraph text." },
    ... 4-7 total H2 sections, each with 1-2 paragraphs ...,
    { "h": "FAQ" },
    { "p": "Q: A realistic question a Lahore client would ask. A: A grounded answer using only verified facts or general planning knowledge." },
    { "p": "Q: Second question. A: Second answer." },
    { "p": "Q: Third question. A: Third answer." }
  ]
}

Do not include an "image" or "imageAlt" field — those are assigned separately from a verified image library.`;
}

async function main() {
  if (!existsSync(decisionPath)) {
    console.error(`No decision found at ${decisionPath} — run npm run seo:decide first.`);
    process.exitCode = 1;
    return;
  }
  const decision: Decision = JSON.parse(readFileSync(decisionPath, 'utf8'));

  mkdirSync(resolve(process.cwd(), REPORTS_DIR), { recursive: true });

  if (decision.action !== 'new-article') {
    const skip = { status: 'skipped', reason: `Decision was "${decision.action}", not "new-article" — nothing to generate today.` };
    writeFileSync(proposalPath, JSON.stringify(skip, null, 2));
    console.log(skip.reason);
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    const skip = {
      status: 'blocked',
      reason: 'Decision was "new-article" but content generation was skipped: ANTHROPIC_API_KEY is not configured.',
      requiredSecret: 'ANTHROPIC_API_KEY',
      howToFix: 'Add an ANTHROPIC_API_KEY repository secret (Settings → Secrets and variables → Actions → New repository secret) with a valid Anthropic API key. No other configuration is required — this script already gates on its presence.',
      decision,
    };
    writeFileSync(proposalPath, JSON.stringify(skip, null, 2));
    console.log(`Content generation blocked: ${skip.reason}`);
    return;
  }

  const keywordMapPath = resolve(process.cwd(), 'data/seo/keyword-map.json');
  const keywordMap: KeywordMap = JSON.parse(readFileSync(keywordMapPath, 'utf8'));
  const clusterKeywords = keywordMap.keywords.filter((k) => k.topicCluster === decision.cluster).map((k) => k.keyword).slice(0, 15);

  const { default: Anthropic } = await import('@anthropic-ai/sdk');
  const client = new Anthropic({ apiKey });

  const response = await client.messages.create({
    model: 'claude-opus-5',
    max_tokens: 8000,
    output_config: { effort: 'medium' },
    messages: [{ role: 'user', content: buildPrompt(decision, clusterKeywords) }],
  });

  const textBlock = response.content.find((b): b is Anthropic.TextBlock => b.type === 'text');
  if (!textBlock) {
    throw new Error(`No text content in Claude response (stop_reason: ${response.stop_reason}).`);
  }

  let article: GeneratedArticle;
  try {
    article = JSON.parse(textBlock.text.trim());
  } catch {
    throw new Error(`Claude response was not valid JSON: ${textBlock.text.slice(0, 500)}`);
  }

  if (posts.some((p) => p.slug === article.slug)) {
    throw new Error(`Generated slug "${article.slug}" collides with an existing post — refusing to proceed.`);
  }

  const image = pickImageForCluster(decision.cluster ?? '');
  const now = new Date();
  const publishedISO = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;

  const relatedForLinking = posts.filter((p) => p.category === article.category).slice(0, 2);
  if (relatedForLinking.length > 0) {
    const lastParagraphIdx = [...article.blocks].map((b, i) => ({ b, i })).reverse().find(({ b }) => b.p)?.i;
    if (lastParagraphIdx !== undefined) {
      article.blocks[lastParagraphIdx] = {
        ...article.blocks[lastParagraphIdx],
        related: relatedForLinking.map((p) => ({ text: p.title, slug: p.slug })),
      };
    }
  }

  const newPost: Post = {
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    category: article.category,
    date: now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    publishedISO,
    readTime: article.readTime,
    ...(image ? { image: image.image, imageAlt: image.imageAlt } : {}),
    blocks: article.blocks,
  };

  const proposal = {
    status: 'generated',
    decision,
    post: newPost,
    model: response.model,
    usage: response.usage,
  };
  writeFileSync(proposalPath, JSON.stringify(proposal, null, 2));
  console.log(`Content proposal generated: "${newPost.title}" (${newPost.slug})`);
}

main().catch((err) => {
  console.error('Content generation failed:', err instanceof Error ? err.message : err);
  const failure = { status: 'error', reason: err instanceof Error ? err.message : String(err) };
  mkdirSync(resolve(process.cwd(), REPORTS_DIR), { recursive: true });
  writeFileSync(proposalPath, JSON.stringify(failure, null, 2));
  process.exitCode = 1;
});
