import { TextLink } from '../common/TextLink';
import './AboutIntro.css';

export function AboutIntro() {
  return (
    <section className="about-intro" aria-labelledby="about-intro-heading">
      <div className="about-intro__inner">
        <div className="about-intro__content">
          <h1 id="about-intro-heading" className="about-intro__text t-display">
            Quellfrisch ist ein Getränkeunternehmen aus Frankfurt am Main. Wir entwickeln eigene Getränke für Hotels,
            Spas und die gehobene Gastronomie.
          </h1>
          <TextLink to="/about">Erfahre mehr</TextLink>
        </div>
      </div>
    </section>
  );
}
