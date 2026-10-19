import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { registerLazyMount } from '../lib/lazyMountRegistry';
import { reservedHeight } from '../lib/bootScroll';

/**
 * Doesn't render children until the wrapper scrolls within `rootMargin` of
 * the viewport, then mounts them permanently. Unlike React.lazy (which only
 * defers the JS download), this defers the actual mount — so a section's
 * scroll listeners, layout reads and animation setup don't run, and can't
 * contend for the main thread, until the section is actually about to be
 * seen. The generous default margin gives content time to mount and settle
 * before it scrolls into view, so growing into its real height never
 * happens on-screen.
 *
 * When a visitor had already scrolled the prerendered page at hand-over (see
 * lib/bootScroll.ts) the wrapper also holds that section's prerendered height
 * until its content has rendered, so the page does not collapse under them.
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

  // Only ever set when a visitor was already scrolled at hand-over; otherwise this stays undefined and the wrapper is unchanged.
  const [reserve, setReserve] = useState<number | undefined>(undefined);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el?.parentElement) return;
    setReserve(reservedHeight(Array.prototype.indexOf.call(el.parentElement.children, el)));
  }, []);
  useEffect(() => {
    if (reserve === undefined) return;
    const el = ref.current;
    if (!el) return;
    // released as soon as the section's own markup is in (children exist), or after a safety timeout
    const release = () => {
      if (el.children.length > 0) setReserve(undefined);
    };
    const observer = new MutationObserver(release);
    observer.observe(el, { childList: true });
    release();
    const timeout = setTimeout(() => setReserve(undefined), 30000);
    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, [reserve]);

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

  return (
    <div ref={ref} style={reserve === undefined ? undefined : { minHeight: reserve }}>
      {visible ? children : null}
    </div>
  );
}
