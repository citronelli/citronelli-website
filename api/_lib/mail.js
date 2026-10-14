/**
 * Gemeinsame Logik der Formular-Endpunkte (nur serverseitig; Dateien unter api/_lib werden von Vercel
 * nicht als eigene Funktion ausgeliefert).
 *
 * Umgebungsvariablen (Vercel → Project → Settings → Environment Variables):
 *   RESEND_API_KEY    erforderlich, geheim
 *   FORM_FROM_EMAIL   optional, bei Resend verifizierter Absender
 *                     (Standard: bisheriger Absender „noreply@contact.quell-frisch.de“)
 *   FORM_TO_EMAIL     optional, Empfänger (Standard: citronelli@quell-frisch.de)
 */

export const DEFAULT_FROM = 'Quellfrisch Website <noreply@contact.quell-frisch.de>';
export const DEFAULT_TO = 'citronelli@quell-frisch.de';
const EMAIL_PATTERN = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]{2,}$/;
/** Mindestzeit zwischen Anzeigen und Absenden des Formulars (Schutz gegen automatisierte Einsendungen) */
export const MIN_FILL_MS = 1500;

export const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const clean = (value) => (typeof value === 'string' ? value.trim() : '');
/** Steuerzeichen entfernen; Zeilenumbrüche nur, wo erlaubt (verhindert Header-Injection in Betreff/Reply-To) */
const singleLine = (value) => clean(value).replace(/[\u0000-\u001f\u007f]+/g, ' ');
const multiLine = (value) => clean(value).replace(/\r\n?/g, '\n').replace(/[\u0000-\u0009\u000b-\u001f\u007f]+/g, ' ');

/**
 * Prüft die Einsendung. Gibt { values } oder { errors } zurück; { bot: true } bei erkannter Automatisierung.
 * fields: [{ name, label, required, max, type: 'email' | 'text' | 'multiline', options? }]
 */
export function validate(body, fields) {
  if (!body || typeof body !== 'object') return { errors: { _form: 'Ungültige Anfrage.' } };
  // Honeypot gefüllt oder zu schnell abgesendet → still verwerfen
  if (clean(body.website)) return { bot: true };
  const elapsed = Number(body.elapsedMs);
  if (!Number.isFinite(elapsed) || elapsed < MIN_FILL_MS) return { bot: true };

  const values = {};
  const errors = {};
  for (const field of fields) {
    const raw = field.type === 'multiline' ? multiLine(body[field.name]) : singleLine(body[field.name]);
    if (!raw) {
      if (field.required) errors[field.name] = `${field.label} fehlt.`;
      continue;
    }
    if (raw.length > field.max) errors[field.name] = `${field.label} ist zu lang.`;
    else if (field.type === 'email' && !EMAIL_PATTERN.test(raw)) errors[field.name] = 'Ungültige E-Mail-Adresse.';
    else if (field.options && !field.options.includes(raw)) errors[field.name] = `${field.label} ist ungültig.`;
    values[field.name] = raw;
  }
  return Object.keys(errors).length ? { errors } : { values };
}

/** Übersichtliche Nachricht als Text und HTML (alle Feldwerte maskiert). */
export function buildMessage(title, fields, values) {
  const rows = fields.filter((f) => values[f.name]);
  const text = [`${title}`, '', ...rows.map((f) => `${f.label}:\n${values[f.name]}\n`), '—', 'Gesendet über das Formular auf quell-frisch.de'].join('\n');
  const html = `<!doctype html><html lang="de"><body style="margin:0;padding:32px;background:#f5f5f5;font-family:Helvetica,Arial,sans-serif;color:#000">
<table role="presentation" width="100%" style="max-width:600px;margin:0 auto;background:#fff;border-collapse:collapse">
<tr><td style="padding:28px 32px 8px;font-size:20px;font-weight:600">${escapeHtml(title)}</td></tr>
${rows
  .map(
    (f) => `<tr><td style="padding:14px 32px;border-bottom:1px solid #eee">
<div style="font-size:12px;color:#666;margin-bottom:4px">${escapeHtml(f.label)}</div>
<div style="font-size:15px;line-height:1.5;white-space:pre-wrap">${escapeHtml(values[f.name])}</div></td></tr>`,
  )
  .join('\n')}
<tr><td style="padding:20px 32px 28px;font-size:12px;color:#666">Gesendet über das Formular auf quell-frisch.de. „Antworten“ schreibt direkt an den Absender.</td></tr>
</table></body></html>`;
  return { text, html };
}

/** Sendet über die Resend-REST-API. Erfolg nur bei 2xx-Antwort mit Nachrichten-ID. */
export async function sendMail({ subject, replyTo, text, html }, env = process.env, fetchImpl = fetch) {
  const apiKey = env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, status: 503, error: 'not-configured' };
  let response;
  try {
    response = await fetchImpl('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: env.FORM_FROM_EMAIL || DEFAULT_FROM,
        to: [env.FORM_TO_EMAIL || DEFAULT_TO],
        reply_to: replyTo,
        subject,
        text,
        html,
      }),
    });
  } catch {
    return { ok: false, status: 502, error: 'send-failed' };
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.id) {
    console.error('Resend-Fehler', response.status, data?.name ?? '', data?.message ?? '');
    return { ok: false, status: 502, error: 'send-failed' };
  }
  return { ok: true, id: data.id };
}

/** Gemeinsamer Request-Handler für beide Formulare. */
export function createFormHandler({ subject, title, fields }, deps = {}) {
  return async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store');
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).json({ ok: false, error: 'method-not-allowed' });
    }
    if (!String(req.headers['content-type'] || '').includes('application/json')) {
      return res.status(415).json({ ok: false, error: 'unsupported-media-type' });
    }
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        body = null;
      }
    }
    const result = validate(body, fields);
    if (result.bot) return res.status(400).json({ ok: false, error: 'rejected' });
    if (result.errors) return res.status(400).json({ ok: false, error: 'invalid', fields: result.errors });

    const { text, html } = buildMessage(title, fields, result.values);
    const sent = await sendMail({ subject, replyTo: result.values.Email, text, html }, deps.env, deps.fetch);
    if (!sent.ok) return res.status(sent.status).json({ ok: false, error: sent.error });
    return res.status(200).json({ ok: true });
  };
}
