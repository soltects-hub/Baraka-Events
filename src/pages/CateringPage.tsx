import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import RevealText from '../components/RevealText';
import MagneticButton from '../components/MagneticButton';
import { useSectionNav } from '../lib/useSectionNav';
import { foodPackages, formatRs, lowestPrice, highestPrice, type FoodPackage } from '../lib/foodMenu';
import { whatsAppUrl } from '../lib/whatsapp';
import {
  useSEO,
  seoConfig,
  routes,
  generateServiceSchema,
  generateFAQSchema,
  generateBreadcrumbSchema,
  applyStructuredData,
  composeSchemaGraph,
} from '../seo';

const WHATSAPP = whatsAppUrl(
  'Assalam-o-Alaikum, I found Baraka Events through your website and would like to ask about catering for my event.'
);

const eventTypes = [
  {
    h: 'Wedding Catering',
    p: 'Pakistani wedding catering for the mehndi, baraat, nikkah and walima, cooked in our own kitchen and served by our own team.',
    link: { text: 'Wedding planning in Lahore', to: '/services/wedding-planning' },
  },
  {
    h: 'Corporate Catering',
    p: 'Food for annual dinners, conferences, launches and client evenings, with service timed around your running order.',
    link: { text: 'Corporate event management', to: '/services/corporate-events' },
  },
  {
    h: 'Private Event Catering',
    p: 'Birthdays, anniversaries, engagements and family gatherings, planned around your guest list.',
    link: { text: 'Birthday party planning', to: '/services/birthday-events' },
  },
];

const trust = [
  { value: '15+ Years', label: 'Of Experience' },
  { value: 'Own Kitchen', label: 'And Catering Team' },
  { value: String(foodPackages.length), label: 'Set Menu Packages' },
  { value: 'Flexible', label: 'Guest Count' },
];

const steps = [
  { h: 'Send us the basics', p: 'Your event type, date, location and approximate guest count.' },
  { h: 'Choose a direction', p: 'Tell us which menu interests you, or ask us to suggest one for your event.' },
  { h: 'Get your quote', p: 'We confirm availability and what your event needs, then send you a quote.' },
];

const priceRange = `${formatRs(lowestPrice)} to ${formatRs(highestPrice)}`;

// Figures come from src/lib/foodMenu.ts; the guest-count and kitchen answers are the owner's, confirmed 2026-11-06.
const faqs = [
  {
    q: 'Does Baraka Events have its own kitchen?',
    a: 'Yes. Baraka Events operates its own kitchen and catering team, so the food is prepared and served by our own people.',
  },
  {
    q: 'How much does catering cost per person in Lahore?',
    a: `Our Food Menu 2026–27 packages run from ${priceRange} per person, depending on the menu. Send us your guest count and requirements and we will confirm your quote.`,
  },
  {
    q: 'What is included in a catering package?',
    a: 'Every package includes the setup: carpet, round tables and banquet chairs, buffet stations, crockery, cutlery, waiters, lighting and a genset. Each menu below lists its exact inclusions.',
  },
  {
    q: 'What is not included?',
    a: 'Decor, DJ, diesel, heating and chilling, and the venue are not included in the food packages. We can plan decor and the wider event separately.',
  },
  {
    q: 'Is there a minimum guest count?',
    a: 'We do not have one fixed minimum. Guest count is flexible, so tell us your numbers and event requirements and we will tell you what is possible.',
  },
  {
    q: 'Do you cater corporate events?',
    a: 'Yes. Tell us the event type, date, location and expected headcount, and we will plan the food around your running order.',
  },
  {
    q: 'How far in advance should we book catering?',
    a: 'It depends on the type of event, your date and availability. Dates in wedding season, from October to March, fill first, so send us your date and we will confirm.',
  },
  {
    q: 'Can you work with our own caterer instead?',
    a: 'Yes. If your family already has a caterer you trust, we can plan and manage the event around them.',
  },
];

const menuGroups = [
  {
    h: 'Main-Dish Menus',
    p: 'Built around a main dish, with a choice of sweet dish and a variety of naan.',
    items: foodPackages.filter((m) => m.sections),
  },
  {
    h: 'Full Spreads',
    p: 'Fuller menus that begin with hot and sour soup and continue through mains, salads, naan and dessert.',
    items: foodPackages.filter((m) => m.dishes),
  },
];

const label = 'text-[11px] font-medium uppercase tracking-[0.2em] text-champagne';

