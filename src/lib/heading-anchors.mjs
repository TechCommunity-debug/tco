import { defineHastPlugin } from 'satteri';

const ANCHOR = /\s*\{#([a-z0-9][a-z0-9-]*)\}\s*$/;

/**
 * Sätteri HAST plugin: `## Wedding attire {#wedding}` becomes `<h2 id="wedding">Wedding attire</h2>`.
 * Astro's own heading-id plugin runs afterwards and keeps an id that is already set.
 */
export const headingAnchors = defineHastPlugin({
  name: 'heading-anchors',
  element: {
    filter: ['h2', 'h3', 'h4'],
    visit(node, ctx) {
      const index = node.children.length - 1;
      const last = node.children[index];
      if (!last || last.type !== 'text') return;
      const match = last.value.match(ANCHOR);
      if (!match) return;
      ctx.setProperty(node, 'id', match[1]);
      ctx.removeChildAt(node, index);
      ctx.insertChildAt(node, index, { type: 'text', value: last.value.replace(ANCHOR, '') });
    },
  },
});
