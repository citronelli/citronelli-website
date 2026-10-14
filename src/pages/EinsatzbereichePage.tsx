import { usePageMeta } from '../hooks/usePageMeta';
import { pageMeta } from '../data/meta';
import { CardGrid } from '../components/common/CardGrid';
import { ImageCard } from '../components/common/ImageCard';
import { PageHeading } from '../components/common/PageHeading';
import { Reveal } from '../components/common/Reveal';
import { einsatzbereiche } from '../data/einsatzbereiche';
import './ListingPage.css';

/** Einsatzbereiche-Übersicht /einsatzbereiche – rekonstruiert aus Screenshot 24 (HTML-Quelle unzureichend). */
export function EinsatzbereichePage() {
  usePageMeta(pageMeta.einsatzbereiche.title, pageMeta.einsatzbereiche.description);
  return (
    <div className="listing-page">
      <Reveal className="listing-page__heading" y={60}>
        <PageHeading title="Einsatzbereiche" count={einsatzbereiche.length} stackOnMobile />
      </Reveal>
      <Reveal className="listing-page__grid" y={60}>
        <CardGrid label="Einsatzbereiche">
          {einsatzbereiche.map((item) => (
            <li key={item.slug}>
              <ImageCard to={item.path} image={item.image} title={item.title} />
            </li>
          ))}
        </CardGrid>
      </Reveal>
    </div>
  );
}
