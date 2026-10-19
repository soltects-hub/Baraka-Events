/**
 * Keeps a visitor's place when the app takes over from the prerendered page.
 *
 * The homepage is shipped as static HTML so it paints before the JavaScript
 * arrives, and createRoot() then replaces that DOM. On a slow phone there can
 * be many seconds between the two, and a visitor may well scroll the static
 * page in that time. Three things then threw them back to the top: the
 * replacement page is far shorter (every LazyMount section is empty until it
 * nears the viewport, so the page falls from ~23,000px to ~2,800px and the
 * browser clamps the scroll position), App's ScrollRestore scrolls to 0 on
 * mount, and the Preloader splash plays again.
 *
 * main.tsx calls captureBootLayout() just before React renders. It only does
 * anything when the visitor has already scrolled the homepage; arriving at the
 * top is untouched. While it is active:
 *  - LazyMount holds each section's static height until its real content has
 *    mounted, so the page keeps its length and the scroll position survives;
 *  - ScrollRestore leaves the position alone (until the visitor navigates);
 *  - Home skips the Preloader.
 */
let heights: number[] | null = null;
let path: string | null = null;

/** Scrolled less than this and the visitor is effectively at the top: nothing to keep. */
const MIN_SCROLL = 160;

export function captureBootLayout() {
  if (typeof window === 'undefined') return;
  // A #hash arrival is positioned by Home itself.
  if (window.location.pathname !== '/' || window.location.hash || window.scrollY < MIN_SCROLL) return;
  const main = document.querySelector('#root main');
  if (!main) return;
  heights = Array.from(main.children, (c) => Math.round(c.getBoundingClientRect().height));
  path = window.location.pathname;
}

/** True when the visitor had already scrolled the prerendered homepage at hand-over. */
export function hasBootPosition() {
  return heights !== null;
}

/** The prerendered height of the nth child of <main>, while the boot position is being kept. */
export function reservedHeight(index: number): number | undefined {
  return heights?.[index];
}

/** Whether App should leave the scroll position alone for this pathname. */
export function keepsBootPosition(pathname: string) {
  return heights !== null && pathname === path;
}

/** Once the visitor navigates, the boot position no longer applies. */
export function clearBootPosition() {
  heights = null;
  path = null;
}
