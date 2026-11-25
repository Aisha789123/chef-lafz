// All drawings, by key. A word uses one with  "image": "art:<key>"  in its JSON.
// Each module exports an object { key: () => svgString }.
import categories from './categories.js';
import phrases from './phrases.js';
import tools from './tools.js';
import vegetables from './vegetables.js';
import spices from './spices.js';
import actions from './actions.js';
import food from './food.js';
import equipment from './equipment.js';
import cutting from './cutting.js';
import measurements from './measurements.js';
import jobs from './jobs.js';
import hygiene from './hygiene.js';
import taste from './taste.js';

export const ART = Object.assign({}, categories, phrases, tools, vegetables, spices, actions, food,
  equipment, cutting, measurements, jobs, hygiene, taste);

const cache = new Map();

export function drawArt(key) {
  if (cache.has(key)) return cache.get(key);
  const fn = ART[key];
  let out = null;
  if (fn) {
    try { out = fn(); } catch (e) { console.warn('Drawing failed:', key, e); }
  }
  cache.set(key, out);
  return out;
}

export const hasArt = (key) => typeof ART[key] === 'function';
