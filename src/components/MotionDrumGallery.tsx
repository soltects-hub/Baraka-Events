import { useMemo, useRef, useState } from 'react';
import { m, useScroll, useTransform, useMotionValueEvent, useReducedMotion, type MotionValue } from 'framer-motion';

export interface DrumPhoto {
  src: string;
  alt: string;
  category: string;
}

interface Props {
  photos: DrumPhoto[];
  onOpen: (index: number) => void;
}

/**
 * A scroll-pinned "drum" of images: a tall spacer holds the scroll distance,
 * a sticky stage stays on screen while scrolling through it, and every panel
 * is angled toward/away from camera based on its distance from the current
 * scroll position — the panel facing the camera reads flat and full-colour,
 * the others recede into a tilted, foreshortened stack above and below it.
 *
 * This is a from-scratch recreation of that interaction model in plain CSS
 * 3D transforms driven by framer-motion's scroll-linked MotionValues (no new
 * dependency — framer-motion is already used site-wide). It is deliberately
 * NOT the WebGL/canvas renderer the original reference uses: that would mean
 * introducing a WebGL surface and a per-frame render loop on a business site
 * where mobile visitors are paying customers, not portfolio browsers — the
 * exact regression this codebase already paid down once (see SmokeCursor's
 * removal). The visual character — flat centre panel, tilting stack, warm
 * fade into the background — is reproduced with transform/opacity only.
 *
 * Performance note: with all 67 photos live-subscribed to scroll at once,
 * a scripted scroll-through measured ~9.7s of main-thread blocking under
 * 4x CPU throttle — the exact class of regression SmokeCursor was removed
 * for. Every photo still renders a real <img> with real alt text (nothing
 * is unmounted, so prerender/SEO sees the full archive), but only the
 * ACTIVE_BUFFER panels nearest the current scroll position get a live,
 * per-frame transform subscription; everything else sits at a static,
 * one-time-computed "parked" position with zero ongoing motion-value cost.
 */
const VISIBLE_RANGE = 4.2;
const ACTIVE_BUFFER = 5; // panels on each side of centre that stay "live"
const ANGLE_STEP = 15; // degrees of rotateX per step away from centre
const Y_STEP = 132; // px of vertical travel per step
const Z_STEP = 130; // px of recession per step (translateZ, negative)
const SCROLL_PER_PANEL = 145; // px of page scroll consumed per panel step

const LABEL_TRANSITION = 2; // panel-steps over which one label crossfades into the next

/** A continuous category position: an integer for most of a category's run,
 *  ramping smoothly to the next integer only in the last LABEL_TRANSITION
 *  panels before the boundary — a crossfade window, not a snap. */
function categoryProgressAt(v: number, catStarts: number[]) {
  const last = catStarts.length - 2;
  for (let c = 0; c <= last; c++) {
    const end = catStarts[c + 1];
    if (v < end || c === last) {
      if (c < last) {
        const distFromEnd = end - v;
        if (distFromEnd < LABEL_TRANSITION) {
          const t = 1 - distFromEnd / LABEL_TRANSITION;
          return c + Math.max(0, Math.min(1, t));
        }
      }
      return c;
    }
  }
  return last;
}

function PanelLabel({
  categories,
  progress,
  panelCount,
  catStarts,
}: {
  categories: string[];
  progress: MotionValue<number>;
  panelCount: number;
  catStarts: number[];
}) {
  // Current category position as a continuous value (fractional only while
  // crossing a boundary), so the label crossfade/slide shares the drum's own
  // motion language instead of a bolted-on separate transition.
  const catProgress = useTransform(progress, (p) => categoryProgressAt(p * (panelCount - 1), catStarts));

  return (
    <div className="pointer-events-none absolute left-6 top-1/2 z-10 h-24 w-[min(60vw,320px)] -translate-y-1/2 overflow-hidden md:left-10">
      {categories.map((label, i) => (
        <Label key={label} label={label} index={i} catProgress={catProgress} />
      ))}
    </div>
  );
}

function Label({ label, index, catProgress }: { label: string; index: number; catProgress: MotionValue<number> }) {
  const offset = useTransform(catProgress, (c) => index - c);
  const y = useTransform(offset, (o) => `${o * 110}%`);
  const opacity = useTransform(offset, (o) => Math.max(0, 1 - Math.abs(o)));
  return (
    <m.h2
      style={{ y, opacity, textShadow: '0 2px 16px rgba(6,5,4,0.9), 0 1px 3px rgba(6,5,4,0.9)' }}
      className="absolute inset-x-0 top-0 font-display text-[7vw] font-semibold uppercase leading-[1.05] tracking-tight text-ivory sm:text-3xl md:text-4xl"
    >
      {label}
    </m.h2>
  );
}

const panelFrameClass =
  'absolute inset-x-0 top-1/2 -mt-[28vw] aspect-[16/9] w-full origin-center overflow-hidden rounded-sm border border-champagne/15 sm:-mt-[18vw] md:-mt-[16vh]';

/** A live, scroll-reactive panel — only mounted for panels near the current
 *  centre. One combined transform-string MotionValue plus one opacity
 *  MotionValue per panel — two subscriptions instead of an earlier version's
 *  eight (a chained virtualIndex -> offset -> six separate transforms).
 *  Measured: the chaining was a real, not theoretical, cost — collapsing it
 *  cut scripted-scroll main-thread blocking substantially under 4x CPU
 *  throttle. Everything here is transform/opacity only (GPU-composited, no
 *  layout or paint cost from the animation itself). */
