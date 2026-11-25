# Chef Lafz · شیف لفظ

**Chef Lafz** ("lafz" = word in Urdu) is a small web app that teaches the English words a beginner chef
needs in a professional kitchen — with **pictures, sound and Urdu**.

It was made for a young cook in Pakistan who reads Urdu, is learning English, and wants to work in a
kitchen abroad. So the app:

- shows a **picture** for every word,
- **speaks** every word and example sentence (normal and slow),
- explains everything in **Urdu** (the interface can switch to English),
- uses **repetition** (spaced repetition with 5 boxes) so hard words come back often,
- works on a **cheap Android phone**, also **offline** after the first visit,
- needs **no login** — progress is saved on the phone.

## What is inside

- **613 words** in 15 sections: kitchen phrases, tools, vegetables, spices & herbs, cooking actions,
  meat/chicken/fish, dairy & eggs, grains & store cupboard, fruits, equipment, cutting techniques,
  measurements & temperature, kitchen jobs & stations, hygiene & safety, taste & texture.
- **16 role-play scenes** ("The chef asks for 2 kg of diced onions — what do you answer?").
- Every kitchen phrase has a short Urdu explanation of **when chefs say it**.
- Pork, bacon, ham, lard, gelatine and alcohol used in cooking have a small **⚠️ not halal** badge.
- Learning modes: **Browse**, **Flashcards**, **Listen & choose**, **Picture quiz**, **Kitchen talk**, and a
  **Today** button that picks the best 10 cards automatically.
- Stars and a progress bar per section, a daily streak 🔥, and a celebration after each session.
- Search in English, Urdu or Roman Urdu.
- Settings: app language, voice speed, show/hide Roman Urdu, record your own Urdu voice, reset progress.

## Screenshots

_Add screenshots here after you open the app on a phone (for example `docs/home.png`)._

| Home | Word | Flashcard | Quiz |
|---|---|---|---|
| ![Home](docs/home.png) | ![Word](docs/word.png) | ![Flashcard](docs/flashcard.png) | ![Quiz](docs/quiz.png) |

## Run it on your computer

The app is plain HTML, CSS and JavaScript. There is **nothing to install and nothing to build**.

It must be opened through a small local web server (not by double-clicking `index.html`), because the
browser does not allow loading the word lists from `file://`.

**Easiest way — VS Code + Live Server**

