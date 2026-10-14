import type { ReactNode } from 'react';
import { DetailBanner } from './DetailBanner';
import './DetailLayout.css';

interface DetailLayoutProps {
  variant: 'einsatz' | 'blog';
  image: string;
  imagePosition?: string;
  /** linke, haftende Spalte (Eckdaten) */
  aside: ReactNode;
  title: string;
  children: ReactNode;
  /** Bereich innerhalb des Inhaltsabschnitts unter dem Text (Blog: „Next Blog“) */
  after?: ReactNode;
  /** Bereich nach dem Inhaltsabschnitt (Einsatzbereiche: „Gemeinsame Verkostung vereinbaren“) */
  trailing?: ReactNode;
}

/**
 * Gemeinsames Grundlayout der Einsatzbereich- und Blogdetailseiten:
 * großes Bild; links Eckdaten; rechts Titel und Inhalt.
 */
export function DetailLayout({ variant, image, imagePosition, aside, title, children, after, trailing }: DetailLayoutProps) {
  return (
    <div className={`detail-layout detail-layout--${variant}`}>
      <DetailBanner image={image} imagePosition={imagePosition} variant={variant} />
      <section className="detail-layout__content" aria-labelledby="detail-title">
        <div className="detail-layout__row">
          <aside className="detail-layout__aside">{aside}</aside>
          <div className="detail-layout__main">
            <h1 id="detail-title" className="detail-layout__title t-heading">
              {title}
            </h1>
            {children}
          </div>
        </div>
        {after}
      </section>
      {trailing}
    </div>
  );
}
