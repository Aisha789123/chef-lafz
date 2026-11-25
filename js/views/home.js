// Home: the big "Today's practice" button first, then all sections.
import { getCategories, getItemsIn, getItems } from '../data.js';
import { countLearned, isDue } from '../store.js';
import { t } from '../i18n.js';
import { esc, ui, catIcon, catStyle, stars, starsFor } from '../ui.js';

export function categoryGridHTML() {
  const tiles = getCategories().map((c) => {
    const ids = getItemsIn(c.id).map((x) => x.id);
    const learned = countLearned(ids);
    const pct = ids.length ? Math.round((learned / ids.length) * 100) : 0;
    return `<a class="cat-tile" href="#/cat/${c.id}" style="${catStyle(c)}" aria-label="${esc(c.nameUr)} — ${esc(c.nameEn)}, ${learned}/${ids.length}">
      <span class="cat-icon">${catIcon(c)}</span>
      <span class="name-ur">${esc(c.nameUr)}</span>
      <span class="name-en en">${esc(c.nameEn)}</span>
      ${stars(starsFor(learned, ids.length))}
      <span class="bar" aria-hidden="true"><span style="width:${pct}%"></span></span>
    </a>`;
  }).join('');
  return `<nav class="cat-grid" aria-label="${esc(t('categories'))}">${tiles}</nav>`;
}

export default function home(root) {
  const due = getItems().filter((it) => isDue(it.id)).length;
  root.innerHTML = `
    <a class="today-btn" href="#/today">
      <span class="big-emo" aria-hidden="true">▶️</span>
      <span>
        <span class="label">${ui('today')}</span>
        <span class="sub">${due ? ui('todayDue', due) : ui('todaySub')}</span>
      </span>
      <span class="go" aria-hidden="true">➜</span>
    </a>
    <h2 class="section-label">${ui('categories')}</h2>
    ${categoryGridHTML()}`;
  return { title: t('appName'), icon: '🏠', tab: 'home' };
}
