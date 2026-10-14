import { images } from './images';

/** Blogbeiträge in der Reihenfolge der Blogübersicht. */
export interface BlogPost {
  slug: string;
  path: string;
  title: string;
  /** ISO-Datum (JJJJ-MM-TT) */
  date: string;
  image: string;
  imagePosition: string;
  /** Autor laut Detailquelle; bei fehlender Quelle nicht belegt */
  author?: string;
  /** false = Detailtext in der erfassten Quelle nicht enthalten */
  hasDetailSource: boolean;
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'wellnesshotels',
    path: '/blog/wellnesshotels',
    title: 'Alkoholfreie Getränke für Wellnesshotels. Worauf kommt es an?',
    date: '2026-10-13',
    image: images.saunaBw,
    imagePosition: '48.8% 69%',
    author: 'Berkay Aydiner',
    hasDetailSource: true,
  },
  {
    slug: 'spakonzept',
    path: '/blog/spakonzept',
    title: 'Eine Brand für den Spabereich',
    date: '2026-10-08',
    image: images.lemonWater,
    imagePosition: 'center',
    author: 'Berkay Aydiner',
    hasDetailSource: true,
  },
  {
    slug: 'speisebegleitung',
    path: '/blog/speisebegleitung',
    title: 'Alkoholfreie Speisebegleitung mit Zitrusnoten',
    date: '2026-09-10',
    image: images.plateFood,
    imagePosition: 'center',
    author: 'Kevin Sauerstein',
    hasDetailSource: true,
  },
  {
    slug: 'zutatenwissen',
    path: '/blog/zutatenwissen',
    title: 'Calamansi und Zitrone: Was unterscheidet die beiden Früchte?',
    date: '2026-09-15',
    image: images.citrusStillLife,
    imagePosition: 'center',
    author: 'Deniz Aydiner',
    hasDetailSource: true,
  },
  {
    slug: 'einblicke',
    path: '/blog/einblicke',
    title: 'Die Flasche von Citronelli: Inspiriert von der Zitronenpresse',
    date: '2026-09-03',
    image: images.bottlingPlant,
    imagePosition: '52.6% 70.7%',
    hasDetailSource: false,
  },
  {
    slug: 'produktentwicklung',
    path: '/blog/produktentwicklung',
    title: 'Wie Citronelli entsteht: Einblicke in unsere Produktentwicklung',
    date: '2026-09-30',
    image: images.pouringGlass,
    imagePosition: 'center',
    author: 'Deniz Aydiner',
    hasDetailSource: true,
  },
];

export const findBlogPost = (slug: string) => blogPosts.find((post) => post.slug === slug);

/** „Nächster Beitrag“: die drei folgenden Beiträge der Übersicht (zyklisch), wie in der Quelle. */
export function nextBlogPosts(slug: string, count = 3): BlogPost[] {
  const index = blogPosts.findIndex((post) => post.slug === slug);
  return Array.from({ length: count }, (_, i) => blogPosts[(index + 1 + i) % blogPosts.length]);
}

const dateFormat = new Intl.DateTimeFormat('de-DE', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

/** „2026-10-13“ → „13. Oktober 2026“ */
export const formatDate = (iso: string) => dateFormat.format(new Date(`${iso}T00:00:00Z`));
