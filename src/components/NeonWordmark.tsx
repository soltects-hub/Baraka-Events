import { useRef, useEffect, type MouseEvent, type TouchEvent } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/**
 * Full-width BARAKA wordmark with a tracked neon spotlight:
 * the #ff960b glow lives exactly where the cursor (or finger) is,
 * spreading softly outward like a neon tube warming up.
 */
export default function NeonWordmark() {
  const ref = useRef<HTMLDivElement>(null);

  const mx = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 60, damping: 16, mass: 0.6 });

  const radiusTarget = useMotionValue(0);
  const radius = useSpring(radiusTarget, { stiffness: 70, damping: 20 });

  useEffect(() => {
    radiusTarget.set(0);
  }, [radiusTarget]);

  const maskImage = useTransform<number | string, string>(
    [sx, radius],
    ([xv, rv]) => {
      const x = Number(xv) * 100;
      const r = Number(rv);
      return `radial-gradient(ellipse ${r}% ${r * 2.4}% at ${x}% 50%, black 32%, transparent 78%)`;
    }
  );

  const setFromClientX = (clientX: number) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set(Math.min(1, Math.max(0, (clientX - rect.left) / rect.width)));
  };

  const onMove = (e: MouseEvent) => setFromClientX(e.clientX);

  const onTouchStart = (e: TouchEvent) => {
    const t = e.touches[0];
    if (!t) return;
    setFromClientX(t.clientX);
    radiusTarget.set(34);
  };

  const onTouchMove = (e: TouchEvent) => {
    const t = e.touches[0];
    if (!t) return;
    setFromClientX(t.clientX);
  };

  const onTouchEnd = () => {
    // let the glow linger for a moment, then fade
    window.setTimeout(() => radiusTarget.set(0), 900);
  };

  return (
    <div
      ref={ref}
      aria-hidden
      onMouseMove={onMove}
      onMouseEnter={() => radiusTarget.set(34)}
      onMouseLeave={() => radiusTarget.set(0)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="relative mt-16 w-full cursor-default select-none overflow-hidden text-center"
      style={{ touchAction: 'pan-y' }}
    >
      {/* base — quiet outline */}
      <div className="neon-base font-display text-[19.5vw] leading-[0.82] tracking-[0.02em]">
        BARAKA
      </div>

      {/* lit layer — revealed only around the cursor / finger */}
      <motion.div
        style={{ WebkitMaskImage: maskImage, maskImage }}
        className="neon-lit pointer-events-none absolute inset-0 font-display text-[19.5vw] leading-[0.82] tracking-[0.02em]"
      >
        BARAKA
      </motion.div>
    </div>
  );
}
