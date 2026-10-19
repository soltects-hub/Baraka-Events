import { useEffect, useId, useRef, type CSSProperties } from 'react';
import { motion, useInView, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';

/**
 * The signature moment at the top of "The House of Baraka": a candle-lit haveli
 * doorway seen in perspective. Pointed arches recede toward a warm glow, each on
 * its own depth plane, so a slow scroll-driven tilt (and, with a mouse, a gentle
 * pull toward the cursor) slides them against one another. The BARAKA wordmark
 * stands in front, with two faint echoes behind it for depth.
 *
 * Built only from CSS 3D transforms and SVG strokes (no WebGL, no canvas, no
 * images). It is decorative: the words are painted from `data-text`
 * (`deco-text`), so nothing is added to the page text, and the whole block is
 * aria-hidden. Fixed heights per breakpoint mean it never shifts the layout, and
 * with `prefers-reduced-motion` it renders as a still composition.
 */

// A pointed (lancet) arch and an inner line echoing it, in a 200 x 260 box.
const ARCH = 'M12 260V118C12 64 56 34 100 6C144 34 188 64 188 118V260';
const ARCH_INNER = 'M22 260V121C22 73 60 47 100 24C140 47 178 73 178 121V260';

const PERSPECTIVE = 900;

/** One arch on one depth plane. Nearer planes are drawn larger by the perspective itself. */
function Arch({
  z,
  x = '50%',
  height = '84%',
  line,
  inner,
  lit,
  style,
}: {
  z: number;
  x?: string;
  height?: string;
  line: string;
  inner: string;
  /** the far doorway: gets the warm light spilling out of it */
  lit?: boolean;
  style?: CSSProperties;
}) {
  const glow = useId();
  return (
    <div
      className="absolute top-1/2"
      style={{ left: x, height, transform: `translate3d(-50%, -50%, ${z}px)`, ...style }}
    >
      <svg viewBox="-6 -10 212 270" className="h-full w-auto overflow-visible" fill="none" aria-hidden>
        {lit && (
          <>
            <defs>
              <linearGradient id={glow} x1="0" y1="1" x2="0" y2="0">
                <stop offset="0" stopColor="#ff960b" stopOpacity="0.34" />
                <stop offset="0.55" stopColor="#ff960b" stopOpacity="0.1" />
                <stop offset="1" stopColor="#ff960b" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={`${ARCH}Z`} fill={`url(#${glow})`} />
          </>
        )}
        <path d={ARCH} stroke={line} strokeWidth="1.1" vectorEffect="non-scaling-stroke" />
        <path d={ARCH_INNER} stroke={inner} strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
        {/* finial: the diamond the site already uses as a separator */}
        <path d="M100 -9 L104.5 -2.5 L100 4 L95.5 -2.5Z" fill={line} />
      </svg>
    </div>
  );
}

export default function HouseSignature() {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion() ?? false;
  const inView = useInView(ref, { margin: '10% 0px 10% 0px' });

  // Scroll drives a slow turn through the doorway: the section's own progress
  // through the viewport, smoothed so it never feels tied to the wheel.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });
  const scrollY = useTransform(progress, [0, 1], reduceMotion ? [0, 0] : [-12, 12]);
  const scrollX = useTransform(progress, [0, 1], reduceMotion ? [0, 0] : [7, -3]);

  // With a mouse, the doorway also leans a few degrees toward the cursor.
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const leanX = useSpring(pointerX, { stiffness: 110, damping: 20 });
  const leanY = useSpring(pointerY, { stiffness: 110, damping: 20 });
  // Phones get a third of the tilt: the front plane would otherwise slide past the edge of the frame.
  const amount = useMotionValue(1);
  useEffect(() => {
    const phone = window.matchMedia('(max-width: 639px)');
    const apply = () => amount.set(phone.matches ? 0.34 : 1);
    apply();
    phone.addEventListener('change', apply);
    return () => phone.removeEventListener('change', apply);
  }, [amount]);
  const rotateY = useTransform([scrollY, leanX, amount], ([a, b, k]: number[]) => (a + b * 6) * k);
  const rotateX = useTransform([scrollX, leanY, amount], ([a, b, k]: number[]) => (a - b * 4) * k);

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduceMotion || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    pointerX.set(((e.clientX - r.left) / r.width - 0.5) * 2);
    pointerY.set(((e.clientY - r.top) / r.height - 0.5) * 2);
  };
  const onPointerLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  const word =
    'font-display font-light uppercase tracking-[0.22em] text-[2.1rem] leading-none min-[360px]:tracking-[0.26em] min-[360px]:text-[2.55rem] sm:text-6xl md:text-7xl lg:text-[5.6rem]';

  return (
    <div
      ref={ref}
      aria-hidden
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="relative mx-auto h-[250px] w-full max-w-[1100px] overflow-hidden select-none sm:h-[300px] md:h-[340px] lg:h-[380px]"
      style={{ maskImage: 'linear-gradient(180deg, transparent 0%, #000 12%, #000 91%, transparent 100%)', WebkitMaskImage: 'linear-gradient(180deg, transparent 0%, #000 12%, #000 91%, transparent 100%)' }}
    >
      {/* the light at the end of the doorway, and the floor it falls on */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 36% 58% at 50% 56%, rgba(255,150,11,0.2), rgba(168,118,58,0.07) 55%, transparent 78%)' }}
        animate={inView && !reduceMotion ? { opacity: [0.78, 1, 0.84, 0.97, 0.78] } : { opacity: 0.9 }}
        transition={inView && !reduceMotion ? { duration: 6, repeat: Infinity, ease: 'easeInOut' } : { duration: 0 }}
      />

      <div
        className="pointer-events-none absolute left-1/2 top-[84%] h-[9%] w-[30%] -translate-x-1/2 rounded-[50%] blur-xl"
        style={{ background: 'radial-gradient(closest-side, rgba(255,150,11,0.3), rgba(255,150,11,0))' }}
      />

      <div className="pointer-events-none absolute inset-0" style={{ perspective: PERSPECTIVE }}>
        <motion.div className="absolute inset-0" style={{ rotateX, rotateY, transformStyle: 'preserve-3d', willChange: 'transform' }}>
          {/* the arcade either side, far back and fading out */}
          <Arch z={-520} x="2%" height="56%" line="rgba(230,197,138,0.16)" inner="rgba(230,197,138,0.07)" />
          <Arch z={-520} x="98%" height="56%" line="rgba(230,197,138,0.16)" inner="rgba(230,197,138,0.07)" />
          <Arch z={-330} x="15%" height="64%" line="rgba(230,197,138,0.28)" inner="rgba(230,197,138,0.13)" />
          <Arch z={-330} x="85%" height="64%" line="rgba(230,197,138,0.28)" inner="rgba(230,197,138,0.13)" />
          <Arch z={-170} x="29%" height="78%" line="rgba(230,197,138,0.24)" inner="rgba(230,197,138,0.1)" />
          <Arch z={-170} x="71%" height="78%" line="rgba(230,197,138,0.24)" inner="rgba(230,197,138,0.1)" />

          {/* the doorway: five nested arches receding toward the light */}
          <Arch z={150} line="rgba(230,197,138,0.5)" inner="rgba(230,197,138,0.22)" />
          <Arch z={40} line="rgba(230,197,138,0.4)" inner="rgba(230,197,138,0.18)" />
          <Arch z={-70} line="rgba(230,197,138,0.34)" inner="rgba(230,197,138,0.15)" />
          <Arch z={-190} line="rgba(230,197,138,0.3)" inner="rgba(168,118,58,0.3)" />
          <Arch z={-310} line="rgba(255,150,11,0.8)" inner="rgba(255,179,71,0.4)" lit />

          {/* the wordmark, in front of the doorway, with two echoes behind it */}
          <div
            className="absolute left-1/2 top-[56%] grid place-items-center"
            style={{ transform: 'translate3d(-50%, -50%, 190px)', transformStyle: 'preserve-3d' }}
          >
            <span data-text="Baraka" className={`deco-text text-stroke col-start-1 row-start-1 opacity-[0.13] ${word}`} style={{ transform: 'translateZ(-56px)' }} />
            <span data-text="Baraka" className={`deco-text text-stroke col-start-1 row-start-1 opacity-[0.24] ${word}`} style={{ transform: 'translateZ(-28px)' }} />
            <span
              data-text="Baraka"
              className={`deco-text col-start-1 row-start-1 text-ivory ${word}`}
              style={{ textShadow: '0 0 28px rgba(6,5,4,0.85), 0 0 2px rgba(6,5,4,0.6)' }}
            />
          </div>
          <div
            className="absolute left-1/2 top-[85%] flex items-center gap-1 whitespace-nowrap text-[8px] uppercase tracking-[0.1em] text-champagne min-[360px]:gap-2 min-[360px]:tracking-[0.2em] min-[400px]:gap-2.5 min-[400px]:text-[9px] min-[400px]:tracking-[0.24em] sm:gap-4 sm:text-[10px] sm:tracking-[0.3em] md:text-[11px]"
            style={{ transform: 'translate3d(-50%, -50%, 190px)', textShadow: '0 0 6px #060504, 0 0 3px #060504' }}
          >
            <span data-text="Weddings" className="deco-text" />
            <span className="h-1 w-1 rotate-45 bg-bronze" />
            <span data-text="Corporate" className="deco-text" />
            <span className="h-1 w-1 rotate-45 bg-bronze" />
            <span data-text="Private" className="deco-text" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
