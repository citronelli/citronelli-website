import { usePageMeta } from '../hooks/usePageMeta';
import { pageMeta } from '../data/meta';
import { Link } from 'react-router-dom';
import './NotFoundPage.css';

/** Fehlerseite. Die Quelle belegt keinen eigenen Pfad und keine Texte; Gestaltung folgt später. */
export function NotFoundPage() {
  usePageMeta(pageMeta.notFound.title, pageMeta.notFound.description);
  return (
    <section className="not-found" aria-labelledby="not-found-heading">
      <h1 id="not-found-heading" className="t-heading">
        404
      </h1>
      <p className="not-found__text t-body">Diese Seite wurde nicht gefunden.</p>
      <Link to="/" className="not-found__back t-label">
        Zur Startseite
      </Link>
    </section>
  );
}
