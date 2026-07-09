/* RACHA · service worker — cache-first del shell para que abra sin internet */
const CACHE = 'racha-v48';
const ASSETS = [
  './', './index.html',
  './css/styles.css',
  './js/store.js', './js/data.js', './js/ui.js', './js/media.js', './js/q.js', './js/forms.js',
  './js/views-landing.js', './js/views-academia.js', './js/views-dash.js', './js/views-coach.js', './js/views-inicio.js', './js/views-snowball.js', './js/views-plan.js',
  './js/app.js',
  './icon.svg', './manifest.json',
];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (u.origin !== location.origin) return; // deja pasar fuentes/cdn
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
      const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
      return res;
    }).catch(() => caches.match('./index.html')))
  );
});
