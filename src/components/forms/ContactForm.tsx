import { EMAIL_PATTERN, useForm } from './useForm';
import type { Validator } from './useForm';
import { FormField, Honeypot } from './FormField';
import { FormStatus } from './FormStatus';
import './ContactForm.css';

type Values = { Name: string; Email: string; Nachricht: string };

const validate: Validator<Values> = (v) => {
  const errors: Partial<Record<keyof Values, string>> = {};
  if (!v.Name.trim()) errors.Name = 'Bitte geben Sie Ihren Namen ein.';
  if (!v.Email.trim()) errors.Email = 'Bitte geben Sie Ihre E-Mail-Adresse ein.';
  else if (!EMAIL_PATTERN.test(v.Email.trim())) errors.Email = 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
  if (!v.Nachricht.trim()) errors.Nachricht = 'Bitte geben Sie Ihre Nachricht ein.';
  return errors;
};

/** Kontaktformular. Felder, Platzhalter und Schaltfläche laut Quelle. */
export function ContactForm() {
  const { values, errors, status, setValue, onSubmit, formRef } = useForm<Values>(
    'contact',
    { Name: '', Email: '', Nachricht: '' },
    validate,
  );

  return (
    <form ref={formRef} className="contact-form" noValidate onSubmit={onSubmit} aria-label="Anfrage">
      <div className="contact-form__row">
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
          placeholder="info@beispiel.de"
          autoComplete="email"
          required
          value={values.Email}
          error={errors.Email}
          onChange={(value) => setValue('Email', value)}
        />
      </div>
      <FormField
        as="textarea"
        label="Anfrage"
        name="Nachricht"
        placeholder="Ihre Nachricht"
        required
        value={values.Nachricht}
        error={errors.Nachricht}
        onChange={(value) => setValue('Nachricht', value)}
      />
      <Honeypot />
      <button type="submit" className="contact-form__submit" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Wird gesendet …' : 'Anfragen'}
      </button>
      <FormStatus
        status={status}
        messages={{
          submitting: 'Ihre Anfrage wird übermittelt.',
          success: 'Vielen Dank! Ihre Anfrage ist bei uns eingegangen.',
          error: 'Die Übermittlung ist fehlgeschlagen. Bitte versuchen Sie es später erneut.',
          notConfigured: 'Der Versand ist derzeit nicht möglich. Es wurde nichts gesendet. Bitte versuchen Sie es später erneut.',
        }}
      />
    </form>
  );
}
