/**
 * Formularzustände im Browser mit simuliertem Server: laufend, Fehler, Erfolg, SPA-HTML statt API.
 * Alle Anfragen an /api/* werden per page.route lokal beantwortet – nichts wird versendet.
 * Aufruf: npm run check:forms
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

let reply = { status: 500, body: { ok: false, error: 'send-failed' }, type: 'application/json' };
const payloads = [];
await page.route('**/api/**', async (route) => {
  payloads.push({ url: route.request().url(), body: route.request().postDataJSON() });
  await new Promise((r) => setTimeout(r, 400));
  await route.fulfill({
    status: reply.status,
    contentType: reply.type,
    body: typeof reply.body === 'string' ? reply.body : JSON.stringify(reply.body),
  });
});
page.on('request', (r) => {
  if (!r.url().startsWith(base) && !r.url().startsWith('data:')) failures.push(`Externe Anfrage: ${r.url()}`);
});

// Kontakt
await page.goto(base + '/contact');
await page.fill('[name="Name"]', 'Test');
await page.fill('[name="Email"]', 'test@example.com');
await page.fill('[name="Nachricht"]', 'Testnachricht');

reply = { status: 502, body: { ok: false, error: 'send-failed' }, type: 'application/json' };
await page.getByRole('button', { name: 'Anfragen' }).click();
check(await page.getByRole('button', { name: 'Wird gesendet …' }).isDisabled(), 'Laufende Übermittlung: Schaltfläche gesperrt');
await page.waitForSelector('.form-status--error');
check(/fehlgeschlagen/.test(await page.locator('.form-status').textContent()), 'Versandfehler 502 → Fehlermeldung, kein Erfolg');
check((await page.inputValue('[name="Nachricht"]')) === 'Testnachricht', 'Eingaben bleiben nach Fehler erhalten');

reply = { status: 503, body: { ok: false, error: 'not-configured' }, type: 'application/json' };
await page.getByRole('button', { name: 'Anfragen' }).click();
await page.waitForFunction(() => /derzeit nicht möglich/.test(document.querySelector('.form-status')?.textContent ?? ''));
check(true, 'Nicht konfiguriert 503 → Hinweis, kein Erfolg');

reply = { status: 200, body: '<!doctype html><html></html>', type: 'text/html' };
await page.getByRole('button', { name: 'Anfragen' }).click();
await page.waitForSelector('.form-status--error');
check(!/eingegangen/.test(await page.locator('.form-status').textContent()), 'HTML-Antwort mit 200 (SPA-Fallback) gilt nicht als Erfolg');

reply = { status: 200, body: { ok: true }, type: 'application/json' };
await page.getByRole('button', { name: 'Anfragen' }).click();
await page.waitForFunction(() => /eingegangen/.test(document.querySelector('.form-status')?.textContent ?? ''));
check(true, 'Bestätigte Annahme 200 { ok: true } → Erfolgsmeldung');
const last = payloads.at(-1);
check(last.url.endsWith('/api/contact'), 'Kontakt sendet an /api/contact');
check(last.body.Email === 'test@example.com' && last.body.Nachricht === 'Testnachricht', 'Nutzlast enthält Formulardaten');
check(last.body.website === '' && Number.isFinite(last.body.elapsedMs), 'Nutzlast enthält Honeypot und Ausfüllzeit');
check((await page.inputValue('[name="Name"]')) === '', 'Formular nach Erfolg geleert');

// Bewerbung
await page.goto(base + '/career');
await page.fill('[name="Name"]', 'Test');
await page.fill('[name="Email"]', 'test@example.com');
await page.selectOption('[name="Bewerbung"]', 'Praktikum');
reply = { status: 200, body: { ok: true }, type: 'application/json' };
await page.getByRole('button', { name: 'Jetzt Bewerben' }).click();
await page.waitForFunction(() => /eingegangen/.test(document.querySelector('.form-status')?.textContent ?? ''));
check(payloads.at(-1).url.endsWith('/api/application') && payloads.at(-1).body.Bewerbung === 'Praktikum', 'Bewerbung sendet an /api/application, Erfolg nach Bestätigung');

await browser.close();
for (const f of failures.filter((f) => f.startsWith('Externe'))) console.log(`✗ ${f}`);
if (failures.length) process.exitCode = 1;
