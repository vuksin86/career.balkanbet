// Code-to-canvas za Figmu: priprema stranicu u "mirnom" konačnom stanju i šalje
// je Figma MCP capture skriptom. Kod sajta se NE menja — sve se radi ovde.
//
// Upotreba:
//   node tools/figma-capture.mjs <url> --w=1440 --h=900 [--mobile] [--capture=<id>] [--shot=out.png]
// Bez --capture radi samo probu: full-page screenshot pripremljene stranice.
import { chromium } from 'playwright';

const url = process.argv[2];
const opt = Object.fromEntries(
  process.argv.slice(3).filter(a => a.startsWith('--'))
    .map(a => a.replace(/^--/, '').split('='))
    .map(([k, v]) => [k, v === undefined ? true : v]),
);
const W = +(opt.w || 1440), H = +(opt.h || 900);
const mobile = !!opt.mobile;

const browser = await chromium.launch({ channel: 'chrome' });
const context = await browser.newContext({
  viewport: { width: W, height: H },
  deviceScaleFactor: 1,
  isMobile: mobile,
  hasTouch: mobile,
  // Konačno stanje svih ulaznih animacija (.reveal, mozaik, brojke, aurora stoji).
  reducedMotion: 'reduce',
});
const page = await context.newPage();
const errors = [];
page.on('pageerror', e => errors.push('PAGEERROR ' + e.message));

const log = m => console.error('[' + ((Date.now() - T0) / 1000).toFixed(1) + 's] ' + m);
const T0 = Date.now();
await page.goto(url, { waitUntil: 'load', timeout: 60000 });
log('loaded');
await page.evaluate(() => document.fonts.ready);

// Prošetaj kroz celu stranicu: observeri i lazy slike se okidaju tek kad element
// uđe u kadar.
const total = await page.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < total; y += Math.round(H * 0.6)) {
  await page.evaluate(y => window.scrollTo(0, y), y);
  await page.waitForTimeout(120);
}
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(800);
log('walked');

