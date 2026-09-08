/**
 * Configuration for the Google Maps Store Locator (src/components/StoreLocator.tsx).
 *
 * Kept out of the component file so LocationMap can ask whether the locator is
 * configured without importing the component — and so the component module has
 * a single export, which is what react-refresh needs to hot-reload it.
 *
 * The Maps JavaScript API needs a billable API key and a Map ID. Neither belongs
 * in source control, so both come from Vite env vars at build time. When either
 * is missing the locator never renders and LocationMap keeps its existing
 * keyless Google Maps iframe, so the site works with nothing configured.
 *
 * A Maps JS key is necessarily visible in client-side code — that is how the API
 * works, and it is not a secret in the way a server key is. It must still be
 * referrer-restricted to the production host, or it can be used elsewhere at
 * your expense. See .env.example for the exact setup.
 */

export const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
export const MAPS_MAP_ID = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID as string | undefined;

/** Pinned so a library update can never silently change what ships. */
export const ECL_SRC =
  'https://ajax.googleapis.com/ajax/libs/@googlemaps/extended-component-library/0.6.15/index.min.js';

/**
 * The real office. Matches src/seo/seoConfig.ts and the LocalBusiness schema
 * exactly, and the coordinates are the ones Google itself holds for the place
 * the site's footer links to — so the locator, the schema and the Maps listing
 * all describe one location rather than three slightly different ones.
 */
export const BARAKA_LOCATION = {
  title: 'Baraka Events',
  address1: 'Office LG 13A, Big City Plaza, Liberty Roundabout',
  address2: 'Main Boulevard, Gulberg III, Lahore 54000, Pakistan',
  coords: { lat: 31.5104519, lng: 74.3401031 },
  actions: [
    {
      label: 'Get directions',
      defaultUrl: 'https://maps.app.goo.gl/iXCcf5Ko2GKd6vjk7',
    },
  ],
};

export function isStoreLocatorConfigured(): boolean {
  return Boolean(MAPS_API_KEY && MAPS_MAP_ID);
}
