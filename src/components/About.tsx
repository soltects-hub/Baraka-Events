import { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion';
import { Link } from 'react-router-dom';
import RevealText from './RevealText';

const stats = [
  { value: 'Full-Service', label: 'Planning & Production' },
  { value: 'One Team', label: 'Start to Finish' },
  { value: 'Lahore-Wide', label: 'Venues & Vendors' },
  { value: 'Direct Line', label: 'To Your Coordinator' },
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
    <section id="about" ref={ref} data-scene="02 · CLOSE-UP — THE HOUSE" className="relative overflow-hidden bg-ink py-20 md:py-40">
      <motion.div
        style={{ x: bigWordX }}
        aria-hidden
        className="pointer-events-none absolute top-2 left-0 whitespace-nowrap font-display text-[20vw] leading-none text-stroke opacity-30 select-none md:top-6"
      >
        Baraka — Baraka — Baraka
      </motion.div>

      <div className="relative mx-auto grid max-w-[1400px] gap-16 px-6 md:px-10 lg:grid-cols-2 lg:gap-24">
        <div className="relative">
          <motion.div style={{ clipPath: mask }} className="relative z-10 overflow-hidden rounded-sm">
            <motion.img
              style={{ y: imgY, scale: 1.15 }}
              src="/media/about.jpg"
              alt="Henna-decorated hands arranging a marigold garland on a wedding table"
              className="h-[520px] w-full object-cover md:h-[640px]"
              loading="lazy"
            />
            <div aria-hidden className="vignette pointer-events-none absolute inset-0 opacity-60" />
          </motion.div>
          <motion.div
            style={{ y: img2Y }}
            className="absolute -right-4 bottom-[-60px] z-20 hidden w-[45%] overflow-hidden rounded-sm border-4 border-ink shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)] md:block"
          >
            <img
              src="/media/gallery/detail-4.webp"
              alt="Nikkah stage with floral rings and warm lighting"
              className="h-64 w-full object-cover"
              loading="lazy"
            />
          </motion.div>
          <div className="absolute -left-6 -top-6 h-24 w-24 border-l border-t border-champagne/50" />
        </div>

        <div className="flex flex-col justify-center pt-10 lg:pt-0">
          <p className="mb-5 text-[11px] uppercase tracking-[0.3em] text-champagne">The House of Baraka</p>
          <RevealText
            as="h2"
            text="We don't just plan your event. We run it."
            className="font-display text-4xl font-light leading-[1.1] md:text-6xl"
            highlightWords={[6, 7, 8]}
            highlightClass="accent-serif"
          />
          <div className="mt-8 space-y-5 text-base font-light leading-[1.75] text-mist md:text-[17px]">
            <p>
              Baraka Events is an event planning and management company based in Gulberg,
              Lahore. We plan and produce weddings, corporate events and private
              celebrations across the city — from the havelis of the Walled City to the
              marquees of DHA and the ballrooms of Gulberg.
            </p>
            <p>
              A{' '}
              <Link to="/services/wedding-planning" className="gold-underline text-gold hover:text-gold-soft">
                shaadi
              </Link>{' '}
              means mehndi, baraat, nikkah and walima planned as one continuous
              production, not four separate bookings. A{' '}
              <Link to="/services/corporate-events" className="gold-underline text-gold hover:text-gold-soft">
                corporate event
              </Link>{' '}
              means stage design, lighting and hospitality handled by people who also do
              this for weddings, so nothing feels improvised. Either way, the same team
              stays with you from the first meeting to the last guest leaving.
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
                <div className="font-display text-4xl font-light text-champagne md:text-5xl">{s.value}</div>
                <motion.span
                  aria-hidden
                  className="hairline-flame mt-3 block w-12 origin-left"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, margin: '-10%' }}
                  transition={{ duration: 1.1, delay: 0.25 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                />
                <div className="mt-3 text-[11px] uppercase tracking-[0.22em] text-mist-dim">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
