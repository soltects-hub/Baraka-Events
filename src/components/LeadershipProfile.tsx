import { useRef } from 'react';
import { m, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import RevealText from './RevealText';
import { members } from '../lib/team';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * Single-leadership profile — replaces the old multi-card TeamCarousel3D
 * now that the team is one person. A carousel (drag/swipe/arrows to browse
 * "other" cards) has nothing to browse to with a single member, so this is
 * a purpose-built editorial portrait layout instead of a one-card carousel.
 */
export default function LeadershipProfile() {
  const leader = members[0];
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <div
      ref={ref}
      className="relative mx-auto grid max-w-[1100px] gap-12 px-6 md:grid-cols-[0.85fr_1fr] md:items-center md:gap-16 md:px-10"
    >
      {/* ambient glow, matching the section's existing accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[480px] w-[min(820px,100vw)] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(230,197,138,0.16) 0%, transparent 65%)' }}
      />

      {/* portrait */}
      <m.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 0.9, ease: EASE }}
        className="relative mx-auto w-full max-w-[380px] md:max-w-none"
      >
        <div className="relative overflow-hidden rounded-md border border-champagne/15 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.85)]">
          <m.img
            style={reduceMotion ? undefined : { y: imgY }}
            src={leader.image}
            alt={`${leader.name}, ${leader.role} of Baraka Events`}
            className="aspect-[4/5] w-full scale-110 object-cover"
            loading="lazy"
          />
          <div aria-hidden className="vignette pointer-events-none absolute inset-0 opacity-70" />
        </div>
        <div aria-hidden className="absolute -left-5 -top-5 hidden h-20 w-20 border-l border-t border-champagne/40 md:block" />
        <div aria-hidden className="absolute -bottom-5 -right-5 hidden h-20 w-20 border-b border-r border-champagne/40 md:block" />
      </m.div>

      {/* hierarchy: name -> role, company -> bio */}
      <div className="relative text-center md:text-left">
        <m.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-[11px] uppercase tracking-[0.3em] text-champagne"
        >
          Founder &amp; Chief Executive
        </m.p>

        <RevealText
          as="h3"
          text={leader.name}
          className="mt-4 font-display text-4xl font-light uppercase leading-[1.05] tracking-wide md:text-6xl"
        />

        <m.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
          className="mt-3 text-[12px] uppercase tracking-[0.25em] text-mist-dim"
        >
          {leader.role} &middot; Baraka Events
        </m.p>

        <m.span
          aria-hidden
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 1, delay: 0.3, ease: EASE }}
          className="hairline-flame mx-auto mt-6 block h-px w-14 origin-left md:mx-0"
        />

        <m.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
          className="mx-auto mt-6 max-w-md text-[15px] font-light leading-relaxed text-mist md:mx-0 md:text-base"
        >
          {leader.bio}
        </m.p>
      </div>
    </div>
  );
}
