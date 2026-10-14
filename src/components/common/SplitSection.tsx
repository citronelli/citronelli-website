import type { ReactNode } from 'react';
import './SplitSection.css';

interface SplitSectionProps {
  title: ReactNode;
  /** Überschriftsebene; Seitenanfang nutzt h1 */
  as?: 'h1' | 'h2';
  children: ReactNode;
  id?: string;
}

/**
 * Zweispaltiger Textabschnitt (Unternehmen): links haftende Überschrift, rechts Inhalt.
 * Mobil gestapelt. Werte aus .framer-oftej3 / .framer-1ua7rsv / .framer-y77viw.
 */
export function SplitSection({ title, as: Heading = 'h2', children, id }: SplitSectionProps) {
  return (
    <section className="split-section" aria-labelledby={id}>
      <div className="split-section__title">
        <Heading id={id} className="t-heading">
          {title}
        </Heading>
      </div>
      <div className="split-section__body">{children}</div>
    </section>
  );
}
