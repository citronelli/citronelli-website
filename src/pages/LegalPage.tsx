import { usePageMeta } from '../hooks/usePageMeta';
import { pageMeta } from '../data/meta';
import { RichText } from '../components/common/RichText';
import { getRichText } from '../data/richtext';
import './LegalPage.css';

/**
 * Impressum und Datenschutz. Texte unverändert aus der veröffentlichten Website übernommen;
 * eine rechtliche Prüfung hat nicht stattgefunden.
 */
export function LegalPage({ kind }: { kind: 'imprint' | 'privacy' }) {
  usePageMeta(pageMeta[kind].title, pageMeta[kind].description);
  const blocks = getRichText(kind) ?? [];
  const title = kind === 'imprint' ? 'Impressum' : 'Datenschutzerklärung';
  return (
    <div className="legal-page" id="hero">
      <h1 className="legal-page__title t-link-large">{title}</h1>
      <RichText blocks={blocks} className="legal-page__text" />
    </div>
  );
}
