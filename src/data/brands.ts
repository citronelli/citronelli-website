import { images } from './images';

/** Markenkarten und -detailseiten (Framer-Collection „Work“). Texte unverändert aus content/. */
export interface ProductFact {
  label: string;
  value: string;
}

export interface BrandSection {
  heading: string;
  paragraphs: string[];
}

export interface Brand {
  slug: string;
  path: string;
  title: string;
  subtitle: string;
  image: string;
  /** object-position aus dem Originalquelltext */
  imagePosition: string;
  /** Produktdaten (Kategorie, Marke, Inhalt, Qualität) */
  facts: ProductFact[];
  /** Detailinhalt; leer bei den „Coming Soon“-Varianten */
  detail?: {
    intro: BrandSection;
    moments: BrandSection;
    nature: BrandSection;
  };
  /** Inhalt laut Screenshots „Coming Soon“ – keine weiteren Produktinformationen belegt */
  comingSoon: boolean;
}

export const brands: Brand[] = [
  {
    slug: 'studio-atlas',
    path: '/work/studio-atlas',
    title: 'Citronelli',
    subtitle: 'Aqua Limon Sal',
    image: images.citrusRedGreen,
    imagePosition: 'center',
    facts: [
      { label: 'Kategorie', value: 'Aqua Limon Sal' },
      { label: 'Marke', value: 'Citronelli' },
      { label: 'Inhalt', value: 'Aqua\nLimon\nCalamansi\nSal' },
      { label: 'Qualität', value: 'Premium' },
    ],
    detail: {
      intro: {
        heading: 'Klarer Anspruch.',
        paragraphs: [
          'Citronelli entsteht aus einer einfachen Idee: \nErfrischung braucht wenige, sorgfältig ausgewählte Zutaten. Frisches Quellwasser, der Geschmack von Zitrone und Calamansi und eine fein abgestimmte Salznote prägen unser Getränk.',
          'Unser Anspruch liegt im Zusammenspiel dieser Zutaten. Wir entwickeln die Rezeptur mit Sorgfalt und geben ihr eine ebenso klare Gestaltung. So entsteht ein Getränk, das vom ersten Schluck bis zur Flasche unsere Haltung trägt.',
        ],
      },
      moments: {
        heading: 'Erfrischung für besondere Momente.',
        paragraphs: [
          'Citronelli ist für Orte gedacht, an denen Menschen zur Ruhe kommen und bewusst genießen. Im Spa, im Saunabereich oder im Hotel begleitet es die Pause zwischendurch. Nach einem Saunagang, auf der Terrasse oder als erfrischender Empfang.',
          'Für Gastgeber lässt sich Citronelli unkompliziert in den Alltag integrieren: fertig abgefüllt und direkt servierbar. So bleibt mehr Zeit für das, was einen Aufenthalt besonders macht. Die persönliche Aufmerksamkeit für den Gast.',
        ],
      },
      nature: {
        heading: 'Natürlichkeit bis ins Detail.',
        paragraphs: [
          'Citronelli setzt auf echten Fruchtsaft statt Konzentrat und eine sorgfältig abgestimmte Rezeptur. Wir verzichten auf künstliche Aromen, Süßstoffe und Konservierungsstoffe. Der Geschmack entsteht aus den Zutaten selbst.',
          'Diesen Anspruch führen wir in der Gestaltung weiter: Eine Glasflasche und ein bewusst schlichtes Etikett geben Citronelli seinen eigenen Charakter. Von der Rezeptur bis zum Auftritt gehört für uns jedes Detail zusammen.',
        ],
      },
    },
    comingSoon: false,
  },
  {
    slug: 'work',
    path: '/work/work',
    title: 'Citronelli — No. 02',
    subtitle: 'Aqua - Sal',
    image: images.citrusYellow,
    imagePosition: 'center',
    // Rekonstruiert aus Screenshots 11–12 (direkte HTML-Quelle unzureichend)
    facts: [
      { label: 'Kategorie', value: 'Aqua - Sal' },
      { label: 'Marke', value: 'Citronelli' },
      { label: 'Inhalt', value: 'Coming Soon' },
      { label: 'Qualität', value: 'Premium' },
    ],
    comingSoon: true,
  },
  {
    slug: 'work-2',
    path: '/work/work-2',
    title: 'Citronelli — No. 03',
    subtitle: 'Aqua - Sal',
    image: images.citrusOrange,
    imagePosition: '50.5% 69.8%',
    // Rekonstruiert aus Screenshots 13–14 (direkte HTML-Quelle unzureichend)
    facts: [
      { label: 'Kategorie', value: 'Aqua - Sal' },
      { label: 'Marke', value: 'Citronelli' },
      { label: 'Inhalt', value: 'Coming Soon' },
      { label: 'Qualität', value: 'Premium' },
    ],
    comingSoon: true,
  },
];

export const findBrand = (slug: string) => brands.find((brand) => brand.slug === slug);
