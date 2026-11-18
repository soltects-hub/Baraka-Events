import { Link } from 'react-router-dom';
import { useSectionNav } from '../../lib/useSectionNav';
import { photos, type Photo } from '../../design/photos';
import { Img, Label, Rail, RevealHeading } from '../../design/components';

/**
 * Homepage scene 04 · Real events (Phase B). Brings together, word for word, the verified items of four former
 * sections: Selected Work (HorizontalPortfolio.tsx, #portfolio), Signature Productions (DesignStudio.tsx, #studio),
 * The Archive (DepthFlythrough.tsx) and The Showreel (Gallery.tsx, #gallery).
 * Held back until the owner confirms their source (their images are undocumented): "The Baraat Canopy",
 * "The Chandelier Canopy" (archive), and showreel frames 03 to 06.
 */
const selected: { kicker: string; title: string; details: string; photo: Photo; alt: string }[] = [
  { kicker: '01 — Walima', title: 'A Walima Floral Arch', details: 'Rose arch · bead garlands · crystal chandeliers', photo: photos.walimaArch, alt: 'Walima floral arch of white and blush roses under hanging bead garlands and crystal chandeliers' },
  { kicker: '02 — Corporate Event', title: 'A Branded LED Stage', details: 'LED screens · truss lighting · stage platform', photo: photos.corporateHall, alt: 'Event hall with red truss arches, LED screens and a circular central platform' },
  { kicker: '03 — Private Celebration', title: 'A Birthday Backdrop', details: 'Flower wall · neon sign · balloon columns', photo: photos.birthdayWall, alt: 'White flower wall with a Happy Birthday neon sign between two pink balloon columns' },
];

const productions: { category: string; title: string; n: string; caption: string; photo: Photo }[] = [
  { category: 'Wedding Reception', title: 'The Walima Floor', n: '01', caption: 'Chandelier canopy · floral arches · ambient lighting', photo: photos.baraatLounge },
  { category: 'Wedding Reception', title: 'Arches & Ambient Light', n: '02', caption: 'Moorish arches · ivory floral · layered light', photo: photos.mehndiCeiling },
];

const archive: { category: string; title: string; photo: Photo; alt: string }[] = [
  { category: 'Corporate Event', title: 'A Ballroom Stage Set-Up', photo: photos.corporateBallroom, alt: 'Ballroom conference set-up with a lighting truss, LED stage screen, red carpet aisle and round tables' },
  { category: 'Wedding', title: 'An Evening Wedding Stage', photo: photos.walimaStage, alt: 'Evening wedding stage under a draped pink and white ceiling with a crystal chandelier and tall floral urns' },
  { category: 'Corporate Event', title: 'A Stage with LED Screens', photo: photos.corporateStage, alt: 'Stage with an LED screen, truss lighting and red balloon decor in a chandeliered hall' },
  { category: 'Private Celebration', title: 'A Floral Wall Installation', photo: photos.birthdayWall, alt: 'White flower wall with a Happy Birthday neon sign between two pink balloon columns' },
];

const showreel: { n: string; category: string; title: string; caption: string; photo: Photo; alt: string }[] = [
  { n: '01', category: 'Walima Reception', title: 'The reception floor', caption: 'Chandeliers, drapery and floral built for one evening', photo: photos.baraatLounge, alt: 'Lounge seating facing a stage of hanging chandeliers and greenery between red velvet drapes' },
  { n: '02', category: 'Walima Reception', title: 'Arches & ambient light', caption: 'A room reshaped with light, not just decor', photo: photos.mehndiCeiling, alt: 'Stage under a ceiling of blush flowers and hanging crystal garlands with a lotus-pattern lit floor' },
];

function Frame({ photo, alt, ratio = '4 / 5', sizes = '(min-width: 700px) 420px, 78vw', children }: { photo: Photo; alt: string; ratio?: string; sizes?: string; children: React.ReactNode }) {
  return (
    <figure className="lu-plate lu-frame">
      <div className="ph" style={{ aspectRatio: ratio }}>
        <Img photo={{ ...photo, alt }} sizes={sizes} />
      </div>
      <figcaption>{children}</figcaption>
    </figure>
  );
}

