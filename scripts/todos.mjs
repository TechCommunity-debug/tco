#!/usr/bin/env node
/** Lists the editorial `todo:` notes from content frontmatter (they are never rendered on the site). */
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const contentDir = join(root, 'src/content');

/** @param {string} dir @returns {string[]} */
const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((d) => (d.isDirectory() ? walk(join(dir, d.name)) : d.name.endsWith('.md') ? [join(dir, d.name)] : []));

let total = 0;
for (const file of walk(contentDir).sort()) {
  const frontmatter = readFileSync(file, 'utf8').match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
  const block = frontmatter.match(/^todo:\n((?:\s+- .*\n?)+)/m)?.[1];
  if (!block) continue;
  const items = block.split('\n').map((line) => line.replace(/^\s+- /, '').trim()).filter(Boolean);
  total += items.length;
  console.log(`\n${relative(root, file)}`);
  for (const item of items) console.log(`  - ${item}`);
}
console.log(`\n${total} open todo notes.`);
