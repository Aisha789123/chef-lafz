// Chef Lafz service worker: caches the whole app so it works offline after the first visit.
// After changing any file, increase VERSION so phones download the new version.
const VERSION = 'v3';
const CACHE = `chef-lafz-${VERSION}`;

const CORE = [
  './', 'index.html', 'manifest.json', 'css/app.css',
  'fonts/NotoNastaliqUrdu-arabic.woff2',
  'icons/icon.svg', 'icons/maskable.svg',
  'js/app.js', 'js/data.js', 'js/store.js', 'js/speech.js', 'js/i18n.js', 'js/ui.js', 'js/srs.js',
  'js/recorder.js', 'js/celebrate.js',
  'js/views/home.js', 'js/views/category.js', 'js/views/word.js', 'js/views/session.js',
  'js/views/search.js', 'js/views/settings.js', 'js/views/progress.js', 'js/views/learn.js', 'js/views/welcome.js',
  'js/art/index.js', 'js/art/kit.js', 'js/art/categories.js', 'js/art/phrases.js', 'js/art/tools.js',
  'js/art/vegetables.js', 'js/art/spices.js', 'js/art/actions.js', 'js/art/food.js', 'js/art/equipment.js',
  'js/art/cutting.js', 'js/art/measurements.js', 'js/art/jobs.js', 'js/art/hygiene.js', 'js/art/taste.js',
  'data/categories.json', 'data/scenes.json',
];
// Optional files: cached if they exist (PNG icons are made later with scripts/make-icons.html).
const OPTIONAL = ['icons/icon-192.png', 'icons/icon-512.png', 'icons/maskable-512.png'];

// On localhost / 127.0.0.1 (Live Server) this worker removes itself, so it never takes over other local projects.
const IS_LOCAL = ['localhost', '127.0.0.1', '[::1]'].includes(self.location.hostname);
if (IS_LOCAL) {
  self.addEventListener('install', () => self.skipWaiting());
  self.addEventListener('activate', (event) => {
    event.waitUntil((async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k.startsWith('chef-lafz-')).map((k) => caches.delete(k)));
      await self.registration.unregister();
      const wins = await self.clients.matchAll({ type: 'window' });
      wins.forEach((c) => c.navigate(c.url));
    })());
  });
}

self.addEventListener('install', (event) => {
  if (IS_LOCAL) return;
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(CORE);
    await Promise.allSettled(OPTIONAL.map((u) => cache.add(u)));
    // Word lists + any picture files they point to (photos / .svg files).
    const cats = await (await cache.match('data/categories.json')).json();
    const files = cats.map((c) => `data/${c.file}`);
    await cache.addAll(files);
    const images = new Set();
    for (const f of files) {
      try {
        const list = await (await cache.match(f)).json();
        list.forEach((it) => { if (/\.(svg|png|jpe?g|webp|gif|avif)$/i.test(it.image || '')) images.add(it.image); });
      } catch { /* ignore broken list */ }
    }
    await Promise.allSettled([...images].map((u) => cache.add(u)));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  if (IS_LOCAL) return;
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k.startsWith('chef-lafz-') && k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

// Cache first (fast + offline). Same-origin files missing from the cache are fetched and stored.
self.addEventListener('fetch', (event) => {
  if (IS_LOCAL) return;
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (req.mode === 'navigate') {
    event.respondWith(caches.match('index.html').then((r) => r || fetch(req)));
    return;
  }
  event.respondWith((async () => {
    const cached = await caches.match(req, { ignoreSearch: true });
    if (cached) return cached;
    try {
      const res = await fetch(req);
      if (res.ok) {
        const cache = await caches.open(CACHE);
        cache.put(req, res.clone());
      }
      return res;
    } catch (e) {
      return new Response('', { status: 504, statusText: 'offline' });
    }
  })());
});
