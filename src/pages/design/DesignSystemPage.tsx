import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import '../../design/lightsUp.css';
import { useSEO } from '../../seo';
import { photos } from '../../design/photos';
import { whatsappHref } from '../../design/contact';
import {
  Button,
  Label,
  LightsUpImage,
  LuHeader,
  ParallaxPair,
  QAList,
  QASearch,
  Rail,
  RevealHeading,
  Rise,
  ServiceCard,
  Transformation,
  VideoSlot,
  Img,
  type QA,
} from '../../design/components';
import { faqs } from '../../lib/faqs';
import { services } from '../../lib/services';
import { foodPackages, formatRs, lowestPrice, highestPrice } from '../../lib/foodMenu';

/**
 * /design-system — Phase A of the "Lights up" redesign (approved 17 Nov 2026).
 * A review page for the owner: tokens, typography, components, navigation and motion prototypes.
 * Not linked from the site, noindex, not in the sitemap or llms.txt.
 */

const swatches = [
  { name: 'House dark', hex: '#060504', use: 'Default ground: hero, menu, video.' },
  { name: 'Charcoal 1', hex: '#0c0a08', use: 'Alternate sections, cards.' },
  { name: 'Charcoal 2', hex: '#141110', use: 'Raised panels, inputs.' },
  { name: 'Charcoal 3', hex: '#1e1915', use: 'Hover, selected rows.' },
  { name: 'Ivory paper', hex: '#f4eee3', use: 'At most two sections a page, for reading.' },
  { name: 'Cue light', hex: '#ff960b', use: 'One per screen: main action, active state, key word. 9.3:1 on house dark.' },
  { name: 'Cue on paper', hex: '#9a4a00', use: 'Orange text on ivory, 5.4:1. Never #ff960b on light.' },
  { name: 'Mist', hex: '#b9ae9d', use: 'Body text on dark, 9.3:1.' },
];

const allQuestions: QA[] = [
  ...faqs.map((f) => ({ q: f.q, a: f.a, topic: 'Baraka Events', href: f.related?.[0]?.to })),
  ...services.flatMap((s) =>
    s.faqs.map((f) => ({ q: f.q, a: f.a, topic: s.title.replace(/ in Lahore$/, '').replace(/ Planning.*| Management.*| & Design.*/, ''), href: `/services/${s.slug}` })),
  ),
];

/** Loads Cormorant Garamond for the comparison only. The live site's font budget is unchanged. */
function useComparisonFont() {
  useEffect(() => {
    const id = 'lu-cormorant';
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,400;1,500&display=swap';
    // Same non-blocking pattern as index.html, so the prerendered page never waits for this font (verify:prerender checks it).
    link.media = 'print';
    link.setAttribute('onload', "this.media='all'");
    document.head.appendChild(link);
  }, []);
}

/** Replays a reveal for review: puts the element back in its starting state, then lets it animate again. */
function Replay({ children, label }: { children: ReactNode; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const replay = () => {
    const root = ref.current;
    if (!root) return;
    const el = root.querySelector<HTMLElement>('.lu-lights, .lu-rise, h2, h3');
    if (!el) return;
    const arm = el.matches('h2, h3') ? 'lu-reveal-armed' : 'lu-armed';
    el.classList.remove('is-in');
    el.classList.add(arm);
    void el.offsetWidth;
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('is-in')));
  };
  return (
    <div className="lu-stack" style={{ '--gap': '14px' } as CSSProperties}>
      <div ref={ref}>{children}</div>
      <button type="button" className="lu-chip" onClick={replay}>
        Replay: {label}
      </button>
    </div>
  );
}

function Section({ id, n, title, intro, children, tone = '' }: { id: string; n: string; title: string; intro?: string; children: ReactNode; tone?: string }) {
  return (
    <section id={id} className={`lu-section ${tone}`} style={{ scrollMarginTop: 80 }}>
      <div className="lu-wrap lu-stack" style={{ '--gap': '44px' } as CSSProperties}>
        <div className="lu-split" style={{ alignItems: 'end' }}>
          <div>
            <Label cue>{n}</Label>
            <RevealHeading className="lu-h2" lines={[title]} />
          </div>
          {intro ? <p className="lu-lede">{intro}</p> : <span />}
        </div>
        {children}
      </div>
    </section>
  );
}

