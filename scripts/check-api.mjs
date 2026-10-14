/**
 * Prüft die Formular-Endpunkte (api/) ohne echten Versand: Resend wird durch eine Attrappe ersetzt,
 * jeder echte Netzwerkzugriff lässt den Test fehlschlagen.
 * Aufruf: npm run check:api
 */
import { applicationForm, contactForm } from '../api/_lib/forms.js';
import { createFormHandler } from '../api/_lib/mail.js';
import contactDefault from '../api/contact.js';

globalThis.fetch = () => {
  throw new Error('Unerwarteter echter Netzwerkzugriff');
};

const failures = [];
const check = (ok, label) => {
  console.log(`${ok ? '✓' : '✗'} ${label}`);
  if (!ok) failures.push(label);
};

function mockRes() {
  return {
    statusCode: 0,
    headers: {},
    body: undefined,
    setHeader(k, v) {
      this.headers[k.toLowerCase()] = v;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.body = data;
      return this;
    },
  };
}
const req = (body, extra = {}) => ({
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body,
  ...extra,
});
function fakeResend(status, data) {
  const calls = [];
  const impl = async (url, init) => {
    calls.push({ url, init, payload: JSON.parse(init.body) });
    return { ok: status >= 200 && status < 300, status, json: async () => data };
  };
  return { impl, calls };
}
const env = { RESEND_API_KEY: 'test-key-nicht-echt' };
const validContact = { Name: 'Max Test', Email: 'max@example.com', Nachricht: 'Hallo\n<b>Test</b>', website: '', elapsedMs: 5000 };
const validApp = { Name: 'Erika Test', Email: 'erika@example.com', Bewerbung: 'Praktikum', website: '', elapsedMs: 5000 };

