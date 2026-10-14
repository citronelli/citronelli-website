# Quellfrisch – Website

Website der Quellfrisch GmbH (Frankfurt am Main) mit der Marke Citronelli.
React + TypeScript + Vite, Single-Page-Anwendung, Hosting auf Vercel.

Diese Anwendung ersetzt seit Version 2.0 die frühere statische Citronelli-Website vollständig
(frühere Dateien sind in der Git-Historie erhalten).

## Lokal starten

Voraussetzung: Node.js 18 oder neuer.

```bash
npm install
npm run dev          # Entwicklungsserver, http://localhost:5173
npm run build        # Typprüfung (tsc -b) + Produktionsbuild nach dist/
npm run typecheck    # nur Typprüfung
npm run preview      # Build lokal ausliefern, http://localhost:4173
```

## Prüfungen

Benötigen ein installiertes Google Chrome.

```bash
npm run preview &              # Server für die beiden folgenden Skripte
npm run check:ui               # Menü, alle Seiten/Links, Titel/Beschreibungen, Footer, Formularvalidierung,
                               # Direktaufruf, Weiterleitungen, prefers-reduced-motion
npm run screenshots            # Überlaufprüfung + Ganzseiten-Aufnahmen aller Seiten → screenshots/
                               # Optionen: -- --only /work,/about  -- --widths 390,810,1200
npm run check:forms            # Browser: laufend / Fehler / Erfolg mit simulierten Serverantworten
npm run check:api              # Endpunkte mit simuliertem Resend (ohne Server, ohne echten Versand)
```

## Deployment (Vercel)

`vercel.json`: Framework Vite, `npm ci`, `npm run build`, Ausgabe `dist/`. Alle Pfade außer `/api/…`
werden auf `index.html` umgeschrieben (SPA-Fallback), damit Direktaufrufe und Neuladen von Unterseiten wie
`/blog/zutatenwissen` funktionieren. Statische Dateien (`/images/…`, `/fonts/…`, `/assets/…`) werden vorher
direkt ausgeliefert.

## Formulare

