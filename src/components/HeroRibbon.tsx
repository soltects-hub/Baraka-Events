import { m, useReducedMotion } from 'framer-motion';

/**
 * Abstract flowing-ribbon artwork for the Hero's visual column. Pure SVG —
 * no photo, no canvas/WebGL, no new dependency — recolored into Baraka's own
 * champagne/bronze/flame palette (not the reference's cold silver/black) so
 * it sits inside the Candlelit Haveli system instead of fighting it.
 */
export default function HeroRibbon() {
  const reduceMotion = useReducedMotion();

  return (
    <m.div
      className="relative mx-auto aspect-[4/5] w-full max-w-[420px]"
      initial={{ opacity: 0, scale: 0.94 }}
      animate={
        reduceMotion
          ? { opacity: 1, scale: 1 }
          : { opacity: 1, scale: 1, y: [0, -14, 0], rotate: [0, 1, 0] }
      }
      transition={
        reduceMotion
          ? { duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }
          : {
              opacity: { duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] },
              scale: { duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] },
              y: { duration: 11, delay: 1.2, repeat: Infinity, ease: 'easeInOut' },
              rotate: { duration: 13, delay: 1.2, repeat: Infinity, ease: 'easeInOut' },
            }
      }
    >
      <svg
        viewBox="0 0 400 500"
        className="h-full w-full"
        role="img"
        aria-label="Abstract flowing light ribbon, Baraka Events brand artwork"
      >
        <defs>
          <linearGradient id="ribbonBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7e6a4c" stopOpacity="0.55" />
            <stop offset="45%" stopColor="#e6c58a" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#c96f06" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id="ribbonEdge" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f3e4c7" stopOpacity="0" />
            <stop offset="50%" stopColor="#ffe9c2" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#f3e4c7" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="ribbonGlint" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff6e6" stopOpacity="0.95" />
            <stop offset="35%" stopColor="#ffb347" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ffb347" stopOpacity="0" />
          </radialGradient>
          <filter id="ribbonBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="10" />
          </filter>
        </defs>

        {/* soft ambient glow behind the ribbon */}
        <ellipse cx="230" cy="260" rx="150" ry="180" fill="url(#ribbonGlint)" opacity="0.5" />

        {/* back strand — blurred, sits behind the main body for depth */}
        <path
          d="M70 60 C 210 40, 320 130, 270 240 C 230 320, 90 300, 100 400 C 106 450, 190 480, 260 450"
          fill="none"
          stroke="url(#ribbonBody)"
          strokeWidth="34"
          strokeLinecap="round"
          filter="url(#ribbonBlur)"
          opacity="0.5"
        />

        {/* main ribbon body */}
        <path
          d="M65 55 C 205 35, 315 125, 265 235 C 225 315, 85 295, 95 395 C 101 445, 185 475, 255 445"
          fill="none"
          stroke="url(#ribbonBody)"
          strokeWidth="26"
          strokeLinecap="round"
        />

        {/* bright edge highlight tracing the same curve, offset slightly */}
        <path
          d="M60 48 C 200 26, 312 116, 260 228"
          fill="none"
          stroke="url(#ribbonEdge)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M110 402 C 118 448, 195 478, 258 450"
          fill="none"
          stroke="url(#ribbonEdge)"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* secondary thin strand crossing the glint, echoing the reference's
            second ribbon fold */}
        <path
          d="M40 220 C 140 190, 260 250, 220 340 C 200 386, 130 380, 150 430"
          fill="none"
          stroke="url(#ribbonBody)"
          strokeWidth="10"
          strokeLinecap="round"
          opacity="0.75"
        />

        {/* the glint itself — a small hot core where two strands cross */}
        <circle cx="232" cy="255" r="7" fill="#fff6e6" opacity="0.9" />
        <circle cx="232" cy="255" r="22" fill="url(#ribbonGlint)" />
      </svg>
    </m.div>
  );
}
