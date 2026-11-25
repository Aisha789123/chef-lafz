// One practice session: 10 cards, different quiz types, then a celebration.
import { getCategory, getItems } from '../data.js';
import { grade, finishSession, getSettings, countLearned } from '../store.js';
import { t } from '../i18n.js';
import { esc, ui, pic, catStyle, shuffle, $, $$ } from '../ui.js';
import { speak, sfx, canSpeak, stop } from '../speech.js';
import { buildToday, buildCategory, distractors } from '../srs.js';
import { confetti } from '../celebrate.js';
import { updateStreak, setSessionUI } from '../app.js';
import { catTitle } from './category.js';

export function learnCategory(root, mode, catId) {
  const cat = getCategory(catId);
  if (!cat) { location.replace('#/home'); return {}; }
  const back = `#/cat/${catId}`;
  return run(root, () => buildCategory(catId, mode), { back, title: catTitle(cat), icon: cat.icon, tab: 'learn' });
}

export function learnToday(root) {
  return run(root, buildToday, { back: '#/home', title: t('today'), icon: '▶️', tab: 'practice' });
}

function run(root, build, { back, title, icon, tab }) {
  let alive = true;
  const start = (cards) => {
    if (!cards.length || (cards.length < 2 && cards[0]?.mode !== 'flash')) {
      root.innerHTML = `<div class="empty"><span class="emo">🤷</span>${ui('notEnough')}</div>`;
      setSessionUI(false);
      return;
    }
    setSessionUI(true, back);
    new Session(root, cards, back, () => alive, () => start(build())).next();
  };
  // The router reads `session: true` after this returns, so start on the next tick.
  setTimeout(() => alive && start(build()), 0);
  return { title, icon, tab, parent: back, session: true, leave: () => { alive = false; stop(); } };
}

class Session {
  constructor(root, cards, back, isAlive, again) {
    this.root = root;
    this.queue = cards.slice();
    this.pos = -1;
    this.back = back;
    this.isAlive = isAlive;
    this.again = again;
    this.firstTry = new Map();  // id -> correct on first try?
    this.requeued = new Set();
  }

  // ---------- flow ----------
  next() {
    if (!this.isAlive()) return;
    this.pos++;
    if (this.pos >= this.queue.length) return this.finish();
    const card = this.queue[this.pos];
    const cat = getCategory(card.type === 'scene' ? 'phrases' : card.item.category);
    const pct = Math.round((this.pos / this.queue.length) * 100);
    this.root.innerHTML = `
      <div class="session-top">
        <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="${this.queue.length}" aria-valuenow="${this.pos}"><span style="width:${pct}%"></span></div>
        <span class="session-count">${this.pos + 1}/${this.queue.length}</span>
      </div>
      <section class="card-area" style="${catStyle(cat)}"></section>`;
    this.area = $('.card-area', this.root);
    const fn = { flash: this.flash, listen: this.listen, picture: this.picture, talk: this.talk }[card.mode];
    if (card.type === 'scene') this.scene(card.scene);
    else if (fn) fn.call(this, card.item);
    else this.flash(card.item);
    const focusEl = $('button, a[href]', this.area);
    if (focusEl) focusEl.focus({ preventScroll: true });
  }

  record(id, correct, item) {
    if (!this.firstTry.has(id)) this.firstTry.set(id, correct);
    grade(id, correct);
    // Got it wrong: show it again later in this session as a flashcard (only once).
    if (!correct && item && !this.requeued.has(id)) {
      this.requeued.add(id);
      this.queue.push({ type: 'word', item, mode: 'flash' });
    }
  }

  nextButton() {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'btn btn-primary next-btn';
    b.innerHTML = `${ui('next')} <span class="emo" aria-hidden="true">${document.documentElement.dir === 'rtl' ? '⬅️' : '➡️'}</span>`;
    b.addEventListener('click', () => this.next());
    this.area.appendChild(b);
    b.focus({ preventScroll: false });
  }

