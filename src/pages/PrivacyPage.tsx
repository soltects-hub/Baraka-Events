import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSEO, seoConfig, routes, generateBreadcrumbSchema, applyStructuredData, composeSchemaGraph } from '../seo';

const sections = [
  {
    h: 'What we collect',
    p: [
      'When you contact us, we receive the details you choose to share: your name, phone number, email address, event type, date, location, guest count and any message you write.',
      'If you use the enquiry form, your details open in WhatsApp and reach us only when you press send. Messages you send through WhatsApp are also handled under WhatsApp’s own terms.',
    ],
  },
  {
    h: 'How we use your details',
    p: ['We use your details to reply to your enquiry, prepare a proposal or quote, and plan and manage your event.'],
  },
  {
    h: 'Analytics and advertising',
    p: [
      'This website uses Google Analytics, Google Tag Manager, Google Ads and Metricool to understand how the site is used and to measure our advertising. These tools may use cookies or similar technology, and they load after your first interaction with a page.',
      'The location map on our contact section is provided by Google Maps. Links to WhatsApp, Facebook, Instagram and YouTube take you to those services, which have their own privacy policies.',
    ],
  },
  {
    h: 'Your choices',
    p: [
      'You can ask us what details we hold about you, or ask us to correct or remove them. You can also block cookies in your browser settings.',
    ],
  },
];

export default function PrivacyPage() {
  useSEO({
    title: 'Privacy Policy | Baraka Events',
    description: 'How Baraka Events handles the details you share through our website, WhatsApp and phone, and the analytics and advertising tools this site uses.',
    canonical: routes.privacy,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    applyStructuredData(
      composeSchemaGraph([
        generateBreadcrumbSchema([
          { name: 'Home', url: seoConfig.site.url },
          { name: 'Privacy Policy', url: `${seoConfig.site.url}${routes.privacy}` },
        ]),
      ])
    );
  }, []);

  return (
    <main className="bg-ink">
      <article className="mx-auto max-w-[800px] px-6 pt-36 pb-24 md:px-10 md:pt-44 md:pb-32">
        <h1 className="font-display text-4xl font-light leading-[1.1] md:text-6xl">Privacy Policy</h1>
        <p className="mt-4 text-sm font-light text-mist">Last updated 6 November 2026</p>
        <div className="mt-10 space-y-9">
          {sections.map((s) => (
            <section key={s.h}>
              <h2 className="font-display text-xl font-light md:text-2xl">{s.h}</h2>
              <div className="mt-3 space-y-3 text-sm font-light leading-relaxed text-mist md:text-base">
                {s.p.map((t) => (
                  <p key={t.slice(0, 24)}>{t}</p>
                ))}
              </div>
            </section>
          ))}
          <section>
            <h2 className="font-display text-xl font-light md:text-2xl">Contact us</h2>
            <p className="mt-3 text-sm font-light leading-relaxed text-mist md:text-base">
              For any privacy question, email{' '}
              <a href={`mailto:${seoConfig.organization.contact.email}`} className="gold-underline text-gold hover:text-gold-soft">
                {seoConfig.organization.contact.email}
              </a>{' '}
              or use our{' '}
              <Link to="/contact" className="gold-underline text-gold hover:text-gold-soft">
                contact page
              </Link>
              .
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
