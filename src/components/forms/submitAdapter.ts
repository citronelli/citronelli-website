/**
 * Versandadapter für Formulare. Sendet an die eigenen serverseitigen Endpunkte (api/contact.js,
 * api/application.js), die per Resend an citronelli@quell-frisch.de zustellen. Der API-Schlüssel liegt
 * ausschließlich auf dem Server (Vercel-Umgebungsvariable RESEND_API_KEY).
 *
 * Erfolg gilt nur, wenn der Endpunkt mit 2xx und { ok: true } antwortet – also nachdem der Versanddienst
 * die Nachricht angenommen hat.
 */
export type FormKind = 'contact' | 'application';

export class SubmissionNotConfiguredError extends Error {
  constructor() {
    super('Versanddienst nicht eingerichtet');
    this.name = 'SubmissionNotConfiguredError';
  }
}

const endpoints: Record<FormKind, string> = {
  contact: '/api/contact',
  application: '/api/application',
};

export async function submitForm(
  kind: FormKind,
  data: Record<string, string>,
  meta: { website: string; elapsedMs: number },
): Promise<void> {
  const response = await fetch(endpoints[kind], {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ ...data, ...meta }),
  });
  const result = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
  if (response.ok && result?.ok === true) return;
  if (result?.error === 'not-configured') throw new SubmissionNotConfiguredError();
  throw new Error(`Serverantwort ${response.status}`);
}
