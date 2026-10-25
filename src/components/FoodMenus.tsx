import { Fragment, memo, useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react';
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
/** Space the deck keeps around the cards: above them (shadow room) and below them (the stage's floor). Matches .menu-card top and .menu-floor in index.css. */
const DECK_PAD = 18 + 64;

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

const labelClass = 'text-[11px] font-medium uppercase tracking-[0.28em] text-champagne';
const order = (i: number) => ({ '--i': i }) as CSSProperties;

const PackageBody = memo(function PackageBody({ pkg }: { pkg: FoodPackage }) {
  return (
    <div data-menu-body className="[overflow-wrap:anywhere]">
      {pkg.sections && (
        <div className="space-y-6 md:space-y-7">
          {pkg.sections.map((s, i) => (
            <div key={s.label} className="menu-item" style={order(i)}>
              <h4 className={labelClass}>{s.label}</h4>
              <p className="mt-2.5 text-[16px] font-light leading-[1.65] text-cream md:text-[17px]">
                <Lines text={s.text} />
              </p>
            </div>
          ))}
        </div>
      )}

      {pkg.dishes && (
        <ul className="menu-dishes">
          {pkg.dishes.map((d, i) => (
            <li key={d.name} className="menu-item mb-3 flex break-inside-avoid gap-3 md:mb-2.5" style={order(i)}>
              <span aria-hidden className="mt-[0.72em] h-1.5 w-1.5 shrink-0 rotate-45 bg-gold/80" />
              <span>
                <span className="block text-[16px] leading-snug text-cream">
                  <SoftSlashes text={d.name} />
                </span>
                {d.detail && <span className="mt-0.5 block text-[13px] font-light leading-snug text-mist">{d.detail}</span>}
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-7 grid gap-6 border-t border-champagne/15 pt-5 md:mt-6 md:grid-cols-2 md:gap-9">
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

function MenuCard({
  pkg,
  pos,
  plateHeight,
  onSelect,
  measure,
}: {
  pkg: FoodPackage;
  pos: string;
  plateHeight: number | undefined;
  onSelect: () => void;
  measure: (el: HTMLDivElement | null) => void;
}) {
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
      {/* the plate takes the height of the front menu, so every card matches it and the stage grows or shrinks as one piece;
          nothing inside a card scrolls on its own, so a finger on a card scrolls the page */}
      <div className="menu-plate" style={plateHeight ? { height: plateHeight } : undefined} inert={!isActive}>
        <div className="menu-content" ref={measure}>
          <header className="menu-face">
            <div className="min-w-0">
              <p aria-hidden className="menu-index">
                0{pkg.number}
              </p>
              <h3 className="menu-name">Menu {pkg.number}</h3>
              <p data-menu-price className="menu-price">
                <span className="menu-price-num">{price}</span>
                <span className="menu-price-unit">/person</span>
              </p>
            </div>
            <p aria-hidden className="menu-ghost">
              {pkg.number}
            </p>
          </header>

          <div className="menu-detail">
            <div className="menu-body">
              <PackageBody pkg={pkg} />
            </div>
            <footer className="menu-foot">
              <span data-menu-min className="menu-min">
                Minimum guests: <span className="text-ivory">{pkg.minimumGuests}</span>
              </span>
              <a
                href={enquiry}
                target="_blank"
                rel="noopener noreferrer"
                className="menu-cta"
              >
                Ask about Menu {pkg.number}
                <span aria-hidden>&rarr;</span>
              </a>
            </footer>
          </div>
        </div>
      </div>
    </article>
  );
}

function Arrow({ dir, onClick }: { dir: 'prev' | 'next'; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-label={dir === 'prev' ? 'Previous menu' : 'Next menu'} className="menu-arrow">
      <svg viewBox="0 0 12 20" className="h-4 w-2.5 fill-none stroke-current" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
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
  const [heights, setHeights] = useState<number[]>(() => Array(COUNT).fill(0));
  const stageRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reducedMotion = useRef(false);
  const gesture = useRef<{ id: number; x: number; y: number; t: number; lastX: number; mode: 'pending' | 'h' } | null>(null);
  const askAboutMenus = whatsAppUrl(
    'Assalam-o-Alaikum, I found Baraka Events through your website and would like to know more about your 2026-27 food menus.'
  );

  const go = useCallback((i: number) => setActive(((i % COUNT) + COUNT) % COUNT), []);
  const step = useCallback((d: number) => setActive((a) => (((a + d) % COUNT) + COUNT) % COUNT), []);

  // The stage is as tall as the menu in front. Each card's own content height is measured (not its plate, which is sized from it),
  // so the stage follows a font load or a resize by itself.
  useEffect(() => {
    const read = () =>
      setHeights((prev) => {
        const next = contentRefs.current.map((el) => (el ? Math.ceil(el.offsetHeight) : 0));
        return next.length === prev.length && next.every((v, i) => v === prev[i]) ? prev : next;
      });
    const ro = new ResizeObserver(read);
    contentRefs.current.forEach((el) => el && ro.observe(el));
    return () => ro.disconnect();
  }, []);

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
        if (entry.isIntersecting && entry.intersectionRatio > 0.15 && !played && !reducedMotion.current) {
          played = true;
          setEntering(true);
          window.setTimeout(() => setEntering(false), 2400);
        }
        sync();
      },
      { threshold: [0, 0.15] }
    );
    io.observe(el);
    document.addEventListener('visibilitychange', sync);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', sync);
    };
  }, []);

  // Pointer parallax: desktop pointers only, one write per frame, and only to the handful of layers that move. (It used to set a CSS
  // variable on the stage, which every element inside inherits, so each pointer move restyled the whole stage.)
  useEffect(() => {
    const el = stageRef.current;
    if (!el || !live || reducedMotion.current || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const glyphs = Array.from(el.querySelectorAll<HTMLElement>('.fm-g'));
    const photo = el.querySelector<HTMLElement>('.menu-backdrop');
    let frame = 0;
    const apply = (nx: number, ny: number) => {
      glyphs.forEach((g) => {
        const d = Number(g.dataset.depth) || 0;
        g.style.transform = `translate3d(${(nx * d).toFixed(1)}px, ${(ny * d).toFixed(1)}px, 0)`;
      });
      if (photo) photo.style.transform = `translate3d(${(nx * -10).toFixed(1)}px, ${(ny * -6).toFixed(1)}px, 0)`;
    };
    const onMove = (e: globalThis.PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const r = el.getBoundingClientRect();
        apply(((e.clientX - r.left) / r.width) * 2 - 1, ((e.clientY - r.top) / r.height) * 2 - 1);
      });
    };
    const onLeave = () => apply(0, 0);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      if (frame) cancelAnimationFrame(frame);
      apply(0, 0);
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
    const r = row.getBoundingClientRect();
    const t = tab.getBoundingClientRect();
    row.scrollBy({ left: t.left - r.left - (r.width - t.width) / 2, behavior: reducedMotion.current ? 'auto' : 'smooth' });
  }, [active]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') step(1);
    else if (e.key === 'ArrowLeft') step(-1);
    else if (e.key === 'Home') go(0);
    else if (e.key === 'End') go(COUNT - 1);
    else return;
    e.preventDefault();
  };

  // Touch and pen. The deck declares touch-action: pan-y, so the browser owns every vertical gesture (the page scrolls under the finger,
  // with its normal momentum) and only hands us movement that is clearly sideways. Direction is decided once, at the first real
  // movement: mostly sideways follows the finger and then moves one menu; anything else is left to the browser (it ends the gesture
  // with pointercancel, which we ignore).
  const settleTrack = () => {
    const t = trackRef.current;
    if (!t) return;
    t.classList.remove('is-dragging');
    t.style.transform = '';
  };
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse') return;
    gesture.current = { id: e.pointerId, x: e.clientX, y: e.clientY, t: performance.now(), lastX: e.clientX, mode: 'pending' };
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const g = gesture.current;
    if (!g || g.id !== e.pointerId) return;
    const dx = e.clientX - g.x;
    const dy = e.clientY - g.y;
    if (g.mode === 'pending') {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      if (Math.abs(dx) <= Math.abs(dy) * 1.6) {
        gesture.current = null; // vertical or diagonal: the page's
        return;
      }
      g.mode = 'h';
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        /* the pointer is already gone */
      }
      trackRef.current?.classList.add('is-dragging');
    }
    g.lastX = e.clientX;
    if (trackRef.current) trackRef.current.style.transform = `translate3d(${(dx * 0.4).toFixed(1)}px, 0, 0)`;
  };
  const onPointerUp = () => {
    const g = gesture.current;
    gesture.current = null;
    settleTrack();
    if (!g || g.mode !== 'h') return;
    const dx = g.lastX - g.x;
    const speed = Math.abs(dx) / Math.max(performance.now() - g.t, 1);
    if (Math.abs(dx) > 64 || (speed > 0.45 && Math.abs(dx) > 28)) step(dx < 0 ? 1 : -1);
  };
  const onPointerCancel = () => {
    gesture.current = null;
    settleTrack();
  };

  const current = foodPackages[active];
  const deckHeight = heights[active] || undefined;

  return (
    <section id="menu" data-scene="07A · FOOD MENU — THE DASTARKHWAN" className="relative overflow-clip bg-ink-2 py-16 md:py-24">
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

        {/* the stage: a dark island. Its tab bar stays in view while a long menu is read, and nothing in it captures a scroll. */}
        <div
          ref={stageRef}
          role="region"
          aria-roledescription="carousel"
          aria-label="Food Menu 2026-27, Menu 1 to Menu 8. Use the arrow keys, the buttons, the tabs or swipe sideways to change menu."
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
          <div aria-hidden className="menu-spot absolute inset-0" />

          <FoodMotion />

          <div className="menu-topbar">
            <Arrow dir="prev" onClick={() => step(-1)} />
            <div ref={tabsRef} className="menu-tabs">
              {foodPackages.map((pkg, i) => (
                <button
                  key={pkg.number}
                  type="button"
                  onClick={() => go(i)}
                  aria-current={i === active}
                  aria-label={`Show Menu ${pkg.number}, ${formatRs(pkg.pricePerPerson)} per person`}
                  className="menu-tab"
                >
                  <span className="menu-tab-name">Menu {pkg.number}</span>
                  <span className="menu-tab-price">{formatRs(pkg.pricePerPerson)}</span>
                </button>
              ))}
            </div>
            <Arrow dir="next" onClick={() => step(1)} />
            <p aria-hidden className="menu-counter">
              {String(active + 1).padStart(2, '0')} / {String(COUNT).padStart(2, '0')}
            </p>
          </div>

          <div
            className="menu-deck"
            style={deckHeight ? { height: deckHeight + DECK_PAD } : { minHeight: 660 }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerCancel}
          >
            <div ref={trackRef} className="menu-track">
              {foodPackages.map((pkg, i) => (
                <MenuCard
                  key={pkg.number}
                  pkg={pkg}
                  pos={positionOf(i, active)}
                  plateHeight={deckHeight}
                  onSelect={() => go(i)}
                  measure={(el) => {
                    contentRefs.current[i] = el;
                  }}
                />
              ))}
            </div>
            <div aria-hidden className="menu-floor" />
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
