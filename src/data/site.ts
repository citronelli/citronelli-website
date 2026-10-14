/** Navigation, Footer und Seitenplan (Pfade aus den ausgelesenen Links, siehe Seitenplan im Referenzpaket). */

export interface NavItem {
  label: string;
  path: string;
}

export const mainNav: NavItem[] = [
  { label: 'Marken', path: '/work' },
  { label: 'Unternehmen', path: '/about' },
  { label: 'Karriere', path: '/career' },
  { label: 'Blog', path: '/blog' },
];

export const contactNav: NavItem = { label: 'Kontakt', path: '/contact' };

export const footerNav = {
  content: { heading: 'Inhalt', items: mainNav },
  legal: {
    heading: 'Rechtliches',
    items: [
      { label: 'Impressum', path: '/imprint' },
      { label: 'Datenschutz', path: '/privacy' },
    ],
  },
  /** Nur belegte Profile; X und Linked In verwiesen in der Quelle auf Framer-Vorlagenlinks und entfallen. */
  social: {
    heading: 'Social',
    items: [{ label: 'Instagram', href: 'https://instagram.com/citronelli_de' }],
  },
  copyright: 'Copyright 2026. All rights reserved.',
};

/** Fehlerhafte Top-Level-Links aus Blogdetails (lieferten 404) → belegte Blogpfade. */
export const legacyRedirects: Record<string, string> = {
  '/wellnesshotels': '/blog/wellnesshotels',
  '/spakonzept': '/blog/spakonzept',
  '/speisebegleitung': '/blog/speisebegleitung',
  '/zutatenwissen': '/blog/zutatenwissen',
  '/einblicke': '/blog/einblicke',
  '/produktentwicklung': '/blog/produktentwicklung',
  /** In einer Quelle auf Top-Level-Ebene verlinkt; belegt ist /work/work-2. */
  '/work-2': '/work/work-2',
};
