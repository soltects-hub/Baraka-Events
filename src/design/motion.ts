import { useEffect, useRef, useState, type RefObject } from 'react';

/**
 * Motion helpers for the "Lights up" prototype. Rules (Phase 1 + approved direction):
 * - Content that is on screen when the page first paints is never hidden: an element is only "armed"
 *   (moved to its pre-animation state) when it starts below the visible screen.
 * - prefers-reduced-motion: nothing is armed; everything is shown as-is.
 * - CSS transitions do the animating (transform, opacity, clip-path, filter); JS only toggles classes.
 */
export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

/** Adds `armClass` to an element that starts below the fold, then `is-in` once it scrolls into view. */
export function useReveal<T extends HTMLElement>(armClass: string, threshold = 0.2): RefObject<T | null> {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || !('IntersectionObserver' in window)) return;
    const top = el.getBoundingClientRect().top;
    if (top < window.innerHeight * 0.9) return; // already visible at first paint: leave it alone
    el.classList.add(armClass);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.classList.add('is-in');
            io.disconnect();
          }
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [armClass, threshold]);
  return ref;
}

/**
 * Layered parallax: children with data-depth="n" move up to n px against the scroll while the container crosses
 * the screen. One passive scroll listener, one rAF per frame, transforms only. Off under reduced motion.
 */
export function useParallax<T extends HTMLElement>(): RefObject<T | null> {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const layers = Array.from(el.querySelectorAll<HTMLElement>('[data-depth]'));
    let frame = 0;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.bottom < 0 || r.top > vh) return;
      const progress = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2); // -1 .. 1
      for (const l of layers) {
        const depth = Math.min(40, Number(l.dataset.depth) || 0);
        l.style.transform = `translate3d(0, ${(progress * depth).toFixed(1)}px, 0)`;
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
  return ref;
}

/** Re-runnable demo: returns [key, replay] so a component can remount its animation on demand. */
export function useReplay(): [number, () => void] {
  const [key, setKey] = useState(0);
  return [key, () => setKey((k) => k + 1)];
}
