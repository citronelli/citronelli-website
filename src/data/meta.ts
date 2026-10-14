/** Seitentitel und Beschreibungen – aus vorhandenen Texten der jeweiligen Seite abgeleitet. */
export const pageMeta = {
  home: {
    title: undefined,
    description:
      'Quellfrisch ist ein Getränkeunternehmen aus Frankfurt am Main. Wir entwickeln eigene Getränke für Hotels, Spas und die gehobene Gastronomie.',
  },
  brands: {
    title: 'Unsere Marke',
    description:
      'Mit Citronelli bringen wir unseren Anspruch an Qualität, Klarheit und Gestaltung in die Flasche. Unsere Haltung wird in unseren Produkten sichtbar.',
  },
  about: {
    title: 'Unternehmen',
    description:
      'Quellfrisch ist ein Getränkeunternehmen aus Frankfurt am Main. Wir entwickeln eigene Produkte und Marken, die unsere Vorstellung von Qualität, Geschmack und Gestaltung tragen.',
  },
  einsatzbereiche: {
    title: 'Einsatzbereiche',
    description:
      'Citronelli für Spas und Wellnessbereiche, Hotels, Gastronomie sowie Lounges und Events.',
  },
  blog: {
    title: 'Blog',
    description:
      'Wir teilen Einblicke in die Getränkewelt, die Entwicklung unserer Marken und die Ideen, die Quellfrisch bewegen.',
  },
  career: {
    title: 'Karriere',
    description:
      'Wir suchen Menschen, die ihr Handwerk verstehen, eigene Ideen einbringen und Verantwortung übernehmen.',
  },
  contact: {
    title: 'Kontakt',
    description:
      'Für Anfragen zu unseren Getränken, Kooperationen und neuen Ideen freuen wir uns auf Ihre Nachricht.',
  },
  imprint: { title: 'Impressum', description: 'Impressum der Quellfrisch GmbH, Frankfurt am Main.' },
  privacy: { title: 'Datenschutz', description: 'Datenschutzerklärung der Quellfrisch GmbH.' },
  notFound: { title: 'Seite nicht gefunden', description: 'Diese Seite wurde nicht gefunden.' },
};

/** Kürzt auf ganze Sätze (max. ~160 Zeichen) für Meta-Beschreibungen. */
export function summarize(text: string, max = 160) {
  const sentences = text.replace(/\s+/g, ' ').trim().match(/[^.!?]+[.!?]+/g) ?? [text];
  let out = '';
  for (const s of sentences) {
    if ((out + s).trim().length > max && out) break;
    out += s;
  }
  return out.trim();
}
