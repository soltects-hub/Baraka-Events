import { type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import '../../design/lightsUp.css';
import { useSEO } from '../../seo';
import { seoConfig } from '../../seo/seoConfig';
import { photos } from '../../design/photos';
import { whatsappHref, telHref, phoneDisplay } from '../../design/contact';
import {
  Button,
  Img,
  Label,
  LuHeader,
  ParallaxPair,
  QAList,
  Rail,
  RevealHeading,
  Rise,
  ServiceCard,
  Transformation,
  VideoSlot,
} from '../../design/components';
import { faqs } from '../../lib/faqs';
import { foodPackages, formatRs, lowestPrice, highestPrice } from '../../lib/foodMenu';
import { steps } from '../../lib/processSteps';
import { testimonials } from '../../lib/testimonials';

/**
 * /design-system/homepage — the approved 8-scene homepage concept as a prototype (Phase A, 17 Nov 2026).
 * Real copy from the site's own data (FAQs, food menu, process steps, Google reviews) and verified gallery photos.
 * The live homepage is unchanged; when the concept is built (Phase B), every section's content and every link of
 * today's homepage is kept or moved to its own page, never dropped.
 */

const scene = (n: string, name: string) => (
  <Label cue>
    Scene {n} · {name}
  </Label>
);

const caseRail = [photos.mehndiCeiling, photos.baraatCanopy, photos.walimaArch, photos.corporateBallroom, photos.mehndiLanterns, photos.qawaliSeating];

export default function HomeConceptPage() {
  useSEO({
    title: 'Homepage concept (Phase A prototype) | Baraka Events',
    description: 'Internal review page: the eight-scene homepage concept for the Baraka Events redesign.',
    canonical: '/design-system/homepage',
    noindex: true,
  });
  const homeFaqs = faqs.slice(0, 6).map((f) => ({ q: f.q, a: f.a, topic: f.related?.[0]?.text, href: f.related?.[0]?.to }));
  const a = seoConfig.organization.address;

  return (
    <div className="lu has-actionbar">
      <LuHeader logo="/media/logo.png" />
      <main>
        {/* 01 — Arrival */}
        <section className="lu-hero" aria-labelledby="concept-h1">
          <div className="media">
            <Img photo={photos.mehndiFloor} priority sizes="100vw" />
          </div>
          <div className="scrim" aria-hidden />
          <div className="lu-wrap content lu-stack" style={{ '--gap': '26px' } as CSSProperties}>
            {scene('01', 'Arrival · lights up')}
            <h1 id="concept-h1" className="lu-h1" style={{ maxWidth: '12ch' }}>
              Event Planners in Lahore.
            </h1>
            <p className="lu-lede" style={{ color: 'var(--lu-ivory)', opacity: 0.88 }}>
              Weddings, corporate events and private celebrations, planned and run by one team in Gulberg III, with catering from our own kitchen.
            </p>
            <div className="lu-row">
              <Button href={whatsappHref} variant="cue">
                WhatsApp us
              </Button>
              <Button href="#work">See the work</Button>
            </div>
            <div className="lu-row" style={{ justifyContent: 'space-between', alignItems: 'end', gap: 20 }}>
              <span className="lu-scrollcue" aria-hidden />
              <p className="lu-dim" style={{ fontSize: 12.5, maxWidth: '46ch', textAlign: 'right' }}>
                Photo: real Baraka mehndi. This becomes a muted showreel (with a pause button) once verified footage is supplied.
              </p>
            </div>
          </div>
        </section>

        {/* 02 — What are you planning? */}
        <section className="lu-section char-1">
          <div className="lu-wrap lu-stack" style={{ '--gap': '44px' } as CSSProperties}>
            <div className="lu-split" style={{ alignItems: 'end' }}>
              <div>
                {scene('02', 'What are you planning?')}
                <RevealHeading className="lu-h2" lines={['One team for every', 'part of the evening.']} />
              </div>
              <p className="lu-lede">Choose where to start. Each card leads to its own page with the questions families ask about it.</p>
            </div>
            <div className="lu-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))' }}>
              <ServiceCard photo={photos.walimaStage} index="01" label="Weddings" title="Mehndi to Walima" line="Every function, one team." to="/services/wedding-planning" />
              <ServiceCard photo={photos.corporateHall} index="02" label="Corporate" title="Launches and conferences" line="Stage, AV, run of show." to="/services/corporate-events" />
              <ServiceCard photo={photos.bachelorette} index="03" label="Private" title="Birthdays and parties" line="Home, rooftop or venue." to="/services/birthday-events" />
              <ServiceCard photo={photos.mehndiCeiling} index="04" label="Décor" title="Design and décor" line="Approved before anything is booked." to="/services/event-decoration" />
              <ServiceCard photo={photos.cateringCounter} index="05" label="Catering" title="The Baraka kitchen" line={`${foodPackages.length} menus, ${formatRs(lowestPrice)}–${formatRs(highestPrice).replace('Rs. ', '')}.`} to="/catering" />
            </div>
          </div>
        </section>

        {/* 03 — The transformation */}
        <section className="lu-section">
          <div className="lu-wrap lu-stack" style={{ '--gap': '40px' } as CSSProperties}>
            <div className="lu-split" style={{ alignItems: 'end' }}>
              <div>
                {scene('03', 'The transformation')}
                <RevealHeading className="lu-h2" lines={['From an empty hall', 'to the room you imagined.']} />
              </div>
              <p className="lu-lede">The signature chapter: a pinned, scroll-driven reveal on desktop, a drag on phones. It needs real before and after photos and a timelapse.</p>
            </div>
            <Transformation photo={photos.baraatLounge} ratio="16 / 7.5" />
            <VideoSlot title="Décor transformation timelapse" needs="Needs real footage: a fixed camera from empty hall to finished set-up, at one or two events." poster={photos.mehndiLanterns} ratio="21 / 9" />
          </div>
        </section>

        {/* 04 — Real events */}
        <section className="lu-section char-1" id="work" style={{ scrollMarginTop: 80 }}>
          <div className="lu-wrap lu-stack" style={{ '--gap': '40px' } as CSSProperties}>
            <div className="lu-split" style={{ alignItems: 'end' }}>
              <div>
                {scene('04', 'Real events')}
                <RevealHeading className="lu-h2" lines={['Real events,', 'told properly.']} />
              </div>
              <p className="lu-lede">Each card becomes a case study: the brief, the venue, the guests, what we built, and the night. Until you choose the events, the rail shows verified gallery photos with their real captions.</p>
            </div>
            <Rail label="Real Baraka events">
              {caseRail.map((p) => (
                <Link key={p.src} to="/portfolio" className="lu-card" style={{ background: 'transparent', border: 0 }}>
                  <div className="ph">
                    <Img photo={p} sizes="420px" />
                  </div>
                  <div className="body" style={{ paddingInline: 0 }}>
                    <p className="lu-label">{p.tags.join(' · ')}</p>
                    <p className="lu-muted" style={{ fontSize: 15 }}>
                      {p.alt}.
                    </p>
                    <div className="cueline" aria-hidden />
                  </div>
                </Link>
              ))}
            </Rail>
          </div>
        </section>

        {/* 05 — The dastarkhwan (ivory) */}
        <section className="lu-section paper">
          <div className="lu-wrap lu-split">
            <div className="lu-stack" style={{ '--gap': '22px' } as CSSProperties}>
              {scene('05', 'The dastarkhwan')}
              <h2 className="lu-h2">
                What does catering <em>cost?</em>
              </h2>
              <p className="lu-lede">
                {foodPackages.length} set menus from {formatRs(lowestPrice)} to {formatRs(highestPrice)} per person, cooked and served by Baraka's own kitchen and team. Each menu is for at least {foodPackages[0].minimumGuests} guests.
              </p>
              <div className="lu-row">
                <Button href="/catering">See every menu</Button>
              </div>
            </div>
            <div style={{ borderTop: '1px solid var(--lu-ivory-rule)' }}>
              {[...foodPackages]
                .sort((x, y) => x.pricePerPerson - y.pricePerPerson)
                .map((p) => (
                  <div key={p.number} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '15px 0', borderBottom: '1px solid var(--lu-ivory-rule)' }}>
                    <span style={{ fontFamily: 'var(--lu-head)', fontSize: 21, fontWeight: 300 }}>Menu {p.number}</span>
                    <span className="lu-label" style={{ color: 'var(--lu-cue-deep)', letterSpacing: '0.12em' }}>
                      {formatRs(p.pricePerPerson)} / person
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </section>

        {/* 06 — How it comes together */}
        <section className="lu-section">
          <div className="lu-wrap lu-split">
            <div className="lu-stack" style={{ '--gap': '22px' } as CSSProperties}>
              {scene('06', 'How it comes together')}
              <RevealHeading className="lu-h2" lines={['Who manages', 'our event on the day?']} />
              <p className="lu-lede">Our founder, Malik Bilal, personally manages each event, supported by our team. 15+ years of experience.</p>
              <ParallaxPair back={photos.founder} front={photos.walimaArch} />
            </div>
            <ol style={{ listStyle: 'none', margin: 0, padding: 0, borderTop: '1px solid var(--lu-rule)' }}>
              {steps.map((s, i) => (
                <li key={s.n} style={{ borderBottom: '1px solid var(--lu-rule)', padding: '24px 0' }}>
                  <Rise i={i}>
                    <div style={{ display: 'grid', gridTemplateColumns: '56px minmax(0, 1fr)', gap: 16 }}>
                      <span className="lu-label cue" style={{ paddingTop: 6 }}>
                        {s.n}
                      </span>
                      <div>
                        <h3 className="lu-h3">{s.title}</h3>
                        <p className="lu-muted" style={{ marginTop: 8 }}>
                          {s.text}
                        </p>
                      </div>
                    </div>
                  </Rise>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 07 — Questions families ask */}
        <section className="lu-section char-1">
          <div className="lu-wrap lu-split">
            <div className="lu-stack" style={{ '--gap': '22px' } as CSSProperties}>
              {scene('07', 'Questions families ask')}
              <RevealHeading className="lu-h2" lines={['Ask us anything.', 'Most answers are here.']} />
              <div className="lu-row">
                <Button href="/design-system#questions">Search all questions</Button>
              </div>
              <div className="lu-stack" style={{ '--gap': '18px', marginTop: 28 } as CSSProperties}>
                <Label>From Google reviews</Label>
                {testimonials.map((t) => (
                  <figure key={t.name} style={{ margin: 0, borderLeft: '1px solid var(--lu-cue)', paddingLeft: 18 }}>
                    <blockquote style={{ margin: 0, color: 'var(--lu-ivory)', fontSize: 16 }}>“{t.quote}”</blockquote>
                    <figcaption className="lu-dim" style={{ fontSize: 13, marginTop: 8 }}>
                      {t.name} · {t.role}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
            <QAList items={homeFaqs} />
          </div>
        </section>

        {/* 08 — Final frame */}
        <section className="lu-section" style={{ paddingBottom: 'clamp(64px, 8vw, 104px)' }}>
          <div className="lu-wrap lu-stack" style={{ '--gap': '36px' } as CSSProperties}>
            {scene('08', 'Final frame')}
            <h2 className="lu-display" style={{ maxWidth: '12ch' }}>
              Tell us about your evening.
            </h2>
            <div className="lu-row">
              <Button href={whatsappHref} variant="cue">
                WhatsApp us
              </Button>
              <Button href={telHref}>Call {phoneDisplay}</Button>
              <Button href="/contact">Send an enquiry</Button>
            </div>
            <hr className="lu-hair" />
            <div className="lu-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))' }}>
              <div>
                <Label>Studio</Label>
                <p className="lu-muted" style={{ marginTop: 10 }}>
                  {a.streetAddress}, Main Boulevard, Gulberg III, {a.addressLocality}
                </p>
              </div>
              <div>
                <Label>Hours</Label>
                <p className="lu-muted" style={{ marginTop: 10 }}>
                  Monday to Saturday, 2:00 PM to 11:00 PM
                </p>
              </div>
              <div>
                <Label>Write</Label>
                <p style={{ marginTop: 10 }}>
                  <a className="lu-link" href={`mailto:${seoConfig.organization.contact.email}`}>
                    {seoConfig.organization.contact.email}
                  </a>
                </p>
              </div>
              <div>
                <Label>Find us</Label>
                <p style={{ marginTop: 10 }}>
                  <a className="lu-link" href={seoConfig.organization.mapUrl} target="_blank" rel="noopener noreferrer">
                    Google Maps →
                  </a>
                </p>
              </div>
            </div>
            <div className="lu-row" style={{ justifyContent: 'space-between', borderTop: '1px solid var(--lu-rule)', paddingTop: 28 }}>
              <img src="/media/logo.png" alt="Baraka Events" width={120} height={99} style={{ height: 96, width: 'auto' }} />
              <p className="lu-dim" style={{ fontSize: 13 }}>
                Prototype footer · the full footer keeps every current link
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
