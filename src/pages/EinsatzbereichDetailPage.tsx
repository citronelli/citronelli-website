import { usePageMeta } from '../hooks/usePageMeta';
import { pageMeta } from '../data/meta';
import { Navigate, useParams } from 'react-router-dom';
import { TextLink } from '../components/common/TextLink';
import { DetailLayout } from '../components/detail/DetailLayout';
import { FactList } from '../components/detail/FactList';
import { einsatzbereichPersonal, findEinsatzbereich } from '../data/einsatzbereiche';
import './EinsatzbereichDetailPage.css';

/** Einsatzbereich-Detail /einsatzbereiche/:slug (Screenshots 25–29). */
export function EinsatzbereichDetailPage() {
  const { slug = '' } = useParams();
  const item = findEinsatzbereich(slug);
  usePageMeta(item ? `Citronelli für ${item.title}` : undefined, item?.intro ?? pageMeta.einsatzbereiche.description);
  if (!item) return <Navigate to="/einsatzbereiche" replace />;

  return (
    <DetailLayout
      variant="einsatz"
      image={item.image}
      title={item.title}
      aside={
        <FactList
          variant="stacked"
          facts={[
            { label: 'Einsatz', value: item.placement },
            { label: 'Nutzen', value: item.benefit },
          ]}
        />
      }
      trailing={
        <div className="einsatz-detail__tasting">
          <TextLink to="/contact">Gemeinsame Verkostung vereinbaren</TextLink>
        </div>
      }
    >
      <p className="detail-layout__lead">{item.intro}</p>
      <div className="einsatz-detail__body">
        <h2 className="einsatz-detail__heading">Citronelli in Ihrem Angebot</h2>
        <p className="einsatz-detail__text">{item.offer}</p>
        <h2 className="einsatz-detail__heading">{einsatzbereichPersonal.heading}</h2>
        <p className="einsatz-detail__text">{einsatzbereichPersonal.text}</p>
      </div>
    </DetailLayout>
  );
}
