import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent } from 'react';
import { AnimatePresence, animate, motion, useMotionValue, useMotionValueEvent, useTransform, type MotionValue } from 'framer-motion';

interface ArchiveItem {
  src: string;
  alt: string;
  category: string;
  title: string;
  location: string;
}

/**
 * Swap or extend this list to change what appears in the archive — the
 * gallery itself doesn't care how many items there are.
 */
const items: ArchiveItem[] = [
  { src: '/media/portfolio-1.webp', alt: 'Wedding staged across a restored haveli in the Walled City', category: 'Wedding', title: 'A Four-Function Wedding', location: 'Walled City, Lahore' },
  { src: '/media/corporate-1.webp', alt: 'Corporate product launch stage', category: 'Corporate Event', title: 'A Product Launch on Stage', location: 'Johar Town, Lahore' },
  { src: '/media/rooftop-birthday.webp', alt: 'Rooftop birthday celebration in the Walled City', category: 'Private Celebration', title: 'A Rooftop Birthday', location: 'Walled City, Lahore' },
  { src: '/media/wedding-2.webp', alt: 'Garden nikkah and walima at a private estate', category: 'Wedding', title: 'A Garden Nikkah & Walima', location: 'DHA, Lahore' },
  { src: '/media/showcase-1.webp', alt: 'Concert-grade stage and lighting rig', category: 'Live Production', title: 'Concert-Grade Stage & Light', location: 'Lahore' },
  { src: '/media/portfolio-4.webp', alt: 'Corporate awards night in a Gulberg ballroom', category: 'Corporate Event', title: 'An Awards Night', location: 'Gulberg, Lahore' },
  { src: '/media/private-1.webp', alt: 'Evening lounge setup for a private celebration', category: 'Private Celebration', title: 'An Evening Lounge Setup', location: 'Lahore' },
];

const DRAG_SENSITIVITY = 0.35;
const WHEEL_SENSITIVITY = 0.28;

/** Smaller radius/card on narrow screens so the side images still peek
 * into view instead of being pushed entirely off-frame. */
