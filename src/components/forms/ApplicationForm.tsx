import { EMAIL_PATTERN, useForm } from './useForm';
import type { Validator } from './useForm';
import { FormField, Honeypot } from './FormField';
import { FormStatus } from './FormStatus';
import './ApplicationForm.css';

type Values = { Name: string; Email: string; Bewerbung: string };

const validate: Validator<Values> = (v) => {
  const errors: Partial<Record<keyof Values, string>> = {};
  if (!v.Name.trim()) errors.Name = 'Bitte gib deinen Namen ein.';
  if (!v.Email.trim()) errors.Email = 'Bitte gib deine E-Mail-Adresse ein.';
  else if (!EMAIL_PATTERN.test(v.Email.trim())) errors.Email = 'Bitte gib eine gültige E-Mail-Adresse ein.';
  if (!v.Bewerbung) errors.Bewerbung = 'Bitte wähle eine Bewerbungsart.';
  return errors;
};

/**
 * Bewerbungsformular (Karriere). Felder laut Quelle: Name, Email, Auswahl „Bewerbung“ mit Option „Praktikum“.
 * Ein Datei-Upload ist in der Quelle nicht belegt und wird nicht ergänzt.
 */
export function ApplicationForm() {
  const { values, errors, status, setValue, onSubmit, formRef } = useForm<Values>(
    'application',
    { Name: '', Email: '', Bewerbung: '' },
    validate,
  );

  return (
    <form ref={formRef} className="application-form" noValidate onSubmit={onSubmit} aria-label="Bewerbung">
      <FormField
        label="Name"
        name="Name"
        placeholder="Max Mustermann"
        autoComplete="name"
        required
        value={values.Name}
        error={errors.Name}
        onChange={(value) => setValue('Name', value)}
      />
      <FormField
        label="Email"
        name="Email"
        type="email"
        placeholder="max@beispiel.de"
        autoComplete="email"
        required
        value={values.Email}
        error={errors.Email}
        onChange={(value) => setValue('Email', value)}
      />
      <FormField
        as="select"
        label="Bewerbung"
        name="Bewerbung"
        placeholder="Bitte auswählen …"
        options={[{ value: 'Praktikum', label: 'Praktikum' }]}
        required
        value={values.Bewerbung}
        error={errors.Bewerbung}
        onChange={(value) => setValue('Bewerbung', value)}
      />
      <Honeypot />
      <button type="submit" className="application-form__submit" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Wird gesendet …' : 'Jetzt Bewerben'}
      </button>
      <FormStatus
        status={status}
        messages={{
          submitting: 'Deine Bewerbung wird übermittelt.',
          success: 'Danke! Deine Bewerbung ist bei uns eingegangen.',
          error: 'Die Übermittlung ist fehlgeschlagen. Bitte versuche es später erneut.',
          notConfigured: 'Der Versand ist noch nicht eingerichtet. Es wurde nichts gesendet.',
        }}
      />
    </form>
  );
}
