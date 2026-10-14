import { useId } from 'react';
import './FormField.css';

interface BaseProps {
  label: string;
  name: string;
  value: string;
  error?: string;
  required?: boolean;
  onChange: (value: string) => void;
}

type FieldProps =
  | (BaseProps & { as?: 'input'; type?: 'text' | 'email'; placeholder?: string; autoComplete?: string })
  | (BaseProps & { as: 'textarea'; placeholder?: string })
  | (BaseProps & { as: 'select'; options: { value: string; label: string }[]; placeholder: string });

/** Formularfeld mit Bezeichnung, Fehlermeldung und Barrierefreiheitsattributen. */
export function FormField(props: FieldProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const common = {
    id,
    name: props.name,
    value: props.value,
    required: props.required,
    'aria-required': props.required || undefined,
    'aria-invalid': props.error ? true : undefined,
    'aria-describedby': props.error ? errorId : undefined,
    className: 'form-field__control',
  } as const;

  let control: React.ReactNode;
  if (props.as === 'textarea') {
    control = (
      <textarea {...common} placeholder={props.placeholder} onChange={(e) => props.onChange(e.target.value)} />
    );
  } else if (props.as === 'select') {
    control = (
      <span className="form-field__select">
        <select {...common} onChange={(e) => props.onChange(e.target.value)}>
          <option value="" disabled>
            {props.placeholder}
          </option>
          {props.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </span>
    );
  } else {
    control = (
      <input
        {...common}
        type={props.type ?? 'text'}
        placeholder={props.placeholder}
        autoComplete={props.autoComplete}
        onChange={(e) => props.onChange(e.target.value)}
      />
    );
  }

  return (
    <div className={`form-field${props.error ? ' has-error' : ''}`}>
      <label htmlFor={id} className="form-field__label">
        {props.label}
      </label>
      {control}
      {props.error && (
        <p id={errorId} className="form-field__error">
          {props.error}
        </p>
      )}
    </div>
  );
}

/** Verstecktes Feld gegen automatisierte Einsendungen (wie in der Quelle). */
export function Honeypot() {
  return (
    <input
      type="text"
      name="website"
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
      className="form-honeypot"
      defaultValue=""
    />
  );
}
