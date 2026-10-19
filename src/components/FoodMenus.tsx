import { Fragment, useId, useState } from 'react';
import RevealText from './RevealText';
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

function PackageBody({ pkg }: { pkg: FoodPackage }) {
  return (
    <div data-menu-body className="[overflow-wrap:anywhere]">
      {pkg.sections && (
        <div className="space-y-7">
          {pkg.sections.map((s) => (
            <div key={s.label}>
              <h4 className={labelClass}>{s.label}</h4>
              <p className="mt-3 text-[15px] font-light leading-[1.75] text-cream/90">
                <Lines text={s.text} />
              </p>
            </div>
          ))}
        </div>
      )}

      {pkg.dishes && (
        <ul className="gap-x-12 sm:columns-2">
          {pkg.dishes.map((d) => (
            <li key={d.name} className="mb-4 flex break-inside-avoid gap-3">
              <span aria-hidden className="mt-[0.7em] h-1 w-1 shrink-0 rotate-45 bg-bronze" />
              <span>
                <span className="block text-[15px] text-cream">
                  <SoftSlashes text={d.name} />
                </span>
                {d.detail && <span className="mt-0.5 block text-[13px] font-light leading-snug text-mist">{d.detail}</span>}
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8 grid gap-7 border-t border-champagne/12 pt-7 md:grid-cols-2 md:gap-10">
        <div>
          <h4 className={labelClass}>{INCLUDED_LABEL}</h4>
          <p className="mt-3 text-[13px] font-light leading-[1.8] text-mist">
            <SoftSlashes text={pkg.included} />
          </p>
        </div>
        <div>
          <h4 className={labelClass}>{EXCLUDED_LABEL}</h4>
          <p className="mt-3 text-[13px] font-light leading-[1.8] text-mist">{pkg.excluded}</p>
        </div>
      </div>
    </div>
  );
}

function Package({ pkg, open, onToggle }: { pkg: FoodPackage; open: boolean; onToggle: () => void }) {
  const id = useId();
  const buttonId = `${id}-button`;
  const panelId = `${id}-panel`;
  const price = formatRs(pkg.pricePerPerson);
  const enquiry = whatsAppUrl(
    `Assalam-o-Alaikum, I found Baraka Events through your website and would like to know more about Menu ${pkg.number} (${price}/person, minimum ${pkg.minimumGuests} guests).`
  );

  return (
    <article data-menu-package={pkg.number} className="border-b border-champagne/15 first:border-t">
      <h3>
        <button
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="group flex w-full items-center gap-3 py-5 text-left sm:gap-4 md:py-6"
        >
          <span aria-hidden className="accent-serif hidden w-8 shrink-0 text-lg text-champagne/60 sm:block md:w-10 md:text-xl">
            0{pkg.number}
          </span>
          <span className="whitespace-nowrap font-display text-2xl font-light leading-none text-ivory transition-colors duration-300 group-hover:text-champagne md:text-3xl">
            Menu {pkg.number}
          </span>
          <span data-menu-price className="ml-auto flex flex-col items-end whitespace-nowrap sm:flex-row sm:items-baseline sm:gap-1">
            <span className="font-display text-xl font-light leading-tight text-champagne md:text-2xl">{price}</span>
            <span className="text-[12px] leading-tight tracking-wide text-mist-dim">/person</span>
          </span>
          <span aria-hidden className="relative ml-1 h-3 w-3 shrink-0">
            <span className="absolute left-0 top-1/2 h-px w-full bg-champagne" />
            <span
              className={`absolute left-1/2 top-0 h-full w-px bg-champagne transition-transform duration-500 ${open ? 'scale-y-0' : ''}`}
            />
          </span>
        </button>
      </h3>

      {/* the content stays in the page when closed (crawlers, print), but is inert and collapsed */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        inert={!open}
        style={{ gridTemplateRows: open ? '1fr' : '0fr', opacity: open ? 1 : 0 }}
        className="grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
      >
        <div className="overflow-hidden">
          <div className="pb-8 pl-0 pr-0 pt-1 md:pb-10 md:pl-14">
            <PackageBody pkg={pkg} />
            <div className="mt-8 flex flex-col gap-4 border-t border-champagne/12 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="flex flex-wrap items-baseline gap-x-6 gap-y-1.5 text-mist">
                <span data-menu-min className="whitespace-nowrap text-[12px] uppercase tracking-[0.2em]">
                  Minimum guests: <span className="text-ivory">{pkg.minimumGuests}</span>
                </span>
                <span className="whitespace-nowrap text-[14px] tracking-wide">
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
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

/** A plate with fork, knife and spoon in fine lines: the motif on the menu's printed cover. */
function PlateMotif() {
  return (
    <svg viewBox="0 0 220 200" fill="none" aria-hidden className="h-auto w-44 text-champagne/45" stroke="currentColor" strokeWidth="1">
      <circle cx="110" cy="100" r="82" />
      <circle cx="110" cy="100" r="66" opacity="0.45" />
      {/* fork */}
      <path d="M78 58v26M84 58v26M90 58v26M78 84q6 12 12 0M84 96v50" strokeLinecap="round" />
      {/* knife */}
      <path d="M110 56c7 9 7 36 0 46v44" strokeLinecap="round" />
      {/* spoon */}
      <ellipse cx="138" cy="72" rx="9" ry="14" />
      <path d="M138 86v60" strokeLinecap="round" />
    </svg>
  );
}

export default function FoodMenus() {
  const [openNumber, setOpenNumber] = useState<number | null>(1);
  const askAboutMenus = whatsAppUrl(
    'Assalam-o-Alaikum, I found Baraka Events through your website and would like to know more about your 2026-27 food menus.'
  );

  return (
    <section id="menu" data-scene="07A · FOOD MENU — THE DASTARKHWAN" className="relative overflow-hidden bg-ink-2 py-20 md:py-36">
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 h-[400px] w-[700px] rounded-full"
        style={{ background: 'radial-gradient(ellipse closest-side, rgba(230,197,138,0.14), transparent)' }}
      />

      <div className="relative mx-auto grid max-w-[1400px] gap-14 px-6 md:px-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="mb-4 text-[11px] uppercase tracking-[0.3em] text-champagne">The Baraka Kitchen</p>
          <RevealText
            as="h2"
            text="A dastarkhwan worth remembering"
            className="font-display text-4xl font-light leading-[1.1] md:text-6xl"
            highlightWords={[2, 3]}
            highlightClass="accent-serif"
          />
          <p className="mt-6 max-w-md text-base font-light leading-[1.75] text-mist">
            Our Food Menu 2026&ndash;27: eight set packages, Menu 1 to Menu 8, each priced per person for a minimum of{' '}
            {MINIMUM_GUESTS} guests. Open any menu to see its full dish list and what is included and excluded.
          </p>

          <dl className="mt-10 grid max-w-md grid-cols-3 gap-6 border-t border-champagne/12 pt-8">
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
            className="btn-flame mt-10 inline-flex items-center justify-center gap-2.5 rounded-full px-8 py-4 text-[12px] font-medium uppercase tracking-[0.22em]"
          >
            Ask about a menu
          </a>

          <div className="mt-14 hidden lg:block">
            <PlateMotif />
          </div>
        </div>

        <div>
          <div>
            {foodPackages.map((pkg) => (
              <Package
                key={pkg.number}
                pkg={pkg}
                open={openNumber === pkg.number}
                onToggle={() => setOpenNumber(openNumber === pkg.number ? null : pkg.number)}
              />
            ))}
          </div>
          <p className="mt-8 text-[11px] uppercase tracking-[0.22em] text-mist-dim">
            All prices are per person &middot; minimum {MINIMUM_GUESTS} guests per package
          </p>
        </div>
      </div>
    </section>
  );
}
