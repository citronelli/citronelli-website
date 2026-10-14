import { useCallback, useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { SubmissionNotConfiguredError, submitForm } from './submitAdapter';
import type { FormKind } from './submitAdapter';

export type Validator<T> = (values: T) => Partial<Record<keyof T, string>>;
export type FormStatus = 'idle' | 'submitting' | 'error' | 'not-configured' | 'success';

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Formularzustand: Werte, Feldfehler, Übermittlungsstatus.
 * Erfolg wird nur nach erfolgreicher Serverantwort gesetzt.
 */
export function useForm<T extends Record<string, string>>(kind: FormKind, initial: T, validate: Validator<T>) {
  const [values, setValues] = useState<T>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<FormStatus>('idle');
  const formRef = useRef<HTMLFormElement>(null);
  // Zeitpunkt der Anzeige; der Server verwirft Einsendungen, die zu schnell abgeschickt werden
  const shownAt = useRef(0);
  useEffect(() => {
    shownAt.current = Date.now();
  }, []);

  const setValue = useCallback(
    (name: keyof T, value: string) => {
      const next = { ...values, [name]: value };
      setValues(next);
      // Nach dem ersten Absenden Fehler direkt aktualisieren
      if (submitted) setErrors(validate(next));
      if (status === 'error' || status === 'not-configured' || status === 'success') setStatus('idle');
    },
    [values, submitted, validate, status],
  );

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === 'submitting') return;
    setSubmitted(true);
    const nextErrors = validate(values);
    setErrors(nextErrors);
    const firstInvalid = Object.keys(nextErrors)[0];
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }
    const honeypot = formRef.current?.querySelector<HTMLInputElement>('input[name="website"]')?.value ?? '';

    setStatus('submitting');
    try {
      await submitForm(kind, values, { website: honeypot, elapsedMs: Date.now() - shownAt.current });
      setStatus('success');
      setValues(initial);
      setSubmitted(false);
    } catch (error) {
      setStatus(error instanceof SubmissionNotConfiguredError ? 'not-configured' : 'error');
    }
  };

  return { values, errors, status, setValue, onSubmit, formRef };
}
