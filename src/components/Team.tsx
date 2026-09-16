import RevealText from './RevealText';
import TeamCarousel3D from './TeamCarousel3D';

export default function Team() {
  return (
    <section id="team" data-scene="09 · PORTRAIT SERIES — THE ATELIER" className="relative overflow-hidden bg-ink py-20 md:py-40">
      {/* ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(230,197,138,0.16) 0%, transparent 65%)' }}
      />

      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:mb-14 md:flex-row md:items-end">
          <div>
            <p className="mb-4 text-[11px] uppercase tracking-[0.3em] text-champagne">The Atelier</p>
            <RevealText
              as="h2"
              text="The faces behind Baraka"
              className="font-display text-4xl font-light leading-[1.1] md:text-6xl"
              highlightWords={[2, 3]}
              highlightClass="accent-serif"
            />
          </div>
          <p className="max-w-sm text-sm font-light leading-relaxed text-mist md:text-right">
            A small team that works on every event together. Hover to pause the
            carousel, drag left or right to browse, or click a face to bring it forward.
          </p>
        </div>
      </div>

      {/* 3D team carousel */}
      <TeamCarousel3D />
    </section>
  );
}
