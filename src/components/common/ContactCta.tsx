import { Link } from 'react-router-dom';
import './ContactCta.css';

/** Kontaktaufruf „Jetzt ins Gespräch kommen.“ */
export function ContactCta() {
  return (
    <section className="contact-cta" aria-label="Kontakt">
      <div className="contact-cta__container">
        <Link to="/contact" className="contact-cta__link">
          <span className="t-display-medium">Jetzt ins Gespräch kommen.</span>
        </Link>
      </div>
    </section>
  );
}
