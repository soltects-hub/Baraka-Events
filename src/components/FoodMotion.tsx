import type { CSSProperties, ReactNode } from 'react';

/**
 * Slow, looping "ingredients" that drift around the Food Menu stage.
 *
 * These are drawn shapes, not photographs, and each one is a thing the printed menu names: jalebi, naan
 * (garlic, dhaniya and achari are all on the menu), a chilli and a skewer for the BBQ and tikka lines, garlic,
 * dhaniya (coriander) and Kashmiri Chae. They are decoration only (aria-hidden) and say nothing about which
 * menu holds what. Motion is CSS transform only (float + a slow 3D turn), so it stays on the compositor; the
 * stage pauses it when the section is off screen or the tab is hidden, and prefers-reduced-motion stops it.
 */

/** A flat spiral of "batter" for the jalebi: the points are computed once, not authored by hand. */
const JALEBI_PATH = (() => {
  const turns = 3.1;
  const steps = 96;
  let d = '';
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * turns * Math.PI * 2;
    const r = 7 + (t / (turns * Math.PI * 2)) * 34;
    const x = (50 + r * Math.cos(t)).toFixed(1);
    const y = (50 + r * Math.sin(t)).toFixed(1);
    d += `${i === 0 ? 'M' : 'L'}${x} ${y}`;
  }
  return d;
})();

function Jalebi() {
  return (
    <svg viewBox="0 0 100 100" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={JALEBI_PATH} stroke="url(#fm-ember)" strokeWidth="7.5" />
      <path d={JALEBI_PATH} stroke="#fff3dc" strokeWidth="1.6" opacity="0.35" />
    </svg>
  );
}

function Naan() {
  return (
    <svg viewBox="0 0 100 100">
      <path d="M52 10C80 12 94 38 88 62C82 86 48 96 26 82C6 68 14 18 52 10Z" fill="url(#fm-cream)" stroke="#a8763a" strokeWidth="1.5" />
      <g fill="#7a3b06" opacity="0.42">
        <circle cx="38" cy="34" r="4" />
        <circle cx="62" cy="28" r="3" />
        <circle cx="70" cy="56" r="4.5" />
        <circle cx="44" cy="66" r="3.5" />
        <circle cx="30" cy="52" r="2.5" />
      </g>
      <g fill="#7d6b2c" opacity="0.8">
        <ellipse cx="55" cy="45" rx="3.4" ry="1.4" transform="rotate(-30 55 45)" />
        <ellipse cx="46" cy="52" rx="3" ry="1.2" transform="rotate(40 46 52)" />
        <ellipse cx="60" cy="68" rx="3" ry="1.3" transform="rotate(15 60 68)" />
      </g>
    </svg>
  );
}

function Chilli() {
  return (
    <svg viewBox="0 0 100 100" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path
        d="M64 12C60 6 70 2 73 8C79 20 80 36 72 54C63 74 40 92 20 90C12 89 18 80 28 74C48 62 58 42 61 22C62 18 62 15 64 12Z"
        fill="url(#fm-chilli)"
        stroke="#5a1604"
        strokeWidth="1.2"
      />
      <path d="M64 12C66 7 70 5 73 8" stroke="#8a8a3a" strokeWidth="4" />
      <path d="M66 24C70 40 62 60 44 76" stroke="#fff3dc" strokeWidth="1.6" opacity="0.4" />
    </svg>
  );
}

