import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { m, animate, useMotionValue, useTransform, useMotionValueEvent, useReducedMotion, type AnimationPlaybackControls, type MotionValue } from 'framer-motion';
import { members, type TeamMember } from '../lib/team';

const AUTO_MS = 4200;
const SNAP_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const AUTO_EASE: [number, number, number, number] = [0.45, 0, 0.2, 1];
const WHEEL_SENSITIVITY = 0.0026; // ring-steps per px of horizontal wheel delta

/** A reserved future seat — distinct from a real hire with no photo yet
 *  (Sania Khan): this one gets the "coming soon" caption treatment, a real
 *  person without a confirmed photo does not. Identity-compared (`===`),
 *  so it never collides with an actual member. */
const ANNOUNCING_SOON: TeamMember = { name: 'Announcing soon', role: 'Creative Director', image: '', bio: 'The next seat at the table — reserved.' };
const items: TeamMember[] = [...members, ANNOUNCING_SOON];

/** Smaller radius/card on narrow screens so side cards stay on-stage instead
 *  of overlapping or clipping — same responsive convention as the homepage
 *  archive ring (DepthFlythrough). */
function ringDimsFor(width: number) {
  if (width < 640) return { cardW: 148, radius: 200, perspective: 900 };
  if (width < 1024) return { cardW: 190, radius: 320, perspective: 1300 };
  return { cardW: 220, radius: 420, perspective: 1800 };
}
function useRingDims() {
  const [dims, setDims] = useState(() => ringDimsFor(typeof window !== 'undefined' ? window.innerWidth : 1280));
  useEffect(() => {
    const onResize = () => setDims(ringDimsFor(window.innerWidth));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return dims;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
function wrapIndex(i: number, n: number) {
  return n <= 0 ? 0 : ((i % n) + n) % n;
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return (parts[0]?.[0] ?? '') + (parts.length > 1 ? parts[parts.length - 1][0] : '');
}

function PlaceholderFace({ member }: { member: TeamMember }) {
  const isFutureSeat = member === ANNOUNCING_SOON;
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 border border-dashed border-champagne/15 bg-ink-2/60">
      <span className="accent-serif text-lg text-champagne/60">{isFutureSeat ? String(items.length).padStart(2, '0') : initials(member.name)}</span>
    </div>
  );
}

/** One card on the ring. `progress` is a continuous fractional index (a
 *  MotionValue, not React state), so rotation tracks the pointer in real
 *  time during a drag instead of only updating once at release. */
function Card({
  member,
  index,
  angleStep,
  progress,
  cardW,
  radius,
  isFront,
  onSelect,
}: {
  member: TeamMember;
  index: number;
  angleStep: number;
  progress: MotionValue<number>;
  cardW: number;
  radius: number;
  isFront: boolean;
  onSelect: () => void;
}) {
  const baseAngle = index * angleStep;
  const transform = useTransform(progress, (p) => {
    const raw = baseAngle - p * angleStep;
    const norm = ((raw % 360) + 540) % 360 - 180;
    const facing = Math.cos((norm * Math.PI) / 180);
    const scale = 0.8 + 0.22 * Math.max(0, facing);
    return `translate(-50%, -50%) rotateY(${raw}deg) translateZ(${radius}px) scale(${scale})`;
  });
  const filter = useTransform(progress, (p) => {
    const raw = baseAngle - p * angleStep;
    const norm = ((raw % 360) + 540) % 360 - 180;
    const facing = Math.cos((norm * Math.PI) / 180);
    return `brightness(${(0.32 + 0.68 * Math.max(0, facing)).toFixed(3)})`;
  });

  return (
    <m.button
      type="button"
      onClick={onSelect}
      aria-label={`Show ${member.name}`}
      aria-current={isFront}
      style={{ position: 'absolute', left: '50%', top: '50%', width: cardW, transform, filter }}
      className="cursor-pointer"
    >
      <div
        className={`relative aspect-[3/4] overflow-hidden rounded-md border bg-ink-2 transition-colors duration-500 ${
          isFront ? 'border-champagne shadow-[0_0_70px_rgba(230,197,138,0.35)]' : 'border-champagne/12'
        }`}
      >
        {member.image ? (
          <img src={member.image} alt={member.name} draggable={false} className="h-full w-full object-cover" />
        ) : (
          <PlaceholderFace member={member} />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/15 to-transparent" />
      </div>
    </m.button>
  );
}

export default function TeamCarousel3D() {
  const reduceMotion = useReducedMotion() ?? false;
  const n = items.length;
  const angleStep = 360 / n;
  const { cardW, radius, perspective } = useRingDims();

  const progress = useMotionValue(0);
  const [centerIndex, setCenterIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<AnimationPlaybackControls | null>(null);
  const gesture = useRef({ pointerId: -1, startX: 0, startY: 0, startProgress: 0, moved: false, active: false });
  const wheelTimer = useRef(0);

  const stopAnim = useCallback(() => {
    animRef.current?.stop();
    animRef.current = null;
  }, []);

  useMotionValueEvent(progress, 'change', (p) => {
    const next = wrapIndex(Math.round(p), n);
    setCenterIndex((prev) => (prev === next ? prev : next));
  });

  const goTo = useCallback(
    (i: number, ease: [number, number, number, number] = SNAP_EASE, duration = 0.9) => {
      stopAnim();
      const p = progress.get();
      let target = i;
      // shortest way round the ring
      const raw = i - p;
      const wrapped = ((raw % n) + n) % n;
      target = p + (wrapped > n / 2 ? wrapped - n : wrapped);
      animRef.current = animate(progress, target, { duration, ease });
    },
    [n, progress, stopAnim]
  );

  const settle = useCallback(() => {
    stopAnim();
    // A single large synthetic pointer jump (or a coalesced burst of real
    // events under load) can make getVelocity() estimate an enormous
    // instantaneous speed from too few samples over too short a window.
    // Fed straight into inertia, that overshoots multiple ring-wraps before
    // settling — capped here to at most ~3 steps/second either way, which
    // still reads as a fast, natural flick for any real gesture.
    const MAX_VELOCITY = n * 3;
    const velocity = clamp(progress.getVelocity(), -MAX_VELOCITY, MAX_VELOCITY);
    animRef.current = animate(progress, progress.get(), {
      type: 'inertia',
      velocity,
      power: 0.2,
      timeConstant: 200,
      modifyTarget: (t) => Math.round(t),
    });
  }, [n, progress, stopAnim]);

  const next = useCallback(() => goTo(centerIndex + 1), [centerIndex, goTo]);
  const prev = useCallback(() => goTo(centerIndex - 1), [centerIndex, goTo]);

  // auto-advance, smoothly eased rather than an instant step + CSS snap
  useEffect(() => {
    if (reduceMotion || paused || dragging) return;
    const t = setInterval(() => goTo(wrapIndex(Math.round(progress.get()) + 1, n), AUTO_EASE, 1.1), AUTO_MS);
    return () => clearInterval(t);
  }, [reduceMotion, paused, dragging, goTo, n, progress]);

  // ---- pointer drag (mouse + touch); a vertical pan is handed back to the page
  const pxPerStep = () => clamp(radius * 0.7, 90, 220);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (n < 2) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    stopAnim();
    gesture.current = { pointerId: e.pointerId, startX: e.clientX, startY: e.clientY, startProgress: progress.get(), moved: false, active: true };
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const g = gesture.current;
    if (!g.active || e.pointerId !== g.pointerId) return;
    const dx = e.clientX - g.startX;
    const dy = e.clientY - g.startY;
    if (!g.moved) {
      if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) {
        g.active = false;
        return;
      }
      if (Math.abs(dx) < 6) return;
      g.moved = true;
      setDragging(true);
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    progress.set(g.startProgress - dx / pxPerStep());
  };
  const endPointer = (e: ReactPointerEvent<HTMLDivElement>) => {
    const g = gesture.current;
    if (!g.active || e.pointerId !== g.pointerId) return;
    g.active = false;
    if (g.moved) {
      setDragging(false);
      settle();
      window.setTimeout(() => { gesture.current.moved = false; }, 0);
    }
  };

  // ---- horizontal trackpad wheel only; vertical page scroll is never touched
  useEffect(() => {
    const el = stageRef.current;
    if (!el || n < 2) return;
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
  }, [n, progress, settle, stopAnim]);

  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
  };

  const onSelectCard = (i: number) => {
    if (gesture.current.moved) return;
    goTo(i);
  };

  const current = items[centerIndex];
  const isFutureSeat = current === ANNOUNCING_SOON;

  if (reduceMotion) {
    // Reduced motion: a still, fully-accessible grid — no rotation, no autoplay.
    return (
      <div className="mx-auto max-w-[1200px] px-6 md:px-10">
        <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
          {items.map((m) => {
            const future = m === ANNOUNCING_SOON;
            return (
              <li key={m.name} className="text-center">
                <div className="relative mx-auto aspect-[3/4] w-full max-w-[220px] overflow-hidden rounded-md border border-champagne/15 bg-ink-2">
                  {m.image ? (
                    <img src={m.image} alt={m.name} loading="lazy" className="h-full w-full object-cover" />
                  ) : (
                    <PlaceholderFace member={m} />
                  )}
                </div>
                <p className="mt-3 text-[10px] uppercase tracking-[0.3em] text-champagne">{m.role}</p>
                <h3 className={`mt-1 font-display text-xl text-cream ${future ? 'italic text-mist' : 'font-light'}`}>{m.name}</h3>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  return (
    <div
      className="relative mx-auto max-w-[1200px] px-6 md:px-10"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[min(900px,100vw)] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(230,197,138,0.2) 0%, transparent 65%)' }}
      />

      {/* 3D ring — drag/swipe (mouse + touch) or the arrows to step through
          members; a fast flick keeps its momentum into an inertia settle on
          the nearest card instead of snapping instantly. */}
      <div
        ref={stageRef}
        role="group"
        aria-roledescription="carousel"
        aria-label="Team members. Drag, swipe or use the arrow keys to browse."
        tabIndex={n > 1 ? 0 : -1}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endPointer}
        onPointerCancel={endPointer}
        style={{ perspective, touchAction: 'pan-y' }}
        className={`relative h-[300px] select-none outline-none sm:h-[360px] md:h-[420px] ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      >
        <div className="absolute left-1/2 top-1/2 h-0 w-0" style={{ transformStyle: 'preserve-3d' }}>
          {items.map((m, i) => (
            <Card
              key={m.name}
              member={m}
              index={i}
              angleStep={angleStep}
              progress={progress}
              cardW={cardW}
              radius={radius}
              isFront={i === centerIndex}
              onSelect={() => onSelectCard(i)}
            />
          ))}
        </div>

        {/* arrows */}
        <button
          onClick={prev}
          aria-label="Previous team member"
          className="absolute left-0 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-champagne/20 bg-ink/75 text-cream transition-colors hover:border-champagne hover:text-champagne md:-left-4"
        >
          &#10094;
        </button>
        <button
          onClick={next}
          aria-label="Next team member"
          className="absolute right-0 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-champagne/20 bg-ink/75 text-cream transition-colors hover:border-champagne hover:text-champagne md:-right-4"
        >
          &#10095;
        </button>
      </div>

      {/* caption panel — the front card's details, fixed and readable.
          Deliberately no AnimatePresence/exit-queue here: `current` is
          `items[centerIndex]`, so it is by construction never out of sync
          with which card is actually front-facing. A fast fling can retarget
          `centerIndex` several times in quick succession (settle() clamps
          the *velocity*, not how far a legitimate multi-step flick can
          travel), and an exit-queued crossfade can fall behind that and get
          stuck showing a stale name — a fade-in keyed to centerIndex, with
          no competing exit animation to desync from, cannot. */}
      <div className="relative mx-auto mt-10 max-w-xl text-center">
        <m.div
          key={centerIndex}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: SNAP_EASE }}
        >
          <p className="text-[10px] uppercase tracking-[0.3em] text-champagne">{current.role}</p>
          <h3 className={`mt-2 font-display text-3xl text-cream md:text-4xl ${isFutureSeat ? 'italic text-mist' : 'font-light'}`}>
            {current.name}
          </h3>
          <p className="mx-auto mt-3 max-w-md text-[13px] font-light leading-relaxed text-mist">{current.bio}</p>
        </m.div>

        <div className="mt-6 flex items-center justify-center gap-4 text-[11px] uppercase tracking-[0.3em] text-mist-dim">
          <span className="text-champagne">{String(centerIndex + 1).padStart(2, '0')}</span>
          <span className="h-[1px] w-10 bg-champagne/15" />
          <span>{String(n).padStart(2, '0')}</span>
        </div>
      </div>
    </div>
  );
}
