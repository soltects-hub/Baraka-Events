import { motion } from 'framer-motion';
import RevealText from './RevealText';

/**
 * TODO: swap this list for Baraka's real named corporate clients once
 * supplied — this placeholder deliberately avoids inventing brand names.
 * Same scrolling-wordmark treatment either way.
 */
const brands = [
  { name: 'Product Launches', style: 'font-display font-semibold tracking-[0.08em]' },
  { name: 'Award Nights', style: 'font-display italic font-medium' },
  { name: 'Annual Dinners', style: 'font-body font-semibold tracking-[0.35em]' },
  { name: 'conferences', style: 'font-body font-medium lowercase tracking-tight' },
  { name: 'Executive Summits', style: 'font-body font-light uppercase tracking-[0.25em]' },
  { name: 'Brand Activations', style: 'font-display font-medium tracking-[0.12em]' },
  { name: 'Leadership Offsites', style: 'font-display italic font-light tracking-[0.06em]' },
  { name: 'AGMs', style: 'font-body font-semibold uppercase tracking-[0.2em]' },
  { name: 'Client Dinners', style: 'font-body font-medium tracking-[0.1em]' },
  { name: 'Team Celebrations', style: 'font-body font-semibold uppercase tracking-[0.3em]' },
];

export default function BrandsMarquee() {
  const row = [...brands, ...brands];

  return (
    <section data-scene="03A · TITLE CARDS — TRUSTED BY" className="relative overflow-hidden bg-ink py-20 md:py-28">
      <div className="mx-auto mb-12 max-w-[1400px] px-6 text-center md:px-10">
        <p className="mb-4 text-[11px] uppercase tracking-[0.45em] text-gold">Corporate Work</p>
        <RevealText
          as="h2"
          text="The kinds of corporate events we run"
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
        Corporate events produced across Lahore, from small leadership dinners to full-scale launches
      </p>
    </section>
  );
}