Kontakt- und Bewerbungsformular senden an serverseitige Vercel-Funktionen, die per
[Resend](https://resend.com) an **citronelli@quell-frisch.de** zustellen:

| Formular | Endpunkt | Betreff | Felder |
| --- | --- | --- | --- |
| Kontakt (`/contact`) | `POST /api/contact` | Quellfrisch – Kontaktanfrage | Name, E-Mail, Anfrage |
| Karriere (`/career`) | `POST /api/application` | Quellfrisch – Bewerbung | Name, E-Mail, Bewerbung |

- Die vom Besucher eingegebene E-Mail-Adresse wird als **Reply-To** gesetzt („Antworten“ schreibt direkt
  an den Absender).
- Der API-Schlüssel bleibt ausschließlich auf dem Server (`process.env.RESEND_API_KEY`); er erscheint
  nie im Browsercode und ist keine `VITE_`-Variable.
- Serverseitige Prüfung: Pflichtfelder, E-Mail-Format, Längen, erlaubte Auswahlwerte, keine
  Zeilenumbrüche in Kopfzeilen. Schutz gegen automatisierte Einsendungen: verstecktes Honeypot-Feld und
  Mindest-Ausfüllzeit (1,5 s).
- Erfolg zeigt die Website erst, wenn der Endpunkt nach Annahme durch Resend mit `{ ok: true }` antwortet.
  Bei Fehlern bleiben die Eingaben erhalten.
- Code: `api/contact.js`, `api/application.js`, gemeinsame Logik in `api/_lib/` (wird nicht als eigener
  Endpunkt ausgeliefert); Frontend-Anbindung in `src/components/forms/submitAdapter.ts`.

Umgebungsvariablen (Vercel → Settings → Environment Variables):

| Name | Pflicht | Bedeutung |
| --- | --- | --- |
| `RESEND_API_KEY` | ja | Resend-API-Schlüssel (geheim) |
| `FORM_FROM_EMAIL` | nein | bei Resend verifizierter Absender; Standard `Quellfrisch Website <noreply@contact.quell-frisch.de>` |
| `FORM_TO_EMAIL` | nein | Empfänger; Standard `citronelli@quell-frisch.de` |

Fehlt `RESEND_API_KEY`, antwortet der Endpunkt mit 503 und die Website meldet, dass der Versand derzeit
nicht möglich ist. `npm run dev` startet nur das Frontend; die Endpunkte laufen lokal mit `vercel dev`.

Tests ohne echten Versand: `npm run check:api` (Endpunkte mit simuliertem Resend) und
`npm run check:forms` (Browserablauf mit simulierten Serverantworten).

## Bilder

- `images-original/`: unveränderte Originale.
- `npm run images`: erzeugt die ausgelieferten Dateien in `public/images` (Fotos als WebP Q82, max. 2400 px
  Breite; Logos verlustfrei; ohne Ersparnis bleibt das Original) und die Zuordnung
  `src/data/generated/image-files.json`. Ein Bild austauschen: Datei gleichen Namens in `images-original/`
  ersetzen, `npm run images` ausführen.

## Inhalte

Strukturierte lokale Daten in `src/data/` (Marken, Einsatzbereiche, Blog, Navigation, Seitentitel/
Beschreibungen in `meta.ts`). Langtexte (Blogartikel, Impressum, Datenschutz) liegen in
`src/data/generated/richtext.json`. Sie wurden einmalig aus dem nicht versionierten Referenzpaket
erzeugt (`scripts/extract-richtext.py`, benötigt `QF_REFERENCE=/pfad/zum/referenzpaket`); spätere
Textänderungen können direkt in der JSON-Datei erfolgen. Ein CMS ist nicht angebunden.

## Struktur

```
index.html, vite.config.ts, tsconfig.json, vercel.json
public/            images/ (optimiert), fonts/ (Inter, lokal)
images-original/   Bildoriginale
scripts/           Prüf- und Hilfsskripte
src/
  data/            Inhalte, Navigation, Bildzuordnung, Seitentitel
  components/      layout/ (Header, Footer), common/, detail/, forms/, home/
  pages/           eine Komponente je Seitentyp
  styles/          Schriften, globale Textstile und Breakpoints
```

Breakpoints: Mobil `< 810px`, Tablet `810–1199.98px`, Desktop `≥ 1200px`.

## Redaktionelle Änderungen gegenüber der Framer-Vorlage

| Bereich | Vorher (Quelle) | Jetzt |
| --- | --- | --- |
| Bedienelemente | Menu, Next Blog, Author, Select… | Menü, Nächster Beitrag, Autor, Bitte auswählen … |
| Datumsangaben | „Oct 13, 2026“ | „13. Oktober 2026“ (`Intl.DateTimeFormat('de-DE')`, Daten als ISO in `blog.ts`) |
| Kontaktaufruf | Let’s work together. | Jetzt ins Gespräch kommen. |
| Kontaktseite, Zitatabsatz | „Sometimes imagination …“ | „Für Anfragen zu unseren Getränken, Kooperationen und neuen Ideen freuen wir uns auf Ihre Nachricht.“ |
| Footer | mobil „Studio / About / Contact“ | überall Inhalt, Rechtliches (Impressum, Datenschutz), Social |
| Social | X, Instagram, Linked In (X/Linked In → framer.com) | nur Instagram (`instagram.com/citronelli_de`, ohne Tracking-Parameter) |
| „Blog (6)“ | weiß auf weiß | sichtbar |
| Zutatenseiten-Verweise | Blog „Calamansi und Zitrone“: Satz „Auf unseren Zutatenseiten …“; Blog „Produktentwicklung“: gleichnamiger Absatz | Satz bzw. Absatz gestrichen, sonst unverändert |
| Seitentitel / Beschreibung | ProLab-/FreeLab-Vorlage | je Seite „<Titel> – Quellfrisch“ und Beschreibung aus vorhandenem Seitentext (`src/data/meta.ts`, `usePageMeta`) |
| Bilder | Original-PNG/JPG | optimierte Auslieferung, Originale aufbewahrt |

## Offene Punkte

### Inhalt / Quelle unvollständig

- **Blog „Die Flasche von Citronelli …“** (`/blog/einblicke`): Detailtext und Autor fehlen in der Quelle.
  Die Seite zeigt Titel, Datum, Bild und sichtbar „In Arbeit“.
- **No. 02 / No. 03**: aus Screenshots 11–14 rekonstruiert – nur Bild, Logo, Produktdaten
  (Kategorie „Aqua - Sal“, Marke „Citronelli“, Inhalt „Coming Soon“, Qualität „Premium“) und „Premium Inhalt“.
  Keine weiteren Produktinformationen ergänzt.
- **Einsatzbereiche-Übersicht**: aus Screenshot 24 rekonstruiert (Titel, (4), vier Bildkarten mit Namen).
- **Bildausschnitte**: wo die Quelle keine Position belegt (No. 02/03-Banner, Einsatzbereich-Karten), ist
  `center` gesetzt.

### Bewusste Abweichungen von der Quelle

| Punkt | Quelle | Nachbau |
| --- | --- | --- |
| „Gemeinsame Verkostung vereinbaren“ mobil | einzeilig, am Rand abgeschnitten | umbrechend |
| Interne Links in Blogartikeln (`./spakonzept` …) | relative Links → 404 | „Nächster Beitrag“ führt auf `/blog/...`; Top-Level-Pfade leiten weiter |
| Einsatzbereiche-Tabelle Tablet (Startseite) | viermal „Spas und Wellnessbereiche“ | richtige Namen |
| Kontaktfeld-Bezeichnungen | „Name 🞵“, „Email 🞵“ (Pflichtzeichen, im Screenshot nicht sichtbar) | „Name“, „Email“; Pflicht per `required`/`aria-required` |
| Pflichtfelder | Kontakt: „Anfrage“ `required`, Name/Email mit Pflichtzeichen; Karriere: nur Auswahl `required` | alle Felder Pflicht (ohne Name/E-Mail ist eine Anfrage nicht beantwortbar) |
| „Datenschutzerklärung“ mobil | 42px, läuft über | Silbentrennung |
| Formulare | Framer-Versand | eigene Vercel-Funktionen mit Resend |
| Dunkle Bildvarianten, Framer-Badge, Analytics | vorhanden | nicht übernommen |

### Weiterhin offen (nicht beauftragt)

- „(Scroll)“ und „Copyright 2026. All rights reserved.“ sind noch englisch.
- Markenkarten No. 02 und No. 03 tragen denselben Untertitel „Aqua - Sal“.
- Bewerbungsformular: Auswahl bietet nur „Praktikum“ (wie in der Quelle).
- Seitentitel/Beschreibungen werden clientseitig gesetzt; für Suchmaschinen ohne JavaScript wäre später
  Prerendering bzw. serverseitiges Rendern sinnvoll.

### Technik / Abnahme

- Animationen sind Annäherungen; Werte aus dem Hauptskript, nicht live vermessen.
- Bilder sind komprimiert, aber nicht in mehreren Breiten (srcset) hinterlegt; größte Datei ~500 KB.
- Ein CMS ist nicht angebunden.
