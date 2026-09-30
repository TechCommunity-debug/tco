import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { continentKeys } from './i18n/ui';
import { parseCsv } from './lib/csv.mjs';

/*
 * Countries, garments and pages live in one folder per locale: `en/japan.md` and `de/japan.md`.
 * The file name is the shared ID across languages; hreflang and the language switcher are
 * built from it. The `slug` in frontmatter is the translated URL segment.
 */

/** Keep `en/japan` as the entry ID; the glob loader would otherwise use the `slug` field. */
const localeId = ({ entry }: { entry: string }) => entry.replace(/\.md$/, '');

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase ASCII words separated by hyphens');

const heroImage = z.object({
  /** File name in src/assets/images/, also the `file_name` column of src/data/image-log.csv. */
  file: z.string().regex(/^[a-z0-9-]+\.webp$/),
  alt: z.string().min(20),
});

/** Internal editorial notes. Never rendered; list them with `npm run todos`. */
const todo = z.array(z.string()).default([]);

const countries = defineCollection({
  loader: glob({ pattern: '*/*.md', base: './src/content/countries', generateId: localeId }),
  schema: z.object({
    slug,
    name: z.string(),
    continent: z.enum(continentKeys),
    title: z.string(),
    description: z.string().max(170),
    intro: z.string(),
    hero: heroImage,
    /** Shared IDs of garments from the garments collection. */
    garments: z.array(z.string()).default([]),
    facts: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
    updated: z.coerce.date(),
    todo,
  }),
});

const garments = defineCollection({
  loader: glob({ pattern: '*/*.md', base: './src/content/garments', generateId: localeId }),
  schema: z.object({
    slug,
    name: z.string(),
    title: z.string(),
    description: z.string().max(170),
    intro: z.string(),
    summary: z.string().max(140),
    hero: heroImage,
    /** Shared IDs of countries from the countries collection. */
    countries: z.array(z.string()).min(1),
    facts: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
    updated: z.coerce.date(),
    todo,
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '*/*.md', base: './src/content/pages', generateId: localeId }),
  schema: z.object({
    slug,
    title: z.string(),
    description: z.string().max(170),
    updated: z.coerce.date(),
    todo,
  }),
});

const images = defineCollection({
  loader: file('src/data/image-log.csv', {
    parser: (text) => parseCsv(text).map((row) => ({ id: row.file_name, ...row })),
  }),
  schema: z.object({
    file_name: z.string(),
    page: z.string(),
    title: z.string(),
    author: z.string(),
    source: z.string(),
    source_url: z.url(),
    download_url: z.url(),
    license: z.string(),
    license_url: z.url(),
    date_downloaded: z.string(),
  }),
});

export const collections = { countries, garments, pages, images };
