/**
 * Formularzustände mit eingerichtetem (abgefangenem) Endpunkt: laufend, Fehler, Erfolg.
 * Es verlässt keine Anfrage den Browser – page.route beantwortet sie lokal.
 * Voraussetzung: Build mit Test-Endpunkten, siehe README („check:forms“).
 */
import { chromium } from 'playwright-core';

const base = process.argv[2] ?? 'http://localhost:4174';
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage();
const failures = [];
const check = (ok, label) => {
  console.log(`${ok ? '✓' : '✗'} ${label}`);
  if (!ok) failures.push(label);
};

let respond = 500;
let payload;
await page.route('https://forms.invalid/**', async (route) => {
  payload = route.request().postDataJSON();
  await new Promise((r) => setTimeout(r, 400));
  await route.fulfill({ status: respond, body: '{}', contentType: 'application/json' });
});

await page.goto(base + '/contact');
await page.fill('[name="Name"]', 'Test');
await page.fill('[name="Email"]', 'test@example.com');
await page.fill('[name="Nachricht"]', 'Testnachricht');

respond = 500;
await page.getByRole('button', { name: 'Anfragen' }).click();
check(await page.getByRole('button', { name: 'Wird gesendet …' }).isDisabled(), 'Laufende Übermittlung: Schaltfläche gesperrt');
await page.waitForSelector('.form-status--error');
check(/fehlgeschlagen/.test(await page.locator('.form-status').textContent()), 'Serverfehler 500 → Fehlermeldung, kein Erfolg');
check((await page.inputValue('[name="Nachricht"]')) === 'Testnachricht', 'Eingaben bleiben nach Fehler erhalten');

respond = 200;
await page.getByRole('button', { name: 'Anfragen' }).click();
await page.waitForFunction(() => /eingegangen/.test(document.querySelector('.form-status')?.textContent ?? ''));
check(true, 'Serverantwort 200 → Erfolgsmeldung');
check(payload?.form === 'contact' && payload?.Email === 'test@example.com', 'Nutzlast enthält Formulardaten');
check((await page.inputValue('[name="Name"]')) === '', 'Formular nach Erfolg geleert');

await browser.close();
if (failures.length) process.exitCode = 1;
