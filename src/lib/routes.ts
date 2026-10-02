import { getCollection, type CollectionEntry } from 'astro:content';
import { defaultLocale, isLocale, locales, segments, type Locale } from '../i18n/ui';

/*
 * Route registry: the single source of truth for every URL on the site.
 * Each route has a `key` shared by all its translations (e.g. `country:japan`).
 * Canonicals, hreflang, the language switcher and the sitemap are all derived from it.
 */

export type RouteKind = 'home' | 'countries' | 'garments' | 'country' | 'garment' | 'page';

export interface SiteRoute {
  key: string;
  kind: RouteKind;
  lang: Locale;
  /** Path with leading and trailing slash, e.g. `/de/land/japan/`. */
  path: string;
  /** Content entry ID (`en/japan`) for country, garment and page routes. */
  entryId?: string;
}

export type Country = CollectionEntry<'countries'>;
export type Garment = CollectionEntry<'garments'>;
export type Page = CollectionEntry<'pages'>;

/** Splits a content entry ID like `de/japan` into its locale and shared ID. */
export function splitEntryId(id: string): { lang: Locale; sharedId: string } {
  const [lang, sharedId] = id.split('/');
  if (!lang || !sharedId || !isLocale(lang)) throw new Error(`Content entry "${id}" must live in a locale folder (${locales.join(', ')})`);
  return { lang, sharedId };
}

export function localePath(lang: Locale, ...parts: string[]): string {
  const prefix = lang === defaultLocale ? [] : [lang];
  const joined = [...prefix, ...parts].filter(Boolean).join('/');
  return joined ? `/${joined}/` : '/';
}

export function countryPath(entry: Country): string {
  const { lang } = splitEntryId(entry.id);
  return localePath(lang, segments[lang].country, entry.data.slug);
}

export function garmentPath(entry: Garment): string {
  const { lang } = splitEntryId(entry.id);
  return localePath(lang, segments[lang].garment, entry.data.slug);
}

export function pagePath(entry: Page): string {
  const { lang } = splitEntryId(entry.id);
  return localePath(lang, entry.data.slug);
}

export async function getCountries(lang: Locale): Promise<Country[]> {
  const entries = await getCollection('countries', (entry) => splitEntryId(entry.id).lang === lang);
  return entries.sort((a, b) => a.data.name.localeCompare(b.data.name, lang));
}

export async function getGarments(lang: Locale): Promise<Garment[]> {
  const entries = await getCollection('garments', (entry) => splitEntryId(entry.id).lang === lang);
  return entries.sort((a, b) => a.data.name.localeCompare(b.data.name, lang));
}

let routesPromise: Promise<SiteRoute[]> | undefined;

export function getRoutes(): Promise<SiteRoute[]> {
  if (import.meta.env.DEV) {
    return buildRoutes();
  }
  routesPromise ??= buildRoutes();
  return routesPromise;
}

async function buildRoutes(): Promise<SiteRoute[]> {
  const routes: SiteRoute[] = [];
  const [countries, garments, pages] = await Promise.all([getCollection('countries'), getCollection('garments'), getCollection('pages')]);

  for (const lang of locales) {
    routes.push({ key: 'home', kind: 'home', lang, path: localePath(lang) });
    routes.push({ key: 'countries', kind: 'countries', lang, path: localePath(lang, segments[lang].countries) });
    routes.push({ key: 'garments', kind: 'garments', lang, path: localePath(lang, segments[lang].garments) });
  }
  for (const entry of countries) {
    const { lang, sharedId } = splitEntryId(entry.id);
    routes.push({ key: `country:${sharedId}`, kind: 'country', lang, path: countryPath(entry), entryId: entry.id });
  }
  for (const entry of garments) {
    const { lang, sharedId } = splitEntryId(entry.id);
    routes.push({ key: `garment:${sharedId}`, kind: 'garment', lang, path: garmentPath(entry), entryId: entry.id });
  }
  for (const entry of pages) {
    const { lang, sharedId } = splitEntryId(entry.id);
    routes.push({ key: `page:${sharedId}`, kind: 'page', lang, path: pagePath(entry), entryId: entry.id });
  }

  validate(routes, countries, garments);
  return routes;
}

function validate(routes: SiteRoute[], countries: Country[], garments: Garment[]) {
  const seen = new Map<string, string>();
  for (const route of routes) {
    const existing = seen.get(route.path);
    if (existing) throw new Error(`Duplicate URL ${route.path} for "${existing}" and "${route.key}"`);
    seen.set(route.path, route.key);
  }

  const keys = new Set(routes.map((route) => `${route.lang}|${route.key}`));
  for (const entry of countries) {
    const { lang } = splitEntryId(entry.id);
    for (const garment of entry.data.garments) {
      if (!keys.has(`${lang}|garment:${garment}`)) throw new Error(`countries/${entry.id} lists unknown garment "${garment}"`);
    }
  }
  for (const entry of garments) {
    const { lang } = splitEntryId(entry.id);
    for (const country of entry.data.countries) {
      if (!keys.has(`${lang}|country:${country}`)) throw new Error(`garments/${entry.id} lists unknown country "${country}"`);
    }
  }
}

/** All language versions of a route (including itself), in locale order. Used for hreflang. */
export async function getAlternates(key: string): Promise<SiteRoute[]> {
  const routes = await getRoutes();
  return locales.flatMap((lang) => routes.filter((route) => route.key === key && route.lang === lang));
}

/** Path of a route in a given language, e.g. `pathFor('page:about', 'de')` → `/de/ueber-uns/`. */
export async function pathFor(key: string, lang: Locale): Promise<string> {
  const route = (await getRoutes()).find((r) => r.key === key && r.lang === lang);
  if (!route) throw new Error(`No route "${key}" in ${lang}`);
  return route.path;
}
