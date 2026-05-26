import { useEffect } from 'react';

/**
 * A custom hook to dynamically update document head metadata for SEO.
 * 
 * @param {Object} seoOptions - The SEO options for the page.
 * @param {string} seoOptions.title - The title tag content.
 * @param {string} seoOptions.description - The meta description content.
 * @param {string} seoOptions.keywords - Comma-separated SEO keywords.
 * @param {string} [seoOptions.ogTitle] - Open Graph title.
 * @param {string} [seoOptions.ogDescription] - Open Graph description.
 * @param {string} [seoOptions.ogImage] - Open Graph image URL.
 * @param {string} [seoOptions.canonicalUrl] - Canonical URL for the page.
 */
export default function useSEO({ title, description, keywords, ogTitle, ogDescription, ogImage, canonicalUrl }) {
  useEffect(() => {
    // 1. Update Document Title
    if (title) {
      document.title = title;
    }

    // Helper to get or create a meta tag
    const setMetaTag = (selector, name, property, content) => {
      if (!content) return;
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        if (name) el.name = name;
        if (property) el.setAttribute('property', property);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    // 2. Meta Description
    setMetaTag('meta[name="description"]', 'description', null, description);

    // 3. Meta Keywords
    setMetaTag('meta[name="keywords"]', 'keywords', null, keywords);

    // 4. Open Graph Tags
    setMetaTag('meta[property="og:title"]', null, 'og:title', ogTitle || title);
    setMetaTag('meta[property="og:description"]', null, 'og:description', ogDescription || description);
    setMetaTag('meta[property="og:image"]', null, 'og:image', ogImage || '/favicon.png');
    setMetaTag('meta[property="og:url"]', null, 'og:url', canonicalUrl || window.location.href);
    setMetaTag('meta[property="og:type"]', null, 'og:type', 'website');
    setMetaTag('meta[property="og:site_name"]', null, 'og:site_name', 'Jeeva Gold');

    // 5. Twitter Card Tags
    setMetaTag('meta[name="twitter:card"]', 'twitter:card', null, 'summary_large_image');
    setMetaTag('meta[name="twitter:title"]', 'twitter:title', null, ogTitle || title);
    setMetaTag('meta[name="twitter:description"]', 'twitter:description', null, ogDescription || description);
    setMetaTag('meta[name="twitter:image"]', 'twitter:image', null, ogImage || '/favicon.png');

    // 6. Canonical URL
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.rel = 'canonical';
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.href = canonicalUrl || window.location.href;

  }, [title, description, keywords, ogTitle, ogDescription, ogImage, canonicalUrl]);
}
