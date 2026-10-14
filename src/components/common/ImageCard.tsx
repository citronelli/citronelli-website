import { Link } from 'react-router-dom';
import './ImageCard.css';

interface ImageCardProps {
  to: string;
  image: string;
  imagePosition?: string;
  title: string;
  subtitle?: string;
}

/** Bildkarte mit Titel/Untertitel (Komponente .framer-5ggr4 „Work“): Marken, Einsatzbereiche. */
export function ImageCard({ to, image, imagePosition = 'center', title, subtitle }: ImageCardProps) {
  return (
    <Link to={to} className="image-card">
      <span className="image-card__media">
        <img src={image} alt="" loading="lazy" className="image-card__image" style={{ objectPosition: imagePosition }} />
      </span>
      <span className="image-card__info">
        <span className="t-body">{title}</span>
        {subtitle && <span className="image-card__subtitle t-body">{subtitle}</span>}
      </span>
    </Link>
  );
}
