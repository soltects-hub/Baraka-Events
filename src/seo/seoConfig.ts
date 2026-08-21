/**
 * SEO Configuration for Baraka Events
 * Centralized SEO metadata configuration
 */

export const seoConfig = {
  site: {
    name: 'Baraka Events',
    url: 'https://barakaevents.com',
    locale: 'en_US',
    description:
      "Baraka Events crafts Lahore's most extraordinary luxury shaadis, mehndi nights, corporate galas and private celebrations. Full-service event design and production.",
  },
  organization: {
    name: 'Baraka Events',
    url: 'https://barakaevents.com',
    logo: 'https://barakaevents.com/favicon.svg',
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
  defaultImage: 'https://barakaevents.com/media/portfolio-1.jpg',
  defaultImageAlt: 'Baraka Events - Luxury Event Production in Lahore',
};

export const routes = {
  home: '/',
  blog: '/blog',
  blogPost: (slug: string) => `/blog/${slug}`,
};
