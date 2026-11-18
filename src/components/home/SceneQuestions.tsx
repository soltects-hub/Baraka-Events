import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { faqs } from '../../lib/faqs';
import { testimonials } from '../../lib/testimonials';
import { seoConfig } from '../../seo/seoConfig';
import { Label, RevealHeading } from '../../design/components';

/**
 * Homepage scene 07 · Questions families ask (Phase B). The three Google reviews (#testimonials, all of them in the
 * HTML now rather than one at a time) and the twelve FAQs (#faq) with every related link, word for word.
 * The FAQPage structured data is generated from the same faqs list in Home.tsx, so it still matches what is shown.
 * Answers stay in the HTML when closed.
 */
export default function SceneQuestions() {
  return (
    <>
      <section id="testimonials" className="lu-section char-1">
        <div className="lu-wrap lu-stack" style={{ ['--gap' as string]: '36px' }}>
          <div className="lu-split" style={{ alignItems: 'end' }}>
            <div>
              <Label cue>Kind Words</Label>
              <RevealHeading className="lu-h2" lines={['From Google reviews']} />
            </div>
            <p>
              <a className="lu-link" href={seoConfig.organization.mapUrl} target="_blank" rel="noopener noreferrer">
                Read our reviews on Google
              </a>
            </p>
          </div>
          <div className="lu-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))' }}>
            {testimonials.map((t) => (
              <figure key={t.name} className="home-review">
                <blockquote>“{t.quote}”</blockquote>
                <figcaption>
                  <span className="name">{t.name}</span>
                  <span className="lu-label">{t.role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="lu-section">
        <div className="lu-wrap lu-split">
          <div className="lu-stack" style={{ ['--gap' as string]: '18px' }}>
            <Label cue>Questions</Label>
            <RevealHeading className="lu-h2" lines={['Everything you', 'need to know']} />
          </div>
          <div className="lu-qa">
            {faqs.map((f) => (
              <details key={f.q}>
                <summary>
                  <h3>{f.q}</h3>
                  <span className="pm" aria-hidden />
                </summary>
                <div className="answer">
                  <p>{f.a}</p>
                  {f.related && f.related.length > 0 ? (
                    <p className="related">
                      Related:{' '}
                      {f.related.map((l, j) => (
                        <Fragment key={l.to}>
                          {j > 0 ? ' · ' : null}
                          <Link to={l.to} className="lu-link">
                            {l.text}
                          </Link>
                        </Fragment>
                      ))}
                    </p>
                  ) : null}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
