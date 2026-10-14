import type { CSSProperties } from 'react';
import './AppearWords.css';

interface AppearWordsProps {
  text: string;
  /** Verzögerung vor dem ersten Wort in s */
  startDelay?: number;
  /** Abstand zwischen Wörtern in s */
  stagger?: number;
}

/**
 * Wortweises Einblenden mit Unschärfe (Original: blur(10px), opacity 0.001, y 10px).
 * Der vollständige Text bleibt für Screenreader als ein Textknoten lesbar.
 */
export function AppearWords({ text, startDelay = 0.1, stagger = 0.03 }: AppearWordsProps) {
  const words = text.split(' ');
  return (
    <>
      <span className="visually-hidden">{text}</span>
      <span aria-hidden="true">
        {words.map((word, index) => (
          <span key={index}>
            <span
              className="appear-word"
              style={{ '--appear-delay': `${startDelay + index * stagger}s` } as CSSProperties}
            >
              {word}
            </span>
            {index < words.length - 1 ? ' ' : null}
          </span>
        ))}
      </span>
    </>
  );
}
