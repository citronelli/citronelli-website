import { einsatzbereiche } from '../../data/einsatzbereiche';
import { EinsatzbereicheTable } from '../common/EinsatzbereicheTable';
import { Reveal } from '../common/Reveal';
import './EinsatzbereicheSection.css';

export function EinsatzbereicheSection() {
  return (
    <section className="ez-section" aria-labelledby="ez-heading">
      <Reveal className="ez-section__container">
        <h2 id="ez-heading" className="ez-section__heading">
          Für Hotels, Spas &amp; mehr
        </h2>
        <EinsatzbereicheTable items={einsatzbereiche} headingId="ez-heading" />
      </Reveal>
    </section>
  );
}
