# Chef Lafz — Build Plan

If work is interrupted, say "continue": read this file and pick up at the first unticked box.

## Rules (from Aisha)
- NO git (no commits). NO terminal commands (no node/npm/servers). Only create/edit files.
- Write scripts (validate etc.) but do not run them.
- Note: before this rule arrived, `git init` was already run once (empty repo, no commits) and a
  repo-local git user.name/user.email was set (`Aisha` / your Gmail). The Urdu font was also downloaded
  into `fonts/`. Delete the `.git` folder if you want to start git fresh.
- (PLAN.md was found empty when work resumed; it was rewritten from the files on disk.)

## Phase A — Skeleton, design, PWA
- [x] PLAN.md, DECISIONS.md
- [x] Self-hosted Noto Nastaliq Urdu font (fonts/) + licence
- [x] css/app.css (mobile-first, RTL, warm palette, big tap targets)
- [x] index.html shell
- [x] js/i18n.js, js/store.js, js/speech.js, js/data.js, js/ui.js, js/app.js (router), js/srs.js, js/recorder.js, js/celebrate.js
- [x] js/art/kit.js + js/art/index.js — drawing kit (one module per category in js/art/)
- [x] data/categories.json (15 categories, colour + icon each)
- [x] manifest.json, sw.js, icons/icon.svg + icons/maskable.svg, scripts/make-icons.html
- [x] Screens: home, category, word, session (all modes), search, settings, progress (js/views/)

## Phase B — Data for the most important categories
- [x] Kitchen phrases & commands (with whenUrdu) + data/scenes.json role-plays (+ js/art/phrases.js)
- [x] Kitchen tools / utensils (+ js/art/tools.js)
- [x] Vegetables (js/art/vegetables.js + data/vegetables.json)
- [x] Spices & herbs (js/art/spices.js + data/spices.json)
- [x] Cooking actions (js/art/actions.js + data/actions.json)

## Phase C — Learning modes + spaced repetition
- [x] Browse + word detail (sound normal/slow, Urdu voice if available, example, record own voice in IndexedDB)
- [x] Flashcards, Listen & choose, Picture quiz, Kitchen talk + scenes
- [x] Leitner boxes, sessions of 10, Today auto-pick
- [x] Stars/progress bars, streak, celebration
- [x] Search
- [x] Code read-through of all modes against the final data

## Phase D — Remaining categories + pictures
- [x] js/art/categories.js (category icons)
- [x] Kitchen equipment, Cutting techniques, Measurements, Jobs & stations (art + data)
- [x] Fruits (emoji + js/art/food.js)
- [x] Meat, chicken & fish (notHalal badges; wine/beer/brandy/gelatine/lard also here)
- [x] Dairy & eggs
- [x] Grains, bread & store cupboard (oil, vinegar, sauces, nuts too)
- [x] Hygiene & safety
- [x] Taste & texture
- [x] 500+ items total — 613 words + 16 role-play scenes
- [x] TRANSLATIONS_TO_CHECK.md
- [x] Cross-check (by search, no scripts): the words use 543 distinct `art:` drawing keys and all exist in js/art/;
      the 544th drawing is the equipment category icon. No missing or unused drawings.

## Phase E — Validation, docs
- [x] package.json (only `"type": "module"` + two script shortcuts; no dependencies, not needed to run the app)
- [x] scripts/validate.js — written, NOT run
- [x] scripts/export-svgs.js — written, NOT run (optional)
- [x] Careful code read-through for bugs (fixed: `hidden` attribute overridden by CSS, a wrong import in
      equipment.js, auto-speech after leaving a screen, speech before the first tap, answer text inside
      cutting pictures, raspberry translation)
- [x] README.md, images/README.md
- [x] Final summary below + checklist for testing

## Phase F — Navigation / UX update (Aisha's 7 points)
- [x] First-visit welcome screen (اردو / English), saved as `welcomed`; reopen from Settings
- [x] Language toggle اردو | EN in the header on every screen (+ still in Settings)
- [x] Bottom nav: Home · Learn · Practice · Progress · Settings (icon + label, active = colour + bold + top line);
      during a practice session it is replaced by a big "✕ Stop practice" bar; it comes back on the celebration screen
- [x] Header = page icon + title (no more link underlines); Home/Search/Settings icons moved out of the header
- [x] Streak chip "🔥 3 days / 3 دن", tap = short explanation bubble
- [x] Settings: "Saved ✓" toast + big "Start practising →" button after any change
- [x] Home: big "Today's practice ▶️" first, then the sections. Learn tab = search box + all sections
- [x] sw.js VERSION → v2 (new files added to the cache list)
- [ ] Browser test at 360 px + desktop — NOT done: starting a local server was blocked by the permission settings

## Summary

**Done.** Everything in the original brief is built, as files only (no git, no terminal, nothing run).

- A complete, framework-free PWA: Urdu-first RTL interface (Noto Nastaliq, self-hosted) with an English
  switch, big buttons, one colour + icon per section, offline support, installable.
- **613 words in 15 sections + 16 role-play scenes**, Pakistani Urdu, Roman Urdu, pronunciation in Urdu
  letters, example sentences, levels 1–3, "when chefs say it" for all 80 phrases, not-halal badges.
- **Every word has a picture**: old-phone-safe emoji where good, otherwise one of 544 flat drawings in
  `js/art/` (same palette, rendered by the app, cached offline). Any picture can be swapped for a photo.
- Learning: Browse, word page with 🔊 / 🐢 / Urdu voice (hidden when the phone has none) / family voice
  recording, Flashcards, Listen & choose, Picture quiz, Kitchen talk + role-plays, Leitner 5 boxes,
  "Today" auto-pick of 10, stars, streak, confetti. Search in English / Urdu / Roman Urdu. Settings.

### Please check tomorrow (in this order)
1. **Run the checker:** `node scripts/validate.js` → fix anything it lists (it was never run).
2. **Open with Live Server**, press F12 → Console: there should be no red errors. If a drawing module has a
   typo, the whole app will not start — the console will name the file and line.
3. **Phone view 360 px** (F12 device toolbar): home, a section, a word page, each of the 5 modes, the
   celebration screen, search, settings, progress. Check that the Urdu text is not cut off at the top/bottom.
4. **Sound:** tap 🔊 and 🐢 on a word; check the English voice is British. Try on the real Android phone.
5. **Pictures:** scroll through every section and note any drawing that looks wrong or unclear —
   tell me the id (e.g. `act-braise`) and I will redraw it.
6. **Offline:** after one visit, F12 → Application → Service workers → tick "Offline", reload.
7. **Icons:** make the PNG icons with `scripts/make-icons.html` (see README) before "Add to Home screen".
8. **Translations:** let a family member go through `TRANSLATIONS_TO_CHECK.md` (14 words).
9. **Git:** the `.git` folder already exists (empty repo, local name "Aisha" + your Gmail as email).
   Keep it, or delete it and start fresh. No AI attribution was added anywhere.
