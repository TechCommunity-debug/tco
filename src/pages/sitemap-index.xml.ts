import type { APIRoute } from 'astro';

/* Sitemap index, same layout as @astrojs/sitemap. The URLs themselves live in sitemap-0.xml. */
export const GET: APIRoute = ({ site }) => {
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    `  <sitemap><loc>${new URL('/sitemap-0.xml', site).href}</loc></sitemap>`,
    '</sitemapindex>',
  ].join('\n');

  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
