import { getWord, getCategory, getItemsIn } from '../data.js';
import { getSettings } from '../store.js';
import { t } from '../i18n.js';
import { esc, ui, pic, catStyle, haramBadge, toast, $ } from '../ui.js';
import { speak, hasUrduVoice, onVoicesChanged, playBlob, canSpeak } from '../speech.js';
import { getRecording, saveRecording, deleteRecording, canRecord, startRecording } from '../recorder.js';
import { catTitle } from './category.js';

export default function word(root, id) {
  const item = getWord(id);
  if (!item) { location.replace('#/home'); return {}; }
  const cat = getCategory(item.category);
  const list = getItemsIn(item.category);
  const i = list.findIndex((x) => x.id === id);
  const prev = list[(i - 1 + list.length) % list.length];
  const next = list[(i + 1) % list.length];
  const s = getSettings();
  const recordOn = s.recordMode && canRecord();

  root.innerHTML = `
    <article class="word-detail" style="${catStyle(cat)}">
      ${item.notHalal ? `<div>${haramBadge(item)}</div>` : ''}
      ${pic(item.image, 168)}
      <p class="big-en en" lang="en">${esc(item.english)}</p>
      <p class="say ur" title="${esc(t('sayIt'))}">${esc(item.englishInUrduScript)}</p>
      <div class="speak-row">
        <button class="speak-btn" type="button" data-say="en" aria-label="${esc(t('speakEn'))}">🔊</button>
        <button class="speak-btn slow" type="button" data-say="slow" aria-label="${esc(t('speakSlow'))}">🐢</button>
        <button class="speak-btn urdu" type="button" data-say="ur" aria-label="${esc(t('speakUr'))}" hidden>🗣️</button>
        ${recordOn ? `<button class="speak-btn rec" type="button" data-rec aria-label="${esc(t('record'))}">🎙️</button>
        <button class="speak-btn small" type="button" data-del aria-label="${esc(t('deleteRecord'))}" hidden style="background:#8D7B6C;box-shadow:none">🗑️</button>` : ''}
      </div>
      <p class="big-ur ur" lang="ur">${esc(item.urdu)}</p>
      <p class="roman">${esc(item.romanUrdu)}</p>
      ${item.whenUrdu ? `<div class="info-box"><span class="lbl">💡 ${ui('whenSaid')}</span><p class="when-ur ur">${esc(item.whenUrdu)}</p></div>` : ''}
      ${item.exampleSentence ? `<div class="info-box">
        <span class="lbl">📝 ${ui('example')}</span>
        <div class="example">
          <button class="speak-btn small" type="button" data-say="ex" aria-label="${esc(t('speakExample'))}">🔊</button>
          <div class="texts">
            <p class="ex-en en" lang="en">${esc(item.exampleSentence)}</p>
            <p class="ex-ur ur" lang="ur">${esc(item.exampleSentenceUrdu)}</p>
          </div>
        </div>
      </div>` : ''}
      ${item.noteUrdu ? `<div class="info-box"><span class="lbl">ℹ️ ${ui('note')}</span><p class="when-ur ur">${esc(item.noteUrdu)}</p></div>` : ''}
    </article>
    <nav class="detail-nav">
      <a class="btn btn-outline" href="#/word/${encodeURIComponent(prev.id)}" aria-label="${esc(t('prev'))}: ${esc(prev.english)}"><span class="arrow" aria-hidden="true">⬅️</span></a>
      <a class="btn btn-outline" href="#/word/${encodeURIComponent(next.id)}" aria-label="${esc(t('nextWord'))}: ${esc(next.english)}"><span class="arrow" aria-hidden="true">➡️</span></a>
    </nav>`;

  const urBtn = $('[data-say="ur"]', root);
  const delBtn = $('[data-del]', root);
  let recording = null;   // saved Blob for this word
  let rec = null;         // active recorder

  const refreshUrdu = () => {
    urBtn.hidden = !(recording || hasUrduVoice());
    if (delBtn) delBtn.hidden = !recording;
  };
  const off = onVoicesChanged(refreshUrdu);
  refreshUrdu();
  getRecording(item.id).then((b) => { recording = b || null; refreshUrdu(); });

  root.addEventListener('click', async (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    const kind = b.dataset.say;
    if (kind === 'en') speak(item.english, { button: b });
    else if (kind === 'slow') speak(item.english, { slow: true, button: b });
    else if (kind === 'ex') speak(item.exampleSentence, { button: b });
    else if (kind === 'ur') {
      if (recording) playBlob(recording, b);
      else speak(item.urdu, { urdu: true, button: b });
    } else if ('rec' in b.dataset) {
      if (rec) { rec.stop(); return; }
      try {
        rec = await startRecording();
        b.classList.add('recording'); b.textContent = '⏹️'; b.setAttribute('aria-label', t('stopRecord'));
        const blob = await rec.done;
        rec = null;
        b.classList.remove('recording'); b.textContent = '🎙️'; b.setAttribute('aria-label', t('record'));
        if (blob.size > 0) {
          await saveRecording(item.id, blob);
          recording = blob; refreshUrdu();
          toast(`<span class="ur">${esc(t('recorded'))}</span>`);
          playBlob(blob, urBtn);
        }
      } catch {
        rec = null;
        toast(`<span class="ur">${esc(t('micError'))}</span>`);
      }
    } else if ('del' in b.dataset) {
      await deleteRecording(item.id);
      recording = null; refreshUrdu();
    }
  });

  // Say the word once when the page opens (only works after the first tap in the app — browser rule).
  let alive = true;
  if (s.autoplay && canSpeak()) setTimeout(() => alive && speak(item.english, { button: $('[data-say="en"]', root) }), 250);

  // Swipe left/right for next / previous word.
  let x0 = null;
  root.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  root.addEventListener('touchend', (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    x0 = null;
    if (Math.abs(dx) < 70) return;
    const rtl = document.documentElement.dir === 'rtl';
    const goNext = rtl ? dx > 0 : dx < 0;
    location.hash = `#/word/${encodeURIComponent((goNext ? next : prev).id)}`;
  });

  return {
    title: catTitle(cat),
    icon: cat.icon,
    tab: 'learn',
    parent: `#/cat/${cat.id}`,
    leave: () => { alive = false; off(); if (rec) rec.stop(); },
  };
}
