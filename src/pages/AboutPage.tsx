import { usePageMeta } from '../hooks/usePageMeta';
import { pageMeta } from '../data/meta';
import { BrandCard } from '../components/common/BrandCard';
import { ContactCta } from '../components/common/ContactCta';
import { Reveal } from '../components/common/Reveal';
import { SplitSection } from '../components/common/SplitSection';
import { brands } from '../data/brands';
import { images } from '../data/images';
import './AboutPage.css';

const marketSegments = [
  'Hotellerie',
  'Wellness und Spa',
  'Saunabetriebe',
  'Gastronomie',
  'Premiumhandel',
  'Airline Lounges',
  'Private Aviation',
  'Premium Events',
];

const competences = [
  'Produktentwicklung',
  'Rezepturentwicklung',
  'Rohstoffauswahl',
  'Herstellungskoordination',
  'Markenführung',
  'Verpackungsgestaltung',
  'Direktvertrieb',
  'Kundenbetreuung',
];

function TagList({ heading, items }: { heading: string; items: string[] }) {
  return (
    <div className="about-page__list">
      <h3 className="t-body">{heading}</h3>
      <ul>
        {items.map((item) => (
          <li key={item} className="t-body">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Unternehmen /about (Screenshots 15–20). Texte unverändert aus content/about.json. */
export function AboutPage() {
  usePageMeta(pageMeta.about.title, pageMeta.about.description);
  return (
    <>
      <div className="about-page">
        <SplitSection title="Unternehmen" as="h1" id="about-company">
          <div className="about-page__company">
            <div className="about-page__paragraphs">
              <p className="t-lead">
                Quellfrisch ist ein Getränkeunternehmen aus Frankfurt am Main. Wir entwickeln eigene Produkte und Marken,
                die unsere Vorstellung von Qualität, Geschmack und Gestaltung tragen. Dabei begleiten wir jede Idee von
                der ersten Rezeptur bis zum fertigen Auftritt. Wir arbeiten mit spezialisierten Herstellungspartnern
                zusammen und pflegen den direkten Austausch mit unseren Kunden. Sorgfalt im Produkt und Verlässlichkeit
                in der Zusammenarbeit bilden die Grundlage unserer Arbeit.
              </p>
              <p className="t-lead">
                Für uns beginnt ein gutes Getränk bei seinen Zutaten. Wir setzen auf natürliche Rohstoffe und sorgfältig
                ausgewählte Säfte, weil sie ihren eigenen Geschmack und Charakter mitbringen. Bei der Auswahl achten wir
                auf Herkunft, Qualität und Verarbeitung. Künstliche Aromen, Süßstoffe und Konservierungsstoffe gehören
                für uns nicht dazu. Unser Ziel sind klare Rezepturen, deren Zutaten nachvollziehbar bleiben und die
                einen bewussten Genuss ermöglichen.
              </p>
            </div>
            <div className="about-page__image">
              <img src={images.bottlingPlant} alt="" loading="lazy" style={{ objectPosition: '54.8% 73.8%' }} />
            </div>
          </div>
        </SplitSection>

        <SplitSection title="Grundsätze" id="about-principles">
          <p className="t-lead">
            Unsere Grundsätze leiten die Entscheidungen, die wir jeden Tag treffen. Wir wählen Zutaten mit Sorgfalt,
            gestalten mit einem klaren Blick für das Produkt und begegnen unseren Partnern auf Augenhöhe. Wir hören zu,
            stehen zu unseren Zusagen und hinterfragen unsere Arbeit. So wird unser Anspruch in unseren Produkten und in
            der Zusammenarbeit spürbar.
          </p>
        </SplitSection>

        <SplitSection
          title={
            <>
              Geschäfts<span className="about-page__tablet-break">-</span>
              <br className="about-page__tablet-break" />
              felder
            </>
          }
          id="about-fields"
        >
          <div className="about-page__fields">
            <p className="t-lead">
              Unsere Geschäftsfelder umfassen die Entwicklung, den Aufbau und den Vertrieb eigener Getränkemarken. Wir
              gestalten Produktideen und Rezepturen, wählen Rohstoffe aus und koordinieren die Herstellung mit
              spezialisierten Partnern. Markenführung, Verpackung und Vermarktung verbinden wir zu einem einheitlichen
              Auftritt. Im Vertrieb setzen wir auf direkte Kundenbeziehungen und persönliche Betreuung. So begleiten wir
              unsere Produkte von der ersten Idee bis zur Platzierung im Markt.
            </p>
            <div className="about-page__lists">
              <TagList heading="Marktsegmente" items={marketSegments} />
              <TagList heading="Kompetenzen" items={competences} />
            </div>
          </div>
        </SplitSection>

        <SplitSection title="Qualität & Verantwortung" id="about-quality">
          <div className="about-page__paragraphs about-page__paragraphs--tight">
            <p className="t-lead">
              Qualität beginnt für uns bei der Auswahl der Rohstoffe und reicht bis zum fertigen Produkt. Wir setzen auf
              natürliche Zutaten, sorgfältig ausgewählte Säfte und spezialisierte Herstellungspartner. Herkunft,
              Verarbeitung und Geschmack sind dabei entscheidend. Mit klaren Anforderungen an Rezeptur, Herstellung und
              Verpackung schaffen wir die Grundlage für Produkte, hinter denen wir stehen.
            </p>
            <p className="t-lead">
              Verantwortung bedeutet für uns, Entscheidungen mit Blick auf ihre langfristigen Folgen zu treffen. Wir
              pflegen einen offenen Austausch mit unseren Partnern, treffen verlässliche Absprachen und gehen bewusst mit
              Ressourcen um. Dabei hinterfragen wir bestehende Abläufe und suchen nach sinnvollen Verbesserungen. Unser
              Maßstab ist, welche Entscheidungen sich im täglichen Handeln bewähren.
            </p>
          </div>
        </SplitSection>

        <SplitSection title="Strategie & Entwicklung" id="about-strategy">
          <div className="about-page__paragraphs about-page__paragraphs--tight">
            <p className="t-lead">
              Unsere Strategie ist darauf ausgerichtet, eigene Getränkemarken mit einer klaren Positionierung aufzubauen
              und langfristig weiterzuentwickeln. Wir konzentrieren uns auf Märkte, in denen Produktqualität, Gestaltung
              und persönliche Betreuung gefragt sind. Neue Produkte und Vertriebswege prüfen wir danach, welchen Mehrwert
              sie für unsere Kunden bieten und wie sie zu unserer unternehmerischen Ausrichtung passen.
            </p>
            <p className="t-lead">
              Entwicklung bedeutet für uns, Erfahrungen aus dem Markt in konkrete Entscheidungen zu übersetzen. Der
              direkte Austausch mit Kunden und Herstellungspartnern hilft uns, Produkte zu verbessern, Abläufe
              weiterzuentwickeln und neue Möglichkeiten zu erkennen. Auf dieser Grundlage wollen wir unser
              Markenportfolio schrittweise ausbauen und weitere Märkte erschließen.
            </p>
          </div>
        </SplitSection>

        <section className="about-page__product" aria-labelledby="about-product">
          <h2 id="about-product" className="t-heading">
            Das Produkt
          </h2>
          <Reveal y={60}>
            <ul className="about-page__cards">
              {brands.map((brand) => (
                <li key={brand.slug}>
                  <BrandCard brand={brand} />
                </li>
              ))}
            </ul>
          </Reveal>
        </section>
      </div>
      <ContactCta />
    </>
  );
}
