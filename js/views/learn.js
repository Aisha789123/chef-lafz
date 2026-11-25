// "Learn" tab: search box + all sections. (#/search opens the same screen with the search box focused.)
import { t } from '../i18n.js';
import { ui, $ } from '../ui.js';
import { categoryGridHTML } from './home.js';
import { searchBoxHTML, wireSearch } from './search.js';

export default function learn(root) {
  const focusSearch = location.hash === '#/search';
  root.innerHTML = `
    ${searchBoxHTML()}
    <div id="allCats">
      <h2 class="section-label">${ui('categories')}</h2>
      ${categoryGridHTML()}
    </div>`;
  const cats = $('#allCats', root);
  const input = wireSearch(root, (hasQuery) => { cats.hidden = hasQuery; });
  if (focusSearch) setTimeout(() => input.focus(), 50);
  return { title: t('learnTitle'), icon: '📚', tab: 'learn' };
}
