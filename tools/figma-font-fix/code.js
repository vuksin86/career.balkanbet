// Code-to-canvas uvoz slaže tekst na Figminom serveru, gde naši fontovi ne
// postoje, pa tekst ostane iscrtan zamenskim fontom i kad je font instaliran
// lokalno. Plugin radi dve stvari na TRENUTNOJ strani:
//  1. imena iz @font-face koja ne postoje kao instalirani font prevodi u prava
//     (LumieraHandwriting -> Lumiera / Handwriting, PatrickHand -> Patrick Hand)
//  2. svaki tekst prebaci na drugu težinu i odmah vrati na njegovu — to tera
//     Figmu da ga ponovo složi pravim fontom.
// Pokreni ga na strani posle svakog novog uvoza.
const REMAP = {
  'LumieraHandwriting': () => ({ family: 'Lumiera', style: 'Handwriting' }),
  'PatrickHand': () => ({ family: 'Patrick Hand', style: 'Regular' }),
  'NeoSansW1G': style => ({ family: 'Neo Sans W1G', style }),
};

(async () => {
  const texts = figma.currentPage.findAllWithCriteria({ types: ['TEXT'] });
  const loaded = new Set();
  const load = async f => {
    const k = f.family + '|' + f.style;
    if (loaded.has(k)) return true;
    try { await figma.loadFontAsync(f); loaded.add(k); return true; } catch (e) { return false; }
  };
  let fixed = 0, remapped = 0, skipped = 0;
  for (const t of texts) {
    try {
      const segs = t.getStyledTextSegments(['fontName']);
      for (const s of segs) {
        const map = REMAP[s.fontName.family];
        if (map) {
          const to = map(s.fontName.style);
          if (await load(to)) { t.setRangeFontName(s.start, s.end, to); s.fontName = to; remapped++; }
        }
      }
      let ok = true;
      for (const s of segs) ok = (await load(s.fontName)) && ok;
      if (!ok) { skipped++; continue; }
      for (const s of segs) {
        const alt = { family: s.fontName.family, style: s.fontName.style === 'Regular' ? 'Bold' : 'Regular' };
        if (!(await load(alt))) continue;
        t.setRangeFontName(s.start, s.end, alt);
        t.setRangeFontName(s.start, s.end, s.fontName);
      }
      fixed++;
    } catch (e) { skipped++; }
  }
  figma.closePlugin('Osveženo: ' + fixed + (remapped ? ', zamenjeno imena: ' + remapped : '') + (skipped ? ', preskočeno: ' + skipped : ''));
})();
