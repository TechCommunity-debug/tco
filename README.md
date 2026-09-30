# Traditional Clothing Hub

Source for [traditionalclothinghub.com](https://traditionalclothinghub.com): a bilingual (English/German) reference site about traditional clothing, built with Astro 7 and Tailwind CSS 4. The visual design follows [DESIGN.md](DESIGN.md).

## Commands

| Command | Action |
| :-- | :-- |
| `npm install` | Install dependencies |
| `npm run dev` | Dev server at `localhost:4321` (or `astro dev --background`) |
| `npm run build` | Build the static site to `dist/` |
| `npm run check` | After a build: verify canonicals, hreflang, internal links, anchors and alt text |
| `npm run images` | Download new images from the image log and convert them to WebP |
| `npm run todos` | List editorial TODO notes (uncertain facts, missing sources) |

## URLs

English has no prefix, German lives under `/de/` with translated slugs. Every URL ends in `/`.

| Page | English | German |
| :-- | :-- | :-- |
| Country | `/country/japan/` | `/de/land/japan/` |
| Garment | `/garment/kimono/` | `/de/kleidungsstueck/kimono/` |
| All countries (by continent) | `/countries/` | `/de/laender/` |
| All garments (A–Z) | `/garments/` | `/de/kleidungsstuecke/` |
| Trust pages | `/about/`, `/contact/`, `/privacy/`, `/sources/` | `/de/ueber-uns/`, `/de/kontakt/`, `/de/datenschutz/`, `/de/quellen/` |

Sub-topics are sections on the parent page, not separate URLs: `/country/japan/#wedding`. Write the anchor into the heading: `## Wedding attire {#wedding}`.

All routes come from one registry, [src/lib/routes.ts](src/lib/routes.ts), rendered by [src/pages/[...path].astro](src/pages/[...path].astro). Canonicals, hreflang (`en`, `de`, `x-default`), the language switcher and `sitemap.xml` are all derived from it, so they cannot drift apart.

## Content

```text
src/content/
  countries/en/japan.md   countries/de/japan.md
  garments/en/kimono.md   garments/de/kimono.md
  pages/en/about.md       pages/de/about.md
```

The **file name is the shared ID** across languages (`japan`). The frontmatter `slug` is the translated URL segment (`suedkorea`). Countries list garments by shared ID and vice versa. The schema in [src/content.config.ts](src/content.config.ts) validates everything at build time.

### Adding a country

1. Create `src/content/countries/en/<id>.md` and `src/content/countries/de/<id>.md` (copy Japan as a template).
2. Add its garment(s) under `src/content/garments/{en,de}/`.
3. Add the images to the image log (below).
4. `npm run build && npm run check`.

### Accuracy

Don't invent facts. Where something is uncertain, leave it out or hedge it, and add a note to the frontmatter `todo:` list. These notes are never rendered. `npm run todos` lists them all.

## Images

[src/data/image-log.csv](src/data/image-log.csv) is the image log (it opens in any spreadsheet app): file name, page, title, author, source URL, download URL, licence and date downloaded. The `/sources/` page and every image caption are generated from it.

1. Find an image: museum open access (CC0: Met, Smithsonian, Rijksmuseum) or Unsplash/Pexels/Pixabay. Keep it modest and respectful.
2. Add a row with a descriptive file name (`kimono-furisode-red.webp`), leaving `date_downloaded` empty.
3. `npm run images`: downloads it, resizes to max 1600px, converts to WebP in `src/assets/images/` and fills in the date. Nothing is hotlinked.
4. Reference it from frontmatter with descriptive alt text, e.g. `hero: { file: kimono-furisode-red.webp, alt: "Red furisode kimono …" }`.

The build fails if an image is missing or has no row in the log.
