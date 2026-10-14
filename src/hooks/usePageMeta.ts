import { useEffect } from 'react';

const SITE = 'Quellfrisch';

/** Setzt Seitentitel und Meta-Beschreibung (clientseitig). */
export function usePageMeta(title: string | undefined, description: string) {
  useEffect(() => {
    document.title = title ? `${title} – ${SITE}` : SITE;
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.content = description;
  }, [title, description]);
}
