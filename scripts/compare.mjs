/**
 * Abschließende Vergleichsbilder: Referenz-Screenshot (Framer, links) neben Nachbau-Aufnahmen
 * Desktop 1200 px und Mobil 390 px (rechts). Voraussetzung: npm run screenshots -- --widths 390,1200
 * Benötigt das (nicht versionierte) Referenzpaket: QF_REFERENCE=/pfad/zum/referenzpaket npm run compare
 * Ausgabe: screenshots/vergleich/<seite>.png
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const shots = new URL('../screenshots/', import.meta.url).pathname;
if (!process.env.QF_REFERENCE) {
  console.error('QF_REFERENCE nicht gesetzt (Pfad zum Referenzpaket mit reference/screenshots).');
  process.exit(1);
}
const ref = `${process.env.QF_REFERENCE.replace(/\/$/, '')}/reference/screenshots/`;
const out = `${shots}vergleich/`;
await mkdir(out, { recursive: true });

const pages = [
  { name: 'startseite', shot: 'home', refs: ['02_home.png', '03_home.png'] },
  { name: 'citronelli', shot: 'work_studio-atlas', refs: ['08_citronelli.png', '09_citronelli.png'] },
  { name: 'unternehmen', shot: 'about', refs: ['15_unternehmen.png', '16_unternehmen.png'] },
  { name: 'kontakt', shot: 'contact', refs: ['23_kontakt.png'] },
];
const H = 2400; // maximale Höhe je Vergleichsbild
const label = (text, w) =>
  Buffer.from(`<svg width="${w}" height="40"><rect width="100%" height="100%" fill="#222"/><text x="10" y="27" font-family="Helvetica" font-size="22" fill="#fff">${text}</text></svg>`);

for (const p of pages) {
  const refImgs = await Promise.all(p.refs.map((f) => sharp(ref + f).resize({ width: 1000 }).png().toBuffer({ resolveWithObject: true })));
  const desk = await sharp(`${shots}${p.shot}-1200.png`).resize({ width: 700 }).png().toBuffer({ resolveWithObject: true });
  const mob = await sharp(`${shots}${p.shot}-390.png`).resize({ width: 300 }).png().toBuffer({ resolveWithObject: true });
  const crop = async (img, h) => (img.info.height > h ? sharp(img.data).extract({ left: 0, top: 0, width: img.info.width, height: h }).toBuffer() : img.data);

  const composites = [{ input: label('Referenz (Framer-Screenshots)', 1000), left: 0, top: 0 }];
  let y = 40;
  for (const r of refImgs) {
    composites.push({ input: r.data, left: 0, top: y });
    y += r.info.height + 10;
  }
  composites.push({ input: label('Nachbau Desktop 1200 px', 700), left: 1020, top: 0 });
  composites.push({ input: await crop(desk, H - 40), left: 1020, top: 40 });
  composites.push({ input: label('Mobil 390 px', 300), left: 1740, top: 0 });
  composites.push({ input: await crop(mob, H - 40), left: 1740, top: 40 });
  await sharp({ create: { width: 2060, height: H, channels: 3, background: '#111' } })
    .composite(composites)
    .png()
    .toFile(`${out}${p.name}.png`);
  console.log(`screenshots/vergleich/${p.name}.png`);
}