/** Dishes exactly as the printed menu has them; the wording is not tidied here. */
function MenuBody({ pkg }: { pkg: FoodPackage }) {
  return (
    <div className="space-y-4 text-sm font-light leading-relaxed text-mist">
      {pkg.sections?.map((s) => (
        <div key={s.label}>
          <p className={label}>{s.label}</p>
          <p className="mt-1 whitespace-pre-line">{s.text}</p>
        </div>
      ))}
      {pkg.dishes && (
        <ul className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
          {pkg.dishes.map((d) => (
            <li key={d.name}>
              {d.name}
              {d.detail ? ` ${d.detail}` : ''}
            </li>
          ))}
        </ul>
      )}
      <div>
        <p className={label}>Included</p>
        <p className="mt-1">{pkg.included}</p>
      </div>
      <div>
        <p className={label}>Excluded</p>
        <p className="mt-1">{pkg.excluded}</p>
      </div>
      <a
        href={whatsAppUrl(
          `Assalam-o-Alaikum, I found Baraka Events through your website and would like to know more about Menu ${pkg.number} (${formatRs(pkg.pricePerPerson)}/person) for my event.`
        )}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => window.gtag?.('event', 'contact_click', { method: 'whatsapp', location: 'catering_menu', menu: pkg.number })}
        className="gold-underline inline-block py-2 text-gold hover:text-gold-soft"
      >
        Ask about Menu {pkg.number} on WhatsApp
      </a>
    </div>
  );
}

