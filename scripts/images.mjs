#!/usr/bin/env node
/**
 * Downloads every image listed in src/data/image-log.csv that is not yet in src/assets/images/,
 * converts it to WebP (max 1600px on the long edge) and stamps `date_downloaded` in the log.
 *
 *   npm run images           # fetch missing images
 *   npm run images -- --force  # re-download and re-encode everything
 *
 * We never hotlink: pages only reference the local WebP files.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { parseCsv, stringifyCsv } from '../src/lib/csv.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const logPath = `${root}src/data/image-log.csv`;
const outDir = `${root}src/assets/images`;
const columns = ['file_name', 'page', 'title', 'author', 'source', 'source_url', 'download_url', 'license', 'license_url', 'date_downloaded'];
const force = process.argv.includes('--force');
const userAgent = 'TraditionalClothingHub/1.0 (+https://traditionalclothinghub.com/sources/)';

/** @param {string} url */
async function download(url) {
  try {
    const response = await fetch(url, { headers: { 'user-agent': userAgent }, redirect: 'follow', signal: AbortSignal.timeout(60_000) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return Buffer.from(await response.arrayBuffer());
  } catch (error) {
    // Some hosts time out on Node's fetch in certain networks; curl is a reliable fallback.
    console.warn(`  fetch failed (${error instanceof Error ? error.message : error}), retrying with curl`);
    return execFileSync('curl', ['-sSfL', '-m', '120', '-A', userAgent, url], { maxBuffer: 256 * 1024 * 1024 });
  }
}

const rows = parseCsv(readFileSync(logPath, 'utf8'));
mkdirSync(outDir, { recursive: true });
const today = new Date().toISOString().slice(0, 10);
let changed = false;

for (const row of rows) {
  const target = `${outDir}/${row.file_name}`;
  if (existsSync(target) && !force) continue;

  console.log(`↓ ${row.file_name}\n  ${row.download_url}`);
  const input = await download(row.download_url);
  const info = await sharp(input)
    .rotate()
    .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 80, effort: 6 })
    .toFile(target);
  console.log(`  ${info.width}×${info.height}, ${(info.size / 1024).toFixed(0)} KB`);

  if (!row.date_downloaded || force) {
    row.date_downloaded = today;
    changed = true;
  }
}

if (changed) writeFileSync(logPath, stringifyCsv(columns, rows));
console.log(changed ? 'Updated image log.' : 'All images present.');
