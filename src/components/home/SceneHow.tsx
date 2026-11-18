import { Link } from 'react-router-dom';
import { steps } from '../../lib/processSteps';
import { members } from '../../lib/team';
import { photos } from '../../design/photos';
import { Img, Label, ParallaxPair, RevealHeading, Rise } from '../../design/components';

/**
 * Homepage scene 06 · How it comes together (Phase B). Carries, word for word, the former About (#about, with its
 * five links and four stats), The Method (#process) and The Atelier (#team) sections.
 * The About photo (about.webp) has no documented source; the verified walima arch takes its place.
 */
const stats = [
  { value: 'Full-Service', label: 'Planning & Production' },
  { value: 'One Team', label: 'Start to Finish' },
  { value: 'Lahore-Wide', label: 'Venues & Vendors' },
  { value: '15+ Years', label: 'Of Experience' },
];

export default function SceneHow() {
  const leader = members[0];
  return (
    <>
      <section id="about" className="lu-section">
        <div className="lu-wrap lu-split">
          <div className="lu-stack" style={{ ['--gap' as string]: '22px' }}>
            <Label cue>The House of Baraka</Label>
            <RevealHeading className="lu-h2" lines={["We don't just plan your event.", 'We run it.']} />
            <p className="lu-body">
              Baraka Events is an{' '}
              <Link to="/services/event-management" className="lu-link">
                event planning and management company
              </Link>{' '}
              based in Gulberg, Lahore, with 15+ years of experience. We plan and produce{' '}
              <Link to="/services/wedding-planning" className="lu-link">
                weddings
              </Link>
              , corporate events and{' '}
              <Link to="/services/birthday-events" className="lu-link">
                private celebrations
              </Link>{' '}
              across the city — from the havelis of the Walled City to the marquees of DHA and the ballrooms of Gulberg.
            </p>
            <p className="lu-body">
              As a{' '}
              <Link to="/services/wedding-planning" className="lu-link">
                wedding planner in Lahore
              </Link>
              , we treat a shaadi as what it is: mehndi, baraat, nikkah and walima planned as one continuous production, not four separate bookings. A{' '}
              <Link to="/services/corporate-events" className="lu-link">
                corporate event
              </Link>{' '}
              means stage design, lighting and hospitality handled by people who also do this for weddings, so nothing feels improvised. Either way, our founder personally manages your event, supported by our team, with{' '}
              <Link to="/catering" className="lu-link">
                catering
              </Link>{' '}
              from our own kitchen.
            </p>
            <dl className="home-stats">
              {stats.map((s, i) => (
                <Rise key={s.value} i={i}>
                  <dt className="lu-num" style={{ fontSize: 'clamp(28px, 3vw, 40px)' }}>
                    {s.value}
                  </dt>
                  <dd className="lu-label">{s.label}</dd>
                </Rise>
              ))}
            </dl>
          </div>
          <ParallaxPair back={photos.walimaArch} front={photos.qawaliSeating} />
        </div>
      </section>

      <section id="process" className="lu-section char-1">
        <div className="lu-wrap lu-split">
          <div className="lu-stack" style={{ ['--gap' as string]: '22px' }}>
            <Label cue>The Method</Label>
            <RevealHeading className="lu-h2" lines={['How a Baraka event', 'actually comes together']} />
            <p className="lu-lede">Five stages, from the first conversation to the event itself. Nothing here is improvised — it is the same process whatever the size of the guest list.</p>
          </div>
          <ol className="home-steps">
            {steps.map((s, i) => (
              <li key={s.n}>
                <Rise i={i}>
                  <div className="step">
                    <span className="lu-label cue">{s.n}</span>
                    <div>
                      <h3 className="lu-h3">{s.title}</h3>
                      <p className="lu-muted">{s.text}</p>
                    </div>
                  </div>
                </Rise>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="team" className="lu-section">
        <div className="lu-wrap lu-split founder">
          <figure className="lu-plate founder-photo">
            <div className="ph">
              <Img photo={{ ...photos.founder, alt: `${leader.name}, ${leader.role} of Baraka Events` }} sizes="(min-width: 900px) 36vw, 90vw" />
            </div>
          </figure>
          <div className="lu-stack" style={{ ['--gap' as string]: '20px' }}>
            <Label cue>The Atelier</Label>
            <RevealHeading className="lu-h2" lines={['The face behind Baraka']} />
            <p className="lu-lede">Every Baraka production is reviewed personally, from stage layout to final vendor sign-off, before it goes live.</p>
            <hr className="lu-hair" />
            <p className="lu-label">Founder &amp; Chief Executive</p>
            <h3 className="lu-h2" style={{ fontSize: 'clamp(30px, 3.4vw, 46px)' }}>
              {leader.name}
            </h3>
            <p className="lu-label">{leader.role} · Baraka Events</p>
            <p className="lu-body">{leader.bio}</p>
          </div>
        </div>
      </section>
    </>
  );
}
