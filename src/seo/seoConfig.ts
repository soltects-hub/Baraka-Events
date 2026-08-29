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
    logo: 'https://www.barakaevents.com/favicon.svg',
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
  defaultImage: 'https://www.barakaevents.com/media/portfolio-1.jpg',
  defaultImageAlt: 'Baraka Events - Event Planning and Production in Lahore',
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
};
