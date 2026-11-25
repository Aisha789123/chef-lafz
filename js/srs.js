// Picks which cards to practise (spaced repetition with Leitner boxes) and which quiz type to use.
import { getItems, getItemsIn, getCategories, getScenes } from './data.js';
import { boxOf, getItem, dayNum } from './store.js';
import { shuffle } from './ui.js';

export const SESSION_SIZE = 10;
const PRIORITY_CATS = 5; // the first 5 categories in categories.json are taught first

function catOrderMap() {
  const m = new Map();
  getCategories().forEach((c, i) => m.set(c.id, i));
  return m;
}

function dueSort(a, b) {
  const A = getItem(a.id), B = getItem(b.id);
  return A.b - B.b || A.d - B.d || A.t - B.t;
}

// Never-seen words, most important first, mixing the main categories so a session is not all one topic.
function newPool(list) {
  const order = catOrderMap();
  const pos = new Map();
  const counters = {};
  for (const it of list) {
    counters[it.category] = (counters[it.category] || 0);
    pos.set(it.id, counters[it.category]++);
  }
  return list.filter((it) => !boxOf(it.id)).sort((a, b) => {
    const ta = (order.get(a.category) ?? 99) < PRIORITY_CATS ? 0 : 1;
    const tb = (order.get(b.category) ?? 99) < PRIORITY_CATS ? 0 : 1;
    return (a.level || 2) - (b.level || 2) || ta - tb || pos.get(a.id) - pos.get(b.id) ||
      (order.get(a.category) ?? 99) - (order.get(b.category) ?? 99);
  });
}

function pick(list, size, maxDue = size) {
  const today = dayNum();
  const seen = list.filter((it) => boxOf(it.id));
  const due = seen.filter((it) => getItem(it.id).d <= today).sort(dueSort);
  const fresh = newPool(list);
  const dueTake = Math.min(due.length, maxDue);
  let chosen = due.slice(0, dueTake);
  chosen = chosen.concat(fresh.slice(0, size - chosen.length));
  if (chosen.length < size) chosen = chosen.concat(due.slice(dueTake, dueTake + size - chosen.length));
  if (chosen.length < size) {
    // Everything is learned and nothing is due: practise the weakest / oldest words again.
    const ids = new Set(chosen.map((x) => x.id));
    const rest = seen.filter((it) => !ids.has(it.id)).sort(dueSort);
    chosen = chosen.concat(rest.slice(0, size - chosen.length));
  }
  return chosen;
}

let rotate = 0;
function modeFor(item) {
  const b = boxOf(item.id);
  if (!b) return 'flash';
  if (item.category === 'phrases') return b === 1 && rotate++ % 2 ? 'flash' : 'talk';
  if (b === 1) return rotate++ % 2 ? 'flash' : 'picture';
  return rotate++ % 2 ? 'listen' : 'picture';
}

function sceneCard() {
  const scenes = getScenes();
  if (!scenes.length) return null;
  const today = dayNum();
  const unseen = scenes.filter((s) => !boxOf(s.id));
  const due = scenes.filter((s) => boxOf(s.id) && getItem(s.id).d <= today);
  const s = due[0] || unseen[0];
  return s ? { type: 'scene', scene: s } : null;
}

export function buildToday() {
  const chosen = pick(getItems(), SESSION_SIZE, 8);
  const cards = chosen.map((item) => ({ type: 'word', item, mode: modeFor(item) }));
  // Add one role-play scene once he knows a few phrases.
  const phrasesSeen = getItemsIn('phrases').filter((it) => boxOf(it.id)).length;
  if (phrasesSeen >= 5) {
    const sc = sceneCard();
    if (sc) cards.splice(cards.length - 1, 1, sc);
  }
  // New cards first (to learn), then the quizzes — keeps it easy.
  return cards.sort((a, b) => (a.mode === 'flash' ? 0 : 1) - (b.mode === 'flash' ? 0 : 1));
}

export function buildCategory(catId, mode) {
  const list = getItemsIn(catId);
  const chosen = pick(list, SESSION_SIZE);
  let cards = shuffle(chosen).map((item) => ({ type: 'word', item, mode }));
  if (mode === 'flash') cards = chosen.map((item) => ({ type: 'word', item, mode }));
  if (mode === 'talk' && catId === 'phrases') {
    const scenes = shuffle(getScenes()).sort((a, b) => boxOf(a.id) - boxOf(b.id)).slice(0, 3);
    scenes.forEach((s, i) => cards.splice(Math.min(cards.length, 3 + i * 3), 0, { type: 'scene', scene: s }));
    cards = cards.slice(0, SESSION_SIZE);
  }
  return cards;
}

// Wrong answer options: same category, different picture and different words.
export function distractors(item, k, key = 'english') {
  const pool = getItemsIn(item.category).filter((x) =>
    x.id !== item.id && x.image !== item.image && x[key] !== item[key] && x.english !== item.english);
  const same = shuffle(pool.filter((x) => (x.level || 2) === (item.level || 2)));
  const other = shuffle(pool.filter((x) => (x.level || 2) !== (item.level || 2)));
  const out = [];
  const used = new Set([item[key], item.image]);
  for (const x of same.concat(other)) {
    if (out.length >= k) break;
    if (used.has(x[key]) || used.has(x.image)) continue;
    used.add(x[key]); used.add(x.image);
    out.push(x);
  }
  return out;
}