await page.evaluate(async () => {
  // Prekidač varijacija je naš alat, nije deo dizajna.
  document.querySelectorAll('.var-toggle').forEach(el => el.remove());

  // Aurora je position: fixed — na živom sajtu stoji iza svakog ekrana, ali u
  // statičnom snimku cele stranice bi pokrila samo prvi ekran, a ispod bi
  // ostala prazna (bela) podloga. Zato aurora postaje JEDAN sloj visok koliko
  // cela stranica, a njeni blobovi se ponavljaju na svakih jedan ekran: svaka
  // sekcija na aurori dobija sjaj koji čitalac vidi kad je ona u kadru. Jedan
  // sloj (a ne pločice) da se zamućeni blobovi pretope preko granica ekrana
  // umesto da ih ivica pločice preseče.
  const bg = document.querySelector('.animated-bg');
  if (bg) {
    const vh = innerHeight, docH = document.documentElement.scrollHeight;
    const blobs = [...bg.querySelectorAll('.animated-bg__blob')].map(b => {
      const r = b.getBoundingClientRect();
      return { b, top: r.top, left: r.left, w: r.width, h: r.height };
    });
    document.body.style.background = getComputedStyle(bg).backgroundColor;
    document.body.style.position = 'relative';
    Object.assign(bg.style, { position: 'absolute', inset: 'auto', left: '0', top: '0', width: '100%', height: docH + 'px' });
    for (let k = 0; k * vh < docH; k++) {
      for (const { b, top, left, w, h } of blobs) {
        const c = k === 0 ? b : bg.insertBefore(b.cloneNode(true), bg.firstChild);
        Object.assign(c.style, { inset: 'auto', top: (top + k * vh) + 'px', left: left + 'px', width: w + 'px', height: h + 'px', animation: 'none', transform: 'none' });
      }
    }
  }

  // Tekst u #razvoj koji se ispisuje na skrol — konačno stanje sa markerom.
  // Klase same nisu dovoljne: skript ih vraća na svaki skrol/resize, a marker
  // ima tranziciju od 0.6s. Zato i stil koji ih zaključava.
  document.querySelectorAll('.impact-word').forEach(el => el.classList.add('is-active'));
  document.querySelectorAll('.impact-word--hl').forEach(el => el.classList.add('is-marked'));
  const lock = document.createElement('style');
  lock.textContent = `
    [data-theme="dark"] .impact-word { color: #F5F1EC !important; transition: none !important; }
    [data-theme="dark"] .impact-word--hl { color: #231F20 !important; }
    .impact-word--hl::before { transform: scaleX(1) !important; transition: none !important; }`;
  document.head.appendChild(lock);

  // Redovi citata direktora (.dq) su na desktopu inline spanovi razdvojeni
  // samo razmakom između tagova — capture taj razmak gubi na prelomu reda
  // ("gradimomesto"). Na desktopu ih zato spajamo u jedan tekst; na telefonu
  // su blokovi i prelomi ostaju kako jesu.
  document.querySelectorAll('p:has(> .dq)').forEach(p => {
    const lines = [...p.querySelectorAll(':scope > .dq')];
    if (lines.length && getComputedStyle(lines[0]).display === 'inline')
      p.textContent = lines.map(s => s.textContent.trim()).join(' ');
  });

  // Video ne može u Figmu: svaki <video> postaje <img> sa jednim kadrom.
  const grab = v => new Promise(res => {
    const done = () => {
      try {
        const c = document.createElement('canvas');
        c.width = v.videoWidth; c.height = v.videoHeight;
        if (!c.width) return res(null);
        c.getContext('2d').drawImage(v, 0, 0);
        res(c.toDataURL('image/jpeg', 0.85));
      } catch { res(null); }
    };
    v.pause();
    const t = Math.min(+(v.dataset.figmaFrame || 1.5), (v.duration || 3) * 0.5);
    if (v.readyState < 1) {
      v.preload = 'auto';
      v.addEventListener('loadedmetadata', () => { v.currentTime = t; }, { once: true });
      v.load();
    } else v.currentTime = t;
    v.addEventListener('seeked', done, { once: true });
    setTimeout(() => res(null), 8000);
  });
  for (const v of [...document.querySelectorAll('video')]) {
    // Plakat ako ga video ima — to je kadar koji je dizajn izabrao.
    const src = v.getAttribute('poster') ? null : await grab(v);
    const img = document.createElement('img');
    img.src = src || v.poster || '';
    img.className = v.className;
    img.setAttribute('style', v.getAttribute('style') || '');
    img.alt = '';
    const cs = getComputedStyle(v);
    img.style.objectFit = cs.objectFit;
    img.style.objectPosition = cs.objectPosition;
    v.replaceWith(img);
  }
  // Figma capture ne prenosi WebP — svaka takva slika postaje PNG (ima li
  // providnost, npr. izrez direktora) ili JPEG.
  const toData = img => {
    const c = document.createElement('canvas');
    c.width = img.naturalWidth; c.height = img.naturalHeight;
    const ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0);
    let alpha = false;
    try {
      const d = ctx.getImageData(0, 0, c.width, c.height).data;
      for (let i = 3; i < d.length; i += 16) if (d[i] < 250) { alpha = true; break; }
    } catch {}
    return alpha ? c.toDataURL('image/png') : c.toDataURL('image/jpeg', 0.88);
  };
  for (const img of [...document.images]) {
    if (!/\.webp(\?|$)/i.test(img.currentSrc || img.src)) continue;
    if (!img.complete) await new Promise(r => { img.onload = img.onerror = r; setTimeout(r, 8000); });
    if (!img.naturalWidth) continue;
    img.removeAttribute('srcset');
    img.loading = 'eager';
    img.src = toData(img);
  }

  // Font: sajt ga zove 'NeoSansW1G' (ime iz @font-face), a instaliran je kao
  // "Neo Sans W1G". Figma traži font po imenu, pa mora dobiti ono pravo —
  // inače crta zamenski. Browser crta isti font iz sistema, izgled je isti.
  for (const el of document.querySelectorAll('body, body *')) {
    const ff = getComputedStyle(el).fontFamily;
    if (/NeoSansW1G/.test(ff)) el.style.setProperty('font-family', ff.replace(/["']?NeoSansW1G["']?/g, '"Neo Sans W1G"'), 'important');
  }
  await document.fonts.ready;

  await Promise.race([
    Promise.all([...document.images].map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; }))),
    new Promise(r => setTimeout(r, 10000)),
  ]);
});
log('prepared');
await page.waitForTimeout(400);

