import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RevealText from '../components/RevealText';
import MagneticButton from '../components/MagneticButton';
import MotionDrumGallery from '../components/MotionDrumGallery';
import { useSectionNav } from '../lib/useSectionNav';
import { useLenis } from '../lib/useLenis';
import { useSEO, seoConfig, routes, generateWebsiteSchema, generateBreadcrumbSchema, applyStructuredData, composeSchemaGraph } from '../seo';

type Category = 'Weddings' | 'Corporate' | 'Celebrations' | 'Production';

/**
 * The filter taxonomy the visitor sees on the page. This is deliberately a
 * separate concern from `Category` above: `Category` drives the drum's own
 * internal grouped-scroll + crossfading label (unchanged, see
 * MotionDrumGallery), while `FilterTag` drives the new filter bar. A photo
 * can carry several tags (e.g. a walima photo is tagged both 'Weddings' and
 * 'Walima') so the broad and specific filters both surface it correctly.
 */
const FILTERS = ['All', 'Weddings', 'Mehndi', 'Baraat', 'Walima', 'Nikkah', 'Engagement', 'Corporate', 'Birthdays', 'Event Decoration', 'Event Details'] as const;
type FilterTag = Exclude<(typeof FILTERS)[number], 'All'>;

interface Photo {
  src: string;
  alt: string;
  category: Category;
  tags: FilterTag[];
  w: number;
  h: number;
}

