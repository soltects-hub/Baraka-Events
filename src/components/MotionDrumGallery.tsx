import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import {
  m,
  animate,
  useMotionValue,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
  type AnimationPlaybackControls,
  type MotionValue,
} from 'framer-motion';

export interface DrumPhoto {
  src: string;
  alt: string;
  category: string;
  /** Optional responsive candidates (e.g. a 640w variant + the original). */
  srcSet?: string;
}

/** Mirrors STAGE_WIDTH_VAR below, so the browser picks the candidate that
 *  matches the width the centre panel is actually painted at. */
export const PANEL_SIZES = '(min-width: 1024px) min(40vw, 600px), (min-width: 640px) min(52vw, 560px), 70vw';

interface Props {
  photos: DrumPhoto[];
  onOpen: (index: number) => void;
}

/**
 * The Baraka gallery drum, composed HORIZONTALLY.
 *
 * Geometry is the fan/accordion measured off markclennon.com/motion (see git
 * history for the pixel measurements) transposed from a vertical stack onto
 * a horizontal row: the flat centre panel keeps the measured 1.64:1 aspect,
 * every neighbouring panel hinges at the edge FARTHEST from centre (the
 * near edge is the one that recedes), the panels shingle behind each other
 * with the nearer-to-centre panel on top, and the visible band of each
 * receding panel is exactly STEP_RATIO of the flat panel's width. That is
 * the same construction as the vertical version — a rotateY hinge instead of
 * rotateX, a step along X instead of Y — so the motion character (the
 * folded strip, the flat frame snapping into place, the fog at the far ends)
 * carries over intact.
 *
 * What changed, and why: the vertical version pinned a full-viewport stage
 * over a ~9,700px scroll track, so the section was mostly empty dark space
 * until the pin engaged. This version is a self-contained stage roughly one
 * panel tall. It is driven by a single MotionValue (`progress`, a float
 * panel index, unbounded — the row is a ring, so the first frame is already
 * flanked on both sides and "previous" is never a dead end) rather than
 * page scroll, and advanced by drag / swipe, horizontal trackpad wheel,
 * arrow keys, the prev/next controls and clicking a side panel. Vertical
 * mouse-wheel is deliberately left alone so the page's own scroll is never
 * intercepted — the same policy as the homepage archive (DepthFlythrough).
 *
 * Performance: only ACTIVE_BUFFER panels each side of centre subscribe to
 * `progress` (three cheap string/number transforms each); every other
 * photo stays in the DOM as a real <img> with real alt text (crawlable,
 * prerenderable) but parked off-stage with no per-frame cost. Nothing
 * animates while idle. No canvas, no WebGL.
 */
const FLAT_ASPECT = 1.64;
const STEP_RATIO = 0.3; // visible band of each receding panel, as a fraction of the flat panel's width
const ANGLE_STEP = 34; // degrees of rotateY per step away from centre, hinged at the far edge
const PERSPECTIVE_RATIO = 2.2; // perspective distance in flat-panel widths (the measured 1.35× width of the vertical version, rescaled to the receding dimension)
const VISIBLE_RANGE = 3.6;
const ACTIVE_BUFFER = 3; // live panels each side of centre — exactly the ones that can be on screen
// Parked panels sit this far off-stage. It has to clear Chrome's
// loading="lazy" pre-fetch margin (up to ~2,500px from the viewport), or
// every photo in a category fetches and decodes the moment it mounts —
// measured: 33 decodes / ~1s of decode work for one filter switch at
// ±120vw. At ±600vw only the live panels load.
const PARK_OFFSET_VW = 600;
const LABEL_TRANSITION = 2;
const WHEEL_SENSITIVITY = 0.0028; // panels per px of horizontal wheel delta
const SNAP_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const STAGE_WIDTH_VAR = '[--stage-w:70vw] sm:[--stage-w:min(52vw,560px)] lg:[--stage-w:min(40vw,600px)]';

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function wrapIndex(i: number, n: number) {
  return n <= 0 ? 0 : ((i % n) + n) % n;
}

/** Signed shortest distance `d` around a ring of `n`, normalised to (-n/2, n/2]. */
function wrapOffset(d: number, n: number) {
  if (n <= 1) return 0;
  let r = ((d % n) + n) % n;
  if (r > n / 2) r -= n;
  return r;
}

/** A continuous category position: an integer for most of a category's run,
 *  ramping to the next integer only across the last LABEL_TRANSITION panels
 *  before each boundary — a crossfade window, not a snap. The final category
 *  ramps toward `categories.length`, which the label treats as index 0 again
 *  so the crossfade also carries across the loop seam. */
