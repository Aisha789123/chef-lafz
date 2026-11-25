// Checks all word lists. Run from the project folder:   node scripts/validate.js
// - every item has all fields, with the right type
// - ids are unique (across all files) and start with the category prefix
// - every picture exists: emoji, a drawing in js/art/, or a file in images/
// - every drawing renders without errors
// Exit code 1 if there are errors (warnings do not fail).
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ART } from '../js/art/index.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const warnings = [];
const err = (where, msg) => errors.push(`${where}: ${msg}`);
const warn = (where, msg) => warnings.push(`${where}: ${msg}`);

const URDU = /[؀-ۿ]/;
const LATIN = /[A-Za-z]/;
const EMOJI = /\p{Extended_Pictographic}/u;
const FILE = /\.(svg|png|jpe?g|webp|gif|avif)$/i;
const REQUIRED = ['id', 'category', 'english', 'urdu', 'romanUrdu', 'englishInUrduScript', 'image', 'exampleSentence', 'exampleSentenceUrdu', 'level'];
const PREFIX = {
  phrases: 'phr-', tools: 'tool-', vegetables: 'veg-', spices: 'spice-', actions: 'act-', meat: 'meat-', dairy: 'dairy-',
  grains: 'grain-', fruits: 'fruit-', equipment: 'equip-', cutting: 'cut-', measurements: 'meas-', jobs: 'job-', hygiene: 'hyg-', taste: 'taste-',
};

function readJson(rel) {
  const p = join(root, rel);
  if (!existsSync(p)) { err(rel, 'file is missing'); return null; }
  try { return JSON.parse(readFileSync(p, 'utf8')); }
  catch (e) { err(rel, `is not valid JSON — ${e.message}`); return null; }
}

function checkImage(where, image) {
  if (typeof image !== 'string' || !image.trim()) return err(where, 'image is empty');
  if (image.startsWith('art:')) {
    const key = image.slice(4);
    if (!ART[key]) err(where, `drawing "${key}" does not exist in js/art/`);
    usedArt.add(key);
  } else if (FILE.test(image)) {
    if (image.startsWith('/') || image.startsWith('http')) err(where, `image path must be relative (no leading "/" or http): ${image}`);
    else if (!existsSync(join(root, image))) err(where, `image file not found: ${image}`);
  } else if (!EMOJI.test(image) || [...image].length > 8) {
    err(where, `image "${image}" is not an emoji, an "art:" drawing or an image file path`);
  }
}

const usedArt = new Set();
const allIds = new Map();
let total = 0;

const categories = readJson('data/categories.json') || [];
const catIds = new Set();
for (const c of categories) {
  const where = `categories.json [${c.id}]`;
  for (const k of ['id', 'file', 'nameEn', 'nameUr', 'icon', 'color', 'bg']) if (!c[k]) err(where, `missing "${k}"`);
  if (catIds.has(c.id)) err(where, 'duplicate category id');
  catIds.add(c.id);
  if (c.icon) checkImage(where + ' icon', c.icon);
  if (c.nameUr && !URDU.test(c.nameUr)) err(where, 'nameUr has no Urdu letters');
}

