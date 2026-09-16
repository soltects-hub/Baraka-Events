import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';

const services = [
  {
    index: '01',
    title: 'Weddings',
    tagline: 'Every function, one plan',
    description:
      'Mehndi, baraat, nikkah and walima planned as one production instead of four separate events. We handle venue selection, stage and floral design, catering coordination and guest logistics, so the story stays consistent from the first night to the last.',
    image: '/media/wedding-2.webp',
    details: ['Mehndi · Baraat · Nikkah · Walima', 'Destination & Multi-Day Weddings', 'Stage, Floral & Lighting Design'],
  },
  {
    index: '02',
    title: 'Corporate Events',
    tagline: 'Built to run on schedule',
    description:
      "Product launches, executive summits and award nights for brands that cannot afford a technical delay. We handle stage design, AV, run-of-show timing and hospitality across Lahore's hotels, expo halls and private venues.",
    image: '/media/corporate-1.webp',
    details: ['Launches, Summits & Award Nights', 'Stage Design & AV Production', 'Guest & Executive Hospitality'],
  },
  {
    index: '03',
    title: 'Private Celebrations',
    tagline: 'Sized to the guest list',
    description:
      'Birthdays, aqeeqahs, anniversaries and family mehfils, planned with the same attention whether it is fifteen guests or a hundred and fifty. A smaller guest list gets more design detail per guest, not less.',
    image: '/media/private-1.webp',
    details: ['Milestone Birthdays & Anniversaries', 'Rooftop Dinners & Garden Mehfils', 'Private & Intimate Gatherings'],
  },
];

/** lg and up (the breakpoint the pinned layout was designed for). Starts
 *  from the real media query so a phone never mounts the 340vh version. */
function useIsDesktop() {
  const [desktop, setDesktop] = useState(
    () => typeof window === 'undefined' || window.matchMedia('(min-width: 1024px)').matches
  );
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = () => setDesktop(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return desktop;
}

/**
 * Touch/narrow layout: the same three chapters as a vertical stack. A
 * 340vh scroll-jacked section with a pinned image was the most awkward
 * thing on the site to thumb through; three cards read in one pass.
 */
function StackedServices() {
  return (
    <section id="experiences" data-scene="03 · LOCKED-OFF — EXPERIENCES" className="relative bg-ink-2 py-20">
      <div className="mx-auto max-w-[1400px] px-6">
        <p className="mb-8 text-[11px] uppercase tracking-[0.3em] text-champagne">Signature Experiences</p>
        <div className="space-y-6">
          {services.map((s, i) => (
            <motion.article
              key={s.index}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-8%' }}
              transition={{ duration: 0.8, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="relative overflow-hidden rounded-sm border border-champagne/10 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]"
            >
              <img src={s.image} alt={s.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
              <div className="grade absolute inset-0" />
              <div className="absolute inset-x-0 bottom-0 h-[85%] bg-gradient-to-t from-ink via-ink/80 via-45% to-transparent" />
              <div className="relative flex min-h-[620px] flex-col justify-end p-6 sm:min-h-[540px] sm:p-8">
                <div className="flex items-baseline gap-3">
                  <span className="accent-serif text-lg text-champagne/80">{s.index}</span>
                  <h3 className="font-display text-4xl font-light sm:text-5xl">{s.title}</h3>
                </div>
                <span aria-hidden className="hairline-flame mt-3 block w-24" />
                <p className="accent-serif mt-3 text-lg sm:text-xl">{s.tagline}</p>
                <p className="mt-3 text-sm font-light leading-relaxed text-cream/85">{s.description}</p>
                <ul className="mt-4 space-y-2">
                  {s.details.map((d) => (
                    <li key={d} className="flex items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-ivory/80">
                      <span className="h-px w-6 shrink-0 bg-champagne/60" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function StickyServices() {
  const desktop = useIsDesktop();
  return desktop ? <PinnedServices /> : <StackedServices />;
}

function PinnedServices() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const idx = Math.min(services.length - 1, Math.floor(v * services.length));
    setActive(idx);
  });

  const s = services[active];

  return (
    <section id="experiences" ref={ref} data-scene="03 · LOCKED-OFF — EXPERIENCES" className="relative h-[340vh] bg-ink-2">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="absolute inset-0">
          <AnimatePresence mode="popLayout">
            <motion.img
              key={s.image}
              src={s.image}
              alt={s.title}
              initial={{ opacity: 0, scale: 1.12, rotateY: 4 }}
              animate={{ opacity: 0.92, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.96, rotateY: -4 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </AnimatePresence>
          <div className="vignette absolute inset-0" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/95 via-ink/65 via-38% to-ink/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-2 via-transparent via-35% to-ink/40" />
        </div>

        <div className="relative z-10 mx-auto grid w-full max-w-[1400px] items-center gap-10 px-6 md:px-10 lg:grid-cols-[1fr_auto]">
          <div className="max-w-2xl">
            <p className="mb-4 text-[11px] uppercase tracking-[0.3em] text-champagne">Signature Experiences</p>
            {/* fixed-height stage sized per breakpoint so text never collides */}
            <div className="relative h-[330px] sm:h-[290px] md:h-[270px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="flex items-baseline gap-4 md:gap-5">
                    <span className="accent-serif text-xl text-champagne/80 md:text-2xl">{s.index}</span>
                    <h3 className="font-display text-4xl font-light sm:text-5xl md:text-6xl lg:text-7xl">{s.title}</h3>
                  </div>
                  {/* a band of light drawn under the title on every chapter change */}
                  <motion.span
                    aria-hidden
                    className="hairline-flame mt-3 block w-28 origin-left"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  />
                  <p className="accent-serif mt-3 text-xl md:text-2xl">{s.tagline}</p>
                  <p className="mt-4 max-w-xl text-sm font-light leading-relaxed text-mist md:text-base">
                    {s.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-2 md:mt-4">
              <AnimatePresence mode="wait">
                <motion.ul
                  key={active}
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  variants={{ show: { transition: { staggerChildren: 0.08 } } }}
                  className="space-y-2.5 md:space-y-3"
                >
                  {s.details.map((d) => (
                    <motion.li
                      key={d}
                      variants={{
                        hidden: { opacity: 0, x: -20 },
                        show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
                      }}
                      className="flex items-center gap-4 text-[12px] uppercase tracking-[0.18em] text-ivory/80 md:text-[13px] md:tracking-[0.2em]"
                    >
                      <span className="h-[1px] w-8 shrink-0 bg-champagne/60" />
                      {d}
                    </motion.li>
                  ))}
                </motion.ul>
              </AnimatePresence>
            </div>
          </div>

          <div className="hidden flex-col items-end gap-6 lg:flex">
            {services.map((sv, i) => (
              <div key={sv.index} className="flex items-center gap-4">
                <span
                  className={`text-[11px] uppercase tracking-[0.3em] transition-all duration-500 ${
                    i === active ? 'text-champagne' : 'text-mist-dim'
                  }`}
                >
                  {sv.title}
                </span>
                <div className="relative h-[1px] w-16 bg-champagne/15">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-gold"
                    animate={{ width: i === active ? '100%' : i < active ? '100%' : '0%' }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
