import { useEffect, useRef, useState, type ReactNode } from 'react';
import { registerLazyMount } from '../lib/lazyMountRegistry';

/**
 * Doesn't render children until the wrapper scrolls within `rootMargin` of
 * the viewport, then mounts them permanently. Unlike React.lazy (which only
 * defers the JS download), this defers the actual mount — so a section's
 * scroll listeners, layout reads and animation setup don't run, and can't
 * contend for the main thread, until the section is actually about to be
 * seen. The generous default margin gives content time to mount and settle
 * before it scrolls into view, so growing into its real height never
 * happens on-screen.
 */
export default function LazyMount({
  children,
  rootMargin = '150% 0px',
  anchorId,
}: {
  children: ReactNode;
  rootMargin?: string;
  /** Section id (without '#') this wraps. If the page loads with a matching
   *  URL hash, mount immediately instead of waiting for scroll proximity —
   *  otherwise a direct link to that anchor would land on nothing. */
  anchorId?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(
    () => !!anchorId && typeof window !== 'undefined' && window.location.hash === `#${anchorId}`
  );

  useEffect(() => {
    if (visible) return;

    const unregister = registerLazyMount(() => setVisible(true));

    const el = ref.current;
    if (!el) return unregister;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );
    observer.observe(el);

    return () => {
      unregister();
      observer.disconnect();
    };
  }, [visible, rootMargin]);

  return <div ref={ref}>{visible ? children : null}</div>;
}
