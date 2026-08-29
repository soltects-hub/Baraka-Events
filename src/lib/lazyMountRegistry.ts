const revealFns = new Set<() => void>();

export function registerLazyMount(reveal: () => void) {
  revealFns.add(reveal);
  return () => revealFns.delete(reveal);
}

/**
 * Force every deferred section to mount right now. Call this before jumping
 * to a hash target (e.g. "#contact") that sits below still-collapsed
 * sections — otherwise the page's current height understates its real
 * height, and the scroll lands short of the intended section.
 */
export function revealAllLazyMounts() {
  revealFns.forEach((reveal) => reveal());
}
