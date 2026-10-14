import { Link } from 'react-router-dom';
import type { Einsatzbereich } from '../../data/einsatzbereiche';
import './EinsatzbereicheTable.css';

interface Props {
  items: Einsatzbereich[];
  headingId?: string;
}

/**
 * Tabellarische Liste der Einsatzbereiche: Bereich | Platzierung | (leere Kategorienspalte der Quelle).
 * Jede Zeile verlinkt auf die Detailseite.
 */
export function EinsatzbereicheTable({ items, headingId }: Props) {
  return (
    <ul className="ez-table" aria-labelledby={headingId}>
      {items.map((item) => (
        <li key={item.slug}>
          <Link to={item.path} className="ez-table__row">
            <span className="ez-table__name">{item.title}</span>
            <span className="ez-table__placement">{item.placement}</span>
            <span className="ez-table__rest" aria-hidden="true" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
