// Za prototip u Figmi: čita sve linkove (i dugme "Pretraži") sa svake strane,
// njihov pravougaonik u koordinatama dokumenta i stranu na koju vode. Stanje
// stranice je isto kao pri snimanju (reduced motion, skrol na vrhu), pa se
// pravougaonici poklapaju sa slojevima u prenetim frame-ovima.
// Upotreba: node tools/figma-links.mjs > links.json
import { chromium } from 'playwright';

const BASE = 'http://localhost:4173/';
const PAGES = ['index.html', 'listanje.html', 'oglas-primer.html', 'poslovi-u-lokalima.html',
  'poslovi-u-centrali.html', 'zivot-u-balkan-betu.html', 'csr.html', 'o-kompaniji.html'];
const VIEWS = { D: { width: 1440, height: 900, mobile: false }, M: { width: 390, height: 844, mobile: true } };

const browser = await chromium.launch({ channel: 'chrome' });
const out = {};
for (const file of PAGES) {
  out[file] = {};
  for (const [k, v] of Object.entries(VIEWS)) {
    const ctx = await browser.newContext({ viewport: { width: v.width, height: v.height }, deviceScaleFactor: 1,
      isMobile: v.mobile, hasTouch: v.mobile, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto(BASE + file, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    const total = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < total; y += 500) { await page.evaluate(y => scrollTo(0, y), y); await page.waitForTimeout(60); }
    await page.evaluate(() => scrollTo(0, 0));
    await page.waitForTimeout(600);
    out[file][k] = await page.evaluate(() => {
      const res = [];
      const els = [...document.querySelectorAll('a[href], .hero-search__submit')];
      for (const el of els) {
        const r = el.getBoundingClientRect();
        if (r.width < 4 || r.height < 4) continue;
        const cs = getComputedStyle(el);
        if (cs.visibility === 'hidden' || cs.display === 'none') continue;
        let href = el.matches('.hero-search__submit') ? 'listanje.html' : el.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('http')) continue;
        href = href.split(/[?#]/)[0];
        res.push([Math.round(r.left), Math.round(r.top + scrollY), Math.round(r.width), Math.round(r.height), href]);
      }
      return res;
    });
    await ctx.close();
  }
}
console.log(JSON.stringify(out));
await browser.close();
process.exit(0);
