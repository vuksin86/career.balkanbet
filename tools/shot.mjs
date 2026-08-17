// Scroll-driven screenshot harness for the Balkan Bet mockup.
//
// Lenis owns scroll on index.html and its smoothed value is what drives the
// hero choreography, so a screenshot is only meaningful once that smoothed
// value has caught up with the native one. We therefore scroll natively and
// then WAIT FOR lenis to converge, rather than sleeping a fixed amount.
//
// Usage:
//   node shot.mjs <url> <outPrefix> <p1,p2,...>   fractions of hero scroll (0..1)
//   node shot.mjs <url> <outPrefix> --y=1200,2400 absolute scrollY values
// Options: --w=1440 --h=900 --var=2 --full
import { chromium } from 'playwright';

const [url, outPrefix, positions] = process.argv.slice(2);
const opt = Object.fromEntries(
  process.argv.slice(2).filter(a => a.startsWith('--'))
    .map(a => a.replace(/^--/, '').split('='))
    .map(([k, v]) => [k, v === undefined ? true : v]),
);

const W = +(opt.w || 1440), H = +(opt.h || 900);

const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });

const errors = [];
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', e => errors.push('PAGEERROR ' + e.message));

const target = opt.var ? `${url}${url.includes('?') ? '&' : '?'}var=${opt.var}` : url;
await page.goto(target, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(400);

// Settle: Lenis smooths the scroll value the hero actually reads, so the frame
// is only meaningful once that smoothing has stopped. Rather than reaching into
// the page for the Lenis instance (which would mean adding a debug hook to
// production markup), watch the OUTPUT: poll the hero's own transforms until
// they stop changing across consecutive frames.
async function settle() {
  await page.waitForFunction(() => {
    const sig = () => {
      const b = document.getElementById('hero-media-box');
      const h = document.getElementById('hero-heading');
      return (b ? getComputedStyle(b).transform : '') + '|' +
             (h ? getComputedStyle(h).transform + getComputedStyle(h).opacity : '') + '|' +
             Math.round(window.scrollY);
    };
    return new Promise(res => {
      const a = sig();
      requestAnimationFrame(() => requestAnimationFrame(() => res(a === sig())));
    });
  }, null, { timeout: 8000, polling: 'raf' }).catch(() => {});
}

const heroRange = await page.evaluate(() => {
  const s = document.getElementById('hero-spacer');
  return s ? { top: s.offsetTop, scrollable: s.offsetHeight - innerHeight } : null;
});

let ys;
if (opt.y) ys = String(opt.y).split(',').map(Number);
else {
  const fracs = (positions && !positions.startsWith('--') ? positions : '0,0.25,0.5,0.75,1')
    .split(',').map(Number);
  ys = fracs.map(f => heroRange ? Math.round(heroRange.top + f * heroRange.scrollable) : Math.round(f * 2000));
}

const shots = [];
for (let i = 0; i < ys.length; i++) {
  await page.evaluate(y => window.scrollTo(0, y), ys[i]);
  await settle();
  const file = `${outPrefix}-${String(i).padStart(2, '0')}.png`;
  await page.screenshot({ path: file, fullPage: !!opt.full });
  shots.push({ file, y: ys[i] });
}

console.log(JSON.stringify({ shots, heroRange, errors }, null, 1));
await browser.close();
