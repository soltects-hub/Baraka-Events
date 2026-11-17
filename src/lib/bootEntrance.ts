/**
 * Entrance animations on a prerendered page.
 *
 * Every page is prerendered, so a direct visitor already sees the finished page
 * before any JavaScript runs. React then replaces that DOM (createRoot), and an
 * entrance animation that starts from `opacity: 0` hid content the visitor could
 * already read and faded it back in. On a slow phone that pushed Largest
 * Contentful Paint from about 3.3 s to 5–7 s (Lighthouse, Nov 2026).
 *
 * `entrance(initial)` returns `false` for the elements React renders in its first
 * pass over a prerendered page, so they appear exactly as the prerendered HTML
 * already shows them. Anything that mounts later (lazy homepage sections, menus,
 * route changes, panels opened by a tap) keeps its animation.
 */

// Read once, at module load, before React has touched #root.
export const bootedOverPrerender: boolean =
  typeof document !== 'undefined' && !!document.getElementById('root')?.firstElementChild;

let bootPending = bootedOverPrerender;

export function entrance<T>(initial: T): T | false {
  return bootPending ? false : initial;
}

/** Called once from App after its first commit: from then on entrances animate as designed. */
export function markBootRendered(): void {
  bootPending = false;
}
