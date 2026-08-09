import { motion } from 'framer-motion';
import RevealText from './RevealText';
import MagneticButton from './MagneticButton';

const ADDRESS = 'LG 13A, Big City Plaza, Liberty Roundabout, Main Boulevard, Gulberg III, Lahore';
const MAP_QUERY = encodeURIComponent('Big City Plaza, Liberty Roundabout, Main Boulevard, Gulberg III, Lahore, Pakistan');

export default function LocationMap() {
  return (
    <section id="location" data-scene="13 \u00b7 WIDE SHOT \u2014 FIND US" className="relative overflow-hidden bg-ink-2 py-28 md:py-36">
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 h-[400px] w-[700px] rounded-full opacity-10 blur-[130px]"
        style={{ background: 'radial-gradient(circle, #ff960b 0%, transparent 65%)' }}
      />

      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="mb-12 grid items-end gap-8 md:mb-14 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="mb-4 text-[11px] uppercase tracking-[0.45em] text-gold">Visit the Atelier</p>
            <RevealText
              as="h2"
              text="Find us in the heart of Gulberg"
              className="font-display text-4xl font-light leading-[1.1] md:text-6xl"
            />
          </div>
          <div className="flex flex-col items-start gap-5 lg:items-end">
            <p className="max-w-sm text-sm font-light leading-relaxed text-cream/60 lg:text-right">
              {ADDRESS}. Walk-ins welcome &mdash; but a booked consultation gets the chai ready before you arrive.
            </p>
            <MagneticButton
              href={`https://www.google.com/maps/dir/?api=1&destination=${MAP_QUERY}`}
              className="inline-flex items-center gap-3 rounded-full bg-gold px-8 py-4 text-[12px] font-medium uppercase tracking-[0.25em] text-ink transition-transform duration-300 hover:scale-[1.03]"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.8">
                <path d="M9.5 14.5L21 3l-6.5 18-2.5-8-8-2.5 5.5-6z" strokeLinecap="round" strokeLinejoin="round" transform="rotate(8 12 12)" />
              </svg>
              Get Directions
            </MagneticButton>
          </div>
        </div>

        {/* map frame */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="group relative overflow-hidden rounded-sm border border-white/10"
        >
          {/* corner brackets — keeps the cinematic frame language */}
          <span className="pointer-events-none absolute left-4 top-4 z-10 h-6 w-6 border-l border-t border-gold/50" />
          <span className="pointer-events-none absolute right-4 top-4 z-10 h-6 w-6 border-r border-t border-gold/50" />
          <span className="pointer-events-none absolute bottom-4 left-4 z-10 h-6 w-6 border-b border-l border-gold/50" />
          <span className="pointer-events-none absolute bottom-4 right-4 z-10 h-6 w-6 border-b border-r border-gold/50" />

          <iframe
            title="Baraka Events office location — Big City Plaza, Gulberg III, Lahore"
            src={`https://www.google.com/maps?q=${MAP_QUERY}&z=16&output=embed`}
            className="h-[380px] w-full border-0 saturate-100 contrast-[1.05] transition-[filter] duration-700 md:h-[480px] lg:saturate-[0.35] lg:group-hover:saturate-100"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />

          {/* address chip on the map */}
          <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 w-[calc(100%-3rem)] max-w-md -translate-x-1/2 rounded-sm border border-white/10 bg-ink/85 px-5 py-4 text-center backdrop-blur-xl md:bottom-8">
            <p className="text-[10px] uppercase tracking-[0.3em] text-gold">Baraka Events &mdash; Head Office</p>
            <p className="mt-1.5 text-[13px] font-light leading-snug text-cream/80">{ADDRESS}</p>
          </div>
        </motion.div>

        {/* quick facts */}
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {[
            { k: 'Landmark', v: 'Liberty Roundabout \u2014 opposite Liberty Market' },
            { k: 'Hours', v: 'Mon\u2013Sat \u00b7 11:00 AM \u2013 8:00 PM' },
            { k: 'Parking', v: 'Big City Plaza basement \u2014 validated for clients' },
          ].map((f, i) => (
            <motion.div
              key={f.k}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="border-l border-gold/40 pl-5"
            >
              <p className="text-[10px] uppercase tracking-[0.3em] text-cream/40">{f.k}</p>
              <p className="mt-2 text-sm font-light leading-relaxed text-cream/75">{f.v}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
