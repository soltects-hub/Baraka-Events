import { Link } from 'react-router-dom';
import { experiences } from '../../lib/experiences';
import { corporateEventTypes } from '../../lib/corporateEventTypes';
import { photos, type Photo } from '../../design/photos';
import { Img, Label, RevealHeading } from '../../design/components';

/**
 * Homepage scene 02 · What are you planning? (Phase B). Carries the three "Signature Experiences" cards
 * (StickyServices.tsx) in full, and the corporate event types (BrandsMarquee.tsx).
 * Verified photos only: the Private Celebrations card's dinner photo has no documented source, so it shows
 * the verified birthday wall from the gallery instead.
 */
const cardPhoto: Record<string, Photo> = {
  Weddings: photos.baraatLounge,
  'Corporate Events': photos.corporateBallroom,
  'Private Celebrations': photos.birthdayWall,
};
const cardLink: Record<string, string> = {
  Weddings: '/services/wedding-planning',
  'Corporate Events': '/services/corporate-events',
  'Private Celebrations': '/services/birthday-events',
};

export default function ScenePlanning() {
  return (
    <section id="experiences" className="lu-section char-1">
      <div className="lu-wrap lu-stack" style={{ ['--gap' as string]: '48px' }}>
        <div className="lu-split" style={{ alignItems: 'end' }}>
          <div>
            <Label cue>Signature Experiences</Label>
            <RevealHeading className="lu-h2" lines={['One team for every', 'part of the evening.']} />
          </div>
          <p className="lu-lede">Weddings, corporate events and private celebrations. Choose where to start.</p>
        </div>

        <div className="lu-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))' }}>
          {experiences.map((x) => (
            <Link key={x.title} to={cardLink[x.title]} className="lu-card">
              <div className="ph">
                <Img photo={cardPhoto[x.title]} sizes="(min-width: 1100px) 32vw, (min-width: 700px) 48vw, 92vw" />
                <p className="lu-label cue index">{x.index}</p>
              </div>
              <div className="body">
                <h3 className="lu-h3">{x.title}</h3>
                <p className="lu-label">{x.tagline}</p>
                <p className="lu-muted" style={{ fontSize: 15 }}>
                  {x.description}
                </p>
                <ul className="lu-details">
                  {x.details.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
                <div className="cueline" aria-hidden />
              </div>
            </Link>
          ))}
        </div>

        <div className="lu-split corporate-types" style={{ borderTop: '1px solid var(--lu-rule)', paddingTop: 40 }}>
          <div>
            <Label>Corporate Work</Label>
            <h3 className="lu-h2" style={{ fontSize: 'clamp(26px, 3vw, 40px)' }}>
              The kinds of corporate events we plan
            </h3>
          </div>
          <div>
            <ul className="lu-typelist" aria-label="Corporate event types we plan for companies in Lahore">
              {corporateEventTypes.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <p className="lu-visually-hidden">Corporate event types we plan for companies in Lahore</p>
          </div>
        </div>
      </div>
    </section>
  );
}
