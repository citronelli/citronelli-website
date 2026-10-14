import './DetailBanner.css';

interface DetailBannerProps {
  image: string;
  imagePosition?: string;
  /** „brand“: randlos, haftet oben (Citronelli); „detail“: abgerundet in Inhaltsbreite (Einsatzbereiche, Blog) */
  variant: 'brand' | 'einsatz' | 'blog';
}

/** Großes Einstiegsbild der Detailseiten. */
export function DetailBanner({ image, imagePosition = 'center', variant }: DetailBannerProps) {
  return (
    <div className={`detail-banner detail-banner--${variant}`}>
      <img src={image} alt="" className="detail-banner__image" style={{ objectPosition: imagePosition }} fetchPriority="high" />
    </div>
  );
}
