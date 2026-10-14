import './FactList.css';

interface Fact {
  label: string;
  value: string;
  /** maschinenlesbares Datum für <time> */
  dateTime?: string;
}

interface FactListProps {
  facts: Fact[];
  /** „table“: Bezeichnung | Wert nebeneinander (Produktdaten); „stacked“: untereinander (Eckdaten) */
  variant: 'table' | 'stacked';
  className?: string;
}

/** Produktdaten bzw. Eckdaten als Beschreibungsliste. */
export function FactList({ facts, variant, className }: FactListProps) {
  return (
    <dl className={['fact-list', `fact-list--${variant}`, className].filter(Boolean).join(' ')}>
      {facts.map((fact) => (
        <div key={fact.label} className="fact-list__row">
          <dt className="fact-list__label">{fact.label}</dt>
          <dd className="fact-list__value">{fact.dateTime ? <time dateTime={fact.dateTime}>{fact.value}</time> : fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}
