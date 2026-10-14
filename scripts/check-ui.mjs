/**
 * Funktionsprüfung gegen einen laufenden Server (npm run preview):
 * mobiles Menü (Tastatur, Escape, Fokus, aria-expanded, Touch) sowie interne Links/Routen.
 * Aufruf: npm run check:ui [-- <url>]
 */
import { chromium } from 'playwright-core';

const base = process.argv[2] ?? 'http://localhost:4173';
const browser = await chromium.launch({ channel: 'chrome' });
const failures = [];
const check = (ok, label) => {
  console.log(`${ok ? '✓' : '✗'} ${label}`);
  if (!ok) failures.push(label);
};

for (const width of [390, 810]) {
  const page = await browser.newPage({ viewport: { width, height: 844 } });
  await page.goto(base + '/');
  const toggle = page.locator('.site-header__toggle');
  const menu = page.locator('.mobile-menu');

  check((await toggle.getAttribute('aria-expanded')) === 'false', `${width}px: Menü initial geschlossen (aria-expanded=false)`);

  await toggle.focus();
  await page.keyboard.press('Enter');
  check((await toggle.getAttribute('aria-expanded')) === 'true', `${width}px: Enter öffnet Menü (aria-expanded=true)`);
  check(await menu.isVisible(), `${width}px: Menü sichtbar`);
  const focused = await page.evaluate(() => document.activeElement?.textContent);
  check(focused === 'Marken', `${width}px: Fokus auf erstem Menüpunkt (${focused})`);
  check(await page.evaluate(() => document.body.classList.contains('is-scroll-locked')), `${width}px: Seite gesperrt`);

  // Tab-Fokus bleibt im Header
  for (let i = 0; i < 12; i++) await page.keyboard.press('Tab');
  const inHeader = await page.evaluate(() => !!document.activeElement?.closest('.site-header'));
  check(inHeader, `${width}px: Tab-Fokus bleibt im geöffneten Menü`);
  await page.keyboard.press('Shift+Tab');
  check(
    await page.evaluate(() => !!document.activeElement?.closest('.site-header')),
    `${width}px: Shift+Tab bleibt im geöffneten Menü`,
  );

  await page.keyboard.press('Escape');
  check((await toggle.getAttribute('aria-expanded')) === 'false', `${width}px: Escape schließt Menü`);
  check(!(await menu.isVisible()), `${width}px: Menü ausgeblendet`);
  check(
    await page.evaluate(() => document.activeElement?.classList.contains('site-header__toggle')),
    `${width}px: Fokus zurück auf Menü-Schalter`,
  );

  // Maus/Touch: öffnen, Link wählen → Navigation + Menü zu
  await toggle.click();
  await page.locator('.mobile-menu__link', { hasText: 'Blog' }).click();
  await page.waitForURL('**/blog');
  check((await toggle.getAttribute('aria-expanded')) === 'false', `${width}px: Klick auf Menüpunkt navigiert und schließt`);
  check(
    !(await page.evaluate(() => document.body.classList.contains('is-scroll-locked'))),
    `${width}px: Scrollsperre nach Navigation aufgehoben`,
  );
  await page.close();
}

// Interne Links aller Seiten führen auf vorhandene Seiten (keine Fehlerseite)
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const pages = ['/', '/work', '/work/studio-atlas', '/work/work', '/work/work-2', '/about', '/einsatzbereiche',
  '/einsatzbereiche/hotels', '/blog', '/blog/zutatenwissen', '/blog/einblicke', '/career', '/contact', '/imprint', '/privacy'];
const hrefs = new Set();
for (const p of pages) {
  await page.goto(base + p);
  check((await page.locator('#not-found-heading').count()) === 0, `Seite ${p} vorhanden`);
  check((await page.locator('h1').count()) === 1, `Seite ${p} hat genau eine h1`);
  (await page.$$eval('a[href^="/"]', (as) => as.map((a) => a.getAttribute('href')))).forEach((h) => hrefs.add(h));
}
for (const href of hrefs) {
  await page.goto(base + href);
  check((await page.locator('#not-found-heading').count()) === 0, `Link ${href} führt auf vorhandene Seite`);
}
// Seitentitel und Beschreibung je Seite
const titles = new Map();
for (const p of pages) {
  await page.goto(base + p);
  const title = await page.title();
  const desc = await page.getAttribute('meta[name="description"]', 'content');
  check(title.endsWith('Quellfrisch') && !/ProLab|FreeLab|Framer/.test(title), `${p}: Titel „${title}“`);
  check(!!desc && desc.length > 20, `${p}: Beschreibung vorhanden`);
  titles.set(title, (titles.get(title) ?? 0) + 1);
}
check([...titles.values()].every((n) => n === 1), 'Seitentitel sind eindeutig');

