import { usePageMeta } from '../hooks/usePageMeta';
import { pageMeta } from '../data/meta';
import { ApplicationForm } from '../components/forms/ApplicationForm';
import { images } from '../data/images';
import './CareerPage.css';

/** Karriere /career (Screenshots 21–22). Texte unverändert aus content/career.json. */
export function CareerPage() {
  usePageMeta(pageMeta.career.title, pageMeta.career.description);
  return (
    <>
      <div className="career-page">
        <section className="career-page__about" aria-labelledby="career-title">
          <div className="career-page__content">
            <p className="t-body">
              Wir suchen Menschen, die ihr Handwerk verstehen, eigene Ideen einbringen und Verantwortung übernehmen. Bei
              Quellfrisch entwickeln wir Getränke und bauen Marken auf. Unser Anspruch verbindet Produkt, Gestaltung und
              Zusammenarbeit. Dafür brauchen wir kreative Köpfe mit Erfahrung, fachlicher Kompetenz und dem Gespür für
              gute Lösungen. Du möchtest etwas mitgestalten und deine Ideen in die Praxis bringen? Dann freuen wir uns,
              dich kennenzulernen.
            </p>
            <p className="t-body">
              Gute Ideen brauchen Menschen, die sie durchdenken und umsetzen. Wir schätzen fachliches Können, einen
              offenen Austausch und die Bereitschaft, Dinge zu hinterfragen. Bei uns bringst du deine Perspektive ein,
              entwickelst Lösungen gemeinsam mit dem Team und begleitest sie bis zur Umsetzung. Dabei zählen klare
              Entscheidungen, verlässliche Absprachen und Sorgfalt im Detail. So gestalten wir zusammen die nächsten
              Schritte von Quellfrisch.
            </p>
            <div className="career-page__image">
              <img src={images.careerRunner} alt="" loading="lazy" />
            </div>
          </div>
          <div className="career-page__title">
            <h1 id="career-title" className="t-heading">
              Karriere
            </h1>
          </div>
        </section>
      </div>

      <section className="career-page__apply" aria-labelledby="career-apply">
        <div className="career-page__apply-inner">
          <h2 id="career-apply" className="career-page__claim">
            Bring deinen Kopf mit.
            <br />
            Und deinen eigenen Geschmack.
          </h2>
          <ApplicationForm />
        </div>
      </section>
    </>
  );
}
