import { useRef, useEffect, useState, type ReactNode } from 'react';
import { motion, useMotionValue } from 'framer-motion';

interface Props {
  children: ReactNode; // one full set of slides
  speed?: number; // auto-scroll speed in px/second
  gapClass?: string; // gap + trailing padding so the loop seam is invisible
}

/**
 * Infinite auto-looping rail: content drifts smoothly to the LEFT forever.
 * - Pauses while hovered (so cards can be read) and while dragging
 * - Still draggable by hand with momentum
 * - Content is rendered twice and wrapped seamlessly
 */
export default function LoopRail({ children, speed = 45, gapClass = 'gap-6 pr-6 md:gap-8 md:pr-8' }: Props) {
  const x = useMotionValue(0);
  const setRef = useRef<HTMLDivElement>(null);
  const [setWidth, setSetWidth] = useState(0);
  const paused = useRef(false);
  const dragging = useRef(false);
  const resumeTimer = useRef(0);

  useEffect(() => {
    const measure = () => {
      if (setRef.current) setSetWidth(setRef.current.offsetWidth);
    };
    measure();
    window.addEventListener('resize', measure);
    const t = setTimeout(measure, 500);
    return () => {
      window.removeEventListener('resize', measure);
      clearTimeout(t);
    };
  }, []);

  useEffect(() => {
    if (!setWidth) return;
    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      let v = x.get();

      // seamless wrap (also catches big drag flings)
      if (v <= -setWidth) {
        while (v <= -setWidth) v += setWidth;
        x.set(v);
      } else if (v > 0) {
        while (v > 0) v -= setWidth;
        x.set(v);
      } else if (!paused.current && !dragging.current) {
        x.set(v - speed * dt);
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [setWidth, speed, x]);

  return (
    <div
      className="overflow-hidden"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
    >
      <motion.div
        drag="x"
        style={{ x }}
        dragTransition={{ power: 0.3, timeConstant: 200 }}
        onDragStart={() => {
          dragging.current = true;
          window.clearTimeout(resumeTimer.current);
        }}
        onDragEnd={() => {
          resumeTimer.current = window.setTimeout(() => (dragging.current = false), 1000);
        }}
        className="flex w-max cursor-grab items-stretch active:cursor-grabbing"
      >
        <div ref={setRef} className={`flex shrink-0 items-stretch ${gapClass}`}>
          {children}
        </div>
        <div aria-hidden className={`flex shrink-0 items-stretch ${gapClass}`}>
          {children}
        </div>
      </motion.div>
    </div>
  );
}
