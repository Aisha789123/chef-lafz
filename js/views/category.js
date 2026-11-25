import { getCategory, getItemsIn } from '../data.js';
import { countLearned } from '../store.js';
import { getLang } from '../i18n.js';
import { esc, ui, catIcon, catStyle, wordCard, stars, starsFor } from '../ui.js';

export default function category(root, id) {
  const cat = getCategory(id);
  if (!cat) { location.replace('#/home'); return {}; }
  const items = getItemsIn(id);
  const learned = countLearned(items.map((x) => x.id));
  const modes = [
    ['listen', '👂'], ['picture', '🖼️'],
    ...(id === 'phrases' ? [['talk', '💬']] : []),
  ];
  root.innerHTML = `
    <div style="${catStyle(cat)}">
      <div class="cat-head">
        <span class="cat-icon">${catIcon(cat)}</span>
        <div>
          <h2 class="ur">${esc(cat.nameUr)}</h2>
          <div class="en">${esc(cat.nameEn)} · ${learned}/${items.length} ${stars(starsFor(learned, items.length))}</div>
        </div>
      </div>
      <div class="mode-row">
        <a class="mode-btn wide" href="#/learn/flash/${id}"><span class="emo" aria-hidden="true">🃏</span>${ui('flash')} · ${ui('practise10')}</a>
        ${modes.map(([m, e]) => `<a class="mode-btn" href="#/learn/${m}/${id}"${id === 'phrases' && m === 'talk' ? ' style="grid-column:1/-1"' : ''}><span class="emo" aria-hidden="true">${e}</span>${ui(m)}</a>`).join('')}
      </div>
      <div class="word-grid">${items.map((it) => wordCard(it, cat)).join('')}</div>
    </div>`;
  return { title: catTitle(cat), icon: cat.icon, tab: 'learn', parent: '#/learn' };
}

// Plain text title of a section in the interface language (the header adds the Urdu font itself).
export function catTitle(cat) {
  return getLang() === 'en' ? cat.nameEn : cat.nameUr;
}
