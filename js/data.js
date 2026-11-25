// Loads the word lists (data/*.json) once and keeps them in memory.

let categories = [];
let items = [];
let scenes = [];
const byId = new Map();
const byCat = new Map();

export async function loadAll() {
  const res = await fetch('data/categories.json');
  if (!res.ok) throw new Error('categories.json ' + res.status);
  categories = await res.json();
  const lists = await Promise.all(categories.map(async (c) => {
    const r = await fetch(`data/${c.file}`);
    if (!r.ok) throw new Error(c.file + ' ' + r.status);
    return r.json();
  }));
  items = [];
  categories.forEach((c, i) => {
    const list = lists[i].map((it) => ({ ...it, category: it.category || c.id }));
    // Most important words first, keep file order inside a level.
    list.sort((a, b) => (a.level || 2) - (b.level || 2));
    byCat.set(c.id, list);
    c.count = list.length;
    items.push(...list);
  });
  items.forEach((it) => byId.set(it.id, it));
  try {
    const s = await fetch('data/scenes.json');
    scenes = s.ok ? await s.json() : [];
  } catch { scenes = []; }
}

export const getCategories = () => categories;
export const getCategory = (id) => categories.find((c) => c.id === id);
export const getItems = () => items;
export const getItemsIn = (catId) => byCat.get(catId) || [];
export const getWord = (id) => byId.get(id);
export const getScenes = () => scenes;

// Search English, Urdu, Roman Urdu (and the Urdu-script pronunciation). Ignores case, accents, spaces.
function norm(s) {
  return String(s || '').toLowerCase()
    .normalize('NFKD').replace(/[̀-ͯ]/g, '')       // é -> e
    .replace(/[ً-ٰٟ]/g, '')                     // Urdu diacritics (zer, zabar…)
    .replace(/[ي]/g, 'ی').replace(/[ك]/g, 'ک').replace(/[ہة]/g, 'ہ')
    .replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
}
let index = null;
export function search(q) {
  const n = norm(q);
  if (!n) return [];
  if (!index) {
    index = items.map((it) => ({
      it,
      en: norm(it.english),
      other: norm([it.urdu, it.romanUrdu, it.englishInUrduScript].join(' ')),
    }));
  }
  const nn = n.replace(/ /g, '');
  const scored = [];
  for (const row of index) {
    let score = -1;
    if (row.en === n) score = 100;
    else if (row.en.startsWith(n)) score = 80;
    else if (row.en.includes(n)) score = 60;
    else if (row.other.split(' ').some((w) => w === n)) score = 70;
    else if (row.other.includes(n)) score = 50;
    else if (row.other.replace(/ /g, '').includes(nn) || row.en.replace(/ /g, '').includes(nn)) score = 30;
    if (score >= 0) scored.push([score - (row.it.level || 2), row.it]);
  }
  scored.sort((a, b) => b[0] - a[0]);
  return scored.slice(0, 60).map((x) => x[1]);
}
