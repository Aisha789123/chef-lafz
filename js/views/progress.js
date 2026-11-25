import { getCategories, getItemsIn, getItems } from '../data.js';
import { countLearned, currentStreak, bestStreak, stats } from '../store.js';
import { t } from '../i18n.js';
import { esc, ui, pic, catStyle, stars, starsFor } from '../ui.js';

export default function progress(root) {
  const all = getItems();
  const learned = countLearned(all.map((x) => x.id));
  const st = stats();
  const lines = getCategories().map((c) => {
    const ids = getItemsIn(c.id).map((x) => x.id);
    const n = countLearned(ids);
    const pct = ids.length ? Math.round((n / ids.length) * 100) : 0;
    return `<a class="prog-line" href="#/cat/${c.id}" style="${catStyle(c)}">
      <span class="emo">${pic(c.icon, 32)}</span>
      <span class="nm"><span class="ur">${esc(c.nameUr)}</span> ${stars(starsFor(n, ids.length))}</span>
      <span class="bar" aria-hidden="true"><span style="width:${pct}%"></span></span>
      <span class="num">${n}/${ids.length}</span>
    </a>`;
  }).join('');
  root.innerHTML = `
    <div class="stat-row">
      <div class="stat"><b>🔥 ${currentStreak()}</b>${ui('streakDays')}</div>
      <div class="stat"><b>${learned}</b>${ui('totalLearned')}</div>
      <div class="stat"><b>${st.sessions}</b>${ui('sessions')}</div>
    </div>
    <div class="stat-row" style="grid-template-columns:1fr">
      <div class="stat"><b>🏅 ${bestStreak()}</b>${ui('bestStreak')}</div>
    </div>
    <div class="card">${lines}</div>`;
  return { title: t('progress'), icon: '📊', tab: 'progress' };
}
