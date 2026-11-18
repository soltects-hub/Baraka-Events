import { Link } from 'react-router-dom';
import { EXCLUDED_LABEL, INCLUDED_LABEL, foodPackages, formatRs, highestPrice, lowestPrice } from '../../lib/foodMenu';
import { whatsAppUrl } from '../../lib/whatsapp';
import { Lines, SoftSlashes } from '../MenuText';
import { Img, Label, RevealHeading } from '../../design/components';
import { photos } from '../../design/photos';

/**
 * Homepage scene 05 · The dastarkhwan (Phase B, ivory paper). Replaces the 3D menu deck (FoodMenus.tsx) on the
 * homepage with eight expandable rows. Every menu's full content (dishes, INCLUDED, EXCLUDED) is in the HTML,
 * open or closed, so the page carries the same text as before. Both WhatsApp tracking calls are unchanged:
 * contact_click {whatsapp, food_menu} for the general button and {whatsapp, food_menu, menu: n} per menu.
 * Guest count is "flexible" (owner-confirmed, 6 Nov 2026), as on the live site.
 */
const askAboutMenus = whatsAppUrl(
  'Assalam-o-Alaikum, I found Baraka Events through your website and would like to know more about your 2026-27 food menus.',
);

export default function SceneFood() {
  return (
    <section id="menu" className="lu-section paper home-menu">
      <div className="lu-wrap lu-stack" style={{ ['--gap' as string]: '44px' }}>
        <div className="lu-split" style={{ alignItems: 'end' }}>
          <div className="lu-stack" style={{ ['--gap' as string]: '18px' }}>
            <Label>The Baraka Kitchen</Label>
            <RevealHeading className="lu-h2" lines={['A dastarkhwan worth remembering']} />
            <p className="lu-lede">
              Our Food Menu 2026–27: eight set packages, Menu 1 to Menu 8, each priced per person, from our own kitchen and catering team. Browse the menus below to see each full dish list, or{' '}
              <Link to="/catering" className="lu-link">
                see our catering services
              </Link>
              .
            </p>
          </div>
          <div className="lu-stack" style={{ ['--gap' as string]: '24px' }}>
            <dl className="menu-stats">
              <div>
                <dt className="lu-label">Packages</dt>
                <dd className="lu-num">{foodPackages.length}</dd>
              </div>
              <div>
                <dt className="lu-label">Per person</dt>
                <dd>
                  <span className="price">{formatRs(lowestPrice)}</span>
                  <span className="sub">to {formatRs(highestPrice)}</span>
                </dd>
              </div>
              <div>
                <dt className="lu-label">Guests</dt>
                <dd>
                  <span className="price">Flexible</span>
                  <span className="sub">ask us</span>
                </dd>
              </div>
            </dl>
            <div className="lu-row">
              <a className="lu-btn" href={askAboutMenus} target="_blank" rel="noopener noreferrer" onClick={() => window.gtag?.('event', 'contact_click', { method: 'whatsapp', location: 'food_menu' })}>
                <span>Ask about a menu</span>
                <span className="lu-arrow" aria-hidden>
                  →
                </span>
              </a>
            </div>
          </div>
        </div>

        <div className="menu-layout">
        <figure className="lu-plate menu-photo">
          <div className="ph">
            <Img photo={photos.cateringCounter} sizes="(min-width: 900px) 30vw, 90vw" />
          </div>
        </figure>
        <div className="menu-rows">
          {foodPackages.map((pkg) => {
            const price = formatRs(pkg.pricePerPerson);
            const enquiry = whatsAppUrl(`Assalam-o-Alaikum, I found Baraka Events through your website and would like to know more about Menu ${pkg.number} (${price}/person).`);
            return (
              <details key={pkg.number} className="menu-row" data-menu-package={pkg.number}>
                <summary>
                  <h3 className="name">Menu {pkg.number}</h3>
                  <span className="price">
                    {price}
                    <span className="unit">/person</span>
                  </span>
                  <span className="pm" aria-hidden />
                </summary>
                <div className="menu-body">
                  {pkg.sections ? (
                    <div className="sections">
                      {pkg.sections.map((s) => (
                        <div key={s.label}>
                          <h4 className="lu-label">{s.label}</h4>
                          <p>
                            <Lines text={s.text} />
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : null}
                  {pkg.dishes ? (
                    <ul className="dishes">
                      {pkg.dishes.map((d) => (
                        <li key={d.name}>
                          <span className="dish">
                            <SoftSlashes text={d.name} />
                          </span>
                          {d.detail ? <span className="detail">{d.detail}</span> : null}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  <div className="incl">
                    <div>
                      <h4 className="lu-label">{INCLUDED_LABEL}</h4>
                      <p>
                        <SoftSlashes text={pkg.included} />
                      </p>
                    </div>
                    <div>
                      <h4 className="lu-label">{EXCLUDED_LABEL}</h4>
                      <p>{pkg.excluded}</p>
                    </div>
                  </div>
                  <div className="foot">
                    <span className="lu-label">Guest count: flexible</span>
                    <a className="lu-link" href={enquiry} target="_blank" rel="noopener noreferrer" onClick={() => window.gtag?.('event', 'contact_click', { method: 'whatsapp', location: 'food_menu', menu: pkg.number })}>
                      Ask about Menu {pkg.number} →
                    </a>
                  </div>
                </div>
              </details>
            );
          })}
        </div>
        </div>

        <div className="lu-stack" style={{ ['--gap' as string]: '8px' }}>
          <p className="lu-label">All prices are per person · guest count is flexible, so tell us yours</p>
          <p className="lu-muted" style={{ fontSize: 13, maxWidth: '72ch' }}>
            Photography shows buffet stations and crockery from our catering set-ups. It illustrates the service, not a particular dish; every menu is listed exactly as printed.
          </p>
        </div>
      </div>
    </section>
  );
}