for (const c of categories) {
  const list = readJson(`data/${c.file}`);
  if (!list) continue;
  if (!Array.isArray(list)) { err(c.file, 'must be a JSON array [ … ]'); continue; }
  const englishSeen = new Map();
  list.forEach((it, i) => {
    total++;
    const where = `${c.file} #${i + 1} (${it && it.id})`;
    if (!it || typeof it !== 'object') return err(where, 'not an object');
    for (const k of REQUIRED) {
      if (it[k] === undefined || it[k] === null || it[k] === '') err(where, `missing "${k}"`);
    }
    for (const k of REQUIRED) if (k !== 'level' && it[k] !== undefined && typeof it[k] !== 'string') err(where, `"${k}" must be text`);
    if (it.category && it.category !== c.id) err(where, `category is "${it.category}" but the file belongs to "${c.id}"`);
    if (![1, 2, 3].includes(it.level)) err(where, 'level must be 1, 2 or 3');
    if (it.id) {
      if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(it.id)) err(where, 'id may only use a-z, 0-9 and "-"');
      if (PREFIX[c.id] && !it.id.startsWith(PREFIX[c.id])) warn(where, `id should start with "${PREFIX[c.id]}"`);
      if (allIds.has(it.id)) err(where, `duplicate id (also in ${allIds.get(it.id)})`);
      allIds.set(it.id, c.file);
    }
    if (it.urdu && !URDU.test(it.urdu)) err(where, 'urdu has no Urdu letters');
    if (it.englishInUrduScript && !URDU.test(it.englishInUrduScript)) err(where, 'englishInUrduScript has no Urdu letters');
    if (it.exampleSentenceUrdu && !URDU.test(it.exampleSentenceUrdu)) err(where, 'exampleSentenceUrdu has no Urdu letters');
    if (it.english && !LATIN.test(it.english)) err(where, 'english has no English letters');
    if (it.romanUrdu && URDU.test(it.romanUrdu)) err(where, 'romanUrdu must use English letters');
    if (it.exampleSentence && URDU.test(it.exampleSentence)) err(where, 'exampleSentence must be English');
    if (c.id === 'phrases' && !it.whenUrdu) err(where, 'phrases need "whenUrdu" (when do chefs say it)');
    for (const k of ['needsCheck', 'notHalal']) if (k in it && typeof it[k] !== 'boolean') err(where, `"${k}" must be true or false`);
    for (const k of ['whenUrdu', 'noteUrdu']) if (k in it && !URDU.test(String(it[k]))) err(where, `"${k}" has no Urdu letters`);
    checkImage(where, it.image);
    const en = String(it.english || '').toLowerCase();
    if (englishSeen.has(en)) warn(where, `same English word as ${englishSeen.get(en)}`);
    englishSeen.set(en, it.id);
  });
  if (list.length < 4) warn(c.file, 'fewer than 4 words — quizzes need at least 4');
}

const scenes = readJson('data/scenes.json') || [];
scenes.forEach((s, i) => {
  const where = `scenes.json #${i + 1} (${s.id})`;
  for (const k of ['id', 'situationUr', 'chefEn', 'chefUr', 'options']) if (!s[k]) err(where, `missing "${k}"`);
  if (s.id && allIds.has(s.id)) err(where, `duplicate id (also in ${allIds.get(s.id)})`);
  if (s.id) allIds.set(s.id, 'scenes.json');
  if (!Array.isArray(s.options) || s.options.length < 2) return err(where, 'needs at least 2 options');
  s.options.forEach((o, j) => { if (!o.en || !o.ur) err(where, `option ${j + 1} needs "en" and "ur"`); });
  if (!Number.isInteger(s.answer) || s.answer < 0 || s.answer >= s.options.length) err(where, '"answer" must be the number of the right option (0 = first)');
});

// Every drawing must render to an SVG.
for (const [key, fn] of Object.entries(ART)) {
  try {
    const out = fn();
    if (typeof out !== 'string' || !out.startsWith('<svg') || out.includes('NaN') || out.includes('undefined')) err(`js/art "${key}"`, 'does not produce a clean <svg>');
  } catch (e) {
    err(`js/art "${key}"`, `crashed — ${e.message}`);
  }
  if (!usedArt.has(key)) warn(`js/art "${key}"`, 'drawing is not used by any word');
}

const needsCheck = [];
for (const c of categories) for (const it of readJson(`data/${c.file}`) || []) if (it.needsCheck) needsCheck.push(it.id);

console.log(`\nChef Lafz data check — ${categories.length} categories, ${total} words, ${scenes.length} scenes, ${Object.keys(ART).length} drawings`);
console.log(`Translations marked needsCheck: ${needsCheck.length}`);
if (warnings.length) { console.log(`\n⚠️  ${warnings.length} warning(s):`); warnings.forEach((w) => console.log('  - ' + w)); }
if (errors.length) {
  console.log(`\n❌ ${errors.length} error(s):`);
  errors.forEach((e) => console.log('  - ' + e));
  process.exit(1);
}
console.log('\n✅ All good!');
