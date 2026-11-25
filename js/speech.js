// Text-to-speech (Web Speech API) + tiny sound effects (Web Audio, no files).
import { getSettings } from './store.js';

const synth = 'speechSynthesis' in window ? window.speechSynthesis : null;
let voices = [];
const listeners = new Set();

function loadVoices() {
  if (!synth) return;
  voices = synth.getVoices() || [];
  listeners.forEach((fn) => fn());
}
if (synth) {
  loadVoices();
  if ('onvoiceschanged' in synth) synth.addEventListener('voiceschanged', loadVoices);
  // Some Android browsers never fire voiceschanged: poll a few times.
  let tries = 0;
  const poll = setInterval(() => { loadVoices(); if (voices.length || ++tries > 10) clearInterval(poll); }, 400);
}

export function canSpeak() { return !!synth; }
export function onVoicesChanged(fn) { listeners.add(fn); return () => listeners.delete(fn); }

export function englishVoices() {
  return voices.filter((v) => /^en[-_]/i.test(v.lang) || v.lang === 'en');
}

function pickEnglish() {
  const wanted = getSettings().voiceURI;
  if (wanted) {
    const v = voices.find((x) => x.voiceURI === wanted);
    if (v) return v;
  }
  const en = englishVoices();
  const norm = (l) => l.replace('_', '-').toLowerCase();
  return en.find((v) => norm(v.lang) === 'en-gb' && /google/i.test(v.name))
    || en.find((v) => norm(v.lang) === 'en-gb')
    || en.find((v) => norm(v.lang) === 'en-in')
    || en.find((v) => norm(v.lang) === 'en-us')
    || en[0] || null;
}

function pickUrdu() {
  return voices.find((v) => /^ur/i.test(v.lang)) || null;
}

export function hasUrduVoice() { return !!pickUrdu(); }

let current = null;

export function stop() {
  if (synth) synth.cancel();
  if (current && current.audio) { current.audio.pause(); }
  current = null;
}

// speak('onion') or speak('onion', { slow: true }) or speak('پیاز', { urdu: true })
export function speak(text, { slow = false, urdu = false, button = null } = {}) {
  if (!synth || !text) return Promise.resolve(false);
  // Browsers block speech before the first tap on the page (and log a warning). Skip quietly instead.
  if (navigator.userActivation && !navigator.userActivation.hasBeenActive) return Promise.resolve(false);
  stop();
  const s = getSettings();
  const u = new SpeechSynthesisUtterance(cleanForSpeech(text));
  if (urdu) {
    const v = pickUrdu();
    if (!v) return Promise.resolve(false);
    u.voice = v; u.lang = v.lang; u.rate = slow ? s.slowRate : s.rate;
  } else {
    const v = pickEnglish();
    if (v) { u.voice = v; u.lang = v.lang; } else { u.lang = 'en-GB'; }
    u.rate = slow ? s.slowRate : s.rate;
  }
  u.pitch = 1;
  return new Promise((resolve) => {
    const done = (ok) => { if (button) button.classList.remove('speaking'); resolve(ok); };
    u.onend = () => done(true);
    u.onerror = () => done(false);
    if (button) button.classList.add('speaking');
    current = { u };
    // Chrome bug: speaking right after cancel() can be swallowed. A tiny delay fixes it.
    setTimeout(() => synth.speak(u), 40);
    // Safety: never leave a button pulsing forever.
    setTimeout(() => done(true), 12000);
  });
}

// Read nicely: drop "(extra info)" in brackets, "…" and symbols the voice would read aloud.
function cleanForSpeech(text) {
  return String(text).replace(/\s*\([^)]*\)/g, '').replace(/…/g, ' ').replace(/[!¡]/g, '').replace(/°C/g, ' degrees Celsius').replace(/°F/g, ' degrees Fahrenheit').replace(/\//g, ' or ');
}

// Play a recorded audio blob (family voice).
export function playBlob(blob, button = null) {
  stop();
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  current = { audio };
  if (button) button.classList.add('speaking');
  const end = () => { if (button) button.classList.remove('speaking'); URL.revokeObjectURL(url); };
  audio.onended = end; audio.onerror = end;
  audio.play().catch(end);
}

// ---- Small sound effects ----
let ctx = null;
function tone(freqs, dur = 0.12, type = 'sine', vol = 0.18) {
  if (!getSettings().sfx) return;
  try {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    let t = ctx.currentTime;
    for (const f of freqs) {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = type; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g).connect(ctx.destination);
      o.start(t); o.stop(t + dur + 0.02);
      t += dur * 0.8;
    }
  } catch { /* no audio: ignore */ }
}
export const sfx = {
  right: () => tone([660, 880], 0.13),
  again: () => tone([392, 330], 0.16, 'triangle', 0.12),
  done: () => tone([523, 659, 784, 1047], 0.14),
  flip: () => tone([500], 0.05, 'triangle', 0.08),
};
