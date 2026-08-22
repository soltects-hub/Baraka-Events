import { useCallback, useEffect, useRef, useSyncExternalStore, type ReactNode } from 'react';
import Lenis from 'lenis';
import { LenisContext } from './useLenis';

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const rafId = useRef<number>(0);
  const listeners = useRef(new Set<() => void>());

  const subscribe = useCallback((onStoreChange: () => void) => {
    listeners.current.add(onStoreChange);
    return () => listeners.current.delete(onStoreChange);
  }, []);
  const getSnapshot = useCallback(() => lenisRef.current, []);

  const lenis = useSyncExternalStore(subscribe, getSnapshot);

  useEffect(() => {
    const instance = new Lenis({
      lerp: 0.085,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    });
    lenisRef.current = instance;
    listeners.current.forEach((notify) => notify());

    const raf = (time: number) => {
      instance.raf(time);
      rafId.current = requestAnimationFrame(raf);
    };
    rafId.current = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId.current);
      instance.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
