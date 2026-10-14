import type { CSSProperties, ElementType, ReactNode } from 'react';
import { useInView } from '../../hooks/useInView';

interface RevealProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Startversatz in px; Original: 50px (Abschnitte) bzw. 60px (Karten) */
  y?: number;
  delay?: number;
}

/**
 * Einblenden beim Scrollen (Annäherung an Framer „appear“: opacity 0 → 1, translateY → 0).
 * Bei prefers-reduced-motion bleibt der Inhalt per CSS sofort sichtbar.
 */
export function Reveal({ children, as: Tag = 'div', className, y = 50, delay = 0 }: RevealProps) {
  const { ref, inView } = useInView<HTMLElement>();
  const style = { '--reveal-y': `${y}px`, '--reveal-delay': `${delay}s` } as CSSProperties;
  return (
    <Tag ref={ref} className={['reveal', inView && 'is-visible', className].filter(Boolean).join(' ')} style={style}>
      {children}
    </Tag>
  );
}
