import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { members } from '../lib/team';

const CARD_W = 220;
const RADIUS = 420;
const AUTO_MS = 4200;

const items = [
  ...members,
  { name: 'Announcing soon', role: 'Creative Director', image: '', bio: 'The sixth seat at the table — reserved.' },
];

export default function TeamCarousel3D() {
  const n = items.length;
  const angleStep = 360 / n;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || paused) return;
    const t = setInterval(() => setActive((a) => (a + 1) % n), AUTO_MS);
    return () => clearInterval(t);
  }, [paused, n]);

  const next = () => setActive((a) => (a + 1) % n);
  const prev = () => setActive((a) => (a - 1 + n) % n);
  const current = items[active];
  const isComingSoon = !current.image;

  return (
    <div
      className="relative mx-auto max-w-[1200px] px-6 md:px-10"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25 blur-[130px]"
        style={{ background: 'radial-gradient(circle, #ff960b 0%, transparent 65%)' }}
      />

      {/* 3D ring */}
      <div className="relative h-[300px] sm:h-[360px] md:h-[420px]" style={{ perspective: '1800px' }}>
        <div
          className="absolute left-1/2 top-1/2 h-0 w-0"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateY(${-active * angleStep}deg)`,
            transition: 'transform 0.9s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          {items.map((m, i) => {
            const angle = i * angleStep;
            const delta = ((angle - active * angleStep + 540) % 360) - 180;
            const facing = Math.cos((delta * Math.PI) / 180);
            const brightness = 0.32 + 0.68 * Math.max(0, facing);
            const scale = 0.8 + 0.22 * Math.max(0, facing);
            const isFront = Math.abs(delta) < 0.5;

            return (
              <button
                key={m.name}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show ${m.name}`}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  width: CARD_W,
                  transform: `translate(-50%, -50%) rotateY(${angle}deg) translateZ(${RADIUS}px) scale(${scale})`,
                  filter: `brightness(${brightness})`,
                  transition: 'transform 0.9s cubic-bezier(0.22, 1, 0.36, 1), filter 0.9s ease',
                }}
                className="cursor-pointer"
              >
                <div
                  className={`relative aspect-[3/4] overflow-hidden rounded-md border bg-ink-2 transition-colors duration-500 ${
                    isFront ? 'border-gold shadow-[0_0_70px_rgba(255,150,11,0.5)]' : 'border-white/10'
                  }`}
                >
                  {m.image ? (
                    <img src={m.image} alt={m.name} draggable={false} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 border border-dashed border-white/12 bg-ink-2/60">
                      <span className="font-display text-lg italic text-gold/60">06</span>
                    </div>
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/15 to-transparent" />
                </div>
              </button>
            );
          })}
        </div>

        {/* arrows */}
        <button
          onClick={prev}
          aria-label="Previous team member"
          className="absolute left-0 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-ink/60 text-cream backdrop-blur-md transition-colors hover:border-gold hover:text-gold md:-left-4"
        >
          &#10094;
        </button>
        <button
          onClick={next}
          aria-label="Next team member"
          className="absolute right-0 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-ink/60 text-cream backdrop-blur-md transition-colors hover:border-gold hover:text-gold md:-right-4"
        >
          &#10095;
        </button>
      </div>

      {/* caption panel — the active member's details, fixed and readable */}
      <div className="relative mx-auto mt-10 max-w-xl text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.name}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-[10px] uppercase tracking-[0.35em] text-gold">{current.role}</p>
            <h3 className={`mt-2 font-display text-3xl text-cream md:text-4xl ${isComingSoon ? 'italic text-cream/50' : 'font-light'}`}>
              {current.name}
            </h3>
            <p className="mx-auto mt-3 max-w-md text-[13px] font-light leading-relaxed text-cream/60">{current.bio}</p>
          </motion.div>
        </AnimatePresence>

        <div className="mt-6 flex items-center justify-center gap-4 text-[11px] uppercase tracking-[0.3em] text-cream/40">
          <span className="text-gold">{String(active + 1).padStart(2, '0')}</span>
          <span className="h-[1px] w-10 bg-white/15" />
          <span>{String(n).padStart(2, '0')}</span>
        </div>
      </div>
    </div>
  );
}
