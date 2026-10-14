import { usePageMeta } from '../hooks/usePageMeta';
import { summarize } from '../data/meta';
import { Navigate, useParams } from 'react-router-dom';
import { BrandCard } from '../components/common/BrandCard';
import { DetailBanner } from '../components/detail/DetailBanner';
import { FactList } from '../components/detail/FactList';
import { brands, findBrand } from '../data/brands';
import type { BrandSection } from '../data/brands';
import { images } from '../data/images';
import './BrandDetailPage.css';

function TextBlock({ section, className }: { section: BrandSection; className?: string }) {
  return (
    <div className={['brand-detail__text', className].filter(Boolean).join(' ')}>
      <h2 className="brand-detail__text-heading">{section.heading}</h2>
      {section.paragraphs.map((paragraph) => (
        <p key={paragraph.slice(0, 24)} className="brand-detail__paragraph">
          {paragraph}
        </p>
      ))}
    </div>
  );
}

/**
 * Citronelli-Detailseiten /work/:slug (Screenshots 08–14).
 * No. 02 und No. 03 zeigen nur die belegten Produktdaten („Coming Soon“), keine weiteren Inhalte.
 */
export function BrandDetailPage() {
  const { slug = '' } = useParams();
  const brand = findBrand(slug);
  usePageMeta(
    brand?.title,
    brand?.detail
      ? summarize(brand.detail.intro.paragraphs.join(' '))
      : `${brand?.title ?? 'Citronelli'} – ${brand?.subtitle ?? ''}. Weitere Inhalte folgen.`,
  );
  if (!brand) return <Navigate to="/work" replace />;

  // „Premium Inhalt“ zeigt in der Quelle auf allen drei Seiten No. 02 und No. 03.
  const premium = brands.filter((item) => item.comingSoon);

  return (
    <article className="brand-detail" aria-labelledby="brand-title">
      <DetailBanner image={brand.image} imagePosition={brand.imagePosition} variant="brand" />

      <section className="brand-detail__content">
        <div className="brand-detail__container">
          <div className="brand-detail__intro">
            <div className="brand-detail__logo">
              <h1 id="brand-title" className="visually-hidden">
                {brand.title}
              </h1>
              <img src={images.logoCitronelli} alt="Citronelli" width={585} height={171} />
            </div>
            <div className="brand-detail__info">
              <FactList facts={brand.facts} variant="table" className="brand-detail__facts" />
              {brand.detail && <TextBlock section={brand.detail.intro} />}
            </div>
          </div>

          {brand.detail ? (
            <>
              <div className="brand-detail__lemon">
                <img src={images.lemonDetail} alt="" loading="lazy" style={{ objectPosition: '53% 62.1%' }} />
              </div>

              <div className="brand-detail__row">
                <div className="brand-detail__image brand-detail__image--fixed">
                  <img src={images.lakeTerrace} alt="" loading="lazy" />
                </div>
                <TextBlock section={brand.detail.moments} className="brand-detail__text--sticky" />
              </div>

              <div className="brand-detail__row brand-detail__row--reverse">
                <TextBlock section={brand.detail.nature} className="brand-detail__text--sticky" />
                <div className="brand-detail__image brand-detail__image--fluid">
                  <img src={images.pouringGlass} alt="" loading="lazy" />
                </div>
              </div>
            </>
          ) : (
            <div className="brand-detail__spacer" aria-hidden="true" />
          )}

          <section className="brand-detail__more" aria-labelledby="premium-heading">
            <h2 id="premium-heading" className="t-label">
              Premium Inhalt
            </h2>
            <ul className="brand-detail__cards">
              {premium.map((item, index) => (
                <li key={item.slug} className={index > 0 ? 'hide-mobile' : undefined}>
                  <BrandCard brand={item} />
                </li>
              ))}
            </ul>
          </section>
        </div>
      </section>
    </article>
  );
}
