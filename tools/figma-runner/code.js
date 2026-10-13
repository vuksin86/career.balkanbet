// Lokalni "runner": izmene koje traže NeoSans (Figmin server ga nema, pa ih
// MCP alat ne može da uradi). Sadržaj se menja po zadatku; rezultat se vidi u
// poruci na dnu ekrana posle pokretanja.
// Zadatak: kartice pozicija na Listanju (desktop + mobilni) -> instance
// komponente "Kartica / Pozicija" (Default), sa tekstom svake kartice.
(async () => {
  try {
    const page = figma.root.children.find(p => p.name === 'Ekrani');
    await figma.setCurrentPageAsync(page);
    const comp = await figma.getNodeByIdAsync('93:1433');
    const texts = n => n.findAll(x => x.type === 'TEXT');
    const frames = [];
    for (const s of page.children) if (s.type === 'SECTION') for (const f of s.children)
      if (f.name.startsWith('Listanje pozicija')) frames.push(f);
    let done = 0, skipped = 0;
    for (const f of frames) {
      const cards = f.findAll(n => n.type === 'FRAME' && n.name.startsWith('Article'));
      for (const old of cards) {
        const ot = texts(old);
        const inst = comp.createInstance();
        const it = texts(inst);
        if (ot.length !== it.length) { inst.remove(); skipped++; continue; }
        const par = old.parent, idx = par.children.indexOf(old);
        par.insertChild(idx, inst);
        if (old.layoutPositioning === 'ABSOLUTE') inst.layoutPositioning = 'ABSOLUTE';
        inst.x = old.x; inst.y = old.y;
        try { inst.layoutAlign = old.layoutAlign; inst.layoutGrow = old.layoutGrow; } catch (e) {}
        if (Math.abs(inst.width - old.width) > 1 || Math.abs(inst.height - old.height) > 1) inst.resize(old.width, old.height);
        for (let i = 0; i < it.length; i++) {
          const v = ot[i].characters;
          if (it[i].characters !== v) { await figma.loadFontAsync(it[i].fontName); it[i].characters = v; }
        }
        inst.name = 'Kartica / Pozicija';
        old.remove();
        done++;
      }
    }
    figma.closePlugin('Kartice: zamenjeno ' + done + (skipped ? ', preskočeno ' + skipped : ''));
  } catch (e) {
    figma.closePlugin('GREŠKA: ' + e.message);
  }
})();