const state = await page.evaluate(() => ({
  headerSolid: document.querySelector('header')?.classList.contains('is-solid'),
  scrollY: window.scrollY,
  height: document.documentElement.scrollHeight,
  dataVar: document.documentElement.dataset.var,
  theme: document.documentElement.dataset.theme,
}));

// Komponente: --selector=css snima samo taj element; --hover mu zaključava
// :hover (CDP forcePseudoState, kao "Force state" u DevTools), --click=css
// klikne pre snimanja (npr. otvori padajući meni).
const sel = opt.selector || 'body';
// --mnav: otvori mobilni meni i ostavi na stranici samo header (traka + panel),
// pa je snimak tačno jedan ekran sa otvorenim menijem.
if (opt.mnav) {
  await page.click('header .mnav-burger');
  await page.waitForTimeout(1000);
  await page.evaluate(() => {
    for (const el of document.body.children) if (el.tagName !== 'HEADER') el.style.display = 'none';
    Object.assign(document.body.style, { height: innerHeight + 'px', overflow: 'hidden' });
    document.querySelectorAll('.mnav, .mnav *').forEach(el => { el.style.transition = 'none'; });
  });
  await page.waitForTimeout(300);
}
if (opt.click) { await page.click(opt.click); await page.waitForTimeout(500); }
if (opt.hover) {
  const cdp = await context.newCDPSession(page);
  await cdp.send('DOM.enable'); await cdp.send('CSS.enable');
  const { root } = await cdp.send('DOM.getDocument', { depth: -1 });
  const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector: sel });
  if (!nodeId) throw new Error('selector not found: ' + sel);
  await cdp.send('CSS.forcePseudoState', { nodeId, forcedPseudoClasses: ['hover'] });
  await page.waitForTimeout(900);
}
if (opt.shot) {
  if (sel === 'body') await page.screenshot({ path: opt.shot, fullPage: true });
  else await page.locator(sel).first().screenshot({ path: opt.shot });
}

let result = null;
if (opt.capture) {
  const id = opt.capture;
  const r = await page.context().request.get('https://mcp.figma.com/mcp/html-to-design/capture.js');
  await page.evaluate(s => { const el = document.createElement('script'); el.textContent = s; document.head.appendChild(el); }, await r.text());
  await page.waitForTimeout(500);
  // Renderer ume da padne POSLE slanja (velika stranica); snimak je tada već
  // stigao u Figmu — proverava se pozivom generate_figma_design sa captureId.
  result = await page.evaluate(([id, sel]) => window.figma.captureForDesign({
    captureId: id,
    endpoint: `https://mcp.figma.com/mcp/capture/${id}/submit?bindVariables=true`,
    selector: sel,
  }), [id, sel]).catch(e => 'renderer: ' + e.message.split(String.fromCharCode(10))[0]);
}

console.log(JSON.stringify({ state, errors, result }, null, 1));
// browser.close() ume da visi posle pada renderera — ne čekamo ga.
setTimeout(() => process.exit(0), 3000);
await browser.close().catch(() => {});
process.exit(0);
