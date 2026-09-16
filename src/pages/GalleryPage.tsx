import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, animate, useMotionValue, useReducedMotion } from 'framer-motion';
import RevealText from '../components/RevealText';
import MagneticButton from '../components/MagneticButton';
import MotionDrumGallery, { PANEL_SIZES, type DrumPhoto } from '../components/MotionDrumGallery';
import { useSectionNav } from '../lib/useSectionNav';
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

// Every photo wider than 720px also ships a 640px variant
// (scripts/generate-gallery-variants.mjs) so the drum fetches and decodes
// roughly the size it paints — the centre panel is ~576px on a DPR-1 desktop.
// The lightbox keeps using the full-size `src`.
const HAS_VARIANT_MIN_WIDTH = 720;
function toDrumPhoto(p: Photo): DrumPhoto & { tags: FilterTag[] } {
  const srcSet = p.w > HAS_VARIANT_MIN_WIDTH ? `${p.src.replace(/\.webp$/, '-640.webp')} 640w, ${p.src} ${p.w}w` : undefined;
  return { src: p.src, alt: p.alt, category: p.category, tags: p.tags, srcSet };
}
const drumPhotos = photos.map(toDrumPhoto);

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


type FilterKey = (typeof FILTERS)[number];

const OUT_EASE: [number, number, number, number] = [0.4, 0, 1, 1];
const IN_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const OUT_MS = 220;
const IN_MS = 420;
const PRELOAD_CAP_MS = 240; // never hold the swap longer than this waiting on decodes

/** Kick off fetch+decode for exactly the frames that will be live the moment
 *  a category fades in: the first `n`, plus the three that wrap in from the
 *  far end of the ring on the left (the drum's live window is ±3 around the
 *  centre). Cached by the browser, so calling it on hover and again on click
 *  costs nothing the second time. */
function preloadEntry(list: DrumPhoto[], n: number) {
  const picks = list.slice(0, n);
  if (list.length > n + 3) picks.push(list[list.length - 1], list[list.length - 2], list[list.length - 3]);
  return Promise.all(
    picks.map((p) => {
      const img = new Image();
      img.decoding = 'async';
      if (p.srcSet) {
        img.sizes = PANEL_SIZES;
        img.srcset = p.srcSet;
      }
      img.src = p.src;
      return img.decode().catch(() => undefined);
    })
  );
}

/**
 * Typographic filter nav — one editorial line, items separated by a dot,
 * the active one in champagne with a hairline underneath. Wraps to a second
 * line only below the width where all eleven fit; on phones it becomes a
 * single controlled horizontal scroll with fade masks (never page overflow).
 * Deliberately no sliding indicator or layout animation so nothing here
 * competes with the drum's own motion.
 */
