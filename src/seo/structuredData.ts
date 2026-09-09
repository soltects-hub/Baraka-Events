/**
 * Structured Data (JSON-LD) Utilities
 * Generate proper schema markup for SEO
 */

import { seoConfig } from './seoConfig';

function absoluteUrl(url: string): string {
  if (/^https?:\/\//i.test(url)) return url;
  return `${seoConfig.site.url}${url.startsWith('/') ? '' : '/'}${url}`;
}

/**
 * Stable identifier for the Baraka Events entity, referenced by other
 * schema blocks (see generateWebsiteSchema) so Google's entity graph can
 * resolve the WebSite and the LocalBusiness as facets of one thing rather
 * than two separately-guessed entities.
 */
export const ORGANIZATION_ID = seoConfig.site.url + '/#organization';

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': ORGANIZATION_ID,
    name: seoConfig.organization.name,
    url: seoConfig.organization.url,
    logo: seoConfig.organization.logo,
    description: seoConfig.site.description,
    image: seoConfig.defaultImage,
    // Top-level, in addition to contactPoint below — Google's local-business
    // guidance reads telephone/email at this level for Maps/Local Pack
    // matching; contactPoint alone is not always picked up the same way.
    telephone: seoConfig.organization.contact.telephone,
    email: seoConfig.organization.contact.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: seoConfig.organization.address.streetAddress,
      addressLocality: seoConfig.organization.address.addressLocality,
      addressRegion: seoConfig.organization.address.addressRegion,
      postalCode: seoConfig.organization.address.postalCode,
      addressCountry: seoConfig.organization.address.addressCountry,
    },
    // Same coordinates already used for the embedded map on the Contact
    // page (LocationMap.tsx) — not a new claim, just mirrored into schema.
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 31.5104519,
      longitude: 74.3401031,
    },
    // The live Google Maps place this business is already listed under —
    // ties the site's own entity markup directly to the real GBP/Maps
    // listing rather than leaving Google to infer the connection.
    hasMap: seoConfig.organization.mapUrl,
    // Real hours, already published as visible text in LocationMap.tsx.
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: seoConfig.organization.openingHours.dayOfWeek,
      opens: seoConfig.organization.openingHours.opens,
      closes: seoConfig.organization.openingHours.closes,
    },
    // Matches the areas already named in the site's own "Where We Work"
    // content (ExperiencesPage) — not a claim beyond what's published.
    areaServed: [
      'Lahore',
      'Gulberg',
      'DHA Lahore',
      'Model Town',
      'Johar Town',
      'Bahria Town Lahore',
      'Lahore Cantt',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: seoConfig.organization.contact.telephone,
      contactType: 'Customer Service',
      areaServed: 'PK',
      email: seoConfig.organization.contact.email,
    },
    sameAs: seoConfig.organization.sameAs,
  };
}

/**
 * FAQPage schema — pass the same Q&A pairs already rendered on-page.
 * Never write copy here; this only mirrors visible content into markup.
 */
export function generateFAQSchema(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a,
      },
    })),
  };
}

/**
 * Service schema for one offering (Wedding Planning, Corporate Events,
 * etc.) — links back to the Organization as provider rather than
 * repeating its details.
 */
export function generateServiceSchema(service: { name: string; description: string; url: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: service.name,
    name: service.name,
    description: service.description,
    provider: {
      '@type': 'LocalBusiness',
      name: seoConfig.organization.name,
      url: seoConfig.organization.url,
    },
    areaServed: 'Lahore, Pakistan',
    url: absoluteUrl(service.url),
  };
}

/**
 * Website schema with search action
 */
export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    // Stable so the WebSite node stays one entity even though it is currently
    // emitted on both Home and Contact (see ContactPage.tsx) rather than once.
    '@id': seoConfig.site.url + '/#website',
    name: seoConfig.site.name,
    url: seoConfig.site.url,
    description: seoConfig.site.description,
    image: seoConfig.defaultImage,
    // Ties the WebSite to the LocalBusiness entity (ORGANIZATION_ID, applied
    // sitewide by App.tsx's OrganizationSchema) so Google's entity graph
    // reads them as one business rather than two independently-guessed ones.
    publisher: { '@id': ORGANIZATION_ID },
  };
}

/**
 * Blog post (Article) schema
 */
export function generateArticleSchema(metadata: {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  publishedDate: string;
  modifiedDate?: string;
  author?: string;
  slug: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: metadata.title,
    description: metadata.description,
    image: {
      '@type': 'ImageObject',
      url: absoluteUrl(metadata.image),
      name: metadata.imageAlt,
    },
    datePublished: metadata.publishedDate,
    dateModified: metadata.modifiedDate || metadata.publishedDate,
    author: {
      '@type': 'Organization',
      name: metadata.author || seoConfig.organization.name,
    },
    publisher: {
      '@type': 'Organization',
      name: seoConfig.organization.name,
      logo: {
        '@type': 'ImageObject',
        url: seoConfig.organization.logo,
      },
    },
    url: `${seoConfig.site.url}/blog/${metadata.slug}`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${seoConfig.site.url}/blog/${metadata.slug}`,
    },
  };
}

/**
 * Breadcrumb schema for blog navigation
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  const breadcrumbList = items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbList,
  };
}

/**
 * Apply structured data to document head
 */
export function applyStructuredData(schema: Record<string, unknown>, id: string = 'structured-data') {
  if (typeof document === 'undefined') return;

  // Remove existing script if present
  const existing = document.getElementById(id);
  if (existing) {
    existing.remove();
  }

  // Create and append new script
  const script = document.createElement('script');
  script.id = id;
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}

/**
 * Compose multiple schemas into a graph
 */
export function composeSchemaGraph(schemas: Record<string, unknown>[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': schemas,
  };
}
