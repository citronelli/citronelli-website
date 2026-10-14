import files from './generated/image-files.json';

/**
 * Lokale Bildmotive. Originale: images-original/;
 * ausgeliefert werden die optimierten Dateien aus public/images (npm run images).
 */
const optimized = files as Record<string, string>;
const img = (file: string) => `/images/${optimized[file] ?? file}`;

export const images = {
  logoQuellfrisch: img('DtnyXjwN5ftscWSSnEeY0Z2Znx4.png'),
  logoCitronelli: img('JKSKtafwlLG8fjlWNx3eUJTofg.png'),
  heroLight: img('GKqXs0kbeO3utX2b4yGC94cuaPw.png'),
  heroDark: img('0k6RD46DM8tWwiGwt1hkLmC0S8.png'),
  handGlassLight: img('Ojfj3UyZONozJG5oyez4Hv60k.png'),
  handGlassDark: img('HXzNMU2KJNty9m6mPON4tc2swvM.png'),
  glassBlue: img('bhfDndSrUTmpaV7IHV4rMNaNtg.png'),
  serviceBar: img('lmkzXiPEuDr9XuagNKFGFhfKo.jpg'),
  careerDesk: img('gf3HyGhzli36bo9xnAgJ65mGI.jpg'),
  careerMotion: img('SMxuu7BFhI5VNibnKuhqaDuawD4.jpg'),
  careerRunner: img('lelxGNlZFDM2ajHnNUxoXLSUh6E.jpg'),
  citrusRedGreen: img('dpfJaB1aRvM0L6xJ2Iw6am8hXGQ.jpg'),
  citrusYellow: img('eorr0PFeW7b3pkWfa89cXJK7rM.jpg'),
  citrusOrange: img('EBDALWA1kCmJdsMbEDgHHpU8Q.jpg'),
  lemonDetail: img('rbmBP5MEVXp2OPi63DYJJBhR94.jpg'),
  lakeTerrace: img('tnpKEPZns1r54k3G8z360ajnTYg.jpg'),
  pouringGlass: img('4bnXvZFS1T69cWUY6GBpbF20Ug.png'),
  bottlingPlant: img('tOEIdziwijx6RaqfSZ5bbLEycTQ.png'),
  saunaBw: img('RsH9BiaxGzYvkDBdw1baipzTQ.png'),
  lemonWater: img('3ePh0k6sAII7eW3t8nMawd0njk.jpg'),
  plateFood: img('4Nz7VMsgsbrBKkMgh9qdAbBE.jpg'),
  citrusStillLife: img('3NZnVCl4blkLzOiPvGJJvpyUs.jpg'),
  staircase: img('KlvbYNW3qQY6UhpbnCAAXUQr42s.jpg'),
  spaPool: img('aOnD7qusdZGfDlhm0szRp567Rk.jpg'),
  kitchen: img('mSAoou5tgqv5XrwyIWAQEZBLEQo.jpg'),
  tableFromAbove: img('dq6ntcprjUYD5q9cfi5xUfxLaU.jpg'),
} as const;
