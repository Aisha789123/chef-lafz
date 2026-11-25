import { getSettings, setSetting, resetProgress } from '../store.js';
import { t } from '../i18n.js';
import { esc, ui, toast, $ } from '../ui.js';
import { speak, englishVoices, onVoicesChanged, canSpeak } from '../speech.js';
import { canRecord, countRecordings } from '../recorder.js';
import { applySettings, updateStreak, switchLang } from '../app.js';

// Set just before a language switch redraws this screen, so "Saved ✓" + the start button survive the redraw.
let justSaved = false;

export default function settings(root) {
  const s = getSettings();
  const sw = (key, label) => `<div class="setting">
    <label id="lb-${key}">${ui(label)}</label>
    <button class="switch" type="button" role="switch" aria-checked="${!!s[key]}" aria-labelledby="lb-${key}" data-toggle="${key}"></button>
  </div>`;
  root.innerHTML = `
    <div class="card">
      <h3>🌐 ${ui('language')}</h3>
      <div class="seg" role="group" aria-label="${esc(t('language'))}">
        <button type="button" data-lang="ur" aria-pressed="${s.lang === 'ur'}"><span class="ur">اردو</span></button>
        <button type="button" data-lang="en" aria-pressed="${s.lang === 'en'}">English</button>
      </div>
    </div>

    <div class="card">
      <h3>🔊 ${ui('speed')}</h3>
      ${canSpeak() ? '' : `<p class="muted">${ui('noVoice')}</p>`}
      <div class="row">
        <input type="range" min="0.5" max="1.2" step="0.05" value="${s.rate}" data-range="rate" aria-label="${esc(t('speed'))}">
        <button class="btn btn-outline" type="button" data-test="rate" aria-label="${esc(t('test'))}">▶️</button>
      </div>
      <h3>🐢 ${ui('slowSpeed')}</h3>
      <div class="row">
        <input type="range" min="0.3" max="0.9" step="0.05" value="${s.slowRate}" data-range="slowRate" aria-label="${esc(t('slowSpeed'))}">
        <button class="btn btn-outline" type="button" data-test="slowRate" aria-label="${esc(t('test'))}">▶️</button>
      </div>
      <div class="setting">
        <label for="voiceSel">${ui('voice')}</label>
        <select id="voiceSel"></select>
      </div>
      ${sw('autoplay', 'autoplay')}
      ${sw('sfx', 'sfx')}
    </div>

    <div class="card">
      ${sw('showRoman', 'showRoman')}
    </div>

    ${canRecord() ? `<div class="card">
      ${sw('recordMode', 'recordMode')}
      <p class="muted" style="margin:4px 0 0">${ui('recordHelp')} <span id="recCount" class="en"></span></p>
    </div>` : ''}

    <div class="card stack">
      <a class="btn btn-outline btn-block" href="#/welcome"><span class="emo" aria-hidden="true">👋</span>${ui('showWelcome')}</a>
      <button class="btn btn-outline btn-block" type="button" data-reset style="color:var(--primary-dark)"><span class="emo" aria-hidden="true">🗑️</span>${ui('reset')}</button>
    </div>

    <p class="muted center">${ui('about')}</p>

    <div class="start-bar" id="startBar" hidden>
      <a class="btn btn-primary" href="#/today">${ui('startPractising')}</a>
    </div>`;

  const startBar = $('#startBar', root);
  const saved = () => {
    toast(ui('saved'), 1800);
    startBar.hidden = false;
  };
  if (justSaved) { justSaved = false; saved(); }

  const fillVoices = () => {
    const sel = $('#voiceSel', root);
    if (!sel) return;
    const cur = getSettings().voiceURI;
    sel.innerHTML = `<option value="">${esc(t('voiceAuto'))}</option>` +
      englishVoices().map((v) => `<option value="${esc(v.voiceURI)}" ${v.voiceURI === cur ? 'selected' : ''}>${esc(v.name)} (${esc(v.lang)})</option>`).join('');
  };
  fillVoices();
  const off = onVoicesChanged(fillVoices);
  countRecordings().then((n) => { const el = $('#recCount', root); if (el && n) el.textContent = `(🎙️ ${n})`; });

  root.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.lang) {
      if (b.dataset.lang === getSettings().lang) return;
      justSaved = true;
      switchLang(b.dataset.lang);          // redraws this screen in the new language
    } else if (b.dataset.toggle) {
      const k = b.dataset.toggle;
      setSetting(k, !getSettings()[k]);
      b.setAttribute('aria-checked', String(getSettings()[k]));
      applySettings();
      saved();
    } else if (b.dataset.test) {
      speak('Yes, chef! Chop the onions, please.', { slow: b.dataset.test === 'slowRate' });
    } else if ('reset' in b.dataset) {
      if (confirm(t('resetConfirm'))) {
        resetProgress();
        updateStreak();
        toast(ui('resetDone'));
      }
    }
  });
  root.addEventListener('change', (e) => {
    const el = e.target;
    if (el.dataset.range) { setSetting(el.dataset.range, parseFloat(el.value)); saved(); }
    if (el.id === 'voiceSel') { setSetting('voiceURI', el.value); saved(); }
  });
  return { title: t('settings'), icon: '⚙️', tab: 'settings', leave: off };
}
