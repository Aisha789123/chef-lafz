# Decisions

Choices made while building Chef Lafz, and why.

## Tech
- **No framework, no build step.** Plain HTML/CSS/ES modules. The app is a single page (`index.html`) with a tiny hash router (`#/home`, `#/cat/vegetables`, `#/word/veg-onion`, …). Hash routing works on GitHub Pages without any server config.
- **All paths are relative** (`./data/…`, `images/…`) so the app works from a sub-folder like `username.github.io/chef-lafz/`.
- **Font is self-hosted** (`fonts/NotoNastaliqUrdu-arabic.woff2`, Arabic-script subset only, ~240 KB, SIL Open Font Licence). Loading it from Google Fonts would break offline use on the first visit and adds a cross-origin request. English text uses the phone's system font (Roboto on Android), which is fast and very readable.
- **Service worker** pre-caches the whole app (HTML, CSS, JS, JSON, font, icons, all SVG pictures) on the first visit, so everything works offline afterwards. Cache name contains a version number; bump it in `sw.js` after changing files so phones download the new version.
- **Progress** lives in `localStorage` under one key (`chefLafz.v1`). Recorded voices live in IndexedDB (audio blobs are too big for localStorage).

## Content
- **Item fields**: `id, category, english, urdu, romanUrdu, englishInUrduScript, image, exampleSentence, exampleSentenceUrdu, level`. Optional: `needsCheck` (translation not 100% sure), `notHalal` (pork/alcohol), `whenUrdu` (for phrases: when chefs say it), `noteUrdu` (short extra explanation).
- **Example sentence** is stored as two flat fields (`exampleSentence` English, `exampleSentenceUrdu`) — easier for a family member to edit than a nested object.
- **Ids** are `<category-prefix>-<english-slug>`, e.g. `veg-onion`, `tool-chefs-knife`.
- **Urdu**: where Pakistani kitchens normally use the English word (fridge, oven, grill, sauce…), the Urdu field is the English word written in Urdu script, sometimes with the Urdu word in brackets.
- **Western herbs** (thyme, rosemary, oregano…) have no common Urdu name; the English name in Urdu script is used and they are marked `needsCheck` only where a real Urdu name might exist.

- **Category order on the home screen**: Kitchen phrases first (the most important), then tools, vegetables, spices, actions. "Today's practice" teaches new words from these 5 first.
- **Alcohol, gelatine and lard live in "Meat, chicken & fish"** (at the end of the list) with the ⚠️ "not halal" badge, next to pork, bacon and ham. There is no separate "drinks" category, and these are exactly the words he must recognise to know what is in a dish. Sausage is NOT marked (it can be halal) but has a note: "always ask: is it pork?".
- **"Grains, bread & baking" became "Grains, bread & store cupboard"** so that oil, olive oil, vinegar, stock, soy sauce, ketchup, mayonnaise, mustard, jam and nuts have a home.
- **British English** is used (courgette, aubergine, chips, tin opener, biscuit). Where the American word is different, a short Urdu note says so (e.g. "امریکہ میں: zucchini").
- **`englishInUrduScript` follows a British accent** (oven → اَوَن, salmon → سیمن). Silent letters are explained in notes (knead, lamb, half, hour, yolk).
- **Picture quiz answers are never written in the picture.** Drawings may show numbers or units (100 g, 75°C, 86) but not the English answer word. Exception: food labels "USE BY" / "BEST BEFORE", because recognising that printed text *is* the skill.
- **Translations not 100% sure** have `"needsCheck": true` and are listed in TRANSLATIONS_TO_CHECK.md (14 words). Example: "رس بھری" was deliberately NOT used for raspberry, because in Pakistan it usually means cape gooseberry.