1. Install [Visual Studio Code](https://code.visualstudio.com/).
2. In VS Code, open the **Extensions** panel and install **Live Server** (by Ritwick Dey).
3. Open the `Chef Lafz` folder in VS Code.
4. Right-click `index.html` → **Open with Live Server**. The app opens in your browser.
5. To see it like on a phone: press `F12` → click the phone icon (device toolbar) → choose a 360 px wide phone.

(If you have Python: run `python -m http.server` in the folder and open http://localhost:8000.)

## Put it online with GitHub Pages (free)

1. Make a free account on [github.com](https://github.com) if you do not have one.
2. Click **New repository**. Name it, for example, `chef-lafz`. Choose **Public**. Click **Create repository**.
3. Upload the files:
   - Easiest: on the new repository page click **uploading an existing file**, drag **all files and folders**
     from the `Chef Lafz` folder into the page (not the folder itself — its contents), then click **Commit changes**.
   - Or with git: `git init`, `git add .`, `git commit -m "Chef Lafz"`, then follow the commands GitHub shows
     under "…or push an existing repository from the command line".
4. In the repository, go to **Settings → Pages**.
5. Under **Build and deployment → Source** choose **Deploy from a branch**. Branch: **main**, folder: **/ (root)**. Click **Save**.
6. Wait 1–2 minutes and refresh. GitHub shows the address, for example
   `https://YOUR-NAME.github.io/chef-lafz/`.
7. Open that address on the phone in **Chrome**. Use the menu **⋮ → Add to Home screen** (or "Install app").
   Now it opens like a normal app and works without internet.

All paths in the app are relative, so it works in a sub-folder like `/chef-lafz/`.

**After you change something:** open `sw.js` and change `const VERSION = 'v1'` to `'v2'` (then `'v3'`, …).
Otherwise phones keep showing the old saved version.

### App icons (PNG)

The icons are SVG (`icons/icon.svg`, `icons/maskable.svg`). Some Android versions also want PNG icons for
"Add to home screen". Open `scripts/make-icons.html` with Live Server, press the button, put the 3 downloaded
PNG files in `icons/`, and add the lines shown on that page to `manifest.json`.

## Add or change words

All words are in the `data/` folder — **one JSON file per section** (`data/vegetables.json`, …).
Each word is **one line**:

```json
{"id":"veg-onion","category":"vegetables","english":"Onion","urdu":"پیاز","romanUrdu":"pyaaz","englishInUrduScript":"اَنیَن","image":"🧅","exampleSentence":"Peel and chop the onions.","exampleSentenceUrdu":"پیاز چھیل کر کاٹو۔","level":1}
```

| Field | What it is |
|---|---|
| `id` | Unique name. Start with the section prefix (`veg-`, `tool-`, `phr-`, `spice-`, `act-`, `meat-`, `dairy-`, `grain-`, `fruit-`, `equip-`, `cut-`, `meas-`, `job-`, `hyg-`, `taste-`). Only `a-z`, `0-9` and `-`. |
| `category` | The section id (same as the file name without `.json`). |
| `english` | The English word or phrase. |
| `urdu` | The Urdu word used in Pakistan (Urdu letters). |
| `romanUrdu` | The Urdu in English letters, e.g. `pyaaz`. |
| `englishInUrduScript` | How to **say** the English word, written in Urdu letters, e.g. knife → `نائف`. |
| `image` | An emoji (`"🧅"`), a drawing (`"art:veg-onion"`) or a picture file (`"images/vegetables/onion.jpg"`). |
| `exampleSentence` | A short kitchen sentence in English. |
| `exampleSentenceUrdu` | The same sentence in Urdu. |
| `level` | `1` = most important, `2`, `3` = less important. |
| `whenUrdu` | **Phrases only:** when do chefs say this (Urdu). |
| `noteUrdu` | Optional extra tip in Urdu. |
| `notHalal` | Optional: `true` shows the ⚠️ not-halal badge. |
| `needsCheck` | Optional: `true` = translation not sure yet (see `TRANSLATIONS_TO_CHECK.md`). |

Remember the commas: every line ends with `,` except the last one before `]`.

Role-play scenes are in `data/scenes.json` (`answer` is the number of the correct option, `0` = first).

### Check your changes

If you have [Node.js](https://nodejs.org/) installed, run in the project folder:

```
node scripts/validate.js
```

It checks that every word has all fields, that no id is used twice, and that every picture exists.
(You can also paste a JSON file into [jsonlint.com](https://jsonlint.com) to find a missing comma.)

## Change a picture (use a real photo)

1. Put the photo in the `images/` folder, for example `images/spices/cumin.jpg`
   (JPG, PNG, WebP or SVG; square pictures look best; keep them small, under 100 KB).
2. In `data/spices.json`, find the word and change its `image`:
   `"image":"art:spice-cumin"` → `"image":"images/spices/cumin.jpg"`
3. Change `VERSION` in `sw.js` (see above). Done.

**About the drawings:** pictures written as `art:…` are simple drawings made with code in `js/art/`
(one file per section, all using the same colours from `js/art/kit.js`). The app draws them itself, so they
load fast and work offline. If you prefer separate `.svg` files (for example to edit them in Inkscape), run
`node scripts/export-svgs.js --switch` once: it writes every drawing to `images/<section>/<id>.svg` and
updates the JSON files.

## Record your own Urdu voice (for family)

Phones often have no Urdu voice. In **Settings ⚙️** turn on *"For family: button to record Urdu voice"*.
Now every word page has a 🎙️ button: press it, say the word in Urdu, press ⏹️. The recording is saved on
that phone and played with the 🗣️ button. (Recordings stay on the phone; they are not uploaded.)

## Files

```
index.html            the app page
manifest.json, sw.js  "install as app" + offline support
css/app.css           all styles
js/                   app code (app.js = start + screen router, srs.js = spaced repetition, …)
js/views/             one file per screen
js/art/               the drawings
data/                 the words (one JSON file per section) + scenes.json
fonts/                Noto Nastaliq Urdu font (for offline use)
icons/                app icons
images/               put your own photos here
scripts/              validate.js, export-svgs.js, make-icons.html
DECISIONS.md          why things are built this way
TRANSLATIONS_TO_CHECK.md   Urdu words a family member should check
```

## Credits

- **Font:** [Noto Nastaliq Urdu](https://github.com/notofonts/nastaliq) by the Noto Project Authors,
  SIL Open Font License 1.1 (see `fonts/OFL.txt`).
- **Emoji** are shown by the phone's own emoji font.
- **Drawings and icons** were made for this project (no outside images are used).
- **Voices** come from the phone (Web Speech API).
