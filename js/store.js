// Progress + settings, saved in localStorage. Spaced repetition with 5 Leitner boxes.

const KEY = 'chefLafz.v1';

// Days until a card is due again, per box (index = box number).
export const BOX_DAYS = [0, 0, 1, 3, 7, 16];
export const LEARNED_BOX = 3; // box 3 or higher counts as "learned"

const DEFAULT_SETTINGS = {
  lang: 'ur',
  rate: 0.85,
  slowRate: 0.6,
  showRoman: true,
  autoplay: true,
  sfx: true,
  recordMode: false,
  voiceURI: '',
  welcomed: false,   // false = show the first-time welcome screen
};

function fresh() {
  return {
    v: 1,
    settings: { ...DEFAULT_SETTINGS },
    items: {},          // id -> { b: box 1-5, d: due day number, s: seen, r: right, w: wrong, t: last timestamp }
    streak: { count: 0, best: 0, last: '' },
    stats: { sessions: 0, answers: 0, right: 0 },
  };
}

let state = load();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return fresh();
    const s = JSON.parse(raw);
    const base = fresh();
    return {
      ...base,
      ...s,
      settings: { ...base.settings, ...(s.settings || {}) },
      streak: { ...base.streak, ...(s.streak || {}) },
      stats: { ...base.stats, ...(s.stats || {}) },
      items: s.items || {},
    };
  } catch {
    return fresh();
  }
}

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* storage full or blocked: keep working in memory */ }
}

// ---- Dates (local time, whole days) ----
export function todayKey(d = new Date()) {
  const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, '0'), day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
export function dayNum(d = new Date()) {
  return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000);
}
function keyToNum(k) {
  const [y, m, d] = k.split('-').map(Number);
  return Math.floor(Date.UTC(y, m - 1, d) / 86400000);
}

// ---- Settings ----
export function getSettings() { return state.settings; }
export function setSetting(k, v) { state.settings[k] = v; save(); }

// ---- Items ----
export function getItem(id) { return state.items[id] || null; }
export function boxOf(id) { return state.items[id]?.b || 0; }   // 0 = never seen
export function isDue(id, today = dayNum()) {
  const it = state.items[id];
  return !!it && it.d <= today;
}
export function isLearned(id) { return boxOf(id) >= LEARNED_BOX; }

export function grade(id, correct) {
  const today = dayNum();
  const it = state.items[id] || { b: 0, d: today, s: 0, r: 0, w: 0, t: 0 };
  it.s++;
  if (correct) {
    it.r++;
    it.b = Math.min(5, Math.max(1, it.b + 1));
  } else {
    it.w++;
    it.b = 1;
  }
  it.d = today + BOX_DAYS[it.b];
  it.t = Date.now();
  state.items[id] = it;
  state.stats.answers++;
  if (correct) state.stats.right++;
  save();
  return it;
}

// ---- Streak + sessions ----
export function finishSession() {
  const k = todayKey();
  const s = state.streak;
  if (s.last !== k) {
    const gap = s.last ? keyToNum(k) - keyToNum(s.last) : 99;
    s.count = gap === 1 ? s.count + 1 : 1;
    s.last = k;
    s.best = Math.max(s.best, s.count);
  }
  state.stats.sessions++;
  save();
  return s.count;
}

// The streak shown is 0 if the last practice was before yesterday (it will restart at 1, never negative).
export function currentStreak() {
  const s = state.streak;
  if (!s.last) return 0;
  const gap = dayNum() - keyToNum(s.last);
  return gap <= 1 ? s.count : 0;
}
export function bestStreak() { return state.streak.best; }
export function stats() { return state.stats; }

export function countLearned(ids) {
  let n = 0;
  for (const id of ids) if (isLearned(id)) n++;
  return n;
}

export function resetProgress() {
  const settings = state.settings;
  state = fresh();
  state.settings = settings;
  save();
}
