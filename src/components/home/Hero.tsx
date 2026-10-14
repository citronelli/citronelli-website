import { images } from '../../data/images';
import { AppearWords } from '../common/AppearWords';
import './Hero.css';

/**
 * Bildstarker Einstieg. Text wörtlich laut Projektvorgaben (Referenzpaket).
 * Mobil fügt die Quelle zusätzliche Zeilenumbrüche ein (br.hero__br-mobile).
 */
export function Hero() {
  return (
    <section className="hero" id="hero" aria-label="Einführung">
      <img
        className="hero__image"
        src={images.heroLight}
        alt=""
        width={1672}
        height={941}
        fetchPriority="high"
      />
      <div className="hero__content">
        <div className="hero__description">
          <p className="hero__text t-lead">
            <AppearWords text="Getränke mit klarem Anspruch." startDelay={0.2} />
            <br />
            <AppearWords text="Wir verbinden sorgfältige" startDelay={0.35} />
            <br className="hero__br-mobile" />{' '}
            <AppearWords text="Produktentwicklung mit zeitloser Gestaltung und persönlicher" startDelay={0.5} />
            <br className="hero__br-mobile" />{' '}
            <AppearWords text="Zusammenarbeit." startDelay={0.75} />
            <br />
            <br />
            <AppearWords
              text="Quellfrisch ist das Unternehmen hinter Citronelli und der Anspruch hinter jedem Detail."
              startDelay={0.85}
            />
          </p>
        </div>
        <div className="hero__scroll" aria-hidden="true">
          <p className="hero__scroll-label t-label">(Scroll)</p>
        </div>
      </div>
    </section>
  );
}
