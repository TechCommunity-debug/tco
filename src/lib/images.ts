import type { ImageMetadata } from 'astro';
import { getImage } from 'astro:assets';
import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

const files = import.meta.glob<{ default: ImageMetadata }>('/src/assets/images/*.webp', { eager: true });

/** Resolves a file name from the image log to the locally hosted image. */
export function getLocalImage(fileName: string): ImageMetadata {
  const image = files[`/src/assets/images/${fileName}`];
  if (!image) throw new Error(`Image "${fileName}" is missing from src/assets/images/. Add it to src/data/image-log.csv and run \`npm run images\`.`);
  return image.default;
}

export type ImageCredit = CollectionEntry<'images'>['data'];

export async function getCredit(fileName: string): Promise<ImageCredit> {
  const entry = await getEntry('images', fileName);
  if (!entry) throw new Error(`Image "${fileName}" has no row in src/data/image-log.csv; every image must be credited.`);
  return entry.data;
}

export async function getAllCredits(): Promise<ImageCredit[]> {
  const entries = await getCollection('images');
  return entries.map((entry) => entry.data).sort((a, b) => a.file_name.localeCompare(b.file_name));
}

/** Absolute URL of the 1200px JPEG used for og:image and JSON-LD (same options, so one file per image). */
export async function getSocialImageUrl(image: ImageMetadata, site: URL): Promise<string> {
  const { src } = await getImage({ src: image, width: 1200, format: 'jpg', quality: 80 });
  return new URL(src, site).href;
}