// Every photo below is real Baraka Events production photography (from the
// team's own event archive — weddings, corporate work and private
// celebrations shot on-site, not stock or AI-generated). Natural aspect
// ratios are kept (w/h) instead of a forced crop, which is what gives the
// masonry its large/small rhythm — a true editorial grid, not a uniform
// square grid dressed up.
//
// `tags` were assigned from each photo's own alt text/visual content, not
// guessed: the wedding-* set already documented itself as walima, baraat or
// mehndi in triplicate runs (see the alt strings), so those became the
// specific tags, with 'Weddings' added alongside as the umbrella filter.
// Nothing here is confidently a Nikkah or Engagement photo specifically, so
// neither tag is force-assigned to any photo — those two filters exist per
// the spec but will correctly show zero results rather than a guess.
const photos: Photo[] = [
  { src: '/media/gallery/wedding-1.webp', alt: 'Real walima reception stage and décor produced by Baraka Events, Lahore', category: 'Weddings', tags: ['Weddings', 'Walima'], w: 1043, h: 1043 },
  { src: '/media/gallery/wedding-2.webp', alt: 'Real walima reception stage and décor produced by Baraka Events, Lahore — look 2', category: 'Weddings', tags: ['Weddings', 'Walima'], w: 640, h: 800 },
  { src: '/media/gallery/wedding-3.webp', alt: 'Real walima reception stage and décor produced by Baraka Events, Lahore — look 3', category: 'Weddings', tags: ['Weddings', 'Walima'], w: 640, h: 800 },
  { src: '/media/gallery/wedding-4.webp', alt: 'Real walima reception stage and décor produced by Baraka Events, Lahore — look 4', category: 'Weddings', tags: ['Weddings', 'Walima'], w: 970, h: 1200 },
  { src: '/media/gallery/wedding-5.webp', alt: 'Real walima reception stage and décor produced by Baraka Events, Lahore — look 5', category: 'Weddings', tags: ['Weddings', 'Walima'], w: 960, h: 1200 },
  { src: '/media/gallery/wedding-6.webp', alt: 'Real walima reception stage and décor produced by Baraka Events, Lahore — look 6', category: 'Weddings', tags: ['Weddings', 'Walima'], w: 900, h: 1200 },
  { src: '/media/gallery/wedding-7.webp', alt: 'Real walima reception stage and décor produced by Baraka Events, Lahore — look 7', category: 'Weddings', tags: ['Weddings', 'Walima'], w: 960, h: 1200 },
  { src: '/media/gallery/wedding-8.webp', alt: 'Real baraat stage setup produced by Baraka Events, Lahore', category: 'Weddings', tags: ['Weddings', 'Baraat'], w: 1200, h: 560 },
  { src: '/media/gallery/wedding-9.webp', alt: 'Real baraat stage setup produced by Baraka Events, Lahore — look 2', category: 'Weddings', tags: ['Weddings', 'Baraat'], w: 1200, h: 560 },
  { src: '/media/gallery/wedding-10.webp', alt: 'Real baraat stage setup produced by Baraka Events, Lahore — look 3', category: 'Weddings', tags: ['Weddings', 'Baraat'], w: 560, h: 1200 },
  { src: '/media/gallery/wedding-11.webp', alt: 'Real baraat stage setup produced by Baraka Events, Lahore — look 4', category: 'Weddings', tags: ['Weddings', 'Baraat'], w: 864, h: 1080 },
  { src: '/media/gallery/wedding-12.webp', alt: 'Real baraat stage setup produced by Baraka Events, Lahore — look 5', category: 'Weddings', tags: ['Weddings', 'Baraat'], w: 1200, h: 560 },
  { src: '/media/gallery/wedding-13.webp', alt: 'Real baraat stage setup produced by Baraka Events, Lahore — look 6', category: 'Weddings', tags: ['Weddings', 'Baraat'], w: 1200, h: 560 },
  { src: '/media/gallery/wedding-14.webp', alt: 'Real baraat stage setup produced by Baraka Events, Lahore — look 7', category: 'Weddings', tags: ['Weddings', 'Baraat'], w: 994, h: 1200 },
  { src: '/media/gallery/wedding-15.webp', alt: 'Real mehndi night décor and lighting produced by Baraka Events, Lahore', category: 'Weddings', tags: ['Weddings', 'Mehndi'], w: 960, h: 1200 },
  { src: '/media/gallery/wedding-16.webp', alt: 'Real mehndi night décor and lighting produced by Baraka Events, Lahore — look 2', category: 'Weddings', tags: ['Weddings', 'Mehndi'], w: 1200, h: 905 },
  { src: '/media/gallery/wedding-17.webp', alt: 'Real mehndi night décor and lighting produced by Baraka Events, Lahore — look 3', category: 'Weddings', tags: ['Weddings', 'Mehndi'], w: 1200, h: 1200 },
  { src: '/media/gallery/wedding-18.webp', alt: 'Real mehndi night décor and lighting produced by Baraka Events, Lahore — look 4', category: 'Weddings', tags: ['Weddings', 'Mehndi'], w: 960, h: 1200 },
  { src: '/media/gallery/wedding-19.webp', alt: 'Real mehndi night décor and lighting produced by Baraka Events, Lahore — look 5', category: 'Weddings', tags: ['Weddings', 'Mehndi'], w: 1200, h: 905 },
  { src: '/media/gallery/wedding-20.webp', alt: 'Real mehndi night décor and lighting produced by Baraka Events, Lahore — look 6', category: 'Weddings', tags: ['Weddings', 'Mehndi'], w: 1200, h: 900 },
  { src: '/media/gallery/wedding-21.webp', alt: 'Real mehndi night décor and lighting produced by Baraka Events, Lahore — look 7', category: 'Weddings', tags: ['Weddings', 'Mehndi'], w: 1200, h: 905 },
  { src: '/media/gallery/wedding-22.webp', alt: 'Real walima reception stage and décor produced by Baraka Events, Lahore', category: 'Weddings', tags: ['Weddings', 'Walima'], w: 960, h: 1200 },
  { src: '/media/gallery/wedding-23.webp', alt: 'Real walima reception stage and décor produced by Baraka Events, Lahore — look 2', category: 'Weddings', tags: ['Weddings', 'Walima'], w: 1080, h: 801 },
  { src: '/media/gallery/wedding-24.webp', alt: 'Real walima reception stage and décor produced by Baraka Events, Lahore — look 3', category: 'Weddings', tags: ['Weddings', 'Walima'], w: 960, h: 1200 },
  { src: '/media/gallery/wedding-25.webp', alt: 'Real baraat stage setup produced by Baraka Events, Lahore', category: 'Weddings', tags: ['Weddings', 'Baraat'], w: 1080, h: 1080 },
  { src: '/media/gallery/wedding-26.webp', alt: 'Real baraat stage setup produced by Baraka Events, Lahore — look 2', category: 'Weddings', tags: ['Weddings', 'Baraat'], w: 720, h: 891 },
  { src: '/media/gallery/wedding-27.webp', alt: 'Real baraat stage setup produced by Baraka Events, Lahore — look 3', category: 'Weddings', tags: ['Weddings', 'Baraat'], w: 1080, h: 486 },
  { src: '/media/gallery/wedding-28.webp', alt: 'Real mehndi night décor and lighting produced by Baraka Events, Lahore', category: 'Weddings', tags: ['Weddings', 'Mehndi'], w: 810, h: 1014 },
  { src: '/media/gallery/wedding-29.webp', alt: 'Real mehndi night décor and lighting produced by Baraka Events, Lahore — look 2', category: 'Weddings', tags: ['Weddings', 'Mehndi'], w: 960, h: 1200 },
  { src: '/media/gallery/wedding-30.webp', alt: 'Real mehndi night décor and lighting produced by Baraka Events, Lahore — look 3', category: 'Weddings', tags: ['Weddings', 'Mehndi'], w: 1200, h: 902 },
  { src: '/media/gallery/wedding-31.webp', alt: 'Real farmhouse wedding setup produced by Baraka Events, Lahore', category: 'Weddings', tags: ['Weddings'], w: 735, h: 985 },
  { src: '/media/gallery/wedding-32.webp', alt: 'Real farmhouse wedding setup produced by Baraka Events, Lahore — look 2', category: 'Weddings', tags: ['Weddings'], w: 736, h: 981 },
  { src: '/media/gallery/wedding-33.webp', alt: 'Real farmhouse wedding setup produced by Baraka Events, Lahore — look 3', category: 'Weddings', tags: ['Weddings'], w: 540, h: 960 },
  { src: '/media/gallery/celebration-1.webp', alt: 'Real birthday celebration décor produced by Baraka Events, Lahore', category: 'Celebrations', tags: ['Birthdays'], w: 864, h: 1080 },
  { src: '/media/gallery/celebration-2.webp', alt: 'Real birthday celebration décor produced by Baraka Events, Lahore — look 2', category: 'Celebrations', tags: ['Birthdays'], w: 960, h: 1200 },
  { src: '/media/gallery/celebration-3.webp', alt: 'Real birthday celebration décor produced by Baraka Events, Lahore — look 3', category: 'Celebrations', tags: ['Birthdays'], w: 1080, h: 1080 },
  { src: '/media/gallery/celebration-4.webp', alt: 'Real birthday celebration décor produced by Baraka Events, Lahore — look 4', category: 'Celebrations', tags: ['Birthdays'], w: 960, h: 1200 },
  { src: '/media/gallery/celebration-5.webp', alt: 'Real birthday celebration décor produced by Baraka Events, Lahore — look 5', category: 'Celebrations', tags: ['Birthdays'], w: 854, h: 570 },
  { src: '/media/gallery/celebration-6.webp', alt: 'Real birthday celebration décor produced by Baraka Events, Lahore — look 6', category: 'Celebrations', tags: ['Birthdays'], w: 1200, h: 1038 },
  { src: '/media/gallery/celebration-7.webp', alt: 'Real birthday celebration décor produced by Baraka Events, Lahore — look 7', category: 'Celebrations', tags: ['Birthdays'], w: 960, h: 1200 },
  { src: '/media/gallery/celebration-8.webp', alt: 'Real birthday celebration décor produced by Baraka Events, Lahore — look 8', category: 'Celebrations', tags: ['Birthdays'], w: 853, h: 569 },
  { src: '/media/gallery/celebration-9.webp', alt: 'Real birthday celebration décor produced by Baraka Events, Lahore — look 9', category: 'Celebrations', tags: ['Birthdays'], w: 960, h: 1200 },
  { src: '/media/gallery/celebration-10.webp', alt: 'Real birthday celebration décor produced by Baraka Events, Lahore — look 10', category: 'Celebrations', tags: ['Birthdays'], w: 854, h: 570 },
  { src: '/media/gallery/celebration-11.webp', alt: 'Real bridal shower setup produced by Baraka Events, Lahore', category: 'Celebrations', tags: ['Event Decoration'], w: 735, h: 919 },
  { src: '/media/gallery/celebration-12.webp', alt: 'Real bridal shower setup produced by Baraka Events, Lahore — look 2', category: 'Celebrations', tags: ['Event Decoration'], w: 670, h: 1200 },
  { src: '/media/gallery/celebration-13.webp', alt: 'Real bridal shower setup produced by Baraka Events, Lahore — look 3', category: 'Celebrations', tags: ['Event Decoration'], w: 675, h: 1200 },
  { src: '/media/gallery/celebration-14.webp', alt: 'Real private celebration décor produced by Baraka Events, Lahore', category: 'Celebrations', tags: ['Event Decoration'], w: 960, h: 1200 },
  { src: '/media/gallery/celebration-15.webp', alt: 'Real private celebration décor produced by Baraka Events, Lahore — look 2', category: 'Celebrations', tags: ['Event Decoration'], w: 480, h: 600 },
  { src: '/media/gallery/celebration-16.webp', alt: 'Real private celebration décor produced by Baraka Events, Lahore — look 3', category: 'Celebrations', tags: ['Event Decoration'], w: 960, h: 1200 },
  { src: '/media/gallery/celebration-17.webp', alt: 'Real mehfil-e-milad stage setup produced by Baraka Events, Lahore', category: 'Celebrations', tags: ['Event Decoration'], w: 900, h: 1200 },
  { src: '/media/gallery/celebration-18.webp', alt: 'Real mehfil-e-milad stage setup produced by Baraka Events, Lahore — look 2', category: 'Celebrations', tags: ['Event Decoration'], w: 675, h: 1200 },
  { src: '/media/gallery/corporate-1.webp', alt: 'Real corporate event production by Baraka Events, Lahore', category: 'Corporate', tags: ['Corporate'], w: 1200, h: 900 },
  { src: '/media/gallery/corporate-2.webp', alt: 'Real corporate event production by Baraka Events, Lahore — look 2', category: 'Corporate', tags: ['Corporate'], w: 1200, h: 675 },
  { src: '/media/gallery/corporate-3.webp', alt: 'Real corporate event production by Baraka Events, Lahore — look 3', category: 'Corporate', tags: ['Corporate'], w: 1200, h: 675 },
  { src: '/media/gallery/corporate-4.webp', alt: 'Real corporate event production by Baraka Events, Lahore — look 4', category: 'Corporate', tags: ['Corporate'], w: 1200, h: 540 },
  { src: '/media/gallery/corporate-5.webp', alt: 'Large-scale public event lighting production by Baraka Events, Lahore', category: 'Corporate', tags: ['Corporate'], w: 1200, h: 900 },
  { src: '/media/gallery/corporate-6.webp', alt: 'Large-scale public event lighting production by Baraka Events, Lahore — look 2', category: 'Corporate', tags: ['Corporate'], w: 1200, h: 900 },
  { src: '/media/gallery/corporate-7.webp', alt: 'Large-scale public event lighting production by Baraka Events, Lahore — look 3', category: 'Corporate', tags: ['Corporate'], w: 1200, h: 900 },
  { src: '/media/gallery/detail-1.webp', alt: 'Real catering and tableware styling by Baraka Events, Lahore', category: 'Production', tags: ['Event Details'], w: 675, h: 1200 },
  { src: '/media/gallery/detail-2.webp', alt: 'Real catering and tableware styling by Baraka Events, Lahore — look 2', category: 'Production', tags: ['Event Details'], w: 736, h: 981 },
  { src: '/media/gallery/detail-3.webp', alt: 'Real qawali night stage and lighting produced by Baraka Events, Lahore', category: 'Production', tags: ['Event Details'], w: 900, h: 1200 },
  { src: '/media/gallery/detail-4.webp', alt: 'Real qawali night stage and lighting produced by Baraka Events, Lahore — look 2', category: 'Production', tags: ['Event Details'], w: 750, h: 929 },
  { src: '/media/gallery/detail-5.webp', alt: 'Real qawali night stage and lighting produced by Baraka Events, Lahore — look 3', category: 'Production', tags: ['Event Details'], w: 675, h: 1200 },
  { src: '/media/gallery/detail-6.webp', alt: 'Real qawali night stage and lighting produced by Baraka Events, Lahore — look 4', category: 'Production', tags: ['Event Details'], w: 736, h: 981 },
  { src: '/media/gallery/detail-7.webp', alt: 'Real floral décor styling by Baraka Events, Lahore', category: 'Production', tags: ['Event Details', 'Event Decoration'], w: 1080, h: 924 },
  { src: '/media/gallery/detail-8.webp', alt: 'Real floral décor styling by Baraka Events, Lahore — look 2', category: 'Production', tags: ['Event Details', 'Event Decoration'], w: 1200, h: 600 },
  { src: '/media/gallery/detail-9.webp', alt: 'Real floral décor styling by Baraka Events, Lahore — look 3', category: 'Production', tags: ['Event Details', 'Event Decoration'], w: 810, h: 1080 },
];