function Garlic() {
  return (
    <svg viewBox="0 0 100 100" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M50 12C52 22 72 28 76 50C80 72 64 90 50 90C36 90 20 72 24 50C28 28 48 22 50 12Z" fill="url(#fm-cream)" stroke="#a8763a" strokeWidth="1.4" />
      <path d="M50 24C42 44 42 70 50 88M50 24C58 44 58 70 50 88" stroke="#a8763a" strokeWidth="1.4" />
      <ellipse cx="50" cy="90" rx="8" ry="2.6" fill="#a8763a" />
    </svg>
  );
}

function Chai() {
  return (
    <svg viewBox="0 0 100 100" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="50" cy="83" rx="36" ry="7" fill="url(#fm-cream)" stroke="#a8763a" strokeWidth="1.2" />
      <path d="M22 44H78C78 67 66 80 50 80C34 80 22 67 22 44Z" fill="url(#fm-cream)" stroke="#a8763a" strokeWidth="1.4" />
      <path d="M78 50C94 48 94 68 76 68" stroke="#a8763a" strokeWidth="5" />
      <ellipse cx="50" cy="44" rx="28" ry="5" fill="url(#fm-ember)" />
      <g className="fm-steam" stroke="#fff3dc" strokeWidth="2" opacity="0.6">
        <path d="M40 34C34 26 46 22 40 12" />
        <path d="M58 34C52 26 64 22 58 12" />
      </g>
    </svg>
  );
}

function Skewer() {
  return (
    <svg viewBox="0 0 100 100" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <g transform="rotate(-35 50 50)">
        <path d="M6 50H94" stroke="#a8763a" strokeWidth="3" />
        <rect x="20" y="38" width="17" height="24" rx="6" fill="url(#fm-ember)" stroke="#7a3b06" strokeWidth="1" />
        <rect x="41" y="38" width="17" height="24" rx="6" fill="url(#fm-ember)" stroke="#7a3b06" strokeWidth="1" />
        <rect x="62" y="38" width="17" height="24" rx="6" fill="url(#fm-ember)" stroke="#7a3b06" strokeWidth="1" />
        <path d="M24 44l9 4M45 55l9-4M66 44l9 4" stroke="#3b1d04" strokeWidth="1.4" opacity="0.55" />
      </g>
    </svg>
  );
}

function Leaf() {
  return (
    <svg viewBox="0 0 100 100" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M50 90C20 70 14 36 50 10C86 36 80 70 50 90Z" fill="url(#fm-leaf)" stroke="#7d6b2c" strokeWidth="1.2" />
      <path d="M50 88V20M50 70L34 56M50 56L66 44M50 44L38 34" stroke="#fff3dc" strokeWidth="1.4" opacity="0.5" />
    </svg>
  );
}

interface GlyphSpec {
  id: string;
  node: ReactNode;
  /** left / top as % of the stage, size in px (desktop), then the same three for a phone; `null` hides it on phones */
  d: { left: string; top: string; size: number };
  m: { left: string; top: string; size: number } | null;
  /** parallax depth in px for a full pointer sweep */
  depth: number;
  /** float travel and period */
  fy: string;
  dur: string;
  delay: string;
  /** a full slow turn about the vertical axis, or a gentle tilt back and forth (better for a cup) */
  turn: 'spin' | 'tilt';
  turnDur: string;
  rz: string;
}

const GLYPHS: GlyphSpec[] = [
  { id: 'jalebi', node: <Jalebi />, d: { left: '1.5%', top: '5%', size: 108 }, m: { left: '5%', top: '1.2%', size: 42 }, depth: 22, fy: '16px', dur: '9s', delay: '-1s', turn: 'spin', turnDur: '34s', rz: '6deg' },
  { id: 'naan', node: <Naan />, d: { left: '90.5%', top: '5%', size: 114 }, m: { left: '80%', top: '1%', size: 46 }, depth: 26, fy: '18px', dur: '11s', delay: '-4s', turn: 'spin', turnDur: '40s', rz: '-5deg' },
  { id: 'chilli', node: <Chilli />, d: { left: '3.5%', top: '63%', size: 76 }, m: null, depth: 14, fy: '12px', dur: '8s', delay: '-2s', turn: 'tilt', turnDur: '12s', rz: '8deg' },
  { id: 'garlic', node: <Garlic />, d: { left: '92.5%', top: '63%', size: 72 }, m: null, depth: 12, fy: '12px', dur: '10s', delay: '-6s', turn: 'spin', turnDur: '46s', rz: '-6deg' },
  { id: 'chai', node: <Chai />, d: { left: '1.5%', top: '22%', size: 80 }, m: { left: '44%', top: '0.8%', size: 40 }, depth: 18, fy: '10px', dur: '9.5s', delay: '-3s', turn: 'tilt', turnDur: '14s', rz: '3deg' },
  { id: 'skewer', node: <Skewer />, d: { left: '92%', top: '22%', size: 100 }, m: null, depth: 20, fy: '14px', dur: '12s', delay: '-7s', turn: 'tilt', turnDur: '16s', rz: '-4deg' },
  { id: 'leaf', node: <Leaf />, d: { left: '12%', top: '3%', size: 56 }, m: null, depth: 30, fy: '20px', dur: '10.5s', delay: '-5s', turn: 'spin', turnDur: '30s', rz: '10deg' },
];

export default function FoodMotion() {
  return (
    <div aria-hidden className="fm-layer pointer-events-none absolute inset-0 z-[4]">
      {/* shared gradients, defined once */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="fm-cream" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff3dc" />
            <stop offset="0.55" stopColor="#e6c58a" />
            <stop offset="1" stopColor="#a8763a" />
          </linearGradient>
          <linearGradient id="fm-ember" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffb347" />
            <stop offset="0.6" stopColor="#e8890a" />
            <stop offset="1" stopColor="#7a3b06" />
          </linearGradient>
          <linearGradient id="fm-chilli" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ff8a4a" />
            <stop offset="0.55" stopColor="#d63a14" />
            <stop offset="1" stopColor="#5a1604" />
          </linearGradient>
          <linearGradient id="fm-leaf" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#e9d89a" />
            <stop offset="1" stopColor="#7d6b2c" />
          </linearGradient>
        </defs>
      </svg>

      {GLYPHS.map((g) => (
        <div
          key={g.id}
          className="fm-g"
          data-mobile={g.m ? 'show' : 'hide'}
          style={
            {
              '--l': g.d.left,
              '--t': g.d.top,
              '--w': `${g.d.size}px`,
              '--ml': g.m?.left,
              '--mt': g.m?.top,
              '--mw': g.m ? `${g.m.size}px` : undefined,
              '--depth': g.depth,
              '--fy': g.fy,
              '--rz': g.rz,
              '--dur': g.dur,
              '--delay': g.delay,
              '--turn-dur': g.turnDur,
            } as CSSProperties
          }
        >
          <div className="fm-float">
            <div className="fm-turn" data-turn={g.turn}>
              {g.node}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
