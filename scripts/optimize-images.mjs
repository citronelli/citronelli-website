/**
 * Erzeugt optimierte Bilder für public/images aus den unveränderten Originalen in images-original/.
 * Fotos → WebP (Qualität 82, max. 2400 px Breite; größere Originale
 * werden verkleinert, kleinere nie vergrößert). Logos (transparente PNG) → verlustfrei neu komprimiertes PNG.
 * Wird die optimierte Datei nicht kleiner, bleibt das Original. Die Zuordnung landet in
 * src/data/generated/image-files.json.
 * Aufruf: npm run images
 */
import sharp from 'sharp';
import { copyFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

const src = new URL('../images-original/', import.meta.url).pathname;
const out = new URL('../public/images/', import.meta.url).pathname;
const LOGOS = new Set(['DtnyXjwN5ftscWSSnEeY0Z2Znx4.png', 'JKSKtafwlLG8fjlWNx3eUJTofg.png']);

const mapping = {};
let before = 0;
let after = 0;
for (const file of await readdir(src)) {
  if (!/\.(png|jpe?g)$/i.test(file)) continue; // Unterordner (z. B. vorher-*) werden übersprungen
  const input = path.join(src, file);
  const base = file.replace(/\.(png|jpe?g)$/i, '');
  const optimized = LOGOS.has(file) ? path.join(out, file) : path.join(out, `${base}.webp`);
  const img = sharp(input).rotate().resize({ width: 2400, withoutEnlargement: true });
  if (LOGOS.has(file)) await img.png({ compressionLevel: 9, effort: 10 }).toFile(optimized);
  else await img.webp({ quality: 82, effort: 6, smartSubsample: true }).toFile(optimized);

  const a = (await stat(input)).size;
  let target = optimized;
  if ((await stat(optimized)).size >= a) {
    // keine Ersparnis: Original ausliefern
    if (optimized !== path.join(out, file)) await rm(optimized);
    target = path.join(out, file);
    await copyFile(input, target);
  } else if (optimized !== path.join(out, file)) {
    await rm(path.join(out, file), { force: true });
  }
  mapping[file] = path.basename(target);
  const b = (await stat(target)).size;
  before += a;
  after += b;
  console.log(`${file.padEnd(36)} ${(a / 1024).toFixed(0).padStart(5)} KB → ${(b / 1024).toFixed(0).padStart(5)} KB`);
}
await writeFile(
  new URL('../src/data/generated/image-files.json', import.meta.url),
  JSON.stringify(mapping, null, 1) + '\n',
);
console.log(`Gesamt: ${(before / 1048576).toFixed(1)} MB → ${(after / 1048576).toFixed(1)} MB`);