function wrapIndex(i: number, length: number) {
  return ((i % length) + length) % length;
}

// Lightbox only ever reads src/alt/length off an item — typed to just that
// shape (rather than the full `Photo`) so it also accepts the filtered,
// category-overridden array `visiblePhotos` produces for a specific filter.
interface LightboxPhoto {
  src: string;
  alt: string;
}

function Lightbox({ items, index, onClose, onNav }: { items: LightboxPhoto[]; index: number; onClose: () => void; onNav: (i: number) => void }) {
  const photo = items[index];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNav(wrapIndex(index + 1, items.length));
      if (e.key === 'ArrowLeft') onNav(wrapIndex(index - 1, items.length));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, items.length, onClose, onNav]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[200] flex cursor-zoom-out items-center justify-center bg-ink/95 p-6"
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={photo.src}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          src={photo.src}
          alt={photo.alt}
          onClick={(e) => e.stopPropagation()}
          className="max-h-[85vh] max-w-full cursor-default rounded-sm object-contain"
        />
      </AnimatePresence>

      <button
        onClick={(e) => { e.stopPropagation(); onNav(wrapIndex(index - 1, items.length)); }}
        aria-label="Previous photo"
        className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-champagne/20 bg-ink/75 text-cream transition-colors hover:border-champagne hover:text-champagne md:left-8"
      >
        &#10094;
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onNav(wrapIndex(index + 1, items.length)); }}
        aria-label="Next photo"
        className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-champagne/20 bg-ink/75 text-cream transition-colors hover:border-champagne hover:text-champagne md:right-8"
      >
        &#10095;
      </button>
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-champagne/20 bg-ink/75 text-cream md:right-6 md:top-6"
      >
        &#10005;
      </button>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[11px] uppercase tracking-[0.25em] text-mist-dim">
        {String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
      </div>
    </motion.div>
  );
}

