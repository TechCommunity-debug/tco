#!/usr/bin/env node
/**
 * Post-build checks on dist/: self-referencing canonicals with trailing slashes, reciprocal hreflang,
 * internal links and #anchors that resolve, and alt attributes on every image.
 *
 *   npm run build && npm run check
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = join(root, 'dist');
const origin = 'https://traditionalclothinghub.com';

/** @param {string} dir @returns {string[]} */
const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((d) => (d.isDirectory() ? walk(join(dir, d.name)) : d.name.endsWith('.html') ? [join(dir, d.name)] : []));

/** @param {string} file */
const urlPathOf = (file) => '/' + relative(dist, file).replace(/index\.html$/, '').replace(/\\/g, '/');

/** @param {string} tag @param {string} name */
const attr = (tag, name) => tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];

/** @param {string} path */
const fileForPath = (path) => {
  const clean = decodeURI(path);
  if (clean.endsWith('/')) return join(dist, clean, 'index.html');
  return join(dist, clean);
};

const pages = new Map();
for (const file of walk(dist)) {
  const html = readFileSync(file, 'utf8');
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  pages.set(urlPathOf(file), { file, html, ids });
}

const errors = [];
const fail = (/** @type {string} */ page, /** @type {string} */ message) => errors.push(`${page}: ${message}`);

for (const [path, { html }] of pages) {
  const isErrorPage = path === '/404.html' || path === '/500.html' || path === '/de/404/' || path === '/de/500/' || path === '/de/404.html' || path === '/de/500.html';
  if (!isErrorPage) {
    const linkTags = [...html.matchAll(/<link\s[^>]*>/g)].map((m) => m[0]);

    const canonical = linkTags.find((tag) => attr(tag, 'rel') === 'canonical');
    const canonicalHref = canonical && attr(canonical, 'href');
    if (!canonicalHref) fail(path, 'missing canonical');
    else if (canonicalHref !== origin + path) fail(path, `canonical ${canonicalHref} is not self-referencing`);
    if (!path.endsWith('/')) fail(path, 'URL has no trailing slash');

    const lang = html.match(/<html[^>]*\slang="([^"]+)"/)?.[1];
    const alternates = linkTags.filter((tag) => attr(tag, 'rel') === 'alternate' && attr(tag, 'hreflang'));
    const self = alternates.find((tag) => attr(tag, 'hreflang') === lang);
    if (!self || attr(self, 'href') !== origin + path) fail(path, `hreflang="${lang}" does not point to itself`);
    if (!alternates.some((tag) => attr(tag, 'hreflang') === 'x-default')) fail(path, 'missing hreflang x-default');
    for (const tag of alternates) {
      const href = attr(tag, 'href') ?? '';
      const target = pages.get(href.replace(origin, ''));
      if (!target) {
        fail(path, `hreflang target ${href} does not exist`);
        continue;
      }
      if (attr(tag, 'hreflang') === 'x-default') continue;
      const back = [...target.html.matchAll(/<link\s[^>]*>/g)].some((m) => attr(m[0], 'hreflang') === lang && attr(m[0], 'href') === origin + path);
      if (!back) fail(path, `hreflang target ${href} does not link back`);
    }
  }

  for (const [, href] of html.matchAll(/<a\s[^>]*href="([^"]+)"/g)) {
    const local = href.startsWith(origin) ? href.slice(origin.length) : href;
    if (!local.startsWith('/') && !local.startsWith('#')) continue;
    const [target, hash] = local.split('#');
    const targetPath = target || path;
    if (!targetPath.endsWith('/') && !/\.[a-z0-9]+$/i.test(targetPath)) fail(path, `link ${href} has no trailing slash`);
    const page = pages.get(targetPath);
    if (!page && !existsSync(fileForPath(targetPath))) {
      fail(path, `broken link ${href}`);
      continue;
    }
    if (hash && page && !page.ids.has(hash)) fail(path, `link ${href} points to missing anchor #${hash}`);
  }

  for (const [tag] of html.matchAll(/<img\s[^>]*>/g)) {
    // A bare `alt` attribute is valid HTML for decorative images (same as alt="").
    if (!/\salt(?:=|[\s/>])/.test(tag)) fail(path, `image without alt: ${tag.slice(0, 120)}`);
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  console.error(`\n✗ ${errors.length} problem(s) in ${pages.size} pages.`);
  process.exit(1);
}
console.log(`✓ ${pages.size} pages checked: canonicals, hreflang, links, anchors and alt text are fine.`);
