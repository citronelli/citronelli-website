import './PageHeading.css';

interface PageHeadingProps {
  title: string;
  count?: number;
  /** Mobil Titel und Anzahl untereinander (Einsatzbereiche-Übersicht) */
  stackOnMobile?: boolean;
}

/** Seitenüberschrift mit optionaler Anzahl rechts („Blog (6)“, „Einsatzbereiche (4)“). */
export function PageHeading({ title, count, stackOnMobile }: PageHeadingProps) {
  const classes = ['page-heading', stackOnMobile && 'page-heading--stack']
    .filter(Boolean)
    .join(' ');
  return (
    <div className={classes}>
      <h1 className="t-heading">
        {title}
        {count !== undefined && <span className="visually-hidden"> ({count})</span>}
      </h1>
      {count !== undefined && (
        <p className="t-heading" aria-hidden="true">
          ({count})
        </p>
      )}
    </div>
  );
}