/**
 * Pill row for the filter taxonomy above. Deliberately plain
 * opacity/color transitions on the pills themselves — no slide, no tab
 * indicator animation — so nothing here competes with or resembles the
 * drum's own transform-driven motion language.
 */
function FilterBar({
  active,
  onSelect,
}: {
  active: (typeof FILTERS)[number];
  onSelect: (tag: (typeof FILTERS)[number]) => void;
}) {
  return (
    <div role="tablist" aria-label="Filter gallery by event category" className="flex flex-wrap gap-2 md:gap-2.5">
      {FILTERS.map((tag) => {
        const isActive = tag === active;
        return (
          <button
            key={tag}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(tag)}
            className={`flex min-h-[44px] shrink-0 items-center rounded-full border px-4 py-2.5 text-[11px] uppercase tracking-[0.2em] transition-colors duration-300 ${
              isActive
                ? 'border-champagne bg-champagne text-ink'
                : 'border-champagne/20 text-mist-dim hover:border-champagne/50 hover:text-champagne'
            }`}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
}

export default function GalleryPage() {
  const sectionNav = useSectionNav();
  const lenis = useLenis();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<(typeof FILTERS)[number]>('All');
  const drumAnchorRef = useRef<HTMLDivElement>(null);

  // 'All' and the broad 'Weddings' filter keep every photo's own native
  // `category` untouched, so the drum's crossfading label behaves exactly
  // as it always has. A specific sub-filter (Mehndi, Baraat, Corporate...)
  // overrides `category` on just the filtered subset passed to the drum, so
  // that same unmodified label mechanism reads e.g. "MEHNDI" instead of the
  // broader "WEDDINGS" it was grouped under — still one continuous run of
  // one label, the exact case the crossfade code already handles natively.
  const visiblePhotos = useMemo(() => {
    if (activeFilter === 'All') return photos;
    const filtered = photos.filter((p) => p.tags.includes(activeFilter));
    if (activeFilter === 'Weddings') return filtered;
    return filtered.map((p) => ({ ...p, category: activeFilter }));
  }, [activeFilter]);

  // Scroll back to the top of the drum first, then swap the photo list once
  // that settles — the drum remounts (key={activeFilter}) at scroll
  // position ~0 and its own existing reveal animation (panels fading in as
  // they enter the visible range) plays exactly as it does on first load.
  // No new transition system, just re-entering the current one.
  function handleFilterSelect(tag: (typeof FILTERS)[number]) {
    if (tag === activeFilter) return;
    const anchor = drumAnchorRef.current;
    if (anchor && lenis) {
      lenis.scrollTo(anchor, { duration: 0.9, onComplete: () => setActiveFilter(tag) });
    } else if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveFilter(tag);
    } else {
      setActiveFilter(tag);
    }
  }

  useSEO({
    title: 'Event Gallery — Wedding, Mehndi, Baraat & Corporate Event Photos in Lahore | Baraka Events',
    description:
      'Real wedding, mehndi, baraat, walima, corporate and private celebration photography from Baraka Events — our own production archive across Lahore.',
    canonical: routes.gallery,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    applyStructuredData(
      composeSchemaGraph([
        generateWebsiteSchema(),
        generateBreadcrumbSchema([
          { name: 'Home', url: seoConfig.site.url },
          { name: 'Gallery', url: `${seoConfig.site.url}${routes.gallery}` },
        ]),
      ])
    );
  }, []);

  return (
    <main className="bg-ink">
      {/* header */}
      <section className="relative overflow-hidden pt-36 pb-16 md:pt-44 md:pb-20">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[900px] -translate-x-1/2 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(230,197,138,0.16) 0%, transparent 65%)' }}
        />
        <div className="relative mx-auto max-w-[1200px] px-6 md:px-10">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-4 text-[11px] uppercase tracking-[0.3em] text-champagne"
          >
            Gallery
          </motion.p>
          <RevealText
            as="h1"
            text="Real events, produced by Baraka."
            className="font-display text-4xl font-light leading-[1.08] sm:text-5xl md:text-7xl"
            highlightWords={[0, 1]}
            highlightClass="accent-serif"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="mt-6 max-w-2xl text-sm font-light leading-relaxed text-mist md:text-base"
          >
            Every photograph here is from our own production archive — weddings, mehndi
            and baraat nights, corporate work and private celebrations across Lahore.
            Scroll to move through the work; click any frame for a full-screen view.
          </motion.p>

          <div className="mt-8">
            <FilterBar active={activeFilter} onSelect={handleFilterSelect} />
          </div>
        </div>
      </section>

      {/* scroll-pinned drum: one continuous scroll through whichever photos
          the active filter leaves visible, grouped by the drum's own
          internal category (Weddings, Corporate, Celebrations, Production),
          with the category label crossfading as you pass into the next
          group — see MotionDrumGallery for the interaction model, which is
          completely unmodified by the filter bar above. `key={activeFilter}`
          remounts the drum fresh on every filter change so its internal
          scroll-position state can't end up pointing at an index that no
          longer exists in a shorter filtered list. */}
      <div ref={drumAnchorRef}>
        {visiblePhotos.length === 0 ? (
          <div className="mx-auto max-w-[1200px] px-6 py-32 text-center md:px-10">
            <p className="text-sm font-light leading-relaxed text-mist-dim">
              No {activeFilter} photos in the archive yet — check back soon, or browse another category.
            </p>
          </div>
        ) : (
          <MotionDrumGallery key={activeFilter} photos={visiblePhotos} onOpen={setLightboxIndex} />
        )}
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            items={visiblePhotos}
            index={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onNav={setLightboxIndex}
          />
        )}
      </AnimatePresence>

      {/* CTA */}
      <section className="border-t border-champagne/10 bg-ink-2/40 py-24 text-center md:py-32">
        <div className="mx-auto max-w-[1200px] px-6 md:px-10">
          <RevealText
            as="h2"
            text="Like what you see? Let's design yours."
            className="mx-auto max-w-2xl font-display text-3xl font-light leading-[1.15] md:text-5xl"
            highlightWords={[7, 8]}
            highlightClass="accent-serif"
          />
          <div className="mt-8">
            <MagneticButton
              onClick={() => sectionNav('/contact')}
            >
              Request Consultation
            </MagneticButton>
          </div>
        </div>
      </section>
    </main>
  );
}
