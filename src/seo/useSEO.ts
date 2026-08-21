/**
 * useSEO Hook - React hook for managing page-level SEO metadata
 * Handles title, meta description, canonical URL, and OG tags
 */

import { useEffect } from 'react';
import { seoConfig } from './seoConfig';

export interface SEOMetadata {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  imageAlt?: string;
  type?: 'website' | 'article';
  publishedDate?: string;
  modifiedDate?: string;
  author?: string;
}

export function useSEO(metadata: SEOMetadata) {
  const {
    title,
    description,
    canonical,
    image = seoConfig.defaultImage,
    imageAlt = seoConfig.defaultImageAlt,
    type = 'website',
    publishedDate,
    modifiedDate,
    author,
  } = metadata;

  useEffect(() => {
    // Set document title
    document.title = title;

    // Remove or update existing meta tags
    const updateMetaTag = (name: string, content: string, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let el = document.querySelector(selector) as HTMLMetaElement;

      if (!el) {
        el = document.createElement('meta');
        if (property) {
          el.setAttribute('property', name);
        } else {
          el.setAttribute('name', name);
        }
        document.head.appendChild(el);
      }

      el.content = content;
    };

    // Standard meta tags
    updateMetaTag('description', description);

    // Open Graph tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:image:alt', imageAlt, true);
    updateMetaTag('og:url', canonical || getCurrentUrl(), true);

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);

    // Article-specific tags
    if (type === 'article') {
      if (publishedDate) {
        updateMetaTag('article:published_time', publishedDate, true);
      }
      if (modifiedDate) {
        updateMetaTag('article:modified_time', modifiedDate, true);
      }
      if (author) {
        updateMetaTag('article:author', author, true);
      }
    }

    // Canonical URL
    const canonicalUrl = canonical || getCurrentUrl();
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonicalUrl;
  }, [title, description, canonical, image, imageAlt, type, publishedDate, modifiedDate, author]);
}

function getCurrentUrl(): string {
  if (typeof window !== 'undefined') {
    return window.location.href;
  }
  return seoConfig.site.url;
}
