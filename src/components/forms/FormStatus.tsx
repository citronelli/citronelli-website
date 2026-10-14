import type { FormStatus as Status } from './useForm';

interface Props {
  status: Status;
  messages: { submitting: string; success: string; error: string; notConfigured: string };
}

/** Rückmeldung zur Übermittlung; Erfolg nur nach erfolgreicher Serverantwort. */
export function FormStatus({ status, messages }: Props) {
  const text =
    status === 'submitting'
      ? messages.submitting
      : status === 'success'
        ? messages.success
        : status === 'error'
          ? messages.error
          : status === 'not-configured'
            ? messages.notConfigured
            : '';
  const isError = status === 'error' || status === 'not-configured';
  return (
    <p
      className={`form-status${isError ? ' form-status--error' : ''}`}
      role={isError ? 'alert' : 'status'}
      aria-live={isError ? 'assertive' : 'polite'}
    >
      {text}
    </p>
  );
}
