import { useRef, useState, type MouseEvent as ReactMouseEvent, type TouchEvent as ReactTouchEvent } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import RevealText from './RevealText';

const BEFORE_IMAGE = '/media/setup-before.jpg';
const AFTER_IMAGE = '/media/setup-after.jpg';

/**
 * Hover-mask before/after: the "before" shot is the base layer, and the
 * "after" shot is revealed only inside a soft circular mask that tracks
 * the cursor (or finger). Move the pointer to see the finished setup
 * wherever it goes, instead of dragging a fixed divider.
 */
export default function DollyZoom() {
  const ref = useRef<HTMLDivElement>(null);
  const [hasHovered, setHasHovered] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 260, damping: 32, mass: 0.5 });
  const sy = useSpring(my, { stiffness: 260, damping: 32, mass: 0.5 });

  // same cursor position drives a subtle whole-frame 3D tilt — the frame
  // reads as one solid pane of glass, not a flat image
  const rotateX = useTransform(sy, [0, 100], [5, -5]);
  const rotateY = useTransform(sx, [0, 100], [-7, 7]);

  const radiusTarget = useMotionValue(0);
  const radius = useSpring(radiusTarget, { stiffness: 110, damping: 22, mass: 0.7 });

  const setFromClient = (clientX: number, clientY: number) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set(((clientX - rect.left) / rect.width) * 100);
    my.set(((clientY - rect.top) / rect.height) * 100);
  };

  const onMouseMove = (e: ReactMouseEvent) => setFromClient(e.clientX, e.clientY);

  const onMouseEnter = () => {
    setHasHovered(true);
    setIsHovering(true);
    radiusTarget.set(30);
  };

  const onMouseLeave = () => {
    setIsHovering(false);
    radiusTarget.set(0);
    mx.set(50);
    my.set(50);
  };

  const onTouchStart = (e: ReactTouchEvent) => {
    const t = e.touches[0];
    if (!t) return;
    setHasHovered(true);
    setIsHovering(true);
    setFromClient(t.clientX, t.clientY);
    radiusTarget.set(30);
  };

  const onTouchMove = (e: ReactTouchEvent) => {
    const t = e.touches[0];
    if (!t) return;
    setFromClient(t.clientX, t.clientY);
  };

  const onTouchEnd = () => {
    setIsHovering(false);
    radiusTarget.set(0);
    mx.set(50);
    my.set(50);
  };

  // circle's radius must be a length, not a percentage — vw keeps it a
  // true circle (unlike ellipse %, which would distort on this wide box).
  // A wide black→transparent gap (25%→100%) is what makes the edge feel
  // like a soft spreading glow instead of a coin with a blurry rim.
  const maskImage = useTransform([sx, sy, radius], (latest) => {
    const [xv, yv, rv] = latest as [number, number, number];
    return `radial-gradient(circle ${rv}vw at ${xv}% ${yv}%, black 25%, transparent 100%)`;
  });

  return (
    <section data-scene="04 · BEFORE & AFTER — THE TRANSFORMATION" className="relative overflow-hidden bg-ink py-28 md:py-40">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[800px] -translate-x-1/2 rounded-full opacity-10 blur-[130px]"
        style={{ background: 'radial-gradient(circle, #ff960b 0%, transparent 65%)' }}
      />

      <div className="relative mx-auto max-w-[1200px] px-6 md:px-10">
        <div className="mb-12 text-center md:mb-16">
          <p className="mb-4 text-[11px] uppercase tracking-[0.45em] text-gold">Before &amp; After</p>
          <RevealText
            as="h2"
            text="The same room, before and after we build."
            className="mx-auto max-w-2xl font-display text-3xl font-light leading-[1.15] text-cream md:text-5xl"
          />
          <p className="mx-auto mt-5 max-w-md text-sm font-light leading-relaxed text-cream/60 md:text-base">
            Move your cursor over the photo to reveal the finished setup.
          </p>
        </div>

        {/* ambient lift shadow — grows softer/warmer on hover, like the
            frame is rising off the page toward the light */}
        <div
          className="mx-auto w-full max-w-[1100px] rounded-md transition-[box-shadow] duration-500 ease-out"
          style={{
            perspective: 1600,
            boxShadow: isHovering
              ? '0 40px 90px -20px rgba(0,0,0,0.65), 0 0 70px -10px rgba(255,150,11,0.28)'
              : '0 25px 60px -20px rgba(0,0,0,0.55)',
          }}
        >
          {/* animated conic-gradient ring — a thin rotating gold seam,
              1px of real border rather than a decorative overlay */}
          <div className="animated-border-ring rounded-md p-px">
            <motion.div
              ref={ref}
              onMouseMove={onMouseMove}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              style={{ touchAction: 'pan-y', rotateX, rotateY, transformStyle: 'preserve-3d' }}
              whileHover={{ scale: 1.006 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="group relative aspect-[1672/941] w-full touch-none select-none overflow-hidden rounded-md bg-ink"
            >
              {/* BEFORE — base layer, always visible */}
              <img
                src={BEFORE_IMAGE}
                alt="The same stage empty, before setup begins"
                draggable={false}
                className="pointer-events-none absolute inset-0 h-full w-full object-cover"
              />

              {/* AFTER — revealed only inside the cursor-tracked mask */}
              <motion.div
                aria-hidden
                style={{ WebkitMaskImage: maskImage, maskImage }}
                className="pointer-events-none absolute inset-0"
              >
                <img
                  src={AFTER_IMAGE}
                  alt="Event stage fully produced, with lighting, décor and table settings"
                  draggable={false}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </motion.div>

              {/* one-time hint, fades out after first interaction */}
              {!hasHovered && (
                <span className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full border border-white/15 bg-ink/60 px-5 py-2 text-[10px] uppercase tracking-[0.3em] text-cream/70 backdrop-blur-md">
                  Hover to reveal
                </span>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
