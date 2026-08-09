import RevealText from './RevealText';
import LoopRail from './LoopRail';

const members = [
  {
    name: 'Malik Bilal',
    role: 'CEO & Founder',
    image: '/media/team-bilal.jpg',
    bio: 'The vision behind the house. Bilal founded Baraka to bring cinematic precision to Lahore\u2019s grandest occasions \u2014 and still signs off every production personally.',
  },
  {
    name: 'Abdul Samad',
    role: 'Marketing Team Head',
    image: '/media/team-samad.jpg',
    bio: 'The storyteller of the atelier. Samad leads the brand and client experience \u2014 ensuring every Baraka event is felt long before the first guest arrives.',
  },
  {
    name: 'Noman Khan',
    role: 'Digital Marketer',
    image: '/media/team-noman.jpg',
    bio: 'The signal in the noise. Noman crafts Baraka\u2019s digital presence \u2014 from campaign film rollouts to the reels your guests share at midnight.',
  },
  {
    name: 'Aqsa',
    role: 'Event Operator Head',
    image: '/media/team-aqsa.jpg',
    bio: 'The conductor on the ground. Aqsa commands every load-in, cue and contingency \u2014 so the night unfolds without a single visible seam.',
  },
  {
    name: 'Ayesha',
    role: 'Client Relations & Event Coordinator',
    image: '/media/team-ayesha.jpg',
    bio: 'Your first call and your calmest voice. Ayesha walks every family through the journey \u2014 from first consultation to the final rukhsati.',
  },
];

const comingSoon = [{ role: 'Creative Director', n: '06' }];

export default function Team() {
  return (
    <section id="team" data-scene="09 \u00b7 PORTRAIT SERIES \u2014 THE ATELIER" className="relative overflow-hidden bg-ink py-28 md:py-40">
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
            A small, obsessive team. The rail drifts on its own &mdash; hover to pause,
            drag to explore by hand.
          </p>
        </div>
      </div>

      {/* auto-looping portrait rail */}
      <div className="px-6 md:px-10">
        <LoopRail speed={40}>
          {members.map((m, i) => (
            <article
              key={m.name}
              className="group relative w-[74vw] shrink-0 select-none sm:w-[340px] md:w-[360px]"
            >
              <div className="relative overflow-hidden rounded-sm">
                <img
                  src={m.image}
                  alt={`${m.name} \u2014 ${m.role} at Baraka Events`}
                  loading="lazy"
                  draggable={false}
                  className="aspect-[3/4] w-full object-cover grayscale-0 transition-all duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] lg:grayscale-[0.35] lg:group-hover:grayscale-0"
                />
                <div className="pointer-events-none absolute inset-0 bg-gold/10 mix-blend-overlay" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent" />

                <div className="absolute right-5 top-5 rounded-full border border-white/15 bg-ink/40 px-3.5 py-1 font-display text-sm italic text-gold backdrop-blur-md">
                  {String(i + 1).padStart(2, '0')}
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-7">
                  <p className="mb-1.5 text-[10px] uppercase tracking-[0.35em] text-gold">{m.role}</p>
                  <h3 className="font-display text-2xl font-light md:text-3xl">{m.name}</h3>
                  <p className="mt-3 max-h-40 overflow-hidden text-[13px] font-light leading-relaxed text-cream/70 opacity-100 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] lg:max-h-0 lg:opacity-0 lg:group-hover:max-h-40 lg:group-hover:opacity-100">
                    {m.bio}
                  </p>
                </div>

                <div className="pointer-events-none absolute inset-3 border border-gold/0 transition-colors duration-700 group-hover:border-gold/35" />
              </div>
            </article>
          ))}

          {comingSoon.map((c) => (
            <div
              key={c.n}
              className="relative flex w-[74vw] shrink-0 select-none flex-col items-center justify-center overflow-hidden rounded-sm border border-dashed border-white/12 bg-ink-2/60 sm:w-[340px] md:w-[360px]"
              style={{ aspectRatio: '3/4' }}
            >
              <span className="font-display text-lg italic text-gold/60">{c.n}</span>
              <p className="mt-3 text-[10px] uppercase tracking-[0.35em] text-cream/45">{c.role}</p>
              <p className="mt-2 font-display text-xl italic text-cream/35">Announcing soon</p>
              <div className="mt-5 h-[1px] w-10 bg-gold/30" />
            </div>
          ))}
        </LoopRail>
      </div>
    </section>
  );
}
