import { useEffect, useRef } from 'react';

/**
 * Subtle WebGL fluid smoke in the brand orange — follows the mouse on
 * desktop and the finger on touch devices. Small splats, quick dissolve:
 * an accent, not a light show.
 */
export default function SmokeCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const isTouch = !window.matchMedia('(pointer: fine)').matches;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    // Deferred: this is a purely decorative accent, not part of the
    // initial view. Starting the WebGL context + shader compilation only
    // once the browser is idle (or after a short fallback delay) keeps it
    // off the critical initial-render path instead of competing with it.
    const idle =
      window.requestIdleCallback?.bind(window) ?? ((cb: () => void) => window.setTimeout(cb, 1200));
    const cancelIdle = window.cancelIdleCallback?.bind(window) ?? window.clearTimeout.bind(window);

    const idleHandle = idle(() => {
      if (cancelled) return;
      startFluid();
    });

    const startFluid = () => {
      import('webgl-fluid')
      .then(({ default: WebglFluid }) => {
        if (cancelled) return;

        try {
          WebglFluid(canvas, {
            TRIGGER: 'hover',
            IMMEDIATE: false,
            AUTO: false,
            SIM_RESOLUTION: isTouch ? 96 : 128,
            DYE_RESOLUTION: isTouch ? 512 : 1024, // lighter on phones
            DENSITY_DISSIPATION: 3.2,
            VELOCITY_DISSIPATION: 0.9,
            PRESSURE: 0.8,
            PRESSURE_ITERATIONS: isTouch ? 12 : 20,
            CURL: 12,
            SPLAT_RADIUS: 0.08,
            SPLAT_FORCE: 3200,
            SHADING: true,
            COLORFUL: false,
            SPLAT_COLOR: { r: 0.26, g: 0.153, b: 0.011 }, // #ff960b
            COLOR_UPDATE_SPEED: 4,
            BACK_COLOR: { r: 0, g: 0, b: 0 },
            TRANSPARENT: true,
            BLOOM: false,
            SUNRAYS: false,
          });
        } catch (err) {
          console.error('[SmokeCursor] init failed:', err);
          return; // WebGL unavailable — silently skip
        }

        // Canvas is pointer-events:none so the site stays fully interactive.
        // Forward window events into the simulation instead.
        const forwardMouse = (e: MouseEvent) => {
          canvas.dispatchEvent(
            new MouseEvent(e.type, {
              clientX: e.clientX,
              clientY: e.clientY,
              button: e.button,
              buttons: e.buttons,
              bubbles: false,
            })
          );
        };

        // Touch: translate finger movement into mousemove splats
        const forwardTouch = (e: TouchEvent) => {
          const t = e.touches[0];
          if (!t) return;
          canvas.dispatchEvent(
            new MouseEvent('mousemove', {
              clientX: t.clientX,
              clientY: t.clientY,
              bubbles: false,
            })
          );
        };

        window.addEventListener('mousemove', forwardMouse, { passive: true });
        window.addEventListener('mousedown', forwardMouse, { passive: true });
        window.addEventListener('touchstart', forwardTouch, { passive: true });
        window.addEventListener('touchmove', forwardTouch, { passive: true });

        cleanup = () => {
          window.removeEventListener('mousemove', forwardMouse);
          window.removeEventListener('mousedown', forwardMouse);
          window.removeEventListener('touchstart', forwardTouch);
          window.removeEventListener('touchmove', forwardTouch);
        };
      })
      .catch(() => {});
    };

    return () => {
      cancelled = true;
      cancelIdle(idleHandle);
      cleanup?.();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[88] h-full w-full opacity-45 mix-blend-screen"
    />
  );
}