function categoryProgressAt(v: number, catStarts: number[]) {
  const last = catStarts.length - 2;
  for (let c = 0; c <= last; c++) {
    const end = catStarts[c + 1];
    if (v < end || c === last) {
      const distFromEnd = end - v;
      if (distFromEnd < LABEL_TRANSITION) {
        const t = 1 - distFromEnd / LABEL_TRANSITION;
        return c + clamp(t, 0, 1);
      }
      return c;
    }
  }
  return last;
}

function Label({ label, index, total, catProgress }: { label: string; index: number; total: number; catProgress: MotionValue<number> }) {
  const offset = useTransform(catProgress, (c) => wrapOffset(index - c, total));
  const y = useTransform(offset, (o) => `${o * 110}%`);
  const opacity = useTransform(offset, (o) => Math.max(0, 1 - Math.abs(o)));
  return (
    <m.h2
      style={{ y, opacity }}
      className="absolute inset-x-0 top-0 font-display text-3xl font-semibold uppercase leading-none tracking-tight text-ivory md:text-5xl"
    >
      {label}
    </m.h2>
  );
}

const panelFrameClass =
  'absolute left-1/2 top-1/2 w-[var(--stage-w)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-sm border border-champagne/15 bg-ink-2';
const panelStyle = { aspectRatio: String(FLAT_ASPECT) } as const;

/** A live, motion-reactive panel — only mounted for panels near centre. */
function LivePanel({
  photo,
  index,
  count,
  progress,
  centerIndex,
  onSelect,
}: {
  photo: DrumPhoto;
  index: number;
  count: number;
  progress: MotionValue<number>;
  centerIndex: number;
  onSelect: (index: number) => void;
}) {
  // The row is a ring: with few photos the reach shrinks to half the ring so
  // a panel has fully faded out on one side before it reappears on the other.
  const reach = Math.min(VISIBLE_RANGE, count / 2);
  const transform = useTransform(progress, (p) => {
    const o = clamp(wrapOffset(index - p, count), -reach, reach);
    // rotateY(+a) recedes the RIGHT edge; each panel must recede its NEAR
    // edge (the one facing centre), so the sign is flipped against o.
    return `translateX(calc(var(--stage-w) * ${o * STEP_RATIO})) rotateY(${-o * ANGLE_STEP}deg)`;
  });
  const opacity = useTransform(progress, (p) => clamp(reach - Math.abs(wrapOffset(index - p, count)), 0, 1));
  // Hinge at the edge farthest from centre. Driven by progress (not the
  // rounded centre index) so the origin flips exactly at o = 0, where the
  // rotation is 0° and the flip is invisible.
  const transformOrigin = useTransform(progress, (p) => (wrapOffset(index - p, count) < 0 ? '0% 50%' : '100% 50%'));
  const isCenter = index === centerIndex;
  const zIndex = 100 - Math.round(Math.abs(wrapOffset(index - centerIndex, count)) * 10);

  return (
    <m.button
      type="button"
      onClick={() => onSelect(index)}
      aria-label={isCenter ? `Open photo ${index + 1}: ${photo.alt}` : `Show photo ${index + 1}: ${photo.alt}`}
      style={{ transform, opacity, transformOrigin, zIndex, ...panelStyle }}
      className={`group ${panelFrameClass} ${isCenter ? 'cursor-zoom-in' : 'cursor-pointer'} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-champagne`}
    >
      <img
        src={photo.src}
        srcSet={photo.srcSet}
        sizes={photo.srcSet ? PANEL_SIZES : undefined}
        alt={photo.alt}
        loading="eager"
        decoding="async"
        draggable={false}
        className={`h-full w-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] ${isCenter ? 'group-hover:scale-[1.03]' : ''}`}
      />
    </m.button>
  );
}

/** A parked panel outside the active window — a real <img> with its real
 *  alt text, but no motion subscription and no ongoing cost. */
function ParkedPanel({ photo, side }: { photo: DrumPhoto; side: -1 | 1 }) {
  return (
    <div
      aria-hidden
      style={{ transform: `translateX(${side * PARK_OFFSET_VW}vw)`, opacity: 0, ...panelStyle }}
      className={panelFrameClass}
    >
      <img src={photo.src} srcSet={photo.srcSet} sizes={photo.srcSet ? PANEL_SIZES : undefined} alt={photo.alt} loading="lazy" decoding="async" draggable={false} className="h-full w-full object-cover" />
    </div>
  );
}

