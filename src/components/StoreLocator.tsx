import { useEffect, useRef, useState } from 'react';
import {
  BARAKA_LOCATION,
  ECL_SRC,
  MAPS_API_KEY,
  MAPS_MAP_ID,
  isStoreLocatorConfigured,
} from '../lib/storeLocatorConfig';

/**
 * Google Maps Store Locator (Extended Component Library), themed to the site's
 * own palette rather than the library's default light-and-blue look.
 *
 * Only rendered when a Maps key and Map ID are configured — LocationMap checks
 * first and otherwise keeps the existing keyless iframe. See
 * src/lib/storeLocatorConfig.ts for the configuration contract.
 */

interface StoreLocatorElement extends HTMLElement {
  configureFromQuickBuilder?: (config: unknown) => void;
}

/** True once the library has been fetched at least once this page load. */
function eclAlreadyLoaded(): boolean {
  if (typeof document === 'undefined') return false;
  return document.querySelector(`script[src="${ECL_SRC}"][data-loaded="true"]`) !== null;
}

export default function StoreLocator() {
  const hostRef = useRef<HTMLDivElement>(null);
  // Read synchronously rather than setting state inside the effect, so a
  // remount after the library is cached does not trigger a cascading render.
  const [ready, setReady] = useState(eclAlreadyLoaded);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!isStoreLocatorConfigured() || ready) return;
    // Puppeteer drives the prerender pass and scrolls every page, which would
    // otherwise pull the whole Maps bundle into the captured HTML and hold
    // sockets open past networkidle0. Static output must never contain a
    // rendered map.
    if (typeof navigator !== 'undefined' && navigator.webdriver) return;

    let cancelled = false;
    const onLoad = () => !cancelled && setReady(true);
    const onError = () => !cancelled && setFailed(true);

    const existing = document.querySelector<HTMLScriptElement>(`script[src="${ECL_SRC}"]`);
    if (existing) {
      existing.addEventListener('load', onLoad);
      existing.addEventListener('error', onError);
      return () => {
        cancelled = true;
        existing.removeEventListener('load', onLoad);
        existing.removeEventListener('error', onError);
      };
    }

    const script = document.createElement('script');
    script.type = 'module';
    script.src = ECL_SRC;
    script.async = true;
    script.addEventListener('load', () => {
      script.dataset.loaded = 'true';
      onLoad();
    });
    script.addEventListener('error', onError);
    document.head.appendChild(script);

    return () => {
      cancelled = true;
    };
  }, [ready]);

  useEffect(() => {
    const host = hostRef.current;
    if (!ready || !host) return;
    let cancelled = false;

    (async () => {
      try {
        await customElements.whenDefined('gmpx-store-locator');
        if (cancelled) return;

        // Built with createElement rather than JSX because `key` is reserved by
        // React and would never reach the DOM — and `key` is precisely the
        // attribute gmpx-api-loader reads.
        host.replaceChildren();
        const loader = document.createElement('gmpx-api-loader');
        loader.setAttribute('key', MAPS_API_KEY as string);
        loader.setAttribute('solution-channel', 'GMP_QB_locatorplus_v11_cF');
        const locator = document.createElement('gmpx-store-locator') as StoreLocatorElement;
        locator.setAttribute('map-id', MAPS_MAP_ID as string);
        host.append(loader, locator);

        locator.configureFromQuickBuilder?.({
          locations: [BARAKA_LOCATION],
          mapOptions: {
            center: BARAKA_LOCATION.coords,
            zoom: 16,
            maxZoom: 18,
            fullscreenControl: true,
            mapTypeControl: false,
            streetViewControl: false,
            zoomControl: true,
            mapId: MAPS_MAP_ID,
          },
          mapsApiKey: MAPS_API_KEY,
          // One office: a search box and distance ranking would be noise.
          // `details` stays off because we hold no Places API Place ID.
          capabilities: {
            input: false,
            autocomplete: false,
            directions: false,
            distanceMatrix: false,
            details: false,
            actions: true,
          },
        });
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [ready]);

  if (!isStoreLocatorConfigured() || failed) return null;

  return (
    <div
      ref={hostRef}
      className="baraka-locator relative h-[380px] w-full bg-ink-3 md:h-[480px]"
      aria-label="Baraka Events office location map"
    />
  );
}
