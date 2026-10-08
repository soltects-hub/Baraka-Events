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
  { src: '/media/gallery/wedding-1.webp', alt: 'Walima floral arch of white and blush roses under hanging bead garlands and crystal chandeliers — Baraka Events, Lahore', category: 'Weddings', tags: ['Weddings', 'Walima'], w: 1043, h: 1043 },
  { src: '/media/gallery/wedding-2.webp', alt: 'Walima aisle under a canopy of hanging greenery and a crystal chandelier, with carved white furniture and elephant figures', category: 'Weddings', tags: ['Weddings', 'Walima'], w: 640, h: 800 },
  { src: '/media/gallery/wedding-3.webp', alt: 'Candles in tall glass holders on a hand-painted floral cabinet with elephant figures, walima décor under hanging greenery', category: 'Weddings', tags: ['Weddings', 'Walima'], w: 640, h: 800 },
  { src: '/media/gallery/wedding-4.webp', alt: 'Walima walkway lined with white rose stands under draped white fabric and a crystal chandelier — Baraka Events, Lahore', category: 'Weddings', tags: ['Weddings', 'Walima'], w: 970, h: 1200 },
  { src: '/media/gallery/wedding-5.webp', alt: 'Garden walkway for a walima with a large black metal basket of white flowers and hanging chandeliers', category: 'Weddings', tags: ['Weddings', 'Walima'], w: 960, h: 1200 },
  { src: '/media/gallery/wedding-6.webp', alt: 'Walima entrance framed by pale green drapes, with a round wooden table of brass elephant figures and candles', category: 'Weddings', tags: ['Weddings', 'Walima'], w: 900, h: 1200 },
  { src: '/media/gallery/wedding-7.webp', alt: 'Long outdoor walima banquet table with tall white rose centrepieces on black stands and wooden cross-back chairs', category: 'Weddings', tags: ['Weddings', 'Walima'], w: 960, h: 1200 },
  { src: '/media/gallery/wedding-8.webp', alt: 'Baraat setup of red velvet drapes, arched niches and a round tufted gold sofa under chandeliers — Baraka Events, Lahore', category: 'Weddings', tags: ['Weddings', 'Baraat'], w: 1200, h: 560 },
  { src: '/media/gallery/wedding-9.webp', alt: 'Baraat lounge under a fairy-light canopy with crystal chandeliers, red velvet drapes and candlelit cabinets', category: 'Weddings', tags: ['Weddings', 'Baraat'], w: 1200, h: 560 },
  { src: '/media/gallery/wedding-10.webp', alt: 'Baraat entrance walkway under a tree, with a large crystal chandelier, fairy lights, red drapes and a round tufted sofa', category: 'Weddings', tags: ['Weddings', 'Baraat'], w: 560, h: 1200 },
  { src: '/media/gallery/wedding-11.webp', alt: 'Baraat stage backdrop of hanging greenery, chandeliers and bougainvillea behind a cream sofa — Baraka Events, Lahore', category: 'Weddings', tags: ['Weddings', 'Baraat'], w: 864, h: 1080 },
  { src: '/media/gallery/wedding-12.webp', alt: 'Baraat lounge of armchairs, wooden tables and candles facing a stage framed by red velvet drapes', category: 'Weddings', tags: ['Weddings', 'Baraat'], w: 1200, h: 560 },
  { src: '/media/gallery/wedding-13.webp', alt: 'Baraat lounge seating on a patterned carpet facing a stage of hanging chandeliers and greenery between red drapes', category: 'Weddings', tags: ['Weddings', 'Baraat'], w: 1200, h: 560 },
  { src: '/media/gallery/wedding-14.webp', alt: 'Baraat stage with curtains of hanging crystal strands, red roses, white urns and a white sofa', category: 'Weddings', tags: ['Weddings', 'Baraat'], w: 994, h: 1200 },
  { src: '/media/gallery/wedding-15.webp', alt: 'Mehndi stage of carved arches hung with marigold garlands, white statues and yellow cushions — Baraka Events, Lahore', category: 'Weddings', tags: ['Weddings', 'Mehndi'], w: 960, h: 1200 },
  { src: '/media/gallery/wedding-16.webp', alt: 'Mehndi entrance aisle under hanging marigold and bead garlands, with mirrored gold tables and yellow and white flowers', category: 'Weddings', tags: ['Weddings', 'Mehndi'], w: 1200, h: 905 },
  { src: '/media/gallery/wedding-17.webp', alt: 'Mehndi stage under a ceiling of blush flowers and crystal garlands, with pink drapes and a lotus-pattern lit floor', category: 'Weddings', tags: ['Weddings', 'Mehndi'], w: 1200, h: 1200 },
  { src: '/media/gallery/wedding-18.webp', alt: 'Mehndi seating of white lattice sofas with yellow and pink cushions under a draped canopy — Baraka Events, Lahore', category: 'Weddings', tags: ['Weddings', 'Mehndi'], w: 960, h: 1200 },
  { src: '/media/gallery/wedding-19.webp', alt: 'Mehndi hall with a fairy-light ceiling, yellow and white garlands and a marigold stage wall beyond flower urns', category: 'Weddings', tags: ['Weddings', 'Mehndi'], w: 1200, h: 905 },
  { src: '/media/gallery/wedding-20.webp', alt: 'Mehndi stage with cascading yellow flower strands, a marigold backdrop and a white sofa between flower mounds', category: 'Weddings', tags: ['Weddings', 'Mehndi'], w: 1200, h: 900 },
  { src: '/media/gallery/wedding-21.webp', alt: 'Mehndi ceiling of hanging garlands and lanterns above a marigold stage wall, with floor cushions on a lit floor', category: 'Weddings', tags: ['Weddings', 'Mehndi'], w: 1200, h: 905 },
  { src: '/media/gallery/wedding-22.webp', alt: 'Walima stage with a white tufted sofa, white floral garland and a greenery arch with a bead curtain — Baraka Events, Lahore', category: 'Weddings', tags: ['Weddings', 'Walima'], w: 960, h: 1200 },
  { src: '/media/gallery/wedding-23.webp', alt: 'Garden walima banquet table with white floral centrepieces and white chairs under a draped white canopy', category: 'Weddings', tags: ['Weddings', 'Walima'], w: 1080, h: 801 },
  { src: '/media/gallery/wedding-24.webp', alt: 'Evening walima stage under a draped pink and white ceiling with a crystal chandelier and tall floral urns', category: 'Weddings', tags: ['Weddings', 'Walima'], w: 960, h: 1200 },
  { src: '/media/gallery/wedding-25.webp', alt: 'Baraat stage with candles in glass holders before pink and magenta flowers and chandeliers — Baraka Events, Lahore', category: 'Weddings', tags: ['Weddings', 'Baraat'], w: 1080, h: 1080 },
  { src: '/media/gallery/wedding-26.webp', alt: 'Baraat stage with a gold sofa against a wall of red flowers, hanging chandeliers and golden bird sculptures', category: 'Weddings', tags: ['Weddings', 'Baraat'], w: 720, h: 891 },
  { src: '/media/gallery/wedding-27.webp', alt: 'Red-petal-lined walkway to a baraat stage under a ceiling of hanging beads, photographed at night', category: 'Weddings', tags: ['Weddings', 'Baraat'], w: 1080, h: 486 },
  { src: '/media/gallery/wedding-28.webp', alt: 'Mehndi aisle of marigold and pink rose petals leading to a yellow-draped stage with a white sofa — Baraka Events, Lahore', category: 'Weddings', tags: ['Weddings', 'Mehndi'], w: 810, h: 1014 },
  { src: '/media/gallery/wedding-29.webp', alt: 'Mehndi lawn with red flower garlands hanging from a fairy-light grid and a gold sofa stage against a green hedge', category: 'Weddings', tags: ['Weddings', 'Mehndi'], w: 960, h: 1200 },
  { src: '/media/gallery/wedding-30.webp', alt: 'Mehndi stage and checkerboard dance floor under hanging chandeliers and pink flower garlands', category: 'Weddings', tags: ['Weddings', 'Mehndi'], w: 1200, h: 902 },
  { src: '/media/gallery/wedding-31.webp', alt: 'Farmhouse wedding dining under a draped cream canopy with ivy-wrapped posts and string lights — Baraka Events, Lahore', category: 'Weddings', tags: ['Weddings'], w: 735, h: 985 },
  { src: '/media/gallery/wedding-32.webp', alt: 'Farmhouse lawn at dusk with gold chairs, round tables and white floral centrepieces for a wedding', category: 'Weddings', tags: ['Weddings'], w: 736, h: 981 },
  { src: '/media/gallery/wedding-33.webp', alt: 'Farmhouse wedding lawn at night, with chair-covered tables and a white-draped entrance beside a lit house', category: 'Weddings', tags: ['Weddings'], w: 540, h: 960 },
  { src: '/media/gallery/celebration-1.webp', alt: 'Bridal shower black sequin wall with a Bride to Be neon sign and pink, black and gold balloons — Baraka Events, Lahore', category: 'Celebrations', tags: ['Birthdays'], w: 864, h: 1080 },
  { src: '/media/gallery/celebration-2.webp', alt: 'Bridal shower garden table with white flower arrangements, a pink and gold balloon garland and a floral sign', category: 'Celebrations', tags: ['Birthdays'], w: 960, h: 1200 },
  { src: '/media/gallery/celebration-3.webp', alt: 'Children\'s birthday safari balloon arch in orange, yellow, blue and cream beside a welcome sign — Baraka Events, Lahore', category: 'Celebrations', tags: ['Birthdays'], w: 1080, h: 1080 },
  { src: '/media/gallery/celebration-4.webp', alt: 'Birthday backdrop of a white flower wall with a Happy Birthday neon sign and pink balloons — Baraka Events, Lahore', category: 'Celebrations', tags: ['Birthdays'], w: 960, h: 1200 },
  { src: '/media/gallery/celebration-5.webp', alt: 'Children\'s birthday with a pastel pink and purple balloon backdrop, giraffe figure and balloon-covered ceiling', category: 'Celebrations', tags: ['Birthdays'], w: 854, h: 570 },
  { src: '/media/gallery/celebration-6.webp', alt: 'Bachelorette party backdrop with a sequin wall, neon sign, pink and silver balloons and copper tables', category: 'Celebrations', tags: ['Birthdays'], w: 1200, h: 1038 },
  { src: '/media/gallery/celebration-7.webp', alt: 'Princess-themed children\'s party with pastel balloons, character cut-outs and a glossy dance floor — Baraka Events, Lahore', category: 'Celebrations', tags: ['Birthdays'], w: 960, h: 1200 },
  { src: '/media/gallery/celebration-8.webp', alt: 'Birthday stage with a pastel balloon backdrop, giraffe figure and two tiered cakes on pink stands', category: 'Celebrations', tags: ['Birthdays'], w: 853, h: 569 },
  { src: '/media/gallery/celebration-9.webp', alt: 'Picnic-style party table made from wooden pallets with gold plates, white flowers and a mirrored cube', category: 'Celebrations', tags: ['Birthdays'], w: 960, h: 1200 },
  { src: '/media/gallery/celebration-10.webp', alt: 'First-birthday setup with large pink and lilac ONE marquee letters beside a pink balloon garland — Baraka Events, Lahore', category: 'Celebrations', tags: ['Birthdays'], w: 854, h: 570 },
  { src: '/media/gallery/celebration-11.webp', alt: 'Bridal shower gold hoop arch with a Bride to Be neon sign, pink and gold balloons and lantern candles', category: 'Celebrations', tags: ['Event Decoration'], w: 735, h: 919 },
  { src: '/media/gallery/celebration-12.webp', alt: 'Bridal shower balloon garland in pink, cream and gold beside a Bridal Shower sign and a small cake', category: 'Celebrations', tags: ['Event Decoration'], w: 670, h: 1200 },
  { src: '/media/gallery/celebration-13.webp', alt: 'Bridal shower at home with rose-gold and white balloons, a Bride to Be neon sign and a ring balloon', category: 'Celebrations', tags: ['Event Decoration'], w: 675, h: 1200 },
  { src: '/media/gallery/celebration-14.webp', alt: 'Party dance floor in black and white checks under hanging lantern pendants and twinkling lights — Baraka Events, Lahore', category: 'Celebrations', tags: ['Event Decoration'], w: 960, h: 1200 },
  { src: '/media/gallery/celebration-15.webp', alt: 'Circular checkerboard dance floor under hanging lanterns, with blue and red neon lines behind a DJ booth', category: 'Celebrations', tags: ['Event Decoration'], w: 480, h: 600 },
  { src: '/media/gallery/celebration-16.webp', alt: 'Round checkerboard dance floor beneath a ring of hanging lanterns and moving lights facing a DJ booth', category: 'Celebrations', tags: ['Event Decoration'], w: 960, h: 1200 },
  { src: '/media/gallery/celebration-17.webp', alt: 'Mehfil-e-milad at home with an embroidered calligraphy banner, a red velvet bench and a green and gold floor spread', category: 'Celebrations', tags: ['Event Decoration'], w: 900, h: 1200 },
  { src: '/media/gallery/celebration-18.webp', alt: 'Mehfil-e-milad stage with blue panels, white-flower hoops and a lit arch with Arabic calligraphy', category: 'Celebrations', tags: ['Event Decoration'], w: 675, h: 1200 },
  { src: '/media/gallery/corporate-1.webp', alt: 'Corporate product showcase hall with red truss arches, a stage with LED screens and a red carpet — Baraka Events, Lahore', category: 'Corporate', tags: ['Corporate'], w: 1200, h: 900 },
  { src: '/media/gallery/corporate-2.webp', alt: 'Conference stage with a large LED screen, branded lectern and blue LED-lit steps — Baraka Events, Lahore', category: 'Corporate', tags: ['Corporate'], w: 1200, h: 675 },
  { src: '/media/gallery/corporate-3.webp', alt: 'Ballroom conference set-up with a lighting truss, LED stage screen, red carpet aisle and round tables in blue linen', category: 'Corporate', tags: ['Corporate'], w: 1200, h: 675 },
  { src: '/media/gallery/corporate-4.webp', alt: 'Corporate celebration stage with a large LED screen, truss lighting and red balloon decor', category: 'Corporate', tags: ['Corporate'], w: 1200, h: 540 },
  { src: '/media/gallery/corporate-5.webp', alt: 'Large outdoor LED screens on a lit truss at night for a public celebration — Baraka Events, Lahore', category: 'Corporate', tags: ['Corporate'], w: 1200, h: 900 },
  { src: '/media/gallery/corporate-6.webp', alt: 'Wide night view of green LED screens on a truss showing a calligraphy greeting and a firework animation', category: 'Corporate', tags: ['Corporate'], w: 1200, h: 900 },
  { src: '/media/gallery/corporate-7.webp', alt: 'Close night view of an outdoor LED screen rig with a calligraphy greeting and a lantern in the foreground', category: 'Corporate', tags: ['Corporate'], w: 1200, h: 900 },
  { src: '/media/gallery/detail-1.webp', alt: 'Catering counter with stacked colourful bowls on gold stands and hammered steel serving dishes — Baraka Events, Lahore', category: 'Production', tags: ['Event Details'], w: 675, h: 1200 },
  { src: '/media/gallery/detail-2.webp', alt: 'Buffet line of gold-framed serving dishes with small flower arrangements on patterned table linen', category: 'Production', tags: ['Event Details'], w: 736, h: 981 },
  { src: '/media/gallery/detail-3.webp', alt: 'Evening qawali night stage under a fairy-light canopy with chandeliers and lit arched frames — Baraka Events, Lahore', category: 'Production', tags: ['Event Details'], w: 900, h: 1200 },
  { src: '/media/gallery/detail-4.webp', alt: 'Qawali night floor seating with sage-green bolsters, pink satin cushions and a flower hoop arch under chandeliers', category: 'Production', tags: ['Event Details'], w: 750, h: 929 },
  { src: '/media/gallery/detail-5.webp', alt: 'Tent interior for a qawali night with patterned carpets, a leafy floral-arch stage and a fairy-light draped ceiling', category: 'Production', tags: ['Event Details'], w: 675, h: 1200 },
  { src: '/media/gallery/detail-6.webp', alt: 'Open-air live-music stage with a gold curtain backdrop, globe chandeliers and microphones facing floor seating', category: 'Production', tags: ['Event Details'], w: 736, h: 981 },
  { src: '/media/gallery/detail-7.webp', alt: 'Floral arch of pink, orange and purple flowers beside a tufted bench and a pink lace parasol — Baraka Events, Lahore', category: 'Production', tags: ['Event Details', 'Event Decoration'], w: 1080, h: 924 },
  { src: '/media/gallery/detail-8.webp', alt: 'Garden-style floral arch frame over a cream sofa and two armchairs in front of a green hedge on a marble floor', category: 'Production', tags: ['Event Details', 'Event Decoration'], w: 1200, h: 600 },
  { src: '/media/gallery/detail-9.webp', alt: 'Pastel floral arches with sheer drapes over a long dining table on a lawn', category: 'Production', tags: ['Event Details', 'Event Decoration'], w: 810, h: 1080 },
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
