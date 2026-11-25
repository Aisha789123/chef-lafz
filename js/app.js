// Chef Lafz — start-up, tiny hash router, header + bottom navigation.
import { loadAll } from './data.js';
import { getSettings, setSetting, currentStreak } from './store.js';
import { setLang, t, getLang } from './i18n.js';
import { toast, esc, pic, $$ } from './ui.js';
import { stop as stopSpeech } from './speech.js';
import home from './views/home.js';
import learn from './views/learn.js';
import category from './views/category.js';
import word from './views/word.js';
import { learnCategory, learnToday } from './views/session.js';
import settings from './views/settings.js';
import progress from './views/progress.js';
import welcome from './views/welcome.js';

// Each view returns { title, icon, tab, parent, session, bare, leave }.
//   tab     = which bottom-nav item is highlighted
//   parent  = where the ← Back button goes (sub-pages only)
//   session = true during a practice session (bottom nav hidden, "Stop" bar shown)
//   bare    = no header and no bottom nav (welcome screen)
const routes = [
  [/^#?\/?(home)?$/, home],
  [/^#\/welcome$/, welcome],
  [/^#\/learn$/, learn],
  [/^#\/search$/, learn],
  [/^#\/cat\/([\w-]+)$/, category],
  [/^#\/word\/([\w-]+)$/, word],
  [/^#\/learn\/(flash|listen|picture|talk)\/([\w-]+)$/, learnCategory],
  [/^#\/today$/, learnToday],
  [/^#\/settings$/, settings],
  [/^#\/progress$/, progress],
];

const root = document.getElementById('app');
const titleEl = document.getElementById('topTitle');
const backBtn = document.getElementById('backBtn');
const streakChip = document.getElementById('streakChip');
const streakTip = document.getElementById('streakTip');
const nav = document.getElementById('bottomNav');
const stopBar = document.getElementById('stopBar');
const stopBtn = document.getElementById('stopBtn');
const stack = [];
let leave = null;
let parent = '#/home';
let navCount = 0;

const URDU = /[؀-ۿ]/;
const label = (text) => `<span class="${URDU.test(text) ? 'ur' : ''}">${esc(text)}</span>`;

// ---------- Settings that change the whole page ----------
export function applySettings() {
  const s = getSettings();
  setLang(s.lang);
  document.body.classList.toggle('no-roman', !s.showRoman);
  backBtn.setAttribute('aria-label', s.lang === 'ur' ? 'واپس' : 'Back');
  $$('.lang-toggle button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === s.lang)));
  $$('[data-t]').forEach((el) => {
    el.textContent = t(el.dataset.t);
    el.classList.toggle('ur', s.lang === 'ur');
  });
  nav.setAttribute('aria-label', s.lang === 'ur' ? 'مینو' : 'Main menu');
  updateStreak();
}

// Switch language from anywhere (header toggle, settings, welcome) and redraw the current screen.
export function switchLang(lang, redraw = true) {
  if (getSettings().lang !== lang) setSetting('lang', lang);
  applySettings();
  if (redraw) route();
}

export function updateStreak() {
  const n = currentStreak();
  document.getElementById('streakText').innerHTML = label(t('streakShort', n));
  streakChip.setAttribute('aria-label', `🔥 ${t('streakShort', n)}`);
  if (!streakTip.hidden) streakTip.innerHTML = label(t('streakHelp', n));
}

// During a practice session the bottom nav is replaced by a big "Stop" button.
export function setSessionUI(on, back = '#/home') {
  nav.hidden = on;
  stopBar.hidden = !on;
  stopBtn.setAttribute('href', back);
}

function closeTip() {
  streakTip.hidden = true;
  streakChip.setAttribute('aria-expanded', 'false');
}

// ---------- Router ----------
function route() {
  stopSpeech();
  closeTip();
  if (leave) { try { leave(); } catch { /* ignore */ } leave = null; }
  const hash = decodeURI(location.hash || '#/home');
  if (!getSettings().welcomed && hash !== '#/welcome') { location.replace('#/welcome'); return; }
  let match = null, view = home;
  for (const [re, v] of routes) {
    const m = hash.match(re);
    if (m) { match = m; view = v; break; }
  }
  if (!match) { location.replace('#/home'); return; }
  // A fresh container per screen, so event listeners of the old screen disappear with it.
  const box = document.createElement('div');
  root.replaceChildren(box);
  const res = view(box, ...match.slice(1)) || {};
  leave = res.leave || null;
  parent = res.parent || '#/home';

  document.body.classList.toggle('bare', !!res.bare);
  titleEl.innerHTML = `<span class="title-icon" aria-hidden="true">${pic(res.icon || '👨‍🍳', 26)}</span>` +
    `<span class="title-text">${label(res.title || t('appName'))}</span>`;
  document.title = `${res.title ? res.title + ' · ' : ''}Chef Lafz`;
  backBtn.hidden = !res.parent || !!res.session;
  setSessionUI(!!res.session, parent);
  $$('a', nav).forEach((a) => {
    if (a.dataset.tab === res.tab) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  updateStreak();

  // Remember the in-app path so the Back button can use the browser history safely.
  if (stack.length > 1 && stack[stack.length - 2] === hash) stack.pop();
  else if (stack[stack.length - 1] !== hash) stack.push(hash);
  window.scrollTo(0, 0);
  if (navCount++ > 0) root.focus({ preventScroll: true });
}

backBtn.addEventListener('click', () => {
  // Use the browser history when we came from inside the app, so the phone's back button stays in sync.
  if (stack.length > 1) history.back();
  else location.hash = parent;
});

$$('.lang-toggle button').forEach((b) => b.addEventListener('click', () => switchLang(b.dataset.lang)));

streakChip.addEventListener('click', (e) => {
  e.stopPropagation();
  const open = streakTip.hidden;
  streakTip.hidden = !open;
  streakChip.setAttribute('aria-expanded', String(open));
  if (open) streakTip.innerHTML = label(t('streakHelp', currentStreak()));
});
document.addEventListener('click', (e) => { if (!streakTip.hidden && !streakTip.contains(e.target)) closeTip(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeTip(); });

async function start() {
  applySettings();
  try {
    await loadAll();
  } catch (e) {
    root.innerHTML = `<div class="empty"><span class="emo">📶</span>${label(t('loadError'))}</div>`;
    return;
  }
  window.addEventListener('hashchange', route);
  route();
  registerSW();
}

const IS_LOCAL = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);

// Local testing (Live Server etc.): never keep a service worker, so it can't take over other projects on the same port.
async function removeLocalSW() {
  try {
    const regs = await navigator.serviceWorker.getRegistrations();
    await Promise.all(regs.map((r) => r.unregister()));
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k.startsWith('chef-lafz-')).map((k) => caches.delete(k)));
    }
  } catch { /* nothing to clean */ }
}

function registerSW() {
  if (!('serviceWorker' in navigator) || location.protocol === 'file:') return;
  if (IS_LOCAL) { removeLocalSW(); return; }
  const firstTime = !navigator.serviceWorker.controller;
  // Scope './' keeps it inside the app's folder (/chef-lafz/ on GitHub Pages).
  navigator.serviceWorker.register('sw.js', { scope: './' }).then((reg) => {
    reg.addEventListener('updatefound', () => {
      const w = reg.installing;
      if (!w) return;
      w.addEventListener('statechange', () => {
        if (w.state === 'activated' && firstTime) toast(label(t('offlineReady')), 3500);
      });
    });
  }).catch(() => { /* offline support is optional */ });
}

start();
