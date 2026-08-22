/**
 * Whitelist of real, existing site images available for new article
 * generation, each with alt text already verified elsewhere in this
 * codebase (About.tsx, DollyZoom.tsx, Gallery.tsx, HorizontalPortfolio.tsx,
 * DesignStudio.tsx, src/lib/posts.ts). generate-content.ts picks from this
 * list by topic — it never invents alt text for an image it can't verify,
 * and never generates or fetches a new image (no image-generation API is
 * connected to this project; see SEO_AUTOMATION.md).
 */
export interface ArticleImageOption {
  image: string;
  imageAlt: string;
  /** Topic clusters this image is thematically appropriate for. */
  themes: string[];
}

export const ARTICLE_IMAGES: ArticleImageOption[] = [
  { image: '/media/wedding-1.jpg', imageAlt: 'Luxurious golden nikkah stage with cascading roses and candles', themes: ['Nikkah', 'Shaadi Budget & Cost', 'Engagement / Mangni'] },
  { image: '/media/wedding-2.jpg', imageAlt: 'Pakistani bride and groom on a luxury shaadi stage', themes: ['Destination & Multi-Day Shaadis', 'Nikkah', 'Engagement / Mangni'] },
  { image: '/media/gallery-1.jpg', imageAlt: 'Opulent rose and marigold floral arrangements in a shaadi reception venue', themes: ['Event Decor & Floral Design', 'Garden & Outdoor Weddings'] },
  { image: '/media/gallery-3.jpg', imageAlt: 'Golden fireworks over a grand Pakistani shaadi celebration', themes: ['Destination & Multi-Day Shaadis', 'Anniversary Celebrations'] },
  { image: '/media/gallery-4.jpg', imageAlt: 'Outdoor mehndi dinner under string lights and marigold garlands', themes: ['Aqeeqah', 'Anniversary Celebrations', 'Milestone Birthdays'] },
  { image: '/media/gallery-6.jpg', imageAlt: 'Dhol drummers performing at a baraat celebration under golden confetti', themes: ['Milestone Birthdays'] },
  { image: '/media/portfolio-1.jpg', imageAlt: 'Grand Pakistani wedding reception in a historic Lahore haveli courtyard', themes: ['Walled City & Haveli Weddings', 'Raiwind Road Farmhouse Weddings'] },
  { image: '/media/portfolio-2.jpg', imageAlt: 'Dramatic corporate launch stage with golden LED screen in Lahore', themes: ['Corporate Product Launch', 'Corporate Summit & Conference', 'VIP & Executive Hospitality'] },
  { image: '/media/about.jpg', imageAlt: 'Henna-decorated hands arranging a marigold garland on a luxury shaadi table', themes: ['Event Catering & Menu Direction', 'Event Decor & Floral Design'] },
  { image: '/media/showcase-1.jpg', imageAlt: 'Full-scale stage & light — concert-grade rigs, engineered in-house', themes: ['Event Lighting & Production'] },
  { image: '/media/showcase-4.jpg', imageAlt: 'The gala floor — intelligent lighting choreographed to the minute', themes: ['Corporate Summit & Conference', 'Event Lighting & Production'] },
  { image: '/media/showcase-5.jpg', imageAlt: 'First impressions — reception service trained to five-star standard', themes: ['VIP & Executive Hospitality', 'Event Catering & Menu Direction'] },
  { image: '/media/design-1.jpg', imageAlt: 'Keynote Hall — 3D visualization by Baraka Events', themes: ['Corporate Summit & Conference', 'Corporate Product Launch'] },
];

export function pickImageForCluster(cluster: string): ArticleImageOption {
  const match = ARTICLE_IMAGES.find((img) => img.themes.includes(cluster));
  return match ?? ARTICLE_IMAGES[0];
}