function LivePanel({
  photo,
  index,
  progress,
  panelCount,
  centerIndex,
  onOpen,
}: {
  photo: DrumPhoto;
  index: number;
  progress: MotionValue<number>;
  panelCount: number;
  centerIndex: number;
  onOpen: () => void;
}) {
  const transform = useTransform(progress, (p) => {
    const o = clamp(index - p * (panelCount - 1), -VISIBLE_RANGE, VISIBLE_RANGE);
    const a = Math.abs(o);
    const scale = 1 - a * 0.015;
    return `translateY(${o * Y_STEP}px) translateZ(${-a * Z_STEP}px) rotateX(${o * ANGLE_STEP}deg) scale(${scale})`;
  });
  const opacity = useTransform(progress, (p) => {
    const a = Math.abs(index - p * (panelCount - 1));
    if (a > VISIBLE_RANGE) return 0;
    if (a < VISIBLE_RANGE - 1) return 1;
    return VISIBLE_RANGE - a; // fade over the last step
  });
  const zIndex = 100 - Math.round(Math.abs(index - centerIndex) * 10);

  return (
    <m.button
      type="button"
      onClick={onOpen}
      aria-label={`Open photo ${index + 1}: ${photo.alt}`}
      style={{ transform, opacity, zIndex }}
      className={`${panelFrameClass} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-champagne`}
    >
      <img src={photo.src} alt={photo.alt} loading="eager" className="h-full w-full object-cover" />
    </m.button>
  );
}

/** A parked panel outside the active window — a real <img> with its real alt
 *  text (so the full archive stays crawlable/prerenderable), but no motion
 *  subscription, no interaction, and no ongoing per-frame cost at all:
 *  styled once, fully inert. */
function ParkedPanel({ photo, index }: { photo: DrumPhoto; index: number }) {
  return (
    <div
      aria-hidden
      style={{ transform: `translateY(${index < 0 ? '-120vh' : '120vh'})`, opacity: 0 }}
      className={panelFrameClass}
    >
      <img src={photo.src} alt={photo.alt} loading="lazy" className="h-full w-full object-cover" />
    </div>
  );
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function MotionDrumGallery({ photos, onOpen }: Props) {
  const reduceMotion = useReducedMotion() ?? false;
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start start', 'end end'] });
  const [centerIndex, setCenterIndex] = useState(0);

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const next = Math.round(p * (photos.length - 1));
    setCenterIndex((prev) => (prev === next ? prev : next));
  });

  const categories = useMemo(() => {
    const seen: string[] = [];
    for (const p of photos) if (!seen.includes(p.category)) seen.push(p.category);
    return seen;
  }, [photos]);

  // Boundary index of each category's first panel, plus the total panel
  // count as a trailing sentinel — e.g. [0, 33, 51, 58, 67] for four
  // categories. Assumes photos are grouped by category (they are).
  const catStarts = useMemo(() => {
    const starts: number[] = [];
    let lastCat: string | null = null;
    photos.forEach((p, i) => {
      if (p.category !== lastCat) {
        starts.push(i);
        lastCat = p.category;
      }
    });
    starts.push(photos.length);
    return starts;
  }, [photos]);

  const scrollHeight = photos.length * SCROLL_PER_PANEL;

  if (reduceMotion) {
    // Reduced motion: a plain, still, fully-accessible vertical list — no
    // scroll-jacked pinning, no 3D transforms, no motion at all.
    return (
      <div className="mx-auto max-w-[720px] px-6">
        <ul className="flex flex-col gap-10">
          {photos.map((photo, i) => (
            <li key={photo.src}>
              <button type="button" onClick={() => onOpen(i)} className="block w-full text-left">
                <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-champagne">{photo.category}</p>
                <span className="block aspect-[16/9] w-full overflow-hidden rounded-sm border border-champagne/15">
                  <img src={photo.src} alt={photo.alt} loading="lazy" className="h-full w-full object-cover" />
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div ref={trackRef} style={{ height: `${scrollHeight}px` }} className="relative">
      <div className="sticky top-0 h-screen overflow-hidden">
        <PanelLabel categories={categories} progress={scrollYProgress} panelCount={photos.length} catStarts={catStarts} />

        <div
          className="relative mx-auto h-full w-[min(88vw,560px)]"
          style={{ perspective: '1400px', perspectiveOrigin: '50% 50%' }}
        >
          {photos.map((photo, i) =>
            Math.abs(i - centerIndex) <= ACTIVE_BUFFER ? (
              <LivePanel
                key={photo.src}
                photo={photo}
                index={i}
                progress={scrollYProgress}
                panelCount={photos.length}
                centerIndex={centerIndex}
                onOpen={() => onOpen(i)}
              />
            ) : (
              <ParkedPanel key={photo.src} photo={photo} index={i - centerIndex} />
            )
          )}
        </div>

        {/* fade the tilted stack into the page's own ink at the top/bottom
            edges of the pinned viewport, so the recession reads as fog
            rather than a hard clip. */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-ink to-transparent" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-ink to-transparent" />

        <p className="pointer-events-none absolute right-6 top-1/2 hidden -translate-y-1/2 font-serif-display text-lg italic text-champagne/70 sm:block md:right-10">
          Gallery.
        </p>
      </div>
    </div>
  );
}
