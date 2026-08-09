import { motion } from 'framer-motion';

const PHRASES = ['Crafting Extraordinary Experiences', 'Baraka Events', 'Lahore', 'Shaadis · Galas · Celebrations'];

function StripContent({ dark }: { dark: boolean }) {
  const row = [...PHRASES, ...PHRASES, ...PHRASES];
  return (
    <>
      {row.map((p, i) => (
        <div key={i} className="flex items-center gap-8">
          <span
            className={`font-display text-xl font-light uppercase tracking-[0.2em] md:text-2xl ${
              dark ? 'text-ink' : 'text-gold'
            }`}
          >
            {p}
          </span>
          <svg viewBox="0 0 24 24" className={`h-4 w-4 ${dark ? 'fill-ink/70' : 'fill-gold/70'}`}>
            <path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4L12 2z" />
          </svg>
        </div>
      ))}
    </>
  );
}

/**
 * Two crossing diagonal ribbons — one gold (moving left), one dark outlined
 * (moving right) — the classic award-site text-strip transition.
 */
export default function TextStrips() {
  return (
    <section aria-hidden className="relative -my-8 overflow-hidden py-24 md:-my-10 md:py-32">
      {/* strip 1 — gold, tilted, scrolls left */}
      <div className="absolute left-1/2 top-1/2 w-[140vw] -translate-x-1/2 -translate-y-1/2 rotate-[-4deg]">
        <div className="border-y border-gold-soft/40 bg-gold py-4 shadow-[0_10px_60px_rgba(255,150,11,0.25)] md:py-5">
          <motion.div
            className="flex w-max items-center gap-8 whitespace-nowrap"
            animate={{ x: ['0%', '-33.333%'] }}
            transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
          >
            <StripContent dark />
          </motion.div>
        </div>
      </div>

      {/* strip 2 — dark glass, opposite tilt, scrolls right */}
      <div className="absolute left-1/2 top-1/2 w-[140vw] -translate-x-1/2 -translate-y-1/2 rotate-[3deg]">
        <div className="border-y border-gold/30 bg-ink-3/95 py-4 backdrop-blur-sm md:py-5">
          <motion.div
            className="flex w-max items-center gap-8 whitespace-nowrap"
            animate={{ x: ['-33.333%', '0%'] }}
            transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
          >
            <StripContent dark={false} />
          </motion.div>
        </div>
      </div>

      {/* spacer to give the rotated strips room */}
      <div className="h-24 md:h-32" />
    </section>
  );
}
