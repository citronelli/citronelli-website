import type { Brand } from '../../data/brands';
import { ImageCard } from './ImageCard';

/** Markenkarte (Komponente .framer-5ggr4 „Work“). */
export function BrandCard({ brand }: { brand: Brand }) {
  return (
    <ImageCard
      to={brand.path}
      image={brand.image}
      imagePosition={brand.imagePosition}
      title={brand.title}
      subtitle={brand.subtitle}
    />
  );
}
