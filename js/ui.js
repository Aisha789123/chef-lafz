// Small shared helpers for building screens.
import { drawArt } from './art/index.js';
import { t, uiClass } from './i18n.js';
import { boxOf } from './store.js';

export function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}

// Text in the interface language (Urdu text gets the Nastaliq class).
export function ui(key, ...args) {
  return `<span class="${uiClass()}">${esc(t(key, ...args))}</span>`;
}

// The picture of a word: emoji, drawing ("art:key") or file path.
// size = the box size in px, used to scale emoji.
export function pic(image, size = 96, cls = '') {
  const img = String(image || '');
  let inner;
  if (img.startsWith('art:')) {
    inner = drawArt(img.slice(4)) || `<span class="emoji" style="font-size:${Math.round(size * 0.7)}px">🍽️</span>`;
  } else if (/\.(svg|png|jpe?g|webp|gif|avif)$/i.test(img)) {
    inner = `<img src="${esc(img)}" alt="" loading="lazy" decoding="async">`;
  } else {
    inner = `<span class="emoji" style="font-size:${Math.round(size * 0.74)}px">${esc(img || '🍽️')}</span>`;
  }
  return `<div class="pic ${cls}" aria-hidden="true">${inner}</div>`;
}

export function catIcon(cat, size = 46) {
  return pic(cat.icon, size);
}

// Style vars so each category has its own colour.
export function catStyle(cat) {
  return cat ? `--cat:${cat.color};--cat-bg:${cat.bg}` : '';
}

export function stars(n) {
  let s = '';
  for (let i = 0; i < 3; i++) s += i < n ? '★' : '<span class="off">★</span>';
  return `<span class="stars" aria-label="${n} / 3">${s}</span>`;
}

export function starsFor(learned, total) {
  if (!total) return 0;
  const p = learned / total;
  return p >= 0.9 ? 3 : p >= 0.6 ? 2 : p >= 0.3 ? 1 : 0;
}

export function boxDots(id) {
  const b = boxOf(id);
  if (!b) return '';
  let s = '';
  for (let i = 1; i <= 5; i++) s += `<i class="${i <= b ? 'on' : ''}"></i>`;
  return `<span class="box-dots" aria-hidden="true">${s}</span>`;
}

export function haramBadge(item, small = false) {
  if (!item.notHalal) return '';
  return `<span class="badge badge-haram" title="Not halal">${small ? '⚠️' : '⚠️ ' + ui('notHalal')}</span>`;
}

export function wordCard(item, cat) {
  return `<a class="word-card" href="#/word/${encodeURIComponent(item.id)}" style="${catStyle(cat)}">
    ${boxDots(item.id)}${haramBadge(item, true)}
    ${pic(item.image, 92)}
    <span class="w-en en">${esc(item.english)}</span>
    <span class="w-ur ur">${esc(item.urdu)}</span>
  </a>`;
}

let toastTimer = 0;
export function toast(msg, ms = 2600) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.innerHTML = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), ms);
}

export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
