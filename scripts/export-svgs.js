// OPTIONAL. Writes every drawing as a real .svg file:  images/<category>/<id>.svg
//
//   node scripts/export-svgs.js              → write the files only (the app keeps using "art:" drawings)
//   node scripts/export-svgs.js --switch     → write the files AND change the JSON to use the file paths
//
// Use --switch if you prefer to edit pictures in a drawing program (Inkscape, Figma…).
// After switching, bump VERSION in sw.js so phones download the new pictures.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ART } from '../js/art/index.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const switchJson = process.argv.includes('--switch');
const categories = JSON.parse(readFileSync(join(root, 'data/categories.json'), 'utf8'));
let written = 0;

const save = (rel, key) => {
  const svg = ART[key]();
  mkdirSync(dirname(join(root, rel)), { recursive: true });
  writeFileSync(join(root, rel), `<?xml version="1.0" encoding="UTF-8"?>\n${svg}\n`);
  written++;
};

for (const c of categories) {
  if (c.icon.startsWith('art:')) {
    const rel = `images/categories/${c.id}.svg`;
    save(rel, c.icon.slice(4));
    if (switchJson) c.icon = rel;
  }
  const file = join(root, 'data', c.file);
  const list = JSON.parse(readFileSync(file, 'utf8'));
  let changed = false;
  for (const it of list) {
    if (!String(it.image).startsWith('art:')) continue;
    const rel = `images/${c.id}/${it.id}.svg`;
    save(rel, it.image.slice(4));
    if (switchJson) { it.image = rel; changed = true; }
  }
  // Keep the "one word per line" layout so the files stay easy to edit.
  if (changed) writeFileSync(file, '[\n' + list.map((it) => JSON.stringify(it)).join(',\n') + '\n]\n');
}
if (switchJson) writeFileSync(join(root, 'data/categories.json'), '[\n' + categories.map((c) => '  ' + JSON.stringify(c)).join(',\n') + '\n]\n');

console.log(`Wrote ${written} SVG files.${switchJson ? ' JSON files now point to images/.' : ' JSON not changed (add --switch to change it).'}`);
