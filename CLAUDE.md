# CLAUDE.md – Hinweise für Claude Code

Projekt: Quellfrisch-Website (React + TypeScript + Vite). Details in `README.md`.

## Arbeitsweise
- Änderungen zuerst lokal umsetzen und prüfen (`npm run dev`, http://localhost:5173; `npm run build`,
  `npm run check:ui`).
- Nicht automatisch committen, pushen oder deployen. Nur auf ausdrückliche Anweisung
  („committe“, „push to GitHub“, „deploy to Vercel“ o. Ä.).
- Keine Zugangsdaten, `.env`-Dateien, `node_modules` oder Build-Ausgaben committen.
- Formulare senden über `api/` per Resend. Bei Tests keine echten Mails versenden (`npm run check:api`,
  `npm run check:forms` simulieren den Versand).
- Keine Produktinformationen oder Texte erfinden.