export default function DesignSystemPage() {
  useSEO({
    title: 'Design system (Phase A prototype) | Baraka Events',
    description: 'Internal review page for the Baraka Events redesign: design system, typography, components, navigation and motion prototypes.',
    canonical: '/design-system',
    noindex: true,
  });
  useComparisonFont();
  const [accent, setAccent] = useState<'current' | 'cormorant'>('current');

  return (
    <div className="lu has-actionbar">
      <LuHeader logo="/media/logo.png" />
      <main>
        <section className="lu-section" style={{ paddingBlock: 'clamp(64px, 9vw, 120px) clamp(48px, 6vw, 80px)' }}>
          <div className="lu-wrap lu-stack" style={{ '--gap': '28px' } as CSSProperties}>
            <Label cue>Lights up · Phase A · for review</Label>
            <h1 className="lu-display">
              The house goes dark.
              <br />
              Then the <em>lights come up.</em>
            </h1>
            <p className="lu-lede">
              The design system for the new Baraka Events website: colours, typography, components, navigation and motion, built as real code so you can judge them on your phone and desktop. Every photograph is verified Baraka work from the gallery. Nothing on the live site has changed.
            </p>
            <div className="lu-row">
              <Button href="/design-system/homepage">See the homepage concept</Button>
              <Button href="#motion">Jump to motion</Button>
            </div>
            <nav className="lu-row" aria-label="On this page" style={{ gap: '8px 22px', marginTop: 12 }}>
              {[
                ['colour', 'Colour'],
                ['type', 'Typography'],
                ['components', 'Components'],
                ['navigation', 'Navigation'],
                ['motion', 'Motion'],
                ['questions', 'Questions'],
                ['paper', 'Ivory section'],
              ].map(([id, t]) => (
                <a key={id} className="lu-link lu-label" href={`#${id}`}>
                  {t}
                </a>
              ))}
            </nav>
          </div>
        </section>

        <Section id="colour" n="01 · Colour" title="House dark, cue light, ivory paper." intro="Three surfaces and one accent, used by rule. Headings are white; orange marks one thing per screen. No decorative gradients: photographs carry the colour." tone="char-1">
          <div className="lu-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 230px), 1fr))' }}>
            {swatches.map((s) => (
              <div key={s.hex} style={{ border: '1px solid var(--lu-rule)' }}>
                <div style={{ height: 96, background: s.hex, borderBottom: '1px solid var(--lu-rule)' }} />
                <div style={{ padding: '14px 16px 16px' }}>
                  <p style={{ color: 'var(--lu-ivory)' }}>{s.name}</p>
                  <p className="lu-dim" style={{ fontSize: 13 }}>
                    {s.hex}
                  </p>
                  <p className="lu-muted" style={{ fontSize: 14, marginTop: 6 }}>
                    {s.use}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section id="type" n="02 · Typography" title="The approved typefaces, given clearer jobs." intro="Roboto for headings (approved 21 October), now white and set lighter and larger; Inter for reading; Oswald for labels and numbers. You asked to see Cormorant Garamond before any change: compare below.">
          <div style={{ borderTop: '1px solid var(--lu-rule)' }}>
            {[
              ['Display · Roboto 300', <p key="d" className="lu-display" style={{ fontFamily: 'var(--lu-head)' }}>Lights up.</p>],
              ['Heading 1 · Roboto 300', <p key="h1" className="lu-h1" style={{ fontFamily: 'var(--lu-head)' }}>Event Planners in Lahore.</p>],
              ['Heading 2 · Roboto 300', <p key="h2" className="lu-h2" style={{ fontFamily: 'var(--lu-head)' }}>How does Mehndi planning work with Baraka?</p>],
              ['Heading 3 · Roboto 400', <p key="h3" className="lu-h3" style={{ fontFamily: 'var(--lu-head)', fontWeight: 400 }}>Décor approved before any vendor is booked</p>],
              ['Lede · Inter 300', <p key="l" className="lu-lede">We put together a design direction for the space: layout, florals, lighting, stage and table setup. You see and approve it before any vendor is booked.</p>],
              ['Label · Oswald 400', <p key="lb" className="lu-label cue">Scene 03 · The transformation</p>],
              ['Numerals · Oswald 300', <p key="n" className="lu-num">15+ <span className="lu-label">years</span></p>],
            ].map(([k, v]) => (
              <div key={k as string} className="lu-split" style={{ gridTemplateColumns: 'minmax(0, 220px) minmax(0, 1fr)', padding: '22px 0', borderBottom: '1px solid var(--lu-rule)', alignItems: 'baseline' }}>
                <p className="lu-label">{k}</p>
                {v}
              </div>
            ))}
          </div>

          <div className="lu-stack" style={{ '--gap': '18px' } as CSSProperties}>
            <Label cue>Accent typeface: side-by-side comparison</Label>
            <div className="lu-row" role="group" aria-label="Accent typeface">
              <button type="button" className="lu-chip" aria-pressed={accent === 'current'} onClick={() => setAccent('current')}>
                Current: Playfair Display italic
              </button>
              <button type="button" className="lu-chip" aria-pressed={accent === 'cormorant'} onClick={() => setAccent('cormorant')}>
                Option: Cormorant Garamond italic
              </button>
            </div>
            <div className="lu-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))' }}>
              {(['current', 'cormorant'] as const).map((k) => (
                <figure key={k} style={{ margin: 0, border: `1px solid ${accent === k ? 'var(--lu-cue)' : 'var(--lu-rule)'}`, padding: 'clamp(22px, 3vw, 36px)', display: 'grid', gap: 16 }}>
                  <p className="lu-label">{k === 'current' ? 'Current · Playfair Display italic (loaded site-wide today)' : 'Option · Cormorant Garamond italic (loaded on this page only)'}</p>
                  <blockquote style={{ margin: 0, fontFamily: k === 'current' ? '"Playfair Display", Georgia, serif' : '"Cormorant Garamond", Georgia, serif', fontStyle: 'italic', fontSize: 'clamp(26px, 3vw, 40px)', lineHeight: 1.2, color: 'var(--lu-ivory)' }}>
                    “We didn't face any kind of tension, and the decor was extremely beautiful.”
                  </blockquote>
                  <p style={{ fontFamily: k === 'current' ? '"Playfair Display", Georgia, serif' : '"Cormorant Garamond", Georgia, serif', fontStyle: 'italic', fontSize: 22, color: 'var(--lu-mist)' }}>
                    Mehndi · Baraat · Nikkah · Walima · 01 02 03
                  </p>
                  <p className="lu-dim" style={{ fontSize: 13 }}>
                    {k === 'current'
                      ? 'Heavier contrast, wider letters; reads as classic print. Already part of the site.'
                      : 'Finer, taller and more calligraphic; reads as couture. Same role, about the same file size. Used only for pull-quotes and one word in a hero.'}
                  </p>
                </figure>
              ))}
            </div>
            <p className="lu-dim" style={{ fontSize: 13 }}>
              The quote is from a published Google review on the site (Noreiz Ahmad, Mehndi &amp; Barat, Lahore).
            </p>
          </div>
        </Section>

        <Section id="components" n="03 · Components" title="Fewer parts, made carefully." intro="Square corners and hairline frames, borrowed from architectural drawings. Hover, focus or tap each one." tone="char-1">
          <div className="lu-stack" style={{ '--gap': '40px' } as CSSProperties}>
            <div className="lu-stack" style={{ '--gap': '14px' } as CSSProperties}>
              <Label>Buttons and links</Label>
              <div className="lu-row">
                <Button href="/contact" variant="cue">
                  Plan your event
                </Button>
                <Button href={whatsappHref} variant="whatsapp">
                  WhatsApp us
                </Button>
                <Button href="/portfolio">See the work</Button>
                <a className="lu-link" href="#components">
                  A text link
                </a>
              </div>
              <p className="lu-dim" style={{ fontSize: 13 }}>
                One cue-light button per screen. Every button is at least 52 px tall; the fill sweeps across on hover and keyboard focus.
              </p>
            </div>

            <div className="lu-stack" style={{ '--gap': '14px' } as CSSProperties}>
              <Label>Service cards</Label>
              <div className="lu-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))' }}>
                <ServiceCard photo={photos.walimaStage} index="01" label="Weddings" title="Mehndi, Baraat, Nikkah, Walima" line="Every function, one team." to="/services/wedding-planning" />
                <ServiceCard photo={photos.corporateHall} index="02" label="Corporate" title="Conferences, launches, galas" line="Stage, AV and run of show." to="/services/corporate-events" />
                <ServiceCard photo={photos.bachelorette} index="03" label="Private" title="Birthdays and celebrations" line="Home, rooftop or venue." to="/services/birthday-events" />
              </div>
            </div>

            <div className="lu-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))' }}>
              <div className="lu-stack" style={{ '--gap': '14px' } as CSSProperties}>
                <Label>Plate: the photo frame</Label>
                <figure className="lu-plate">
                  <div style={{ aspectRatio: '4 / 3', position: 'relative' }}>
                    <Img photo={photos.walimaArch} sizes="(min-width: 900px) 45vw, 90vw" style={{ position: 'absolute', inset: 0 }} />
                  </div>
                  <span className="tag" style={{ left: 22, bottom: 22 }}>
                    Walima · floral arch
                  </span>
                  <figcaption>{photos.walimaArch.alt}.</figcaption>
                </figure>
              </div>
              <div className="lu-stack" style={{ '--gap': '14px' } as CSSProperties}>
                <Label>Video slot: labelled placeholder</Label>
                <VideoSlot title="Hero showreel" needs="Needs real footage: 8 to 12 seconds of lights coming up on a finished stage. Muted, with a pause button." poster={photos.mehndiFloor} ratio="4 / 3" />
              </div>
            </div>

            <div className="lu-stack" style={{ '--gap': '14px' } as CSSProperties}>
              <Label>Transformation slider</Label>
              <Transformation photo={photos.baraatLounge} />
            </div>

            <div className="lu-stack" style={{ '--gap': '14px' } as CSSProperties}>
              <Label>Rail: swipe, scroll or use the arrows</Label>
              <Rail label="Example rail of real Baraka events">
                {[photos.mehndiCeiling, photos.baraatCanopy, photos.qawaliSeating, photos.corporateBallroom, photos.mehndiLanterns].map((p) => (
                  <figure key={p.src} className="lu-plate" style={{ margin: 0 }}>
                    <div style={{ aspectRatio: '4 / 5', position: 'relative' }}>
                      <Img photo={p} sizes="420px" style={{ position: 'absolute', inset: 0 }} />
                    </div>
                    <figcaption>{p.alt}.</figcaption>
                  </figure>
                ))}
              </Rail>
            </div>
          </div>
        </Section>

        <Section id="navigation" n="04 · Navigation" title="A menu that previews the work." intro="The header at the top of this page is the prototype. On desktop, open Services for the mega menu: the preview changes as you move through it. On a phone, open the menu for the full-screen version; the WhatsApp, Call and Get a quote bar stays at the bottom of the screen.">
          <div className="lu-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))' }}>
            {[
              ['Desktop', 'Five items, one cue-light action. Services opens a mega menu in three groups (Weddings, Celebrations, Corporate & design) built from the same service list as today, with a photo preview.'],
              ['Phone', 'A full-screen menu that opens like a curtain from the top; items rise in sequence; WhatsApp and call at the bottom of the menu. Escape or the close button returns.'],
              ['Action bar', 'WhatsApp, Call, Get a quote, fixed to the bottom on phones. It replaces the floating bubble that covered form fields and menu cards.'],
            ].map(([t, d]) => (
              <div key={t} style={{ borderTop: '1px solid var(--lu-cue)', paddingTop: 18 }}>
                <h3 className="lu-h3">{t}</h3>
                <p className="lu-muted" style={{ marginTop: 10 }}>
                  {d}
                </p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="motion" n="05 · Motion" title="Motion that behaves like stage lighting." intro="Four signature moves and nothing else. Everything animates transform, opacity, clip-path or brightness; nothing on the first screen is hidden while the page loads; with reduced motion switched on in your phone's settings, everything simply appears." tone="char-1">
          <div className="lu-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 440px), 1fr))', gap: 40 }}>
            <Replay label="lights up">
              <Label cue>A · Lights up</Label>
              <div style={{ marginTop: 14 }}>
                <LightsUpImage photo={photos.mehndiLanterns} caption="The image opens from the centre like a curtain, then brightens: 0.9 s clip, 1.4 s light. For chapter openers and case studies." />
              </div>
            </Replay>
            <Replay label="line reveal">
              <Label cue>B · Line reveal</Label>
              <RevealHeading as="h3" className="lu-h2" lines={['From an empty hall', 'to a room your family', 'remembers.']} />
              <p className="lu-dim" style={{ fontSize: 13, marginTop: 12 }}>
                Each line rises from a mask, 1 s, 90 ms apart. Headings below the first screen only.
              </p>
            </Replay>
            <Replay label="rise">
              <Label cue>C · Rise</Label>
              <Rise>
                <div style={{ border: '1px solid var(--lu-rule)', padding: 24, marginTop: 14 }}>
                  <p className="lu-num">
                    {formatRs(lowestPrice).replace('Rs. ', '')}–{formatRs(highestPrice).replace('Rs. ', '')}
                  </p>
                  <p className="lu-muted">Rupees per person across the {foodPackages.length} published food menus.</p>
                </div>
              </Rise>
              <p className="lu-dim" style={{ fontSize: 13, marginTop: 12 }}>
                Blocks lift 28 px and fade in, 0.9 s. For figures, cards and short text.
              </p>
            </Replay>
            <div className="lu-stack" style={{ '--gap': '14px' } as CSSProperties}>
              <Label cue>D · Layered parallax</Label>
              <ParallaxPair back={photos.walimaStage} front={photos.qawaliSeating} />
              <p className="lu-dim" style={{ fontSize: 13 }}>
                Two real photos drift at different speeds as you scroll, at most 40 px. Off with reduced motion.
              </p>
            </div>
          </div>
          <div className="lu-split" style={{ borderTop: '1px solid var(--lu-rule)', paddingTop: 28 }}>
            <div>
              <Label cue>E · Cue-line page transition</Label>
              <p className="lu-muted" style={{ marginTop: 10 }}>
                Between pages the old page dims and the new one opens from a horizontal line, like a stage curtain: 0.9 s. It uses the browser's built-in page-transition feature, so it adds no code to download; browsers without it change page instantly.
              </p>
            </div>
            <div className="lu-row">
              <Link to="/design-system/homepage" viewTransition className="lu-btn cue">
                <span>Try it: open the homepage concept</span>
                <span className="lu-arrow" aria-hidden>
                  →
                </span>
              </Link>
            </div>
          </div>
        </Section>

        <Section id="questions" n="06 · Questions" title="Every answer, one search away." intro={`A working prototype of the Questions hub with the ${allQuestions.length} answers already published on the site. In the build, every answer is in the page's HTML, so search engines and AI tools can read them even when they are closed.`}>
          <QASearch items={allQuestions} />
        </Section>

        <Section id="paper" n="07 · Ivory paper" title="Reading sections, on paper." intro="Up to two per page, for menus and long answers. Orange becomes a deeper #9a4a00 here so it stays readable." tone="paper">
          <div className="lu-split">
            <div className="lu-stack" style={{ '--gap': '16px' } as CSSProperties}>
              <h3 className="lu-h3">What does catering cost?</h3>
              <p className="lu-lede">
                {foodPackages.length} set menus from {formatRs(lowestPrice)} to {formatRs(highestPrice)} per person, cooked by Baraka's own kitchen. Guest count is flexible.
              </p>
            </div>
            <div style={{ borderTop: '1px solid var(--lu-ivory-rule)' }}>
              {[...foodPackages]
                .sort((a, b) => a.pricePerPerson - b.pricePerPerson)
                .slice(0, 5)
                .map((p) => (
                  <div key={p.number} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '14px 0', borderBottom: '1px solid var(--lu-ivory-rule)' }}>
                    <span style={{ fontFamily: 'var(--lu-head)', fontSize: 20 }}>Menu {p.number}</span>
                    <span className="lu-label" style={{ color: 'var(--lu-cue-deep)', letterSpacing: '0.12em' }}>
                      {formatRs(p.pricePerPerson)} / person
                    </span>
                  </div>
                ))}
            </div>
          </div>
          <QAList items={faqs.filter((f) => /catering|cost/i.test(f.q)).map((f) => ({ q: f.q, a: f.a }))} />
        </Section>

        <section className="lu-section">
          <div className="lu-wrap lu-stack" style={{ '--gap': '22px' } as CSSProperties}>
            <Label cue>Rules every component follows</Label>
            <ul className="lu-muted" style={{ margin: 0, paddingLeft: 18, maxWidth: '72ch', display: 'grid', gap: 8 }}>
              <li>One cue-light element per screen. The phone action bar is the only exception: it is always there, so it never competes.</li>
              <li>Only verified Baraka photographs; undocumented images stay out until you confirm them.</li>
              <li>Nothing visible at first paint is hidden while the page loads (Phase 1 rule).</li>
              <li>Motion uses CSS transitions; no new libraries, no WebGL. This page's code loads only on this page.</li>
              <li>Reduced-motion settings turn every animation off.</li>
              <li>Touch targets at least 44 px; visible keyboard focus in cue orange.</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
