import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import RevealText from './RevealText';

const steps = [
  {
    n: '01',
    title: 'Discovery',
    text: 'A private consultation where we listen — to your story, your guests, your ambitions. We map the emotional arc of your event before a single vendor is called.',
  },
  {
    n: '02',
    title: 'Concept & Design',
    text: 'Moodboards become blueprints. Our designers craft a complete visual identity: spatial design, florals, lighting, typography, tablescapes and scent.',
  },
  {
    n: '03',
    title: 'Curation',
    text: 'We assemble a hand-picked ensemble of the region\u2019s finest — chefs, musicians, artisans and technicians — each briefed to the same exacting standard.',
  },
  {
    n: '04',
    title: 'Production',
    text: 'Timelines to the minute. Contingencies for the contingencies. Rehearsals, load-ins and technical runs so the day itself unfolds without a visible seam.',
  },
  {
    n: '05',
    title: 'The Event',
    text: 'You arrive as a guest at your own celebration. Our team conducts everything invisibly, so all you experience is the magic — never the machinery.',
  },
];

export default function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.7', 'end 0.6'] });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section id="process" data-scene="08 · TRACKING — THE METHOD" className="relative bg-ink-2 py-28 md:py-40">
      <div className="mx-auto grid max-w-[1400px] gap-16 px-6 md:px-10 lg:grid-cols-[1fr_1.4fr] lg:gap-24">
        <div className="lg:sticky lg:top-28 lg:h-fit">
          <p className="mb-4 text-[11px] uppercase tracking-[0.45em] text-gold">The Method</p>
          <RevealText
            as="h2"
            text="Five acts. One flawless performance."
            className="font-display text-4xl font-light leading-[1.12] text-cream md:text-6xl"
          />
          <p className="mt-7 max-w-md text-sm font-light leading-relaxed text-cream/60 md:text-base">
            Great events look effortless because the process behind them is anything but.
            This is how a Baraka production comes to life — from the first conversation
            to the final candle.
          </p>
        </div>

        <div ref={ref} className="relative">
          <div className="absolute left-[19px] top-0 bottom-0 w-[1px] bg-white/10 md:left-[27px]" />
          <motion.div style={{ height: lineHeight }} className="absolute left-[19px] top-0 w-[1px] bg-gold md:left-[27px]" />

          <div className="space-y-14 md:space-y-20">
            {steps.map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-15%' }}
                transition={{ duration: 0.85, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="relative flex gap-8 pl-0 md:gap-12"
              >
                <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-ink-2 font-display text-sm italic text-gold md:h-14 md:w-14 md:text-base">
                  {step.n}
                </div>
                <div className="pt-1">
                  <h3 className="font-display text-2xl font-light text-cream md:text-4xl">{step.title}</h3>
                  <p className="mt-3 max-w-lg text-sm font-light leading-relaxed text-cream/60 md:text-base">{step.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
