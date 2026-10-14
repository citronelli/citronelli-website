import { usePageMeta } from '../hooks/usePageMeta';
import { pageMeta } from '../data/meta';
import { ContactForm } from '../components/forms/ContactForm';
import './ContactPage.css';

/** Kontakt /contact (Screenshot 23). */
export function ContactPage() {
  usePageMeta(pageMeta.contact.title, pageMeta.contact.description);
  return (
    <div className="contact-page">
      <h1 className="contact-page__intro t-heading">
        Wir entwickeln Getränke und eigene Marken mit einem klaren Anspruch an Qualität und Gestaltung.
        <br />
        <br />
        Für geschäftliche Anfragen, Kooperationen oder neue Ideen freuen wir uns auf den Austausch mit Ihnen.
      </h1>
      <section className="contact-page__content" aria-label="Anfrage">
        <p className="contact-page__quote">
          Für Anfragen zu unseren Getränken, Kooperationen und neuen Ideen freuen wir uns auf Ihre Nachricht.
        </p>
        <div className="contact-page__form">
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