function FilterNav({ active, onSelect, onWarm }: { active: FilterKey; onSelect: (tag: FilterKey) => void; onWarm: (tag: FilterKey) => void }) {
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ inline: 'nearest', block: 'nearest', behavior: 'smooth' });
  }, [active]);

  return (
    <nav aria-label="Filter gallery by event category" className="relative -mx-6 md:mx-0">
      <div role="tablist" className="scrollbar-none flex items-center overflow-x-auto px-6 md:flex-wrap md:overflow-visible md:px-0">
        {FILTERS.map((tag, i) => {
          const isActive = tag === active;
          return (
            <Fragment key={tag}>
              {i > 0 && <span aria-hidden className="mx-2.5 h-[3px] w-[3px] shrink-0 rounded-full bg-champagne/35 md:mx-3.5" />}
              <button
                ref={isActive ? activeRef : undefined}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onSelect(tag)}
                onPointerEnter={() => onWarm(tag)}
                onFocus={() => onWarm(tag)}
                className={`relative flex h-11 shrink-0 items-center whitespace-nowrap text-[10px] uppercase tracking-[0.22em] transition-colors duration-300 md:text-[11px] ${
                  isActive ? 'text-champagne' : 'text-mist-dim hover:text-ivory'
                }`}
              >
                {tag}
                <span
                  aria-hidden
                  className={`absolute inset-x-0 bottom-2 h-px bg-champagne transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}
                />
              </button>
            </Fragment>
          );
        })}
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-ink to-ink/0 md:hidden" />
      <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-ink to-ink/0 md:hidden" />
    </nav>
  );
}

export default function GalleryPage() {
  const sectionNav = useSectionNav();
  const reduceMotion = useReducedMotion() ?? false;
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  // `active` is what the nav highlights (updates on the click, instantly);
  // `displayed` is what the stage is showing, and only changes once the
  // outgoing set has faded out.
  const [active, setActive] = useState<FilterKey>('All');
  const [displayed, setDisplayed] = useState<FilterKey>('All');
  const stageOpacity = useMotionValue(1);
  const stageScale = useMotionValue(1);
  const transitionSeq = useRef(0);
  const pendingIn = useRef(false);

  // Every filter's photo list, computed once. 'All' and the broad
  // 'Weddings' filter keep each photo's own native `category` so the drum's
  // crossfading label behaves exactly as before; a specific sub-filter
  // overrides `category` on just its subset so that same label mechanism
  // reads e.g. "MEHNDI" rather than the broader "WEDDINGS".
  const photosByFilter = useMemo(() => {
    const map = new Map<FilterKey, DrumPhoto[]>();
    for (const f of FILTERS) {
      if (f === 'All') map.set(f, drumPhotos);
      else {
        const filtered = drumPhotos.filter((p) => p.tags.includes(f));
        map.set(f, f === 'Weddings' ? filtered : filtered.map((p) => ({ ...p, category: f })));
      }
    }
    return map;
  }, []);
  const displayedPhotos = photosByFilter.get(displayed) ?? drumPhotos;

  const warm = useCallback((tag: FilterKey) => {
    if (tag === displayed) return;
    void preloadEntry(photosByFilter.get(tag) ?? [], 3);
  }, [displayed, photosByFilter]);

  // Click → the stage begins fading out on that same frame → the incoming
  // set's first frames are decoded in parallel → swap while invisible →
  // fade back in. One continuous ~640ms transition with no blank hold; a
  // newer click simply supersedes an in-flight one at whatever opacity it
  // has reached.
  const selectFilter = useCallback(
    (tag: FilterKey) => {
      if (tag === active) return;
      setActive(tag);
      setLightboxIndex(null);
      const seq = ++transitionSeq.current;
      const next = photosByFilter.get(tag) ?? [];

      if (reduceMotion) {
        setDisplayed(tag);
        return;
      }

      const decoded = preloadEntry(next, 4);
      const wait = new Promise<void>((r) => window.setTimeout(r, PRELOAD_CAP_MS));
      const out = animate(stageOpacity, 0, { duration: OUT_MS / 1000, ease: OUT_EASE });
      animate(stageScale, 0.985, { duration: OUT_MS / 1000, ease: OUT_EASE });

      void Promise.all([out.finished, Promise.race([decoded, wait])])
        .then(() => {
          if (seq !== transitionSeq.current) return;
          stageScale.jump(1.015);
          pendingIn.current = true;
          setDisplayed(tag);
        })
        .catch(() => undefined); // an interrupted fade-out is simply superseded
    },
    [active, photosByFilter, reduceMotion, stageOpacity, stageScale]
  );

  // The fade-in starts only after React has committed the new photo set,
  // so the first frame the visitor sees is the finished layout.
  useEffect(() => {
    if (!pendingIn.current) return;
    pendingIn.current = false;
    animate(stageOpacity, 1, { duration: IN_MS / 1000, ease: IN_EASE });
    animate(stageScale, 1, { duration: IN_MS / 1000, ease: IN_EASE });
  }, [displayed, stageOpacity, stageScale]);

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
      {/* header + filters: same max-width container as the fixed navbar
          (Navbar.tsx, max-w-[1400px]) so the logo, the title and the filter
          line share one left edge; top padding clears the unscrolled bar
          without the old half-viewport of dark space above the media */}
      <section className="relative overflow-hidden pt-28 pb-4 md:pt-32 md:pb-5">
        {/* `closest-side` keeps the glow fully faded inside its own 300px
            box, so the now-compact header never clips it into a visible
            horizontal edge above the stage */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-[300px] w-[900px] -translate-x-1/2"
          style={{ background: 'radial-gradient(closest-side, rgba(230,197,138,0.16), transparent)' }}
        />
        <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-3 text-[11px] uppercase tracking-[0.3em] text-champagne"
          >
            Gallery
          </motion.p>
          <RevealText
            as="h1"
            text="Real events, produced by Baraka."
            className="font-display text-4xl font-light leading-[1.08] sm:text-5xl md:text-6xl"
            highlightWords={[0, 1]}
            highlightClass="accent-serif"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="mt-3 max-w-4xl text-sm font-light leading-relaxed text-mist md:text-[15px]"
          >
            Our own production archive across Lahore. Drag or use the arrows to browse; click the
            centre frame to view full-screen.
          </motion.p>

          <div className="mt-5 md:mt-6">
            <FilterNav active={active} onSelect={selectFilter} onWarm={warm} />
          </div>
        </div>
      </section>

      {/* the drum stays mounted across filter changes; only its photo list
          swaps, inside this opacity/scale crossfade. will-change promotes the
          section to its own compositor layer so the ±1.5% scale is applied
          to the already-rasterised layer — without it Chrome re-rasters (and
          re-decodes) every visible photo on every frame of the scale;
          traced: 52 decodes per switch for 3 new images. */}
      <motion.section
        style={{ opacity: stageOpacity, scale: stageScale, willChange: 'transform, opacity' }}
        className="relative mt-1 md:mt-2"
      >
        <MotionDrumGallery photos={displayedPhotos} onOpen={setLightboxIndex} />
      </motion.section>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            items={displayedPhotos}
            index={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onNav={setLightboxIndex}
          />
        )}
      </AnimatePresence>

      {/* CTA */}
      <section className="mt-14 border-t border-champagne/10 bg-ink-2/40 py-20 text-center md:mt-20 md:py-28">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
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
