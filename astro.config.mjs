// @ts-check
import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import tailwindcss from '@tailwindcss/vite';
import { headingAnchors } from './src/lib/heading-anchors.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://traditionalclothinghub.com',
  // Every URL ends in a slash; canonicals and hreflang links rely on this.
  trailingSlash: 'always',
  build: { format: 'directory' },
  markdown: {
    // `## Wedding attire {#wedding}` sets a stable anchor id that doesn't change when the heading text is edited.
    processor: satteri({ hastPlugins: [headingAnchors] }),
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
