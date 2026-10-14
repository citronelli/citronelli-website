import { usePageMeta } from '../hooks/usePageMeta';
import { pageMeta } from '../data/meta';
import { BrandCard } from '../components/common/BrandCard';
import { CardGrid } from '../components/common/CardGrid';
import { Reveal } from '../components/common/Reveal';
import { brands } from '../data/brands';
import './ListingPage.css';

/** Markenübersicht /work (Screenshot 07). */
export function BrandsPage() {
  usePageMeta(pageMeta.brands.title, pageMeta.brands.description);
  return (
    <div className="listing-page">
      <Reveal className="listing-page__heading" y={60}>
        <h1 className="t-heading">Unsere Marke</h1>
      </Reveal>
      <Reveal className="listing-page__grid" y={60}>
        <CardGrid label="Marken">
          {brands.map((brand) => (
            <li key={brand.slug}>
              <BrandCard brand={brand} />
            </li>
          ))}
        </CardGrid>
      </Reveal>
    </div>
  );
}
