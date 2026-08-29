import RevealText from './RevealText';
import TeamCarousel3D from './TeamCarousel3D';

export default function Team() {
  return (
    <section id="team" data-scene="09 · PORTRAIT SERIES — THE ATELIER" className="relative overflow-hidden bg-ink py-28 md:py-40">
      {/* ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full opacity-15 blur-[130px]"
        style={{ background: 'radial-gradient(circle, #ff960b 0%, transparent 65%)' }}
      />

      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:mb-14 md:flex-row md:items-end">
          <div>
            <p className="mb-4 text-[11px] uppercase tracking-[0.45em] text-gold">The Atelier</p>
            <RevealText
              as="h2"
              text="The faces behind Baraka"
              className="font-display text-4xl font-light leading-[1.1] md:text-6xl"
            />
          </div>
          <p className="max-w-sm text-sm font-light leading-relaxed text-cream/60 md:text-right">
            A small team that works on every event together. Hover to pause the
            carousel, or click a face to bring it forward.
          </p>
        </div>
      </div>

      {/* 3D team carousel */}
      <TeamCarousel3D />
    </section>
  );
}