// Abschlussdurchgang: Texte, Footer, Social, Blogüberschrift
for (const width of [390, 810, 1440]) {
  const p2 = await browser.newPage({ viewport: { width, height: 900 } });
  await p2.goto(base + '/');
  const footer = p2.locator('footer');
  for (const label of ['Inhalt', 'Rechtliches', 'Social', 'Impressum', 'Datenschutz'])
    check(await footer.getByText(label, { exact: true }).isVisible(), `${width}px: Footer zeigt „${label}“`);
  check((await footer.getByText('Studio', { exact: true }).count()) === 0, `${width}px: kein „Studio“-Vorlagenrest`);
  check((await p2.locator('a[href*="framer.com"]').count()) === 0, `${width}px: keine Framer-Verweise`);
  check(await p2.getByText('Jetzt ins Gespräch kommen.').isVisible(), `${width}px: neuer Kontaktaufruf`);
  if (width < 1200) check((await p2.locator('.site-header__toggle').textContent()) === 'Menü', `${width}px: Schalter „Menü“`);
  await p2.goto(base + '/blog');
  const h = p2.locator('h1');
  const color = await h.evaluate((el) => getComputedStyle(el).color);
  check((await h.isVisible()) && color === 'rgb(0, 0, 0)', `${width}px: „Blog (6)“ sichtbar`);
  await p2.close();
}
const bodyText = async (p) => { await page.goto(base + p); return page.locator('body').innerText(); };
check(!/Let’s work|Sometimes imagination|Next Blog|Author\b|Select…|Zutatenseiten|\b(Oct|Sep) \d/.test(
  (await bodyText('/')) + (await bodyText('/contact')) + (await bodyText('/career')) + (await bodyText('/blog/zutatenwissen')) + (await bodyText('/blog/produktentwicklung'))),
  'Keine englischen Bedienelemente, alten Daten oder Zutatenseiten-Verweise');
await page.goto(base + '/blog/zutatenwissen');
check(await page.getByText('Nächster Beitrag').isVisible() && await page.getByText('Autor', { exact: true }).isVisible() && await page.getByText('15. September 2026').first().isVisible(), 'Blogartikel: „Nächster Beitrag“, „Autor“, deutsches Datum');
await page.goto(base + '/career');
check((await page.locator('select[name="Bewerbung"] option').first().textContent()) === 'Bitte auswählen …', 'Auswahl „Bitte auswählen …“');

// Direktaufruf, Neuladen und Weiterleitung alter Bloglinks
await page.goto(base + '/einsatzbereiche/hotels');
await page.reload();
check((await page.locator('h1').textContent()) === 'Hotels', 'Direktaufruf + Neuladen /einsatzbereiche/hotels');
await page.goto(base + '/zutatenwissen');
await page.waitForURL('**/blog/zutatenwissen', { timeout: 3000 }).catch(() => {});
check(page.url().endsWith('/blog/zutatenwissen'), 'Alter Link /zutatenwissen → /blog/zutatenwissen');
await page.goto(base + '/gibt-es-nicht');
check((await page.locator('#not-found-heading').count()) === 1, 'Unbekannter Pfad zeigt Fehlerseite');

// Formulare ohne Versanddienst: Validierung, kein Versand, kein Erfolg
for (const [route, submit, emailName] of [['/contact', 'Anfragen', 'Email'], ['/career', 'Jetzt Bewerben', 'Email']]) {
  const requests = [];
  page.on('request', (r) => { if (r.method() === 'POST') requests.push(r.url()); });
  await page.goto(base + route);
  await page.getByRole('button', { name: submit }).click();
  const errors = await page.locator('.form-field__error').count();
  check(errors >= 3, `${route}: leeres Absenden zeigt Feldfehler (${errors})`);
  check(await page.evaluate(() => document.activeElement?.getAttribute('name') === 'Name'), `${route}: Fokus auf erstem fehlerhaften Feld`);
  check((await page.locator('[aria-invalid="true"]').count()) >= 3, `${route}: aria-invalid gesetzt`);
  await page.fill('[name="Name"]', 'Test');
  await page.fill(`[name="${emailName}"]`, 'kein-email');
  check((await page.locator('.form-field__error', { hasText: 'gültige' }).count()) === 1, `${route}: ungültige E-Mail erkannt`);
  await page.fill(`[name="${emailName}"]`, 'test@example.com');
  if (route === '/contact') await page.fill('[name="Nachricht"]', 'Test');
  else await page.selectOption('[name="Bewerbung"]', 'Praktikum');
  check((await page.locator('.form-field__error').count()) === 0, `${route}: gültige Eingaben ohne Fehler`);
  await page.getByRole('button', { name: submit }).click();
  const statusText = await page.locator('.form-status').textContent();
  check(/nicht eingerichtet/.test(statusText ?? ''), `${route}: ohne Versanddienst Hinweis statt Erfolg („${statusText}“)`);
  check(requests.length === 0, `${route}: keine Anfrage gesendet`);
  page.removeAllListeners('request');
}

// Reduzierte Bewegung: alle Einblend-Elemente sofort sichtbar
const ctx = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } });
const rm = await ctx.newPage();
await rm.goto(base + '/');
const hidden = await rm.$$eval('.reveal, .appear-word', (els) => els.filter((el) => getComputedStyle(el).opacity !== '1').length);
check(hidden === 0, `prefers-reduced-motion: alle Inhalte sichtbar (${hidden} verborgen)`);
await ctx.close();

await browser.close();
if (failures.length) {
  console.error(`\n${failures.length} Prüfung(en) fehlgeschlagen.`);
  process.exitCode = 1;
}