// Erfolg Kontakt
{
  const resend = fakeResend(200, { id: 'msg_1' });
  const res = mockRes();
  await createFormHandler(contactForm, { env, fetch: resend.impl })(req(validContact), res);
  const p = resend.calls[0]?.payload;
  check(res.statusCode === 200 && res.body.ok === true, 'Kontakt: Erfolg nach Annahme durch Resend (200, ok)');
  check(resend.calls[0]?.url === 'https://api.resend.com/emails', 'Kontakt: Aufruf der Resend-API');
  check(resend.calls[0]?.init.headers.Authorization === 'Bearer test-key-nicht-echt', 'Kontakt: Schlüssel nur serverseitig im Header');
  check(p?.subject === 'Quellfrisch – Kontaktanfrage', 'Kontakt: Betreff „Quellfrisch – Kontaktanfrage“');
  check(JSON.stringify(p?.to) === '["citronelli@quell-frisch.de"]', 'Kontakt: Empfänger citronelli@quell-frisch.de');
  check(p?.reply_to === 'max@example.com', 'Kontakt: Reply-To = Besucheradresse');
  check(p?.from === 'Quellfrisch Website <noreply@contact.quell-frisch.de>', 'Kontakt: verifizierter Standardabsender');
  check(/Max Test/.test(p?.text) && /max@example\.com/.test(p?.text) && /Hallo/.test(p?.text), 'Kontakt: alle Felder in der Textnachricht');
  check(p?.html.includes('&lt;b&gt;Test&lt;/b&gt;') && !p?.html.includes('<b>Test</b>'), 'Kontakt: HTML-Eingaben maskiert');
  check(!('website' in p) && !p.text.includes('elapsedMs'), 'Kontakt: Schutzfelder nicht in der Nachricht');
}
// Erfolg Bewerbung
{
  const resend = fakeResend(200, { id: 'msg_2' });
  const res = mockRes();
  await createFormHandler(applicationForm, { env, fetch: resend.impl })(req(validApp), res);
  const p = resend.calls[0]?.payload;
  check(res.statusCode === 200 && res.body.ok === true, 'Bewerbung: Erfolg nach Annahme');
  check(p?.subject === 'Quellfrisch – Bewerbung', 'Bewerbung: Betreff „Quellfrisch – Bewerbung“');
  check(p?.reply_to === 'erika@example.com' && /Praktikum/.test(p?.text), 'Bewerbung: Reply-To und alle Felder');
}
// Fehler beim Versanddienst
for (const [status, data, label] of [
  [500, { message: 'down' }, 'Resend 500'],
  [403, { name: 'validation_error', message: 'domain not verified' }, 'Resend 403 (Absender nicht verifiziert)'],
  [200, {}, 'Resend 200 ohne Nachrichten-ID'],
]) {
  const resend = fakeResend(status, data);
  const res = mockRes();
  await createFormHandler(contactForm, { env, fetch: resend.impl })(req(validContact), res);
  check(res.statusCode === 502 && res.body.ok === false, `${label} → 502, kein Erfolg`);
}
{
  const res = mockRes();
  await createFormHandler(contactForm, { env, fetch: async () => { throw new Error('Netzwerk'); } })(req(validContact), res);
  check(res.statusCode === 502 && res.body.ok === false, 'Netzwerkfehler → 502, kein Erfolg');
}
// Fehlende Konfiguration
{
  const resend = fakeResend(200, { id: 'x' });
  const res = mockRes();
  await createFormHandler(contactForm, { env: {}, fetch: resend.impl })(req(validContact), res);
  check(res.statusCode === 503 && res.body.error === 'not-configured' && resend.calls.length === 0, 'Ohne RESEND_API_KEY → 503, kein Versandversuch');
}
// Serverseitige Validierung und Schutz
const cases = [
  [{ ...validContact, Name: '  ' }, 400, 'leerer Name'],
  [{ ...validContact, Email: 'kein-email' }, 400, 'ungültige E-Mail'],
  [{ ...validContact, Email: 'a@b.de\nBcc: x@y.de' }, 400, 'E-Mail mit Zeilenumbruch (Header-Injection)'],
  [{ ...validContact, Nachricht: 'x'.repeat(5001) }, 400, 'zu lange Nachricht'],
  [{ ...validContact, website: 'http://spam' }, 400, 'Honeypot gefüllt'],
  [{ ...validContact, elapsedMs: 300 }, 400, 'zu schnell abgesendet'],
  [{ ...validContact, elapsedMs: undefined }, 400, 'ohne Ausfüllzeit'],
  ['kein json', 400, 'ungültiger Body'],
];
for (const [body, expected, label] of cases) {
  const resend = fakeResend(200, { id: 'x' });
  const res = mockRes();
  await createFormHandler(contactForm, { env, fetch: resend.impl })(req(body), res);
  check(res.statusCode === expected && resend.calls.length === 0, `Abgelehnt: ${label}`);
}
{
  const resend = fakeResend(200, { id: 'x' });
  const res = mockRes();
  await createFormHandler(applicationForm, { env, fetch: resend.impl })(req({ ...validApp, Bewerbung: 'Vorstand' }), res);
  check(res.statusCode === 400 && resend.calls.length === 0, 'Abgelehnt: unbekannte Bewerbungsart');
}
{
  const res = mockRes();
  await createFormHandler(contactForm, { env })(req(validContact, { method: 'GET' }), res);
  check(res.statusCode === 405, 'GET → 405');
  const res2 = mockRes();
  await createFormHandler(contactForm, { env })(req(validContact, { headers: { 'content-type': 'text/plain' } }), res2);
  check(res2.statusCode === 415, 'Falscher Content-Type → 415');
}
// Standard-Export liest process.env (hier ohne Schlüssel) und sendet nichts
{
  const saved = process.env.RESEND_API_KEY;
  delete process.env.RESEND_API_KEY;
  const res = mockRes();
  await contactDefault(req(validContact), res);
  check(res.statusCode === 503, 'api/contact.js ohne Schlüssel → 503');
  if (saved !== undefined) process.env.RESEND_API_KEY = saved;
}

if (failures.length) {
  console.error(`\n${failures.length} Prüfung(en) fehlgeschlagen.`);
  process.exitCode = 1;
}
