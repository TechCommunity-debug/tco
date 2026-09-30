export interface Crumb {
  label: string;
  href: string;
}

export function breadcrumbJsonLd(crumbs: Crumb[], site: URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.label,
      item: new URL(crumb.href, site).href,
    })),
  };
}

export function articleJsonLd(options: { headline: string; description: string; url: string; image?: string; dateModified: Date; lang: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: options.headline,
    description: options.description,
    inLanguage: options.lang,
    mainEntityOfPage: options.url,
    dateModified: options.dateModified.toISOString().slice(0, 10),
    ...(options.image ? { image: options.image } : {}),
    publisher: { '@type': 'Organization', name: 'Traditional Clothing Hub', url: 'https://traditionalclothinghub.com/' },
  };
}
