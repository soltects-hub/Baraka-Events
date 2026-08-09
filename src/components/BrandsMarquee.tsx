import { motion } from 'framer-motion';
import RevealText from './RevealText';

/**
 * Pakistani professional brands that have trusted Baraka for corporate events.
 * Rendered as elegant typographic wordmarks in a continuous slide.
 */
const brands = [
  { name: 'Khaadi', style: 'font-display font-semibold tracking-[0.08em]' },
  { name: 'Gul Ahmed', style: 'font-display italic font-medium' },
  { name: 'HBL', style: 'font-body font-semibold tracking-[0.35em]' },
  { name: 'Jazz', style: 'font-body font-medium lowercase tracking-tight' },
  { name: 'Packages Mall', style: 'font-body font-light uppercase tracking-[0.25em]' },
  { name: 'Nishat', style: 'font-display font-medium tracking-[0.12em]' },
  { name: 'Sapphire', style: 'font-display italic font-light tracking-[0.06em]' },
  { name: 'Engro', style: 'font-body font-semibold uppercase tracking-[0.2em]' },
  { name: 'Bank Alfalah', style: 'font-body font-medium tracking-[0.1em]' },
  { name: 'Servis', style: 'font-body font-semibold uppercase tracking-[0.3em]' },
  { name: 'Interwood', style: 'font-body font-light uppercase tracking-[0.22em]' },
  { name: 'Fatima Group', style: 'font-display font-medium tracking-[0.1em]' },
];

export default function BrandsMarquee() {
  const row = [...brands, ...brands];

  return (
    <section data-scene="03A · TITLE CARDS — TRUSTED BY" className="relative overflow-hidden bg-ink py-20 md:py-28">
      <div className="mx-auto mb-12 max-w-[1400px] px-6 text-center md:px-10">
        <p className="mb-4 text-[11px] uppercase tracking-[0.45em] text-gold">Trusted By</p>
        <RevealText
          as="h2"
          text="Pakistan's finest brands celebrate with us"
          className="font-display text-3xl font-light leading-[1.15] text-cream md:text-5xl"
        />
      </div>

      {/* row 1 */}
      <div className="relative border-y border-white/5 bg-ink-2/60 py-8">
        {/* edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ink to-transparent md:w-40" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ink to-transparent md:w-40" />
        <motion.div
          className="flex w-max items-center gap-14 whitespace-nowrap md:gap-20"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 42, repeat: Infinity, ease: 'linear' }}
        >
          {row.map((b, i) => (
            <div key={i} className="flex items-center gap-14 md:gap-20">
              <span
                className={`${b.style} text-xl text-cream/35 transition-colors duration-500 hover:text-gold md:text-2xl`}
              >
                {b.name}
              </span>
              <span className="h-1 w-1 rotate-45 bg-gold/40" />
            </div>
          ))}
        </motion.div>
      </div>

      <p className="mt-8 text-center text-[10px] uppercase tracking-[0.3em] text-cream/30">
        Corporate galas · launches · annual dinners — produced for Pakistan's leading names
      </p>
    </section>
  );
}
