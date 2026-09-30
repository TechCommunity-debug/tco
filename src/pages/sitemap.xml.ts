import type { APIRoute } from 'astro';
import { defaultLocale } from '../i18n/ui';
import { getRoutes } from '../lib/routes';

/* XML sitemap with hreflang alternates for every translated URL. */
export const GET: APIRoute = async ({ site }) => {
  const routes = await getRoutes();
  const absolute = (path: string) => new URL(path, site).href;

  const urls = routes.map((route) => {
    const alternates = routes.filter((other) => other.key === route.key);
    const xDefault = alternates.find((alt) => alt.lang === defaultLocale);
    const links = [
      ...alternates.map((alt) => `    <xhtml:link rel="alternate" hreflang="${alt.lang}" href="${absolute(alt.path)}"/>`),
      ...(xDefault ? [`    <xhtml:link rel="alternate" hreflang="x-default" href="${absolute(xDefault.path)}"/>`] : []),
    ];
    return [`  <url>`, `    <loc>${absolute(route.path)}</loc>`, ...links, `  </url>`].join('\n');
  });

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...urls,
    '</urlset>',
  ].join('\n');

  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
