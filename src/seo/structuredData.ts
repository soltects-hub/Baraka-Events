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
 * Organization schema for Baraka Events
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: seoConfig.organization.name,
    url: seoConfig.organization.url,
    logo: seoConfig.organization.logo,
    description: seoConfig.site.description,
    image: seoConfig.defaultImage,
    address: {
      '@type': 'PostalAddress',
      streetAddress: seoConfig.organization.address.streetAddress,
      addressLocality: seoConfig.organization.address.addressLocality,
      addressRegion: seoConfig.organization.address.addressRegion,
      postalCode: seoConfig.organization.address.postalCode,
      addressCountry: seoConfig.organization.address.addressCountry,
    },
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
 * Website schema with search action
 */
export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: seoConfig.site.name,
    url: seoConfig.site.url,
    description: seoConfig.site.description,
    image: seoConfig.defaultImage,
  };
}

/**
 * Blog post (Article) schema
 */
export function generateArticleSchema(metadata: {
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
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
    ...(metadata.image
      ? {
          image: {
            '@type': 'ImageObject',
            url: absoluteUrl(metadata.image),
            name: metadata.imageAlt,
          },
        }
      : {}),
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
