import { Link } from 'react-router-dom';
import { images } from '../../data/images';
import './ImageStack.css';

interface StackItem {
  number: string;
  label: string;
  /** Linkziel; Karte 1 führt auf Marken (Quelle verwies auf /about) */
  path: string;
  image: string;
  /** Abweichendes Motiv unter 1200px (Karriere) */
  imageBelowDesktop?: string;
  modifier: string;
}

const items: StackItem[] = [
  { number: '1', label: 'Unsere Marke', path: '/work', image: images.handGlassLight, modifier: 'brand' },
  { number: '2', label: 'Unternehmen', path: '/about', image: images.glassBlue, modifier: 'company' },
  { number: '3', label: 'Zusammenarbeit', path: '/contact', image: images.serviceBar, modifier: 'collab' },
  {
    number: '4',
    label: 'Karriere',
    path: '/career',
    image: images.careerDesk,
    imageBelowDesktop: images.careerMotion,
    modifier: 'career',
  },
];

/**
 * Vier nummerierte, bildfüllende Bereiche. Jede Karte ist 100vh hoch und bleibt mit
 * gestaffeltem Abstand (0/50/100/150px, mobil 0/30/60/90px) oben haften, sodass sich die
 * Karten beim Scrollen überlagern (position: sticky wie im Original).
 */
export function ImageStack() {
  return (
    <section className="image-stack" id="services" aria-label="Bereiche">
      <ol className="image-stack__list">
        {items.map((item) => (
          <li key={item.number} className={`image-stack__card image-stack__card--${item.modifier}`}>
            <Link to={item.path} className="image-stack__link">
              <picture>
                {item.imageBelowDesktop && <source media="(max-width: 1199.98px)" srcSet={item.imageBelowDesktop} />}
                <img className="image-stack__image" src={item.image} alt="" loading="lazy" />
              </picture>
              <span className="image-stack__label">
                <span className="image-stack__row t-heading">
                  <span aria-hidden="true">{item.number}</span>
                  <span>{item.label}</span>
                </span>
                <span className="image-stack__line" aria-hidden="true" />
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
