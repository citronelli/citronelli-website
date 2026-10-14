import { usePageMeta } from '../hooks/usePageMeta';
import { pageMeta } from '../data/meta';
import { AboutIntro } from '../components/home/AboutIntro';
import { BlogSection } from '../components/home/BlogSection';
import { BrandsSection } from '../components/home/BrandsSection';
import { EinsatzbereicheSection } from '../components/home/EinsatzbereicheSection';
import { Hero } from '../components/home/Hero';
import { ImageStack } from '../components/home/ImageStack';
import { ContactCta } from '../components/common/ContactCta';

export function HomePage() {
  usePageMeta(pageMeta.home.title, pageMeta.home.description);
  return (
    <>
      <Hero />
      <ImageStack />
      <AboutIntro />
      <BrandsSection />
      <EinsatzbereicheSection />
      <BlogSection />
      <ContactCta />
    </>
  );
}