function ringDimsFor(width: number) {
  if (width < 640) return { cardW: 148, radius: 210, perspective: 900 };
  if (width < 1024) return { cardW: 200, radius: 340, perspective: 1200 };
  return { cardW: 260, radius: 480, perspective: 1600 };
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

function wrapIndex(i: number, n: number) {
  return ((i % n) + n) % n;
}

/** The exact rotation value (mod 360, nearest to `current`) that puts item `i` front-and-center. */
function targetRotationFor(i: number, angleStep: number, current: number) {
  const base = -i * angleStep;
  const k = Math.round((current - base) / 360);
  return base + k * 360;
}

function RingCard({
  item,
  index,
  angleStep,
  rotation,
  cardW,
  radius,
}: {
  item: ArchiveItem;
  index: number;
  angleStep: number;
  rotation: MotionValue<number>;
  cardW: number;
  radius: number;
}) {
  const baseAngle = index * angleStep;

  const transform = useTransform(rotation, (r) => {
    const raw = baseAngle + r;
    const norm = ((raw % 360) + 540) % 360 - 180;
    const facing = Math.cos((norm * Math.PI) / 180);
    const scale = 0.62 + 0.4 * Math.max(0, facing);
    return `translate(-50%, -50%) rotateY(${raw}deg) translateZ(${radius}px) scale(${scale})`;
  });

  const filter = useTransform(rotation, (r) => {
    const raw = baseAngle + r;
    const norm = ((raw % 360) + 540) % 360 - 180;
    const facing = Math.cos((norm * Math.PI) / 180);
    return `brightness(${(0.4 + 0.6 * Math.max(0, facing)).toFixed(3)})`;
  });

  const zIndex = useTransform(rotation, (r) => {
    const raw = baseAngle + r;
    const norm = ((raw % 360) + 540) % 360 - 180;
    return Math.round(100 - Math.abs(norm));
  });

  return (
    <motion.div
      style={{ position: 'absolute', left: '50%', top: '50%', width: cardW, transform, filter, zIndex }}
      className="pointer-events-none"
    >
      <div className="aspect-[3/4] overflow-hidden rounded-sm border border-gold/25">
        <img
          src={item.src}
          alt={item.alt}
          loading="lazy"
          draggable={false}
          className="h-full w-full object-cover [image-rendering:auto]"
        />
      </div>
    </motion.div>
  );
}

export default function DepthFlythrough() {
  const n = items.length;
  const angleStep = 360 / n;

  const rotation = useMotionValue(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const { cardW, radius, perspective } = useRingDims();

  const dragStartX = useRef(0);
  const dragStartRotation = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const settle = (i: number) => {
    const target = targetRotationFor(i, angleStep, rotation.get());
    animate(rotation, target, { type: 'spring', stiffness: 120, damping: 20, mass: 0.8 });
  };

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    dragStartX.current = e.clientX;
    dragStartRotation.current = rotation.get();
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartX.current;
    rotation.set(dragStartRotation.current + dx * DRAG_SENSITIVITY);
  };

  const endDrag = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const nearest = Math.round(-rotation.get() / angleStep);
    settle(wrapIndex(nearest, n));
  };

  const goTo = (i: number) => settle(i);

  // horizontal wheel/trackpad gestures rotate the gallery; ordinary
  // vertical mouse-wheel scroll is left completely alone, so the page's
  // own (Lenis-driven) scroll is never intercepted.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      rotation.set(rotation.get() - e.deltaX * WHEEL_SENSITIVITY);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [rotation]);

  useMotionValueEvent(rotation, 'change', (r) => {
    if (isDragging) return;
    const nearest = wrapIndex(Math.round(-r / angleStep), n);
    setActiveIndex((prev) => (prev === nearest ? prev : nearest));
  });

  const onKeyDown = (e: ReactKeyboardEvent) => {
    if (e.key === 'ArrowLeft') goTo(wrapIndex(activeIndex - 1, n));
    if (e.key === 'ArrowRight') goTo(wrapIndex(activeIndex + 1, n));
  };

  const active = items[activeIndex];

  return (
    <section data-scene="06 · THE ARCHIVE" className="relative overflow-hidden bg-ink py-28 md:py-40">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 h-[500px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-10 blur-[130px]"
        style={{ background: 'radial-gradient(circle, #ff960b 0%, transparent 65%)' }}
      />

      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="mb-14 text-center md:mb-20">
          <p className="mb-4 text-[10px] uppercase tracking-[0.5em] text-gold">Scroll = Camera</p>
          <h2 className="font-display text-4xl font-light text-cream md:text-6xl">
            Enter the <em className="italic text-gold-soft">archive</em>
          </h2>
          <p className="mx-auto mt-5 max-w-md text-sm font-light leading-relaxed text-cream/60 md:text-base">
            A selection of celebrations, productions and experiences we&rsquo;ve brought to life.
          </p>
        </div>

        <div
          ref={containerRef}
          role="group"
          aria-label="Project archive, use arrow keys or drag to browse"
          tabIndex={0}
          onKeyDown={onKeyDown}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          style={{ perspective, touchAction: 'pan-y' }}
          className={`relative mx-auto h-[260px] max-w-[1200px] touch-none select-none outline-none sm:h-[340px] md:h-[440px] ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
        >
          <div style={{ transformStyle: 'preserve-3d' }} className="absolute inset-0">
            {items.map((item, i) => (
              <RingCard key={item.src} item={item} index={i} angleStep={angleStep} rotation={rotation} cardW={cardW} radius={radius} />
            ))}
          </div>
        </div>

        <div className="mt-10 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.3em] text-cream/35 md:mt-14">
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-gold" strokeWidth="1.5">
            <path d="M7 11.5V6a1.5 1.5 0 0 1 3 0v4.5M10 10.5V5a1.5 1.5 0 0 1 3 0v5.5M13 10.5V6a1.5 1.5 0 0 1 3 0v6.5c0 3.5-2 5.5-5 5.5s-4.5-1.5-5.5-4L4.2 11a1.4 1.4 0 0 1 2.4-1.4l1.4 2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Drag to explore
        </div>

        <div className="relative mx-auto mt-8 max-w-xl text-center md:mt-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.title}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-[10px] uppercase tracking-[0.4em] text-gold">{active.category}</p>
              <h3 className="mt-3 font-display text-2xl font-light text-cream md:text-3xl">{active.title}</h3>
              <p className="mt-2 text-[11px] uppercase tracking-[0.3em] text-cream/45">{active.location}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