function Chevron({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.5" aria-hidden>
      <path d={dir === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function MotionDrumGallery({ photos, onOpen }: Props) {
  const reduceMotion = useReducedMotion() ?? false;
  const count = photos.length;

  const progress = useMotionValue(0);
  const [centerIndex, setCenterIndex] = useState(0);
  const [dragging, setDragging] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<AnimationPlaybackControls | null>(null);
  const gesture = useRef({ pointerId: -1, startX: 0, startY: 0, startProgress: 0, moved: false, active: false });
  const wheelTimer = useRef(0);

  const stopAnim = useCallback(() => {
    animRef.current?.stop();
    animRef.current = null;
  }, []);

  // A new photo set (filter change) always re-enters at the first frame.
  // The parent crossfades the whole drum around this swap, so the jump
  // itself is never visible. Centre index is re-derived during the same
  // render the new set arrives in (React's adjust-state-on-prop-change
  // pattern) so the very first paint already has the right panels live.
  const [seenPhotos, setSeenPhotos] = useState(photos);
  if (seenPhotos !== photos) {
    setSeenPhotos(photos);
    setCenterIndex(0);
  }
  useEffect(() => {
    stopAnim();
    progress.jump(0);
  }, [photos, progress, stopAnim]);

  useMotionValueEvent(progress, 'change', (p) => {
    const next = wrapIndex(Math.round(p), count);
    setCenterIndex((prev) => (prev === next ? prev : next));
  });

  // Progress is unbounded (the row is a ring); a target is always reached
  // the short way round.
  const goTo = useCallback(
    (i: number) => {
      if (count < 2) return;
      stopAnim();
      const p = progress.get();
      const target = p + wrapOffset(i - p, count);
      animRef.current = animate(progress, target, { duration: 0.7, ease: SNAP_EASE });
    },
    [count, progress, stopAnim]
  );

  const settle = useCallback(() => {
    stopAnim();
    const velocity = progress.getVelocity(); // panels per second
    animRef.current = animate(progress, progress.get(), {
      type: 'inertia',
      velocity,
      power: 0.25,
      timeConstant: 220,
      modifyTarget: (t) => Math.round(t),
    });
  }, [progress, stopAnim]);

  // ---- pointer drag (mouse + touch), horizontal only; vertical pans stay native
  const pxPerPanel = () => clamp((stageRef.current?.clientWidth ?? 1200) * 0.24, 140, 320);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (count < 2) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    stopAnim();
    gesture.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      startProgress: progress.get(),
      moved: false,
      active: true,
    };
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const g = gesture.current;
    if (!g.active || e.pointerId !== g.pointerId) return;
    const dx = e.clientX - g.startX;
    const dy = e.clientY - g.startY;
    if (!g.moved) {
      if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) {
        g.active = false; // a vertical pan — hand it back to the page
        return;
      }
      if (Math.abs(dx) < 6) return;
      g.moved = true;
      setDragging(true);
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    progress.set(g.startProgress - dx / pxPerPanel());
  };

  const endPointer = (e: ReactPointerEvent<HTMLDivElement>) => {
    const g = gesture.current;
    if (!g.active || e.pointerId !== g.pointerId) return;
    g.active = false;
    if (g.moved) {
      setDragging(false);
      settle();
      // The click event for this same gesture dispatches synchronously after
      // pointerup, so keep `moved` set for it and clear it right after — a
      // later click (keyboard-activated, or on a panel) must not be swallowed.
      window.setTimeout(() => { gesture.current.moved = false; }, 0);
    }
  };

  // ---- horizontal wheel / trackpad only (deltaX). Vertical wheel is the page's.
  useEffect(() => {
    const el = stageRef.current;
    if (!el || count < 2) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      stopAnim();
      progress.set(progress.get() + e.deltaX * WHEEL_SENSITIVITY);
      window.clearTimeout(wheelTimer.current);
      wheelTimer.current = window.setTimeout(settle, 110);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheel);
      window.clearTimeout(wheelTimer.current);
    };
  }, [count, progress, settle, stopAnim]);

  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(centerIndex + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(centerIndex - 1); }
    if (e.key === 'Home') { e.preventDefault(); goTo(0); }
    if (e.key === 'End') { e.preventDefault(); goTo(count - 1); }
  };

  const onSelectPanel = (i: number) => {
    if (gesture.current.moved) return; // the tail end of a drag, not a click
    if (i === centerIndex) onOpen(i);
    else goTo(i);
  };

  // ---- category label + counter, both driven by the same progress value
  const categories = useMemo(() => {
    const seen: string[] = [];
    for (const p of photos) if (!seen.includes(p.category)) seen.push(p.category);
    return seen;
  }, [photos]);

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

  const catProgress = useTransform(progress, (p) => categoryProgressAt(count ? wrapIndex(p, count) : 0, catStarts));
  const counter = useTransform(progress, (p) => String(wrapIndex(Math.round(p), count) + 1).padStart(2, '0'));

  if (reduceMotion) {
    // Reduced motion: a still, fully-accessible grid — no 3D, no inertia.
    return (
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        {count === 0 ? (
          <p className="py-16 text-center text-sm font-light text-mist-dim">No photos in this category yet.</p>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {photos.map((photo, i) => (
              <li key={photo.src}>
                <button type="button" onClick={() => onOpen(i)} className="block w-full text-left">
                  <span className="block aspect-[164/100] w-full overflow-hidden rounded-sm border border-champagne/15">
                    <img src={photo.src} alt={photo.alt} loading="lazy" className="h-full w-full object-cover" />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  return (
    <div className={STAGE_WIDTH_VAR}>
      {/* stage: full-bleed, exactly one panel tall plus breathing room, so
          the photography sits directly under the filters with no dead space
          and the section never changes height between categories (no CLS) */}
      <div
        ref={stageRef}
        role="group"
        aria-roledescription="gallery"
        aria-label="Gallery. Drag, swipe or use the arrow keys to move through the photos."
        tabIndex={count > 1 ? 0 : -1}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endPointer}
        onPointerCancel={endPointer}
        style={{ height: 'calc(var(--stage-w) / 1.64 + 2.5rem)', touchAction: 'pan-y' }}
        className={`relative w-full select-none overflow-hidden outline-none ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      >
        <div
          className="absolute inset-0"
          style={{ perspective: `calc(var(--stage-w) * ${PERSPECTIVE_RATIO})`, perspectiveOrigin: '50% 50%' }}
        >
          {photos.map((photo, i) => {
            const d = wrapOffset(i - centerIndex, count);
            return Math.abs(d) <= ACTIVE_BUFFER ? (
              <LivePanel key={photo.src} photo={photo} index={i} count={count} progress={progress} centerIndex={centerIndex} onSelect={onSelectPanel} />
            ) : (
              <ParkedPanel key={photo.src} photo={photo} side={d < 0 ? -1 : 1} />
            );
          })}
        </div>

        {count === 0 && (
          <p className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm font-light leading-relaxed text-mist-dim">
            No photos in this category yet — browse another category.
          </p>
        )}

        {/* fog at the far ends so the recession reads as depth, not a clip.
            `to-ink/0` rather than `to-transparent`: Tailwind v4 interpolates
            gradients in OKLab, and fading to the transparent keyword drifts
            off the ink hue mid-way, leaving a faint visible block. */}
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-[14%] bg-gradient-to-r from-ink to-ink/0 md:w-[18%]" />
        <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-[14%] bg-gradient-to-l from-ink to-ink/0 md:w-[18%]" />

        <p className="pointer-events-none absolute right-5 top-2 font-serif-display text-sm italic text-champagne/60 md:right-10 md:top-3 md:text-base">
          Gallery.
        </p>
      </div>

      {/* category / project information, below the media. Extra right
          padding from lg up keeps the arrows clear of the fixed WhatsApp
          button (WhatsAppButton.tsx, bottom-right) when this row lands in
          the bottom of the viewport, as it does on first paint at 1440×900. */}
      <div className="mx-auto mt-4 flex max-w-[1400px] items-end justify-between gap-6 px-6 md:mt-5 md:px-10 lg:pr-28">
        <div className="relative h-8 min-w-0 flex-1 overflow-hidden md:h-12">
          {categories.map((label, i) => (
            <Label key={label} label={label} index={i} total={categories.length} catProgress={catProgress} />
          ))}
        </div>

        {count > 0 && (
          <div className="flex shrink-0 items-center gap-3 md:gap-4">
            <p className="text-[11px] uppercase tracking-[0.25em] text-mist-dim tabular-nums">
              <m.span className="text-champagne">{counter}</m.span>
              <span className="mx-1.5">/</span>
              {String(count).padStart(2, '0')}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => goTo(centerIndex - 1)}
                disabled={count < 2}
                aria-label="Previous photo"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-champagne/20 text-cream transition-colors duration-300 hover:border-champagne hover:text-champagne disabled:cursor-default disabled:opacity-30"
              >
                <Chevron dir="left" />
              </button>
              <button
                type="button"
                onClick={() => goTo(centerIndex + 1)}
                disabled={count < 2}
                aria-label="Next photo"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-champagne/20 text-cream transition-colors duration-300 hover:border-champagne hover:text-champagne disabled:cursor-default disabled:opacity-30"
              >
                <Chevron dir="right" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
