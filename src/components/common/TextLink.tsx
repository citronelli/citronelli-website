import { Link } from 'react-router-dom';
import './TextLink.css';

interface TextLinkProps {
  to: string;
  children: string;
}

/** Große Textverknüpfung mit Linie, die beim Hover/Fokus einläuft („Erfahre mehr“, „Mehr über uns“). */
export function TextLink({ to, children }: TextLinkProps) {
  return (
    <Link to={to} className="text-link">
      <span className="text-link__label t-link-large">{children}</span>
      <span className="text-link__line" aria-hidden="true" />
    </Link>
  );
}