export default function SceneWork() {
  const go = useSectionNav();
  return (
    <section id="portfolio" className="lu-section">
      <div className="lu-wrap lu-stack" style={{ ['--gap' as string]: '56px' }}>
        <div className="lu-split" style={{ alignItems: 'end' }}>
          <div>
            <Label cue>Selected Work</Label>
            <RevealHeading className="lu-h2" lines={['Three events,', 'one standard']} />
          </div>
          <p className="lu-lede">A walima floral arch, a branded LED stage and a birthday backdrop — different briefs from our archive.</p>
        </div>

        <Rail label="Selected work">
          {selected.map((s) => (
            <Frame key={s.title} photo={s.photo} alt={s.alt}>
              <span className="lu-label cue">{s.kicker}</span>
              <span className="t">{s.title}</span>
              <span>{s.details}</span>
            </Frame>
          ))}
          <div className="lu-frame yours">
            <p className="lu-h2" style={{ fontSize: 'clamp(30px, 3.4vw, 44px)' }}>
              Yours is next.
            </p>
            <button type="button" className="lu-btn" onClick={() => go('#contact')}>
              <span>Plan Your Event</span>
              <span className="lu-arrow" aria-hidden>
                →
              </span>
            </button>
          </div>
        </Rail>

        <div id="studio" className="lu-split studio" style={{ borderTop: '1px solid var(--lu-rule)', paddingTop: 48, scrollMarginTop: 90 }}>
          <div className="lu-stack" style={{ ['--gap' as string]: '18px' }}>
            <Label>Signature Productions</Label>
            <h3 className="lu-h2" style={{ fontSize: 'clamp(28px, 3.4vw, 46px)' }}>
              Built the way it's imagined
            </h3>
            <p className="lu-body">
              Every{' '}
              <Link to="/services/event-decoration" className="lu-link">
                stage, floral program and lighting plan
              </Link>{' '}
              is designed as one system before a single vendor is briefed. These are real productions, not renders.
            </p>
            <p className="lu-label">Designed, planned and managed by our team, start to finish</p>
          </div>
          <div className="lu-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))' }}>
            {productions.map((p) => (
              <Frame key={p.title} photo={p.photo} alt={p.photo.alt} ratio="4 / 5" sizes="(min-width: 900px) 30vw, 90vw">
                <span className="lu-label cue">
                  {p.n} · {p.category}
                </span>
                <span className="t">{p.title}</span>
                <span>{p.caption}</span>
              </Frame>
            ))}
          </div>
        </div>

        <div className="lu-stack" style={{ ['--gap' as string]: '28px', borderTop: '1px solid var(--lu-rule)', paddingTop: 48 }}>
          <div className="lu-grid archive-intros" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))' }}>
            <div>
              <Label>The Archive</Label>
              <h3 className="lu-h3" style={{ fontSize: 'clamp(24px, 2.4vw, 32px)', marginTop: 8 }}>
                Enter the archive
              </h3>
              <p className="lu-body" style={{ marginTop: 10 }}>
                A selection of celebrations, productions and experiences we’ve brought to life.
              </p>
            </div>
            <div id="gallery" style={{ scrollMarginTop: 90 }}>
              <Label>The Showreel</Label>
              <h3 className="lu-h3" style={{ fontSize: 'clamp(24px, 2.4vw, 32px)', marginTop: 8 }}>
                Production, in motion
              </h3>
              <p className="lu-body" style={{ marginTop: 10 }}>
                Behind every seamless event is serious machinery.
              </p>
            </div>
          </div>
          <Rail label="The archive and showreel">
            {archive.map((a) => (
              <Frame key={a.title} photo={a.photo} alt={a.alt}>
                <span className="lu-label cue">{a.category}</span>
                <span className="t">{a.title}</span>
              </Frame>
            ))}
            {showreel.map((f) => (
              <Frame key={f.title} photo={f.photo} alt={f.alt}>
                <span className="lu-label cue">
                  {f.n} · {f.category}
                </span>
                <span className="t">{f.title}</span>
                <span>{f.caption}</span>
              </Frame>
            ))}
          </Rail>
        </div>
      </div>
    </section>
  );
}
