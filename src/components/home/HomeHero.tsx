import { useSectionNav } from '../../lib/useSectionNav';
import { photos } from '../../design/photos';

/**
 * Homepage scene 01 · Arrival (Phase B). Replaces Hero.tsx + Marquee.tsx on the homepage.
 * The H1 text, intro and buttons are word for word the same as before; only verified photography
 * (the hero triptych has no documented source and is held back).
 * The image is an art-directed, pre-darkened copy of gallery/wedding-30: a portrait crop on phones.
 */
const functions = ['Mehndi Nights', 'Baraat Processions', 'Nikkah Ceremonies', 'Walima Receptions', 'Corporate Galas', 'Destination Shaadis'];

export default function HomeHero() {
  const go = useSectionNav();
  return (
    <section id="top" className="lu-hero home-hero" aria-labelledby="home-h1">
      <div className="media">
        <picture>
          <source media="(max-width: 760px)" srcSet="/media/gallery/wedding-30-hero-portrait-600.webp 600w, /media/gallery/wedding-30-hero-portrait-800.webp 676w" sizes="100vw" />
          <img src="/media/gallery/wedding-30-hero-1200.webp" alt={photos.mehndiFloor.alt} width={1200} height={902} fetchPriority="high" decoding="async" />
        </picture>
      </div>
      <div className="scrim" aria-hidden />
      <div className="lu-wrap content">
        <p className="lu-label cue">Event Design &amp; Production — Gulberg, Lahore</p>
        <h1 id="home-h1" className="lu-h1 home-h1">
          Event Planners in Lahore. <span>Weddings, corporate, private.</span>
        </h1>
        <p className="lu-lede intro">
          From mehndi and baraat to product launches and milestone birthdays, we handle the planning, the vendors and the schedule — so you get to actually attend your own event.
        </p>
        <div className="lu-row ctas">
          <button type="button" className="lu-btn cue hero-primary" onClick={() => go('#contact')}>
            <span>Plan Your Event</span>
          </button>
          <button type="button" className="lu-btn" onClick={() => go('#portfolio')}>
            <span>See Our Work</span>
            <span className="lu-arrow" aria-hidden>
              →
            </span>
          </button>
        </div>
        <p className="functions lu-label">
          {functions.map((f, i) => (
            <span key={f}>
              {i > 0 ? <span aria-hidden> · </span> : null}
              {f}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
