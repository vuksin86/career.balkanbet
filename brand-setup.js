/* ============================================================================
   BRAND TOKENS — Tailwind (Play CDN) config, shared by every page.

   Loaded as a plain <script> right AFTER the Tailwind CDN on index.html,
   listanje.html and oglas-primer.html, so all three pages get the
   same colour names, font stack and radius scale. Edit here, never per page.
============================================================================ */
tailwind.config = {
  theme: {
    extend: {
      colors: {
        brand: {
          dark:    '#231F20', // primary text / buttons / dark surfaces
          section: '#ECECEC', // neutral section background
          yellow:  '#FDB813', // primary brand accent (icons, markers, highlights)
          // Fill for every CTA BUTTON that has a yellow background — the header
          // "Pronađi posao", the "Prijavi se" card buttons, and the yellow hover
          // state of the dark "Saznaj više o nama" pill. Deliberately its own
          // token rather than a change to `yellow` above: that one still paints
          // text, icons and the marker sweep, and those were not part of the
          // request. The two shades are close (253,184,19 vs 255,187,26) — if a
          // button ever looks off next to an icon, this is why.
          cta:     '#ffbb1a',
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
