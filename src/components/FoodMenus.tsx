import { Fragment, memo, useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import RevealText from './RevealText';
import FoodMotion from './FoodMotion';
import {
  EXCLUDED_LABEL,
  INCLUDED_LABEL,
  foodPackages,
  formatRs,
  highestPrice,
  lowestPrice,
  type FoodPackage,
} from '../lib/foodMenu';
import { whatsAppUrl } from '../lib/whatsapp';

const MINIMUM_GUESTS = foodPackages[0].minimumGuests;
const COUNT = foodPackages.length;

/**
 * Photography behind the stage. Both are catering set-ups already published in the Gallery (buffet stations
 * and crockery, which the menus list under INCLUDED). They show the service, not any particular dish, so the
 * stage says so in its caption. There is no photograph of the dishes themselves on the site yet.
 */
const BACKDROPS = [
  { src: '/media/gallery/detail-2.webp', srcSet: '/media/gallery/detail-2-640.webp 640w, /media/gallery/detail-2.webp 736w', w: 736, h: 981 },
  { src: '/media/gallery/detail-1.webp', srcSet: undefined, w: 675, h: 1200 },
];

/**
 * Renders a line that may contain slashes ("Gulab Jamun/Jalebi/Kulfa/...") so that a long list can wrap
 * after any slash on a narrow screen. A <wbr> adds a break opportunity, not a character: the text stays
 * exactly as the menu prints it.
 */
function SoftSlashes({ text }: { text: string }) {
  return (
    <>
      {text.split('/').map((part, i) => (
        <Fragment key={i}>
          {i > 0 && (
            <>
              /<wbr />
            </>
          )}
          {part}
        </Fragment>
      ))}
    </>
  );
}

/** Text that may carry deliberate line breaks ("\n") exactly where the printed menu has them. */
function Lines({ text }: { text: string }) {
  return (
    <>
      {text.split('\n').map((line, i) => (
        <span key={i} className="block">
          <SoftSlashes text={line} />
        </span>
      ))}
    </>
  );
}

const labelClass = 'text-[10px] font-medium uppercase tracking-[0.3em] text-champagne';

const PackageBody = memo(function PackageBody({ pkg }: { pkg: FoodPackage }) {
  return (
    <div data-menu-body className="[overflow-wrap:anywhere]">
      {pkg.sections && (
        <div className="space-y-6">
          {pkg.sections.map((s) => (
            <div key={s.label}>
              <h4 className={labelClass}>{s.label}</h4>
              <p className="mt-2.5 text-[15px] font-light leading-[1.7] text-cream/90">
                <Lines text={s.text} />
              </p>
            </div>
          ))}
        </div>
      )}

      {pkg.dishes && (
        <ul className="gap-x-10 sm:columns-2">
          {pkg.dishes.map((d) => (
            <li key={d.name} className="mb-2.5 flex break-inside-avoid gap-3 md:mb-3.5">
              <span aria-hidden className="mt-[0.7em] h-1 w-1 shrink-0 rotate-45 bg-bronze" />
              <span>
                <span className="block text-[14px] text-cream md:text-[15px]">
                  <SoftSlashes text={d.name} />
                </span>
                {d.detail && <span className="mt-0.5 block text-[13px] font-light leading-snug text-mist">{d.detail}</span>}
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-7 grid gap-6 border-t border-champagne/12 pt-6 md:grid-cols-2 md:gap-9">
        <div>
          <h4 className={labelClass}>{INCLUDED_LABEL}</h4>
          <p className="mt-2.5 text-[13px] font-light leading-[1.75] text-mist">
            <SoftSlashes text={pkg.included} />
          </p>
        </div>
        <div>
          <h4 className={labelClass}>{EXCLUDED_LABEL}</h4>
          <p className="mt-2.5 text-[13px] font-light leading-[1.75] text-mist">{pkg.excluded}</p>
        </div>
      </div>
    </div>
  );
});

/** Where a card sits on the deck, from its signed distance to the active card (the deck wraps around). */
function positionOf(i: number, active: number): string {
  let o = (i - active) % COUNT;
  if (o > COUNT / 2) o -= COUNT;
  if (o <= -COUNT / 2) o += COUNT;
  return o === 0 ? '0' : o === 1 ? 'p1' : o === -1 ? 'm1' : o === 2 ? 'p2' : o === -2 ? 'm2' : o > 0 ? 'hr' : 'hl';
}

function MenuCard({ pkg, pos, onSelect }: { pkg: FoodPackage; pos: string; onSelect: () => void }) {
  const price = formatRs(pkg.pricePerPerson);
  const isActive = pos === '0';
  const enquiry = whatsAppUrl(
    `Assalam-o-Alaikum, I found Baraka Events through your website and would like to know more about Menu ${pkg.number} (${price}/person, minimum ${pkg.minimumGuests} guests).`
  );

  return (
    <article
      data-menu-package={pkg.number}
      data-pos={pos}
      role="group"
      aria-roledescription="slide"
      aria-label={`Menu ${pkg.number} of ${COUNT}`}
      // every menu stays in the page (crawlers, print); only the front one is reachable by keyboard and screen reader
      aria-hidden={!isActive}
      onClick={isActive ? undefined : onSelect}
      className="menu-card"
    >
      <div className="menu-plate" inert={!isActive}>
        <header className="flex items-end justify-between gap-4 border-b border-champagne/12 px-5 pb-4 pt-5 md:px-8 md:pb-5 md:pt-6">
          <div>
            <p aria-hidden className="accent-serif text-lg leading-none text-champagne/70 md:text-xl">
              0{pkg.number}
            </p>
            <h3 className="mt-1.5 whitespace-nowrap font-display text-3xl font-light leading-none md:text-4xl">Menu {pkg.number}</h3>
          </div>
          <p data-menu-price className="flex flex-col items-end whitespace-nowrap sm:flex-row sm:items-baseline sm:gap-1.5">
            <span className="font-display text-2xl font-light leading-tight text-champagne md:text-3xl">{price}</span>
            <span className="text-[12px] leading-tight tracking-wide text-mist-dim">/person</span>
          </p>
        </header>

        <div className="menu-scroll min-h-0 flex-1 overflow-y-auto px-5 py-5 md:px-8 md:py-6">
          <PackageBody pkg={pkg} />
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-x-5 gap-y-2 border-t border-champagne/12 px-5 py-3.5 md:px-8 md:py-4">
          <p className="flex flex-wrap items-baseline gap-x-5 gap-y-1 text-mist">
            <span data-menu-min className="whitespace-nowrap text-[11px] uppercase tracking-[0.2em]">
              Minimum guests: <span className="text-ivory">{pkg.minimumGuests}</span>
            </span>
            <span className="hidden whitespace-nowrap text-[13px] tracking-wide sm:inline">
              <span className="text-ivory">{price}</span>/person
            </span>
          </p>
          <a
            href={enquiry}
            target="_blank"
            rel="noopener noreferrer"
            className="gold-underline inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-gold hover:text-gold-soft"
          >
            Ask about Menu {pkg.number}
            <span aria-hidden>&rarr;</span>
          </a>
        </footer>
      </div>
    </article>
  );
}

function Arrow({ dir, onClick, inline = false }: { dir: 'prev' | 'next'; onClick: () => void; inline?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === 'prev' ? 'Previous menu' : 'Next menu'}
      className={`items-center justify-center rounded-full border border-champagne/30 bg-ink/70 text-champagne transition-colors duration-300 hover:border-champagne hover:bg-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
        inline
          ? 'flex h-10 w-10 shrink-0 md:hidden'
          : `absolute top-[calc(var(--card-h)/2+20px)] z-[8] hidden h-12 w-12 -translate-y-1/2 backdrop-blur-sm md:flex ${dir === 'prev' ? 'left-5' : 'right-5'}`
      }`}
    >
      <svg viewBox="0 0 12 20" className="h-4 w-2.5 fill-none stroke-current" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d={dir === 'prev' ? 'M10 2L2 10l8 8' : 'M2 2l8 8-8 8'} />
      </svg>
    </button>
  );
}

export default function FoodMenus() {
  const [active, setActive] = useState(0);
  const [live, setLive] = useState(false);
  const [entering, setEntering] = useState(false);
  const [backdrop, setBackdrop] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useRef(false);
  const touch = useRef<{ x: number; y: number; lastX: number; moved: boolean } | null>(null);
  const askAboutMenus = whatsAppUrl(
    'Assalam-o-Alaikum, I found Baraka Events through your website and would like to know more about your 2026-27 food menus.'
  );

  const go = useCallback((i: number) => setActive(((i % COUNT) + COUNT) % COUNT), []);
  const step = useCallback((d: number) => setActive((a) => (((a + d) % COUNT) + COUNT) % COUNT), []);

  // Run the motion only while the stage is on screen and the tab is visible; play the entrance once, as it arrives.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let visible = false;
    const sync = () => setLive(visible && document.visibilityState === 'visible');
    let played = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (entry.isIntersecting && entry.intersectionRatio > 0.2 && !played && !reducedMotion.current) {
          played = true;
          setEntering(true);
          window.setTimeout(() => setEntering(false), 2200);
        }
        sync();
      },
      { threshold: [0, 0.2] }
    );
    io.observe(el);
    document.addEventListener('visibilitychange', sync);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', sync);
    };
  }, []);

  // Pointer parallax for the floating ingredients: desktop pointers only, throttled to one write per frame.
  useEffect(() => {
    const el = stageRef.current;
    if (!el || !live || reducedMotion.current || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    let frame = 0;
    const onMove = (e: globalThis.PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const r = el.getBoundingClientRect();
        el.style.setProperty('--px', (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
        el.style.setProperty('--py', (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
      });
    };
    el.addEventListener('pointermove', onMove);
    return () => {
      el.removeEventListener('pointermove', onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [live]);

  // The backdrop photograph changes slowly, and only while the stage is live.
  useEffect(() => {
    if (!live || reducedMotion.current) return;
    const id = window.setInterval(() => setBackdrop((b) => (b + 1) % BACKDROPS.length), 9000);
    return () => window.clearInterval(id);
  }, [live]);

  // Keep the active tab centred inside the tab row without moving the page.
  useEffect(() => {
    const row = tabsRef.current;
    const tab = row?.querySelector<HTMLElement>('[aria-current="true"]');
    if (!row || !tab) return;
    row.scrollTo({ left: tab.offsetLeft - (row.clientWidth - tab.offsetWidth) / 2, behavior: reducedMotion.current ? 'auto' : 'smooth' });
  }, [active]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') step(1);
    else if (e.key === 'ArrowLeft') step(-1);
    else if (e.key === 'Home') go(0);
    else if (e.key === 'End') go(COUNT - 1);
    else return;
    e.preventDefault();
  };

  // Swipe: touch and pen only. Vertical movement is left to the page (touch-action: pan-y on the deck).
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse') return;
    touch.current = { x: e.clientX, y: e.clientY, lastX: e.clientX, moved: false };
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const t = touch.current;
    if (!t) return;
    t.lastX = e.clientX;
    if (Math.abs(e.clientX - t.x) > 12 && Math.abs(e.clientX - t.x) > Math.abs(e.clientY - t.y)) t.moved = true;
  };
  const onPointerUp = () => {
    const t = touch.current;
    touch.current = null;
    if (!t || !t.moved) return;
    const dx = t.lastX - t.x;
    if (Math.abs(dx) > 48) step(dx < 0 ? 1 : -1);
  };
  const onPointerCancel = () => {
    touch.current = null;
  };

  const current = foodPackages[active];

  return (
    <section id="menu" data-scene="07A · FOOD MENU — THE DASTARKHWAN" className="relative overflow-hidden bg-ink-2 py-16 md:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 h-[400px] w-[700px] rounded-full"
        style={{ background: 'radial-gradient(ellipse closest-side, rgba(230,197,138,0.14), transparent)' }}
      />

      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-16">
          <div>
            <p className="mb-4 text-[11px] uppercase tracking-[0.3em] text-champagne">The Baraka Kitchen</p>
            <RevealText
              as="h2"
              text="A dastarkhwan worth remembering"
              className="font-display text-4xl font-light leading-[1.1] md:text-6xl"
              highlightWords={[2, 3]}
              highlightClass="accent-serif"
            />
            <p className="mt-5 max-w-xl text-base font-light leading-[1.75] text-mist">
              Our Food Menu 2026&ndash;27: eight set packages, Menu 1 to Menu 8, each priced per person for a minimum of{' '}
              {MINIMUM_GUESTS} guests. Browse the menus below to see each full dish list and what is included and excluded.
            </p>
          </div>

          <div>
            <dl className="grid max-w-md grid-cols-3 gap-6 border-t border-champagne/12 pt-6">
              <div>
                <dt className="text-[10px] uppercase tracking-[0.22em] text-mist-dim">Packages</dt>
                <dd className="mt-2 font-display text-3xl font-light text-champagne">{foodPackages.length}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.22em] text-mist-dim">Per person</dt>
                <dd className="mt-2 font-display text-xl font-light leading-tight text-champagne">
                  {formatRs(lowestPrice)}
                  <span className="block text-sm text-mist">to {formatRs(highestPrice)}</span>
                </dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.22em] text-mist-dim">Minimum</dt>
                <dd className="mt-2 font-display text-3xl font-light text-champagne">
                  {MINIMUM_GUESTS}
                  <span className="block text-sm text-mist">guests</span>
                </dd>
              </div>
            </dl>
            <a
              href={askAboutMenus}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-flame mt-7 inline-flex items-center justify-center gap-2.5 rounded-full px-8 py-4 text-[12px] font-medium uppercase tracking-[0.22em]"
            >
              Ask about a menu
            </a>
          </div>
        </div>

        {/* the stage: a fixed-height dark island, so choosing a menu never moves anything on the page */}
        <div
          ref={stageRef}
          role="region"
          aria-roledescription="carousel"
          aria-label="Food Menu 2026-27, Menu 1 to Menu 8. Use the arrow keys, the buttons or swipe to change menu."
          tabIndex={0}
          onKeyDown={onKeyDown}
          data-live={live}
          data-entering={entering}
          className="menu-stage bg-ink-3 mt-10 border border-champagne/15 outline-none focus-visible:ring-2 focus-visible:ring-gold md:mt-14"
        >
          <div aria-hidden className="menu-backdrop absolute inset-0">
            {BACKDROPS.map((b, i) => (
              <img
                key={b.src}
                src={b.src}
                srcSet={b.srcSet}
                sizes="(min-width: 768px) 1300px, 100vw"
                width={b.w}
                height={b.h}
                alt=""
                loading="lazy"
                decoding="async"
                data-on={backdrop === i}
              />
            ))}
          </div>
          <div aria-hidden className="menu-vignette absolute inset-0" />

          <FoodMotion />

          <div
            className="menu-deck relative z-[3]"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerCancel}
          >
            {foodPackages.map((pkg, i) => {
              return <MenuCard key={pkg.number} pkg={pkg} pos={positionOf(i, active)} onSelect={() => go(i)} />;
            })}
          </div>

          <Arrow dir="prev" onClick={() => step(-1)} />
          <Arrow dir="next" onClick={() => step(1)} />

          <div className="relative z-[6] flex items-center gap-2 px-3 pb-4 pt-1 md:gap-3 md:px-6">
            <Arrow dir="prev" inline onClick={() => step(-1)} />
            <Arrow dir="next" inline onClick={() => step(1)} />
            <div ref={tabsRef} className="menu-tabs flex min-w-0 flex-1 gap-2 overflow-x-auto">
              {foodPackages.map((pkg, i) => (
                <button
                  key={pkg.number}
                  type="button"
                  onClick={() => go(i)}
                  aria-current={i === active}
                  aria-label={`Show Menu ${pkg.number}, ${formatRs(pkg.pricePerPerson)} per person`}
                  className={`shrink-0 rounded-full border px-3.5 py-2 text-left transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
                    i === active ? 'border-gold bg-gold/15 text-ivory' : 'border-champagne/20 text-mist hover:border-champagne/50 hover:text-ivory'
                  }`}
                >
                  <span className="block text-[10px] uppercase leading-none tracking-[0.2em]">Menu {pkg.number}</span>
                  <span className="mt-1 block text-[12px] leading-none tracking-wide text-champagne">{formatRs(pkg.pricePerPerson)}</span>
                </button>
              ))}
            </div>
            <p aria-hidden className="hidden shrink-0 text-[11px] uppercase tracking-[0.25em] text-mist-dim sm:block">
              {String(active + 1).padStart(2, '0')} / {String(COUNT).padStart(2, '0')}
            </p>
          </div>

          <p className="sr-only" aria-live="polite" aria-atomic="true">
            Menu {current.number} of {COUNT}, {formatRs(current.pricePerPerson)} per person, minimum {current.minimumGuests} guests.
          </p>
        </div>

        <p className="mt-6 text-[11px] uppercase tracking-[0.22em] text-mist-dim">
          All prices are per person &middot; minimum {MINIMUM_GUESTS} guests per package
        </p>
        <p className="mt-2 max-w-2xl text-[12px] font-light leading-relaxed text-mist-dim">
          Photography shows buffet stations and crockery from our catering set-ups. It illustrates the service, not a particular dish; every
          menu is listed exactly as printed.
        </p>
      </div>
    </section>
  );
}