  feedback(ok, item, extra = '') {
    const div = document.createElement('div');
    div.className = `feedback ${ok ? 'good' : 'again'}`;
    div.setAttribute('role', 'status');
    div.innerHTML = `<span class="emo" aria-hidden="true">${ok ? '🎉' : '💪'}</span>
      <span><span class="${document.documentElement.lang === 'ur' ? 'ur' : ''}" style="display:block">${esc(ok ? t('right') : t('wrong'))}</span>
      ${item ? `<span class="fb-word en">${esc(item.english)}</span><span class="ur">${esc(item.urdu)}</span>` : ''}${extra}</span>`;
    this.area.appendChild(div);
    if (ok) sfx.right(); else sfx.again();
  }

  // ---------- 1. Flashcard ----------
  flash(item) {
    const s = getSettings();
    this.area.innerHTML = `
      <div class="flash">
        <div class="flash-inner">
          <button class="flash-face flash-front" type="button" aria-label="${esc(t('tapToFlip'))}">
            ${pic(item.image, 200)}
            <span class="tap-hint"><span aria-hidden="true" style="font-family:var(--latin)">👆</span>${ui('tapToFlip')}</span>
          </button>
          <div class="flash-face flash-back" inert>
            ${pic(item.image, 96)}
            <p class="big-en en" lang="en">${esc(item.english)}</p>
            <p class="say ur">${esc(item.englishInUrduScript)}</p>
            <p class="big-ur ur" lang="ur">${esc(item.urdu)}</p>
            <p class="roman" style="margin:0">${esc(item.romanUrdu)}</p>
            <div class="speak-row">
              <button class="speak-btn small" type="button" data-say="en" aria-label="${esc(t('speakEn'))}">🔊</button>
              <button class="speak-btn small slow" type="button" data-say="slow" aria-label="${esc(t('speakSlow'))}">🐢</button>
            </div>
          </div>
        </div>
      </div>
      <div class="answer-row" hidden>
        <button class="btn btn-again" type="button" data-a="again"><span class="emo" aria-hidden="true">🔁</span>${ui('again')}</button>
        <button class="btn btn-good" type="button" data-a="knew"><span class="emo" aria-hidden="true">✅</span>${ui('knewIt')}</button>
      </div>`;
    const flashEl = $('.flash', this.area);
    const backFace = $('.flash-back', this.area);
    const row = $('.answer-row', this.area);
    const flip = () => {
      if (flashEl.classList.contains('flipped')) return;
      flashEl.classList.add('flipped');
      backFace.inert = false;
      $('.flash-front', this.area).inert = true;
      row.hidden = false;
      sfx.flip();
      if (s.autoplay) speak(item.english, { button: $('[data-say="en"]', this.area) });
      setTimeout(() => $('[data-a="knew"]', this.area)?.focus({ preventScroll: true }), 50);
    };
    $('.flash-front', this.area).addEventListener('click', flip);
    this.area.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      if (b.dataset.say === 'en') speak(item.english, { button: b });
      if (b.dataset.say === 'slow') speak(item.english, { slow: true, button: b });
      if (b.dataset.a) {
        const ok = b.dataset.a === 'knew';
        this.record(item.id, ok, item);
        if (ok) sfx.right();
        this.next();
      }
    });
  }

  // ---------- 2. Listen & choose (4 pictures) ----------
  listen(item) {
    const options = shuffle([item, ...distractors(item, 3)]);
    if (options.length < 2) return this.flash(item);
    this.area.innerHTML = `
      <p class="prompt"><span class="emo" aria-hidden="true">👂</span> ${ui('whatDidYouHear')}</p>
      <div class="big-play">
        <button class="speak-btn" type="button" data-say="en" aria-label="${esc(t('listenAgain'))}">🔊</button>
        <button class="speak-btn slow" type="button" data-say="slow" aria-label="${esc(t('speakSlow'))}">🐢</button>
      </div>
      ${canSpeak() ? '' : `<p class="center en" style="font-size:24px;font-weight:800">${esc(item.english)}</p>`}
      <div class="pic-choices">
        ${options.map((o, i) => `<button class="pic-choice" type="button" data-id="${esc(o.id)}" aria-label="${i + 1}">${pic(o.image, 120)}<span class="reveal en" hidden>${esc(o.english)}</span></button>`).join('')}
      </div>`;
    const play = (slow = false) => speak(item.english, { slow, button: $(`[data-say="${slow ? 'slow' : 'en'}"]`, this.area) });
    setTimeout(() => this.isAlive() && play(), 300);
    let answered = false;
    this.area.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      if (b.dataset.say) return play(b.dataset.say === 'slow');
      if (!b.dataset.id || answered) return;
      answered = true;
      const ok = b.dataset.id === item.id;
      $$('.pic-choice', this.area).forEach((el) => {
        el.disabled = true;
        $('.reveal', el).hidden = false;
        if (el.dataset.id === item.id) el.classList.add('is-right');
        else if (el === b) el.classList.add('is-wrong');
        else el.classList.add('is-dim');
      });
      this.record(item.id, ok, item);
      this.feedback(ok, item);
      speak(item.english);
      this.nextButton();
    });
  }

  // ---------- 3. Picture quiz (picture → English word) ----------
  picture(item) {
    const options = shuffle([item, ...distractors(item, 3)]);
    if (options.length < 2) return this.flash(item);
    this.area.innerHTML = `
      <p class="prompt"><span class="emo" aria-hidden="true">🤔</span> ${ui('whatIsThis')}</p>
      <div class="quiz-pic">${pic(item.image, 158)}</div>
      <div class="word-choices">
        ${options.map((o) => `<div class="word-choice">
          <button class="choose en" type="button" data-id="${esc(o.id)}" lang="en">${esc(o.english)}</button>
          <button class="speak-btn" type="button" data-speak="${esc(o.id)}" aria-label="${esc(t('speakEn'))}: ${esc(o.english)}">🔊</button>
        </div>`).join('')}
      </div>`;
    const byId = new Map(options.map((o) => [o.id, o]));
    let answered = false;
    this.area.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      if (b.dataset.speak) return speak(byId.get(b.dataset.speak).english, { button: b });
      if (!b.dataset.id || answered) return;
      answered = true;
      const ok = b.dataset.id === item.id;
      $$('.choose', this.area).forEach((el) => {
        el.disabled = true;
        if (el.dataset.id === item.id) el.classList.add('is-right');
        else if (el === b) el.classList.add('is-wrong');
        else el.classList.add('is-dim');
      });
      this.record(item.id, ok, item);
      this.feedback(ok, item);
      speak(item.english);
      this.nextButton();
    });
  }

  // ---------- 4. Kitchen talk (hear an English phrase → choose the Urdu meaning) ----------
  talk(item) {
    const options = shuffle([item, ...distractors(item, 3, 'urdu')]);
    if (options.length < 2) return this.flash(item);
    this.area.innerHTML = `
      <p class="prompt"><span class="emo" aria-hidden="true">👨‍🍳</span> ${ui('whatDoesItMean')}</p>
      <div class="big-play">
        <button class="speak-btn" type="button" data-say="en" aria-label="${esc(t('listenAgain'))}">🔊</button>
        <button class="speak-btn slow" type="button" data-say="slow" aria-label="${esc(t('speakSlow'))}">🐢</button>
      </div>
      <p class="center en phrase-text" style="font-size:24px;font-weight:800;margin:0 0 12px" ${canSpeak() ? 'hidden' : ''}>${esc(item.english)}</p>
      <div class="word-choices">
        ${options.map((o) => `<div class="word-choice"><button class="choose ur" type="button" data-id="${esc(o.id)}" lang="ur">${esc(o.urdu)}</button></div>`).join('')}
      </div>`;
    const play = (slow = false) => speak(item.english, { slow, button: $(`[data-say="${slow ? 'slow' : 'en'}"]`, this.area) });
    setTimeout(() => this.isAlive() && play(), 300);
    let answered = false;
    this.area.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      if (b.dataset.say) return play(b.dataset.say === 'slow');
      if (!b.dataset.id || answered) return;
      answered = true;
      const ok = b.dataset.id === item.id;
      $('.phrase-text', this.area).hidden = false;
      $$('.choose', this.area).forEach((el) => {
        el.disabled = true;
        if (el.dataset.id === item.id) el.classList.add('is-right');
        else if (el === b) el.classList.add('is-wrong');
        else el.classList.add('is-dim');
      });
      this.record(item.id, ok, item);
      this.feedback(ok, null, item.whenUrdu ? `<span class="ur" style="display:block;font-size:16px">💡 ${esc(item.whenUrdu)}</span>` : '');
      this.nextButton();
    });
  }

  // ---------- 5. Role-play scene ----------
  scene(sc) {
    const options = shuffle(sc.options.map((o, i) => ({ ...o, ok: i === sc.answer })));
    this.area.innerHTML = `
      <div class="scene-box">
        <p class="scene-situation ur"><span aria-hidden="true">🎬</span> ${esc(sc.situationUr)}</p>
        <div class="bubble-row">
          <span class="who" aria-hidden="true">👨‍🍳</span>
          <div class="bubble"><span class="en" lang="en">${esc(sc.chefEn)}</span><span class="ur chef-ur" hidden>${esc(sc.chefUr)}</span></div>
          <button class="speak-btn small" type="button" data-say="chef" aria-label="${esc(t('listenAgain'))}">🔊</button>
        </div>
      </div>
      <p class="prompt"><span class="emo" aria-hidden="true">🙋</span> ${ui('whatDoYouSay')}</p>
      <div class="word-choices">
        ${options.map((o, i) => `<div class="word-choice">
          <button class="choose" type="button" data-i="${i}" style="display:flex;flex-direction:column;align-items:center">
            <span class="en" lang="en">${esc(o.en)}</span><span class="ur" style="font-size:16px;font-weight:400">${esc(o.ur)}</span>
          </button>
          <button class="speak-btn" type="button" data-speak="${i}" aria-label="${esc(t('speakEn'))}">🔊</button>
        </div>`).join('')}
      </div>`;
    const sayChef = () => speak(sc.chefEn, { button: $('[data-say="chef"]', this.area) });
    setTimeout(() => this.isAlive() && sayChef(), 300);
    let answered = false;
    this.area.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      if (b.dataset.say) return sayChef();
      if (b.dataset.speak) return speak(options[+b.dataset.speak].en, { button: b });
      if (b.dataset.i === undefined || answered) return;
      answered = true;
      const chosen = options[+b.dataset.i];
      const right = options.find((o) => o.ok);
      $('.chef-ur', this.area).hidden = false;
      $$('.choose', this.area).forEach((el) => {
        el.disabled = true;
        const o = options[+el.dataset.i];
        if (o.ok) el.classList.add('is-right');
        else if (el === b) el.classList.add('is-wrong');
        else el.classList.add('is-dim');
      });
      this.record(sc.id, chosen.ok, null);
      if (!chosen.ok && !this.requeued.has(sc.id)) {
        this.requeued.add(sc.id);
        this.queue.push({ type: 'scene', scene: sc });
      }
      this.feedback(chosen.ok, null, `<span class="en fb-word">${esc(right.en)}</span>`);
      speak(right.en);
      this.nextButton();
    });
  }

  // ---------- Celebration ----------
  finish() {
    const streak = finishSession();
    updateStreak();
    setSessionUI(false);   // session over: show the bottom menu again
    const total = this.firstTry.size;
    const right = [...this.firstTry.values()].filter(Boolean).length;
    const learned = countLearned(getItems().map((x) => x.id));
    const trophy = right === total ? '🏆' : right >= total / 2 ? '🎉' : '⭐';
    this.root.innerHTML = `
      <div class="celebrate">
        <div class="trophy" aria-hidden="true">${trophy}</div>
        <h2>${ui('doneTitle')}</h2>
        <p class="score">${ui('doneScore', right, total)}</p>
        <div class="stat-row">
          <div class="stat"><b>🔥 ${streak}</b>${ui('streakDays')}</div>
          <div class="stat"><b>${total}</b>${ui('sessionWords')}</div>
          <div class="stat"><b>${learned}</b>${ui('learnedWords')}</div>
        </div>
        <div class="stack">
          <button class="btn btn-primary btn-block" type="button" data-more><span class="emo" aria-hidden="true">🔁</span>${ui('moreBtn')}</button>
          <a class="btn btn-outline btn-block" href="#/home"><span class="emo" aria-hidden="true">🏠</span>${ui('homeBtn')}</a>
        </div>
      </div>`;
    sfx.done();
    confetti();
    $('[data-more]', this.root).addEventListener('click', () => this.again());
    $('[data-more]', this.root).focus({ preventScroll: true });
  }
}
