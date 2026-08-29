import { useRef, type MouseEvent, type TouchEvent } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const WORD = 'BARAKA';

/**
 * Full-width BARAKA wordmark: a fine hairline serif outline that lights
 * up gold where the cursor (or finger) passes, with a warm ember glow
 * that sits low against the baseline and a couple of slow smoke wisps
 * drifting up through it — like the word is lit from embers underneath
 * rather than lit evenly all over.
 *
 * The outline itself is a morphological SVG filter (dilate + blur)
 * rather than -webkit-text-stroke, so it fades into the background
 * instead of reading as a hard traced line.
 */
export default function NeonWordmark() {
  const ref = useRef<HTMLDivElement>(null);

  const mx = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 55, damping: 22, mass: 0.6 });

  const radiusTarget = useMotionValue(0);
  const radius = useSpring(radiusTarget, { stiffness: 55, damping: 22, mass: 0.6 });

  const setFromClientX = (clientX: number) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set(Math.min(1, Math.max(0, (clientX - rect.left) / rect.width)));
  };

  const onMove = (e: MouseEvent) => setFromClientX(e.clientX);

  const onLeave = () => {
    radiusTarget.set(0);
    mx.set(0.5);
  };

  const onTouchStart = (e: TouchEvent) => {
    const t = e.touches[0];
    if (!t) return;
    setFromClientX(t.clientX);
    radiusTarget.set(65);
  };

  const onTouchMove = (e: TouchEvent) => {
    const t = e.touches[0];
    if (!t) return;
    setFromClientX(t.clientX);
  };

  const onTouchEnd = () => {
    window.setTimeout(onLeave, 900);
  };

  // One mask spanning the full word — the glow sweeps continuously
  // across every letter and the gaps between them, instead of being
  // recomputed and clipped inside each letter's own box. Radii are in
  // vw (not %) because the masked box below is padded well beyond the
  // text's own bounds — a mask clips to its element's box regardless of
  // overflow:visible, so without that padding the glow's blur gets cut
  // off in a hard rectangle right at the glyph edges instead of fading.
  const maskImage = useTransform([sx, radius], (latest) => {
    const [xv, rv] = latest as [number, number];
    return `radial-gradient(ellipse ${rv}% ${rv * 0.45}vw at ${xv * 100}% 50%, black 25%, transparent 90%)`;
  });

  return (
    <div
      ref={ref}
      aria-hidden
      onMouseMove={onMove}
      onMouseEnter={() => radiusTarget.set(60)}
      onMouseLeave={onLeave}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="relative mt-16 w-full select-none overflow-visible px-[2vw]"
      style={{ touchAction: 'pan-y' }}
    >
      {/* invisible defs — the morphological outline filter used below */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden>
        <defs>
          <filter id="neon-outline-base" x="-40%" y="-40%" width="180%" height="180%">
            <feMorphology in="SourceAlpha" operator="dilate" radius="1" result="dilated" />
            <feComposite in="dilated" in2="SourceAlpha" operator="out" result="ring" />
            <feGaussianBlur in="ring" stdDeviation="1" result="softRing" />
            <feFlood floodColor="#ff960b" floodOpacity="0.6" result="color" />
            <feComposite in="color" in2="softRing" operator="in" result="outline" />
            <feMerge>
              <feMergeNode in="outline" />
            </feMerge>
          </filter>
          <filter id="neon-outline-lit" x="-30%" y="-30%" width="160%" height="160%">
            <feMorphology in="SourceAlpha" operator="dilate" radius="0.8" result="dilated" />
            <feComposite in="dilated" in2="SourceAlpha" operator="out" result="ring" />
            <feGaussianBlur in="ring" stdDeviation="1.2" result="softRing" />
            <feFlood floodColor="#ffb347" floodOpacity="0.85" result="color" />
            <feComposite in="color" in2="softRing" operator="in" result="outline" />
            <feGaussianBlur in="SourceAlpha" stdDeviation="10" result="blur1" />
            <feFlood floodColor="#ff960b" floodOpacity="0.5" result="glowColor1" />
            <feComposite in="glowColor1" in2="blur1" operator="in" result="glow1" />
            <feGaussianBlur in="SourceAlpha" stdDeviation="28" result="blur2" />
            <feFlood floodColor="#ff960b" floodOpacity="0.28" result="glowColor2" />
            <feComposite in="glowColor2" in2="blur2" operator="in" result="glow2" />
            <feMerge>
              <feMergeNode in="glow2" />
              <feMergeNode in="glow1" />
              <feMergeNode in="outline" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* ember glow — a warm light sitting low against the baseline, always on */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[6%] left-[8%] right-[8%] h-[45%] blur-[50px]"
        style={{
          background: 'radial-gradient(ellipse 60% 100% at 50% 100%, rgba(255,150,11,0.5) 0%, rgba(255,150,11,0.18) 45%, transparent 75%)',
          animation: 'ground-glow-pulse 5s ease-in-out infinite',
        }}
      />

      {/* smoke wisps — slow, faint, drifting up through the word */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-[4%] h-[70%] w-[22%] rounded-full blur-[26px]"
        style={{
          background: 'radial-gradient(circle, rgba(180,120,60,0.4) 0%, transparent 70%)',
          animation: 'smoke-drift-a 9s ease-in infinite',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-[38%] h-[60%] w-[18%] rounded-full blur-[22px]"
        style={{
          background: 'radial-gradient(circle, rgba(200,140,70,0.35) 0%, transparent 70%)',
          animation: 'smoke-drift-b 11s ease-in infinite 2.5s',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-[10%] h-[65%] w-[20%] rounded-full blur-[24px]"
        style={{
          background: 'radial-gradient(circle, rgba(190,130,65,0.35) 0%, transparent 70%)',
          animation: 'smoke-drift-a 10s ease-in infinite 5s',
        }}
      />

      {/* the sign */}
      <div className="relative flex items-baseline justify-between">
        {/* base — fine hairline outline, elegant serif */}
        {WORD.split('').map((ch, i) => (
          <span
            key={`base-${i}`}
            className="neon-base font-serif-display text-[19.5vw] font-normal leading-[0.82] tracking-[0.005em]"
          >
            {ch}
          </span>
        ))}

        {/* lit layer — single continuous spotlight mask over the whole word.
            Padded well beyond the text box (see maskImage comment above)
            so the glow has room to fade out instead of being clipped;
            the inner row is inset back by the same fixed amount so the
            letters still land exactly on top of the base layer. */}
        <motion.div
          aria-hidden
          style={{ WebkitMaskImage: maskImage, maskImage }}
          className="pointer-events-none absolute -inset-x-[6vw] -inset-y-[40vw]"
        >
          <div
            className="absolute flex items-baseline justify-between"
            style={{ top: '40vw', bottom: '40vw', left: '6vw', right: '6vw' }}
          >
            {WORD.split('').map((ch, i) => (
              <span
                key={`lit-${i}`}
                className="neon-lit font-serif-display text-[19.5vw] font-normal leading-[0.82] tracking-[0.005em]"
              >
                {ch}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