## Pictures
- **Emoji only from Emoji 12 (2019) or older.** Cheap / old Android phones do not have newer emoji (🫑 bell pepper, 🫚 ginger, 🫛 peas, 🫘 beans…) and would show an empty box. Those items get an SVG instead.
- **SVG illustrations are drawn in code, in `js/art.js`**, from small building blocks (jar, leaf, pot, flame, knife, chef figure, speech bubble…). This gives every picture the same flat style and colour palette. In the JSON such a picture is written as `"image": "art:cumin"`. The app turns it into an inline SVG at runtime — no build step, and the drawings are cached offline with the JS file (one ~100 KB file instead of 350 separate image downloads, which is much faster on a slow connection).
  - Why not one `.svg` file per item? While building, no terminal/scripts could be run, so hundreds of files could not be generated. `scripts/export-svgs.js` is included: run `node scripts/export-svgs.js` once to write every drawing to `images/<category>/<id>.svg` and switch the JSON paths to those files, if you prefer real files.
- **The `image` field accepts three kinds of value**: an emoji (`"🧅"`), a drawing (`"art:cumin"`), or a file path (`"images/spices/cumin.jpg"`, `.svg`, `.png`, `.webp`). To use a real photo, drop the file in `images/<category>/` and change the `image` value. Nothing else changes.
- **App icons** are SVG (`icons/icon.svg`, `icons/maskable.svg`). PNG versions (192/512) are needed by some Android versions for "Add to home screen": open `scripts/make-icons.html` in the browser once and it downloads them; put them in `icons/`.
- Phrases are drawn as a chef with a speech bubble containing a symbol (✋ "behind", 🔥 "hot", etc.) so every phrase has its own recognisable picture.

## Learning
- **Leitner boxes (1–5)**. Wrong answer → box 1. Right answer → next box. A card is due again after: box 1 → same day, box 2 → 1 day, box 3 → 3 days, box 4 → 7 days, box 5 → 16 days.
- **Today's practice** picks 10 cards: first due cards (lowest box first), then new cards (level 1 first, phrases and tools before other categories), at most 5 new cards if there are due cards — so the session is never overwhelming.
- **Mode choice for "Today"**: the app rotates modes automatically per card (flashcard for new cards, then listen / picture quiz / kitchen talk for known ones), so he does not have to choose.
- **"Again" in flashcards** puts the card back at the end of the current session, so he sees it again a few cards later.
- **Never punishing**: wrong answers show the right answer with sound and a gentle "no problem, again" message; there are no lives, no red crosses, no lost points.
- **Stars per category**: ★ = 30% of words learned (box 3+), ★★ = 60%, ★★★ = 90%.
- **Streak**: counts days in a row with at least one finished session. Missing a day resets it to 1 on the next practice (no scary message).

## Sound
- English uses `speechSynthesis` with an `en-GB` voice when available, otherwise any English voice. Normal rate 0.85, slow 0.6 (both adjustable in Settings).
- Urdu speech button is shown only if the phone has a voice whose language starts with `ur`. Otherwise hidden silently.
- Family members can record their own voice for any word (🎙️ on the word screen). The recording is played instead of the robot Urdu voice. The 🎙️ button is **off by default** (Settings → "For family") so the learner's screen stays simple.
- Speech is only started after the first tap on the page (browser rule). Text in brackets is not read aloud ("Eighty-six (86)" is spoken as "Eighty-six").
- When the phone has no speech at all, the quiz screens show the English text instead, so every mode still works.

## Navigation (update)
- **Bottom navigation with 5 tabs** (Home, Learn, Practice, Progress, Settings), like WhatsApp. The header no longer holds navigation icons — only Back (on sub-pages), the page icon + title, the 🔥 streak and the اردو | EN switch. This frees space at 360 px and makes "where am I" obvious.
- **Search moved into the Learn tab** (search box above the sections). The old `#/search` link still works and opens Learn with the box focused.
- **During practice the bottom nav is hidden** and replaced by one big "✕ Stop practice" button, so he cannot leave a quiz by accident with a tab tap. The nav comes back on the celebration screen.
- **Welcome screen** shows on the first visit only (setting `welcomed`). Existing installs also see it once after this update — that is harmless and lets him pick the language.
- **Language switch redraws the current screen** instead of going Home, so he never loses his place.

## Working rules for this build
- No terminal commands and no git were used after the first few minutes (Aisha's rule). So nothing was run in a browser or with Node. `scripts/validate.js` and a browser test are the first things to do — see the checklist in PLAN.md.
