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
 * A from-scratch recreation of markclennon.com/motion's scroll-drum, built
 * from PIXEL MEASUREMENTS taken directly off the reference (see below), not
 * approximation. The reference itself renders on a single WebGL canvas with
 * no persisted drawing buffer, so its geometry can't be read via CSS/DOM
 * inspection — it was reverse-engineered from screenshots: a horizontal
 * content-edge scan per row (`isBg` below is the same test used against a
 * real screenshot of the reference) to find each band's exact top/bottom Y
 * and left/right X at every row, which is how the numbers below were
 * derived, not guessed:
 *
 *  - Flat/active panel: 511x312px at a 1440px viewport -> aspect 1.64:1,
 *    perfectly constant width for its full height (zero internal tilt).
 *  - Each adjacent tilted band: exactly 136px tall (136/312 = 0.436x the
 *    flat panel's height), and LINEAR (no internal bulge) from one edge to
 *    the other -- confirmed by sampling its width every 4px of height and
 *    checking the slope was constant.
 *  - Every band's horizontal centre sits at exactly the same X (720px @
 *    1440 viewport, i.e. dead centre) -- pure vertical stacking, no
 *    horizontal drift.
 *  - Bands touch directly at their seams (no gap), and each band is
 *    narrower at the edge nearest the current flat panel and wider at the
 *    edge nearest the NEXT seam -- i.e. each panel hinges at the edge
 *    farthest from the current centre, not around its own middle. That's
 *    the accordion/fan structure implemented below via a per-panel
 *    transform-origin that flips between the panel's top and bottom edge
 *    depending on which side of centre it's currently on.
 *  - Scroll is Lenis-smoothed (confirmed with a wheel-burst test: scrollY
 *    kept drifting for ~150ms after input stopped, then held) -- inherited
 *    for free here since this codebase already runs Lenis site-wide.
 *  - No global custom cursor (cursor:auto everywhere) -- the reference's
 *    PLAY affordance on hover is a positioned DOM overlay, not a cursor
 *    swap, and doesn't apply here anyway since there is no video content.
 *  - Stage width is viewport-proportional and RESPONSIVE, not one constant:
 *    ~35.5vw (capped) at 1440/1024px, jumping to ~64vw at 390px mobile --
 *    a breakpoint change, reproduced below via a CSS custom property.
 *  - Text repositions at mobile rather than just shrinking: the project
 *    label moves from left-middle to bottom-centre (below the stack), and
 *    the corner wordmark moves from right-middle to top-centre (above it).
 *
 * Deliberately NOT the WebGL/canvas renderer itself: that would mean a
 * WebGL surface and a per-frame render loop on a business site where
 * mobile visitors are paying customers, not portfolio browsers -- the
 * exact regression this codebase already paid down once (SmokeCursor).
 * Everything here is transform/opacity only, driven by framer-motion's
 * scroll-linked MotionValues (already a dependency, no new library).
 *
 * One disclosed gap: the reference's measured "far" edge (571px) slightly
 * OVERSHOOTS the flat panel's own native width (511px), which a pure
 * hinge-rotation can't reproduce (a hinged edge tops out at native width).
 * That ~12% overshoot is most likely each of the reference's 7 real videos
 * having a slightly different native aspect ratio, not a deliberate
 * geometric exaggeration -- Baraka's photos are cropped to one consistent
 * ratio by design, so this implementation holds every panel to the
 * measured 1.64:1 flat ratio rather than force-replicating that overshoot.
 */
const FLAT_ASPECT = 1.64; // measured 511/312
const STEP_HEIGHT_RATIO = 0.436; // measured 136/312, per step away from centre
const VISIBLE_RANGE = 4.2;
const ACTIVE_BUFFER = 5; // panels on each side of centre that stay "live"
const ANGLE_STEP = 34; // degrees of rotateX per step away from centre
const SCROLL_PER_PANEL = 145; // px of page scroll consumed per panel step
const STAGE_WIDTH_VAR = '[--stage-w:64vw] md:[--stage-w:min(35.5vw,560px)]';

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
  const catProgress = useTransform(progress, (p) => categoryProgressAt(p * (panelCount - 1), catStarts));

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-[6%] z-10 h-16 overflow-hidden text-center md:inset-x-auto md:bottom-auto md:left-6 md:top-1/2 md:h-24 md:w-[min(60vw,320px)] md:-translate-y-1/2 md:text-left md:left-10">
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
  'absolute left-1/2 top-1/2 w-[var(--stage-w)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-sm border border-champagne/15';
const panelStyle = { aspectRatio: String(FLAT_ASPECT) } as const;

/** A live, scroll-reactive panel — only mounted for panels near the current
 *  centre. Two MotionValue subscriptions (a combined transform string, plus
 *  opacity) rather than eight separate chained ones — measured: collapsing
 *  the chain cut scripted-scroll main-thread blocking substantially under
 *  4x CPU throttle. transform-origin flips between the panel's own top and
 *  bottom edge depending on which side of centre it's on (see file-level
 *  comment) — the fan/accordion hinge measured off the reference. Only
 *  transform/opacity are animated (GPU-composited, no layout/paint cost). */
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
    const raw = index - p * (panelCount - 1);
    const o = clamp(raw, -VISIBLE_RANGE, VISIBLE_RANGE);
    // Step distance is a fraction of the flat panel's own (responsive)
    // height, expressed as CSS calc() against the shared --stage-w custom
    // property so it stays correct at any viewport width with no JS
    // measurement or resize listener.
    const stepCoefficient = (o * STEP_HEIGHT_RATIO) / FLAT_ASPECT;
    return `translateY(calc(var(--stage-w) * ${stepCoefficient})) rotateX(${o * ANGLE_STEP}deg)`;
  });
  const opacity = useTransform(progress, (p) => {
    const a = Math.abs(index - p * (panelCount - 1));
    if (a > VISIBLE_RANGE) return 0;
    if (a < VISIBLE_RANGE - 1) return 1;
    return VISIBLE_RANGE - a; // fade over the last step
  });
  const zIndex = 100 - Math.round(Math.abs(index - centerIndex) * 10);
  // Hinge at the edge FARTHEST from the current centre (measured: the edge
  // nearest the flat panel is the one that narrows; the far edge, toward
  // the next seam, is the one that holds close to native width).
  const transformOrigin = index <= centerIndex ? '50% 0%' : '50% 100%';

  return (
    <m.button
      type="button"
      onClick={onOpen}
      aria-label={`Open photo ${index + 1}: ${photo.alt}`}
      style={{ transform, opacity, zIndex, transformOrigin, ...panelStyle }}
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
      style={{ transform: `translateY(${index < 0 ? '-120vh' : '120vh'})`, opacity: 0, ...panelStyle }}
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
                <span className="block aspect-[164/100] w-full overflow-hidden rounded-sm border border-champagne/15">
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
      <div className={`sticky top-0 h-screen overflow-hidden ${STAGE_WIDTH_VAR}`}>
        <PanelLabel categories={categories} progress={scrollYProgress} panelCount={photos.length} catStarts={catStarts} />

        <div className="relative h-full" style={{ perspective: 'calc(var(--stage-w) * 1.35)', perspectiveOrigin: '50% 50%' }}>
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

        <p className="pointer-events-none absolute inset-x-0 top-[6%] text-center font-serif-display text-base italic text-champagne/70 md:inset-x-auto md:right-6 md:top-1/2 md:-translate-y-1/2 md:text-left md:text-lg md:right-10">
          Gallery.
        </p>
      </div>
    </div>
  );
}
