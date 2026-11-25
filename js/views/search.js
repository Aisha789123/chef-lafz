// Search box (English, Urdu, Roman Urdu). Used at the top of the Learn screen.
import { search as find, getCategory } from '../data.js';
import { t } from '../i18n.js';
import { esc, ui, pic, catStyle, haramBadge, $ } from '../ui.js';

let lastQuery = '';

export function searchBoxHTML() {
  return `
    <div class="search-box">
      <label class="visually-hidden" for="q">${esc(t('search'))}</label>
      <input id="q" type="search" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="search"
        placeholder="🔍 ${esc(t('searchPlaceholder'))}" value="${esc(lastQuery)}">
    </div>
    <div class="result-list" id="results" aria-live="polite"></div>`;
}

// onChange(hasQuery) lets the page hide other content while results are shown.
export function wireSearch(root, onChange = () => {}) {
  const input = $('#q', root);
  const out = $('#results', root);
  const render = () => {
    lastQuery = input.value;
    const q = input.value.trim();
    onChange(!!q);
    if (!q) { out.innerHTML = ''; return; }
    const res = find(q);
    if (!res.length) { out.innerHTML = `<p class="empty"><span class="emo" aria-hidden="true">🤷</span>${ui('noResults')}</p>`; return; }
    out.innerHTML = res.map((it) => {
      const cat = getCategory(it.category);
      return `<a class="result" href="#/word/${encodeURIComponent(it.id)}" style="${catStyle(cat)}">
        ${pic(it.image, 52)}
        <span class="r-text"><span class="r-en en">${esc(it.english)} ${haramBadge(it, true)}</span><span class="r-ur ur">${esc(it.urdu)}</span><span class="roman" style="font-size:14px">${esc(it.romanUrdu)}</span></span>
      </a>`;
    }).join('');
  };
  let timer = 0;
  input.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(render, 120); });
  render();
  return input;
}
