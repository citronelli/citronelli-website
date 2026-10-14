import { images } from './images';

/** Einsatzbereiche (Framer-Collection „Target Group“). Texte unverändert aus content/. */
export interface Einsatzbereich {
  slug: string;
  path: string;
  title: string;
  /** Eckdatum „Einsatz“, zugleich Spalte „Platzierung“ der Startseiten-Tabelle */
  placement: string;
  /** Eckdatum „Nutzen“ */
  benefit: string;
  image: string;
  intro: string;
  offer: string;
}

/** Für alle Bereiche gleicher Abschnitt „Persönlich kennenlernen“. */
export const einsatzbereichPersonal = {
  heading: 'Persönlich kennenlernen',
  text: 'Citronelli ist eine Marke der Quellfrisch GmbH. Wir betreuen unsere Geschäftspartner persönlich und besprechen mit Ihnen, wie unsere Getränke zu Ihrem Angebot passen. Vereinbaren Sie eine gemeinsame Verkostung und lernen Sie die Varianten kennen.',
};

export const einsatzbereiche: Einsatzbereich[] = [
  {
    slug: 'spasundwellness',
    path: '/einsatzbereiche/spasundwellness',
    title: 'Spas und Wellnessbereiche',
    placement: 'Ruhebereiche und Lounges',
    benefit: 'Fertig abgefüllt für einen unkomplizierten Getränkeservice.',
    image: images.spaPool,
    intro: 'Citronelli begleitet entspannte Momente in Ihrem Spa mit Zitrone oder Calamansi und einer feinen Salznote.',
    offer:
      'In Ruhebereichen und Lounges lässt sich Citronelli nach einer Anwendung oder während einer Pause anbieten. Die fertig abgefüllten Getränke ermöglichen einen unkomplizierten Service.',
  },
  {
    slug: 'hotels',
    path: '/einsatzbereiche/hotels',
    title: 'Hotels',
    placement: 'Empfang und Hotelbar',
    benefit: 'Ein besonderes Willkommensgetränk für Ihre Gäste.',
    image: images.staircase,
    intro: 'Begrüßen Sie Ihre Gäste mit Citronelli und setzen Sie am Empfang oder in der Hotelbar einen besonderen Akzent.',
    offer:
      'Citronelli eignet sich als Willkommensgetränk am Empfang und als Ergänzung des Angebots in Ihrer Hotelbar. Zitrone oder Calamansi und eine feine Salznote bieten Ihren Gästen eine besondere Geschmacksrichtung.',
  },
  {
    slug: 'gastronomie',
    path: '/einsatzbereiche/gastronomie',
    title: 'Gastronomie',
    placement: 'Restaurant und Bar',
    benefit: 'Zitrusnoten mit feiner Salznote für Ihre Getränkekarte.',
    image: images.kitchen,
    intro: 'Ergänzen Sie Ihre Getränkekarte mit Citronelli und verbinden Sie klare Zitrusnoten mit einer feinen Salznote.',
    offer:
      'Im Restaurant oder an der Bar kann Citronelli das bestehende Getränkeangebot ergänzen. Die fertig abgefüllten Varianten mit Zitrone oder Calamansi lassen sich unkompliziert servieren.',
  },
  {
    slug: 'loungesundevents',
    path: '/einsatzbereiche/loungesundevents',
    title: 'Lounges und Events',
    placement: 'Empfänge und Veranstaltungen',
    benefit: 'Eine eigene Flaschenform für eine hochwertige Präsentation.',
    image: images.tableFromAbove,
    intro: 'Citronelli passt zu persönlichen Begegnungen in Lounges, bei Empfängen und auf Veranstaltungen.',
    offer:
      'Für Empfänge und Veranstaltungen bietet Citronelli ein fertig abgefülltes Getränk mit Zitrone oder Calamansi und einer feinen Salznote. Die eigene Flaschenform unterstützt eine hochwertige Präsentation.',
  },
];

export const findEinsatzbereich = (slug: string) => einsatzbereiche.find((item) => item.slug === slug);
