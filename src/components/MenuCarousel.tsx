import RevealText from './RevealText';
import LoopRail from './LoopRail';

interface MenuCard {
  index: string;
  title: string;
  urdu: string;
  items: { name: string; desc: string }[];
  image: string;
  accent: string;
}

const menu: MenuCard[] = [
  {
    index: '01',
    title: 'Live BBQ Station',
    urdu: 'Angeethi',
    image: '/media/bbq-station.webp',
    accent: 'Charcoal-fired, carved to order',
    items: [
      { name: 'Seekh Kebab', desc: 'Hand-minced beef, charred over coals' },
      { name: 'Chicken Malai Boti', desc: 'Cream-marinated, saffron glaze' },
      { name: 'Mutton Chops', desc: 'Spiced rack, mint chutney' },
      { name: 'Fish Tikka', desc: 'River sole, ajwain crust' },
    ],
  },
  {
    index: '02',
    title: 'The Grand Mains',
    urdu: 'Khaas Khaanay',
    image: '/media/grand-mains.webp',
    accent: 'The heart of every shaadi dastarkhwan',
    items: [
      { name: 'Mutton Qorma', desc: 'Slow-cooked in desi ghee, shahi style' },
      { name: 'Chicken Biryani', desc: 'Sindhi-spiced, sella rice, aloo' },
      { name: 'Beef Nihari', desc: 'Overnight simmer, bone marrow' },
      { name: 'Butter Chicken Karahi', desc: 'Lahori-style, wood-fired' },
    ],
  },
  {
    index: '03',
    title: 'Continental & Fusion',
    urdu: 'Jadeed Zaiqay',
    image: '/media/continental-fusion.webp',
    accent: 'For the modern mehmaan',
    items: [
      { name: 'Herb-Crusted Chicken Roast', desc: 'Rosemary jus, roast vegetables' },
      { name: 'Penne Alfredo Live Station', desc: 'Tossed to order, parmesan' },
      { name: 'Thai Green Curry', desc: 'Jasmine rice, fresh basil' },
      { name: 'Mongolian Beef Stir-Fry', desc: 'Live wok station' },
    ],
  },
  {
    index: '04',
    title: 'Desserts & Mithai',
    urdu: 'Meethas',
    image: '/media/desserts-mithai.webp',
    accent: 'The sweetest farewell',
    items: [
      { name: 'Shahi Kheer', desc: 'Clay-pot rice pudding, pistachio' },
      { name: 'Gulab Jamun Flamb\u00e9', desc: 'Served warm, live counter' },
      { name: 'Gajar ka Halwa', desc: 'Winter special, khoya rich' },
      { name: 'Molten Chocolate Fountain', desc: 'Fresh fruit & marshmallow' },
    ],
  },
  {
    index: '05',
    title: 'Chai & Beverages',
    urdu: 'Mashroobat',
    image: '/media/gallery-4.webp',
    accent: 'From doodh patti to mocktails',
    items: [
      { name: 'Kashmiri Chai Station', desc: 'Pink tea, crushed pistachio' },
      { name: 'Doodh Patti', desc: 'Karak, served in clay cups' },
      { name: 'Fresh Juice Bar', desc: 'Seasonal — anaar, mausambi, mango' },
      { name: 'Signature Mocktails', desc: 'Falsa fizz, peach iced tea' },
    ],
  },
];

export default function MenuCarousel() {
  return (
    <section id="menu" data-scene="07A · TASTING MENU — THE DASTARKHWAN" className="relative overflow-hidden bg-ink-2 py-28 md:py-36">
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 h-[400px] w-[700px] rounded-full opacity-10 blur-[130px]"
        style={{ background: 'radial-gradient(circle, #ff960b 0%, transparent 65%)' }}
      />

      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="mb-14 flex flex-col items-start justify-between gap-6 md:mb-16 md:flex-row md:items-end">
          <div>
            <p className="mb-4 text-[11px] uppercase tracking-[0.45em] text-gold">The Baraka Kitchen</p>
            <RevealText
              as="h2"
              text="A dastarkhwan worth remembering"
              className="font-display text-4xl font-light leading-[1.1] md:text-6xl"
            />
          </div>
          <div className="flex flex-col items-start gap-3 md:items-end">
            <p className="max-w-sm text-sm font-light leading-relaxed text-cream/60 md:text-right">
              Our signature catering menus, always in motion &mdash; hover to pause, drag to browse.
            </p>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-cream/60">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-gold" strokeWidth="1.5">
                <path d="M7 11.5V6a1.5 1.5 0 0 1 3 0v4.5M10 10.5V5a1.5 1.5 0 0 1 3 0v5.5M13 10.5V6a1.5 1.5 0 0 1 3 0v6.5c0 3.5-2 5.5-5 5.5s-4.5-1.5-5.5-4L4.2 11a1.4 1.4 0 0 1 2.4-1.4l1.4 2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Drag to explore
            </div>
          </div>
        </div>
      </div>

      {/* auto-looping menu rail */}
      <div className="px-6 md:px-10">
        <LoopRail speed={50}>
          {menu.map((card) => (
            <article
              key={card.index}
              className="group relative w-[82vw] shrink-0 select-none overflow-hidden rounded-sm border border-white/8 bg-ink sm:w-[420px]"
            >
              {/* image header */}
              <div className="relative h-44 overflow-hidden md:h-52">
                <img
                  src={card.image}
                  alt={card.title}
                  draggable={false}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
                <span className="absolute left-5 top-5 rounded-full border border-gold/40 bg-ink/50 px-4 py-1.5 font-display text-sm italic text-gold backdrop-blur-md">
                  {card.index}
                </span>
                <div className="absolute bottom-4 left-5 right-5">
                  <p className="text-[10px] uppercase tracking-[0.35em] text-gold">{card.urdu}</p>
                  <h3 className="font-display text-2xl font-light md:text-3xl">{card.title}</h3>
                </div>
              </div>

              {/* items */}
              <div className="p-6 md:p-7">
                <p className="mb-5 font-display text-sm italic text-gold-soft">{card.accent}</p>
                <ul className="space-y-4">
                  {card.items.map((it) => (
                    <li key={it.name} className="flex items-baseline justify-between gap-3 border-b border-dotted border-white/10 pb-3">
                      <div>
                        <p className="text-sm font-medium tracking-wide text-cream">{it.name}</p>
                        <p className="mt-0.5 text-xs font-light text-cream/50">{it.desc}</p>
                      </div>
                      <span className="h-1 w-1 shrink-0 rotate-45 bg-gold/50" />
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </LoopRail>
      </div>

      <p className="mt-10 px-6 text-center text-[10px] uppercase tracking-[0.3em] text-cream/60">
        Full tasting sessions arranged at your consultation &middot; custom menus for every function
      </p>
    </section>
  );
}
