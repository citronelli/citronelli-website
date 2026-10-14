/**
 * Versandadapter für Formulare. Der Versanddienst ist noch nicht festgelegt (siehe README).
 *
 * Einrichtung später: Endpunkt per Umgebungsvariable setzen, z. B. in .env.local (nicht versioniert)
 *   VITE_FORM_ENDPOINT_CONTACT=https://…
 *   VITE_FORM_ENDPOINT_APPLICATION=https://…
 * Der Endpunkt erhält JSON per POST. Nur eine 2xx-Antwort gilt als Erfolg.
 * Ohne Endpunkt wird nichts gesendet und ein Fehler gemeldet – es gibt keinen simulierten Erfolg.
 */
export type FormKind = 'contact' | 'application';

export class SubmissionNotConfiguredError extends Error {
  constructor() {
    super('Versanddienst nicht eingerichtet');
    this.name = 'SubmissionNotConfiguredError';
  }
}

const endpoints: Record<FormKind, string | undefined> = {
  contact: import.meta.env.VITE_FORM_ENDPOINT_CONTACT,
  application: import.meta.env.VITE_FORM_ENDPOINT_APPLICATION,
};

export async function submitForm(kind: FormKind, data: Record<string, string>): Promise<void> {
  const endpoint = endpoints[kind];
  if (!endpoint) throw new SubmissionNotConfiguredError();

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ form: kind, ...data }),
  });
  if (!response.ok) throw new Error(`Serverantwort ${response.status}`);
}
