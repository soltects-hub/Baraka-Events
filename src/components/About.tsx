import { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion';
import RevealText from './RevealText';

const stats = [
  { value: '450+', label: 'Events Produced' },
  { value: '120+', label: 'Lahore Venues' },
  { value: '12', label: 'Years of Craft' },
  { value: '98%', label: 'Client Return Rate' },
];

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });

  const imgY = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const img2Y = useTransform(scrollYProgress, [0, 1], [160, -40]);
  const maskInset = useTransform(scrollYProgress, [0.05, 0.4], [30, 0]);
  const mask = useMotionTemplate`inset(${maskInset}% 0% ${maskInset}% 0%)`;
  const bigWordX = useTransform(scrollYProgress, [0, 1], ['6%', '-14%']);

  return (
    <section id="about" ref={ref} data-scene="02 · CLOSE-UP — THE HOUSE" className="relative overflow-hidden bg-ink py-28 md:py-40">
      <motion.div
        style={{ x: bigWordX }}
        aria-hidden
        className="pointer-events-none absolute top-2 left-0 whitespace-nowrap font-display text-[20vw] leading-none text-stroke opacity-25 select-none md:top-6"
      >
        Baraka — Baraka — Baraka
      </motion.div>

      <div className="relative mx-auto grid max-w-[1400px] gap-16 px-6 md:px-10 lg:grid-cols-2 lg:gap-24">
        <div className="relative">
          <motion.div style={{ clipPath: mask }} className="relative z-10 overflow-hidden rounded-sm">
            <motion.img
              style={{ y: imgY, scale: 1.15 }}
              src="/media/about.jpg"
              alt="Henna-decorated hands arranging a marigold garland on a luxury shaadi table"
              className="h-[520px] w-full object-cover md:h-[640px]"
              loading="lazy"
            />
          </motion.div>
          <motion.div
            style={{ y: img2Y }}
            className="absolute -right-4 bottom-[-60px] z-20 hidden w-[45%] overflow-hidden rounded-sm border-4 border-ink shadow-2xl md:block"
          >
            <img
              src="/media/wedding-1.jpg"
              alt="Luxurious nikkah stage with golden backdrop and cascading roses"
              className="h-64 w-full object-cover"
              loading="lazy"
            />
          </motion.div>
          <div className="absolute -left-6 -top-6 h-24 w-24 border-l border-t border-gold/40" />
        </div>

        <div className="flex flex-col justify-center pt-10 lg:pt-0">
          <p className="mb-5 text-[11px] uppercase tracking-[0.45em] text-gold">The House of Baraka</p>
          <RevealText
            as="h2"
            text="Where Baraka meets brilliance."
            className="font-display text-4xl font-light leading-[1.1] text-cream md:text-6xl"
          />
          <div className="mt-8 space-y-5 text-base font-light leading-relaxed text-cream/65 md:text-lg">
            <p>
              Baraka — the blessing — is the promise woven into every event we create.
              For over a decade, our atelier has transformed Lahore's most treasured occasions
              into enduring memories — from the historic havelis of the Walled City to the
              grand marquees of DHA and the rooftops of Gulberg.
            </p>
            <p>
              From week-long shaadis — mehndi, baraat, nikkah and walima — to thousand-guest
              corporate galas, we blend Mughal-inspired staging, couture florals, immersive
              lighting and world-class mehmaan nawazi into experiences that feel effortless —
              because behind the scenes, nothing is left to chance.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="font-display text-4xl text-gold md:text-5xl">{s.value}</div>
                <div className="mt-2 text-[11px] uppercase tracking-[0.25em] text-mist">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
