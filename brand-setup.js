/* ============================================================================
   BRAND TOKENS — Tailwind (Play CDN) config, shared by every page.

   Loaded as a plain <script> right AFTER the Tailwind CDN on index.html,
   poslovi-u-lokalima.html and oglas-primer.html, so all three pages get the
   same colour names, font stack and radius scale. Edit here, never per page.
============================================================================ */
tailwind.config = {
  theme: {
    extend: {
      colors: {
        brand: {
          dark:    '#231F20', // primary text / buttons / dark surfaces
          section: '#ECECEC', // neutral section background
          yellow:  '#FDB813', // primary brand accent (CTAs, primary icons)
          yellow2: '#FDB913', // secondary accent (near-identical shade, used for variety/hover)
          gold:    '#FAA61A', // tertiary accent, echoes the animated background's base tone
        },
      },
      fontFamily: {
        sans: ['NeoSansW1G', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl2: '32px',
      },
    },
  },
};