export default function CateringPage() {
  const go = useSectionNav();

  useSEO({
    title: 'Catering Services in Lahore | Baraka Events',
    description: `Wedding, corporate and event catering in Lahore from our own kitchen and team. Eight food menu packages from ${formatRs(lowestPrice)} per person.`,
    canonical: routes.catering,
    image: '/media/catering-buffet.webp',
    imageAlt: 'Buffet of silver chafing dishes on a garden table at a Baraka Events catering set-up',
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    applyStructuredData(
      composeSchemaGraph([
        {
          ...generateServiceSchema({
            name: 'Catering Services in Lahore',
            description: `Wedding, corporate and event catering in Lahore from Baraka Events' own kitchen and catering team.`,
            url: routes.catering,
          }),
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Food Menu 2026–27',
            itemListElement: foodPackages.map((m) => ({
              '@type': 'Offer',
              name: `Menu ${m.number}`,
              priceSpecification: {
                '@type': 'UnitPriceSpecification',
                price: m.pricePerPerson,
                priceCurrency: 'PKR',
                unitText: 'per person',
              },
            })),
          },
        },
        generateFAQSchema(faqs),
        generateBreadcrumbSchema([
          { name: 'Home', url: seoConfig.site.url },
          { name: 'Catering', url: `${seoConfig.site.url}${routes.catering}` },
        ]),
      ])
    );
  }, []);

  const track = (method: string, location: string) => () => window.gtag?.('event', 'contact_click', { method, location });

  return (
    <main className="bg-ink">
      {/* header */}
      <section className="relative overflow-hidden pt-36 pb-16 md:pt-44 md:pb-20">
        <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-6 md:px-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-4 text-[11px] uppercase tracking-[0.3em] text-champagne"
            >
              The Baraka Kitchen
            </motion.p>
            <RevealText
              as="h1"
              text="Catering Services in Lahore"
              className="font-display text-4xl font-light leading-[1.08] sm:text-5xl md:text-7xl"
            />
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35 }}
              className="mt-6 max-w-2xl text-sm font-light leading-relaxed text-mist md:text-base"
            >
              Baraka Events provides wedding, corporate and private event catering in Lahore from our own kitchen, prepared and
              served by our own catering team. Our Food Menu 2026&ndash;27 has {foodPackages.length} set packages from {priceRange}{' '}
              per person, and guest count is flexible.
            </motion.p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <MagneticButton href={WHATSAPP} onClick={track('whatsapp', 'catering_top')}>
                WhatsApp Us
              </MagneticButton>
              <MagneticButton variant="ghost" href="tel:+923139999039" onClick={track('call', 'catering_top')}>
                Call Now
              </MagneticButton>
            </div>
          </div>
          <img
            src="/media/catering-buffet.webp"
            srcSet="/media/catering-buffet-640.webp 640w, /media/catering-buffet.webp 1200w"
            sizes="(min-width: 1024px) 40vw, calc(100vw - 48px)"
            alt="Buffet of silver chafing dishes on a garden table at a Baraka Events catering set-up"
            width={1200}
            height={1799}
            fetchPriority="high"
            className="max-h-[560px] w-full rounded-md object-cover"
          />
        </div>
      </section>

      {/* trust */}
      <section className="mx-auto max-w-[1200px] px-6 pb-16 md:px-10">
        <dl className="grid grid-cols-2 gap-8 border-y border-champagne/10 py-10 md:grid-cols-4">
          {trust.map((t) => (
            <div key={t.label}>
              <dt className="sr-only">{t.label}</dt>
              <dd>
                <span className="block font-display text-2xl font-light text-champagne md:text-3xl">{t.value}</span>
                <span className="mt-1 block text-[11px] uppercase tracking-[0.2em] text-mist">{t.label}</span>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* what we cater */}
      <section className="mx-auto max-w-[1200px] px-6 pb-20 md:px-10">
        <h2 className="max-w-3xl font-display text-2xl font-light md:text-4xl">Wedding, corporate and event catering in Lahore</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {eventTypes.map((e) => (
            <div key={e.h} className="plate rounded-sm p-7">
              <h3 className="font-display text-xl font-light text-gold-soft">{e.h}</h3>
              <p className="mt-3 text-sm font-light leading-relaxed text-mist">{e.p}</p>
              <Link to={e.link.to} className="gold-underline mt-4 inline-block py-1 text-sm text-gold hover:text-gold-soft">
                {e.link.text}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* menus */}
      <section className="mx-auto max-w-[1000px] px-6 pb-20 md:px-10">
        <h2 className="font-display text-2xl font-light md:text-4xl">Wedding food menu: Food Menu 2026&ndash;27</h2>
        <p className="mt-4 max-w-2xl text-sm font-light leading-relaxed text-mist md:text-base">
          {foodPackages.length} set packages, listed exactly as printed. Prices are per person. Guest count is flexible, so send us
          your numbers and requirements and we will confirm your quote.
        </p>
        <div className="mt-10 space-y-12">
          {menuGroups.map((g) => (
            <div key={g.h}>
              <h3 className="font-display text-xl font-light text-gold-soft md:text-2xl">{g.h}</h3>
              <p className="mt-2 text-sm font-light text-mist">{g.p}</p>
              <div className="mt-5 space-y-3">
                {g.items.map((m) => (
                  <details key={m.number} className="plate group rounded-sm" open={m.number === 1 || m.number === 4}>
                    <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-4 px-6 py-4">
                      <span className="font-display text-lg font-light text-ivory">Menu {m.number}</span>
                      <span className="flex items-center gap-3 text-sm text-champagne">
                        {formatRs(m.pricePerPerson)} <span className="text-mist">per person</span>
                        <span aria-hidden className="transition-transform duration-300 group-open:rotate-180">
                          &#8964;
                        </span>
                      </span>
                    </summary>
                    <div className="px-6 pb-6">
                      <MenuBody pkg={m} />
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* photographs + kitchen */}
      <section className="mx-auto max-w-[1200px] px-6 pb-20 md:px-10">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <img
            src="/media/catering-food.webp"
            srcSet="/media/catering-food-640.webp 640w, /media/catering-food.webp 1200w"
            sizes="(min-width: 1024px) 45vw, calc(100vw - 48px)"
            alt="Whole roast on rice in a silver chafing dish at a Baraka Events buffet"
            width={1200}
            height={1799}
            loading="lazy"
            className="max-h-[560px] w-full rounded-md object-cover"
          />
          <div>
            <h2 className="font-display text-2xl font-light md:text-4xl">Our own kitchen, our own team</h2>
            <div className="mt-5 space-y-4 text-sm font-light leading-relaxed text-mist md:text-base">
              <p>
                With 15+ years of experience, Baraka Events prepares and serves food through its own kitchen and catering team.
                You are not being passed to a third party for the most important part of the evening.
              </p>
              <p>
                When we also plan your event, the food is part of the same plan as the decor and the running order, and our
                founder personally manages the event, supported by our team. Meal service is timed so it does not compete with
                stage moments or speeches.
              </p>
              <p>
                Planning a wedding? See our{' '}
                <Link to="/services/wedding-planning" className="gold-underline text-gold hover:text-gold-soft">
                  wedding planning
                </Link>{' '}
                and{' '}
                <Link to="/services/walima-events" className="gold-underline text-gold hover:text-gold-soft">
                  walima planning
                </Link>{' '}
                pages, or read our{' '}
                <Link to="/blog/luxury-event-catering-menu-lahore" className="gold-underline text-gold hover:text-gold-soft">
                  wedding catering guide
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* how to enquire */}
      <section className="mx-auto max-w-[1200px] px-6 pb-20 md:px-10">
        <h2 className="font-display text-2xl font-light md:text-4xl">How to get a catering quote</h2>
        <ol className="mt-8 grid gap-8 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.h}>
              <span aria-hidden className="accent-serif text-2xl text-champagne">
                {i + 1}
              </span>
              <h3 className="mt-2 font-display text-lg font-light text-gold-soft">{s.h}</h3>
              <p className="mt-1.5 text-sm font-light leading-relaxed text-mist">{s.p}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* FAQs */}
      <section className="mx-auto max-w-[900px] px-6 pb-20 md:px-10">
        <h2 className="font-display text-2xl font-light md:text-4xl">Catering questions</h2>
        <div className="mt-8 space-y-6">
          {faqs.map((f) => (
            <div key={f.q}>
              <h3 className="font-display text-base font-light md:text-lg">{f.q}</h3>
              <p className="mt-1.5 text-sm font-light leading-relaxed text-mist">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-[1200px] px-6 pb-24 text-center md:px-10 md:pb-32">
        <RevealText as="h2" text="Tell us about your event." className="font-display text-3xl font-light md:text-5xl" />
        <p className="mx-auto mt-4 max-w-md text-sm font-light leading-relaxed text-mist">
          Send your event type, date, location and guest count, and we will take it from there.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <MagneticButton onClick={() => go('/contact?need=catering')}>Get a Catering Quote</MagneticButton>
          <MagneticButton variant="ghost" href={WHATSAPP} onClick={track('whatsapp', 'catering_end')}>
            WhatsApp Us
          </MagneticButton>
        </div>
      </section>
    </main>
  );
}
