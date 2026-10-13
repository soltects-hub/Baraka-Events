/**
 * SEO Configuration for Baraka Events
 * Centralized SEO metadata configuration
 */

export const seoConfig = {
  site: {
    name: 'Baraka Events',
    // Real Search Console data (URL Inspection) confirms Google selects
    // https://www.barakaevents.com/ as the canonical host — the apex domain
    // barakaevents.com is not attached to the Vercel project and redirects
    // to www at the DNS/registrar level. Every canonical/OG/sitemap URL must
    // match the host that's actually served, or Google keeps treating pages
    // as redirects instead of indexing them.
    url: 'https://www.barakaevents.com',
    locale: 'en_US',
    description:
      'Baraka Events is an event planning and management company based in Gulberg III, Lahore. We plan weddings, mehndi and baraat functions, corporate events and private celebrations across the city.',
  },
  organization: {
    name: 'Baraka Events',
    url: 'https://www.barakaevents.com',
    logo: 'https://www.barakaevents.com/web-app-manifest-512x512.png',
    address: {
      streetAddress: 'LG 13A, Big City Plaza, Liberty Roundabout',
      addressLocality: 'Lahore',
      addressRegion: 'Punjab',
      postalCode: '54000',
      addressCountry: 'PK',
    },
    contact: {
      email: 'Booking@barakaevents.com',
      telephone: '+92 313 9999039',
    },
    // The Google Maps place link already used as the "Get Directions" href in
    // LocationMap.tsx (CID 0xc453244142e6eefe) — single-sourced here so the
    // structured-data hasMap property can never drift from what the page
    // actually links to.
    mapUrl: 'https://maps.app.goo.gl/iXCcf5Ko2GKd6vjk7',
    // Real hours, already published as visible text in LocationMap.tsx's
    // "quick facts" row — mirrored here, not a new claim.
    openingHours: {
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '11:00',
      closes: '20:00',
    },
    sameAs: [
      'https://instagram.com/Barakaeventsofficial',
      'https://facebook.com/Barakaeventsofficial',
      'https://youtube.com/@Barakaeventsofficial',
      'https://linkedin.com/company/Barakaeventsofficial',
    ],
  },
  social: {
    twitter: '@Barakaeventsofficial',
    facebook: 'Barakaeventsofficial',
    instagram: 'Barakaeventsofficial',
  },
  // The brand logo, deliberately, not a photograph. The previous default (a courtyard-wedding photograph) was removed
  // from the site on 2026-10-09 at the owner's request and must not return through this fallback. A page that has a real
  // photo of its own passes it to useSEO({ image }).
  defaultImage: 'https://www.barakaevents.com/web-app-manifest-512x512.png',
  defaultImageAlt: 'Baraka Events logo',
};

export const routes = {
  home: '/',
  about: '/about',
  experiences: '/experiences',
  portfolio: '/portfolio',
  gallery: '/gallery',
  team: '/team',
  contact: '/contact',
  blog: '/blog',
  blogPost: (slug: string) => `/blog/${slug}`,
  services: '/services',
  servicePage: (slug: string) => `/services/${slug}`,
  // Foundation-phase routes (architecture proposal approved 2026-09-29,
  // Phase 1) — src/lib/venues.ts and src/lib/vendors.ts ship empty until
  // Phase 2 adds real, verified listings.
  venues: '/venues',
  venuePage: (slug: string) => `/venues/${slug}`,
  vendors: '/vendors',
  vendorPage: (slug: string) => `/vendors/${slug}`,
};
