import type { ReactNode } from 'react';
import './CardGrid.css';

interface CardGridProps {
  children: ReactNode;
  /** „blog“: Zeilenabstand 40/60/50px wie .framer-11g1y45; „cards“: 0 (Karten bringen 60px Abstand mit) */
  variant?: 'cards' | 'blog';
  label?: string;
}

/** Zweispaltiges Kartenraster (Desktop/Tablet), mobil eine Spalte. */
export function CardGrid({ children, variant = 'cards', label }: CardGridProps) {
  return (
    <ul className={`card-grid card-grid--${variant}`} aria-label={label}>
      {children}
    </ul>
  );
}
