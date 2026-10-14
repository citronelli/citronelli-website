/**
 * Lokale Sichtprüfung: Ganzseiten-Screenshots und Überlaufprüfung je Seite und Breite.
 * Voraussetzung: laufender Server (npm run preview, Standard http://localhost:4173) und Google Chrome.
 * Aufruf: npm run screenshots [-- --base <url>] [-- --only /work,/about]
 */
import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';

const args = process.argv.slice(2);
const opt = (name) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};
const base = opt('base') ?? 'http://localhost:4173';

export const routes = [
  '/',
  '/work',
  '/work/studio-atlas',
  '/work/work',
  '/work/work-2',
  '/about',
  '/einsatzbereiche',
  '/einsatzbereiche/spasundwellness',
  '/einsatzbereiche/hotels',
  '/einsatzbereiche/gastronomie',
  '/einsatzbereiche/loungesundevents',
  '/blog',
  '/blog/wellnesshotels',
  '/blog/spakonzept',
  '/blog/speisebegleitung',
  '/blog/zutatenwissen',
  '/blog/einblicke',
  '/blog/produktentwicklung',
  '/career',
  '/contact',
  '/imprint',
  '/privacy',
];
const only = opt('only')?.split(',');
const selected = only ? routes.filter((r) => only.includes(r)) : routes;
const widths = (opt('widths') ?? '390,809,810,1199,1200,1440').split(',').map(Number);
const heightFor = (w) => (w < 810 ? 844 : w < 1200 ? 1080 : 800);
const outDir = new URL('../screenshots/', import.meta.url);
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ channel: 'chrome' });
let problems = 0;

for (const route of selected) {
  const name = route === '/' ? 'home' : route.slice(1).replaceAll('/', '_');
  for (const width of widths) {
    const vh = heightFor(width);
    const page = await browser.newPage({ viewport: { width, height: vh } });
    await page.goto(base + route, { waitUntil: 'networkidle' });
    // Durch die Seite scrollen, damit Einblendungen und Lazy-Bilder geladen werden.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 300) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 30));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(1200);

    const report = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const overflowX = document.documentElement.scrollWidth - vw;
      const offenders = [];
      document.querySelectorAll('body *').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width && (r.right > vw + 1 || r.left < -1)) {
          if (getComputedStyle(el).position !== 'fixed' && !el.closest('.visually-hidden, .form-honeypot'))
            offenders.push(`${el.tagName}.${el.className}`);
        }
      });
      return { overflowX, offenders: offenders.slice(0, 6) };
    });
    const bad = report.overflowX > 0 || report.offenders.length;
    if (bad) problems++;
    console.log(`${bad ? '✗' : '✓'} ${route} @${width}px`, bad ? JSON.stringify(report) : '');

    // Ganzseite im „Canvas-Modus“ wie im Framer-Editor: 100vh als feste Höhe, sticky aus.
    await page.addStyleTag({
      content: `.hero,.image-stack__card{height:${vh}px!important}.image-stack__card,.detail-banner--brand{position:relative!important;top:auto!important}.ez-section{height:${Math.round(vh * 0.75875)}px!important}@media (max-width:1199.98px){.ez-section{height:auto!important}}.reveal{opacity:1!important;transform:none!important}`,
    });
    await page.waitForTimeout(200);
    await page.screenshot({ path: new URL(`${name}-${width}.png`, outDir).pathname, fullPage: true });
    await page.close();
  }
}

await browser.close();
if (problems) {
  console.error(`Überlauf in ${problems} Aufnahme(n) gefunden.`);
  process.exitCode = 1;
}
