import { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion';
import { useLenis } from '../lib/scroll';
import MagneticButton from './MagneticButton';

/**
 * Scroll = Camera. The brand mark hangs in the air as a floating 3D emblem;
 * scrolling flies it past the lens to reveal the logo rebuilt as a monumental
 * gold BUILDING — then the camera dollies all the way into its glowing gate
 * and through the doors in a golden flash.
 */
export default function Hero({ started }: { started: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  // — stage 1: the floating emblem + headline fly past the camera
  const logoScale = useTransform(p, [0, 0.3], [1, 7]);
  const logoOpacity = useTransform(p, [0.16, 0.3], [1, 0]);
  const logoBlur = useTransform(p, [0.14, 0.3], [0, 18]);
  const logoFilter = useMotionTemplate`blur(${logoBlur}px)`;

  const uiOpacity = useTransform(p, [0.03, 0.18], [1, 0]);
  const uiY = useTransform(p, [0, 0.22], [0, 110]);
  const uiScale = useTransform(p, [0, 0.22], [1, 1.28]);
  const pe = useTransform(p, (v) => (v > 0.15 ? 'none' : 'auto'));

  // — stage 2: dolly toward the monument (3D approach)
  const monScale = useTransform(p, [0, 0.62], [1.04, 3.1]);
  const monRotX = useTransform(p, [0, 0.55], [5, 0]);
  const monOpacity = useTransform(p, [0.5, 0.63], [1, 0]);
  const monDim = useTransform(p, [0, 0.2, 0.55], [0.62, 0.3, 0.12]);

  // — stage 3: crossfade to the gate, keep pushing in
  const gateOpacity = useTransform(p, [0.5, 0.62], [0, 1]);
  const gateScale = useTransform(p, [0.5, 0.98], [1.08, 3.8]);
  const gateBlur = useTransform(p, [0.88, 1], [0, 8]);
  const gateFilter = useMotionTemplate`blur(${gateBlur}px)`;

  // — stage 4: through the doors — golden flash, then cut to black
  const flashOpacity = useTransform(p, [0.82, 0.97], [0, 1]);
  const cutOpacity = useTransform(p, [0.95, 1], [0, 0.92]);

  const barH = useTransform(p, [0.14, 0.4], ['0vh', '10vh']);
  const hintOpacity = useTransform(p, [0, 0.08], [1, 0]);
  const approachW = useTransform(p, [0.2, 0.95], ['0%', '100%']);
  const approachO = useTransform(p, [0.18, 0.28, 0.85, 0.96], [0, 1, 1, 0]);

  return (
    <section id="top" ref={ref} data-scene="01 · ESTABLISHING — THE STAGE" className="relative h-[340vh]">
      <div className="sticky top-0 h-screen overflow-hidden bg-ink">
        {/* night atmosphere */}
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 50% 30%, #191308 0%, #050505 75%)' }}
        />

        {/* the empty stage — camera dollies toward the light */}
        <div className="absolute inset-0" style={{ perspective: '1200px' }}>
          <motion.div
            style={{ scale: monScale, rotateX: monRotX, opacity: monOpacity, transformOrigin: '50% 56%' }}
            className="absolute inset-0 will-change-transform"
          >
            <img
              src="/media/hero-arrival.jpg"
              alt="Stage production under construction — beams of light cutting through a dark venue"
              className="h-full w-full object-cover"
              style={{ objectPosition: '50% 45%' }}
            />
            <motion.div style={{ opacity: monDim }} className="absolute inset-0 bg-ink" />
          </motion.div>
        </div>

        {/* into the light — warm spotlights in haze */}
        <motion.div
          style={{ opacity: gateOpacity, scale: gateScale, filter: gateFilter, transformOrigin: '42% 30%' }}
          className="absolute inset-0 will-change-transform"
        >
          <img
            src="/media/hero-inside.jpg"
            alt="Warm spotlights glowing through stage haze"
            className="h-full w-full object-cover"
            style={{ objectPosition: '42% 30%' }}
          />
        </motion.div>

        {/* vignette */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(5,5,5,0.6) 100%)' }}
        />

        {/* through-the-door flash + hard cut */}
        <motion.div
          style={{ opacity: flashOpacity, background: 'radial-gradient(circle at 50% 52%, #fff6e0 0%, #ffb763 34%, rgba(255,150,11,0.4) 68%, transparent 100%)' }}
          className="pointer-events-none absolute inset-0 z-20"
        />
        <motion.div style={{ opacity: cutOpacity }} className="pointer-events-none absolute inset-0 z-20 bg-ink" />

        {/* letterbox */}
        <motion.div style={{ height: barH }} className="absolute inset-x-0 top-0 z-30 bg-black" />
        <motion.div style={{ height: barH }} className="absolute inset-x-0 bottom-0 z-30 bg-black" />

        {/* headline — flies past the lens on scroll */}
        <motion.div
          style={{ pointerEvents: pe }}
          className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
        >
          <motion.div style={{ scale: logoScale, opacity: logoOpacity, filter: logoFilter }} className="will-change-transform">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={started ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.6 }}
              className="text-[10px] uppercase tracking-[0.5em] text-gold md:text-xs"
            >
              Event Design &amp; Production &mdash; Gulberg, Lahore
            </motion.p>

            <h1 className="mt-5 font-display font-light leading-[1.06] text-cream">
              <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
                <motion.span
                  className="block text-[11vw] sm:text-[8.5vw] md:text-[6vw]"
                  initial={{ y: '110%' }}
                  animate={started ? { y: '0%' } : {}}
                  transition={{ duration: 1.2, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                  Lahore celebrates.
                </motion.span>
              </span>
              <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
                <motion.span
                  className="block text-[11vw] sm:text-[8.5vw] md:text-[6vw]"
                  initial={{ y: '110%' }}
                  animate={started ? { y: '0%' } : {}}
                  transition={{ duration: 1.2, delay: 0.95, ease: [0.22, 1, 0.36, 1] }}
                >
                  We <em className="italic text-gold-soft">orchestrate</em>.
                </motion.span>
              </span>
            </h1>
          </motion.div>

          <motion.div style={{ opacity: uiOpacity, y: uiY, scale: uiScale }} className="flex flex-col items-center will-change-transform">
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={started ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 1.4 }}
              className="mt-6 max-w-md text-sm font-light leading-relaxed text-cream/70 md:max-w-xl md:text-base"
            >
              Weddings, corporate functions and private evenings &mdash; planned end to end
              by one team that has done it 450 times. You host. We handle the rest.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={started ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 1.6 }}
              className="mt-8 flex flex-col items-center gap-4 sm:flex-row"
            >
              <MagneticButton
                onClick={() => lenis?.scrollTo('#contact', { duration: 1.8 })}
                className="rounded-full bg-gold px-9 py-4 text-[12px] font-medium uppercase tracking-[0.25em] text-ink transition-transform duration-300 hover:scale-[1.03]"
              >
                Plan Your Event
              </MagneticButton>
              <MagneticButton
                onClick={() => lenis?.scrollTo('#portfolio', { duration: 1.8 })}
                className="rounded-full border border-cream/25 bg-white/5 px-9 py-4 text-[12px] uppercase tracking-[0.25em] text-cream backdrop-blur-md transition-colors duration-300 hover:border-gold hover:text-gold"
              >
                See Our Work
              </MagneticButton>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* approach instrumentation */}
        <motion.div
          style={{ opacity: approachO }}
          className="absolute bottom-[12vh] left-1/2 z-40 flex w-52 -translate-x-1/2 flex-col items-center gap-2"
        >
          <span className="text-[9px] uppercase tracking-[0.4em] text-cream/50">Approaching the gate</span>
          <div className="h-[2px] w-full bg-white/10">
            <motion.div style={{ width: approachW }} className="h-full bg-gold" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={started ? { opacity: 1 } : {}}
          transition={{ delay: 2.3, duration: 1 }}
          style={{ opacity: hintOpacity }}
          className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3"
        >
          <span className="text-[10px] uppercase tracking-[0.4em] text-cream/50">Scroll to enter</span>
          <div className="h-12 w-[1px] overflow-hidden bg-cream/15">
            <motion.div
              className="h-1/2 w-full bg-gold"
              animate={{ y: ['-100%', '250%'] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
