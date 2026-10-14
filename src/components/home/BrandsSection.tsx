import { brands } from '../../data/brands';
import { BrandCard } from '../common/BrandCard';
import { Reveal } from '../common/Reveal';
import { TextLink } from '../common/TextLink';
import './BrandsSection.css';

/**
 * „Unsere Marke“ mit drei versetzt angeordneten Karten.
 * Desktop/Tablet: 12-Spalten-Raster (Leerspalte, 7 / 4 Spalten, darunter 6 Spalten) wie im Original.
 */
export function BrandsSection() {
  const [first, second, third] = brands;
  return (
    <section className="brands" aria-labelledby="brands-heading">
      <Reveal className="brands__header">
        <div className="brands__header-inner">
          <h2 id="brands-heading" className="t-display-medium">
            Unsere Marke
          </h2>
          <p className="brands__intro t-body">
            Mit Citronelli bringen wir unseren Anspruch an Qualität, Klarheit und Gestaltung in die Flasche. Unsere
            Haltung wird in unseren Produkten sichtbar.
          </p>
        </div>
      </Reveal>

      <Reveal className="brands__grid">
        <div className="brands__spacer brands__spacer--start hide-mobile" aria-hidden="true" />
        <Reveal className="brands__item brands__item--first" y={60}>
          <BrandCard brand={first} />
        </Reveal>
        <Reveal className="brands__item brands__item--second" y={60} delay={0.1}>
          <BrandCard brand={second} />
        </Reveal>
        <Reveal className="brands__item brands__item--third" y={60}>
          <BrandCard brand={third} />
        </Reveal>
        <div className="brands__spacer brands__spacer--end hide-mobile" aria-hidden="true" />
      </Reveal>

      <div className="brands__more">
        <TextLink to="/work">Mehr über uns</TextLink>
      </div>
    </section>
  );
}
