/* ================================================================
   Storm Ranger service worker
   ----------------------------------------------------------------
   Goal: the app installs to a home screen and still opens with no
   signal, without ever showing you a stale sky.

   Two rules do all the work:

   1. The PAGE ITSELF is network-first. Ask the network, and only fall
      back to the cached copy when that fails. A cache-first page would
      pin whoever already visited to whatever version they saw first,
      and they would keep getting the old app on every visit until this
      file's CACHE name changed. For a weather app that is the worst
      kind of bug: silent, and it looks like the app is just wrong.

   2. LIVE DATA is never cached. Radar, forecast, warnings and tides all
      come from other origins, and those requests pass straight through
      untouched. Showing yesterday's radar is worse than showing none.

   Icons and the manifest are cache-first, because they never change
   without a filename change.
   ================================================================ */

const CACHE = 'storm-ranger-v2';

// The static files that make up the app shell.
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png'
];

// Install: pre-cache the shell, and take over without waiting for the
// old worker to be released.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(SHELL)).catch(() => {})
  );
  self.skipWaiting();
});

// Activate: drop caches from older versions of this worker.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  let sameOrigin = false;
  try { sameOrigin = new URL(req.url).origin === self.location.origin; }
  catch (e) { return; }

  // Live weather and tide APIs live on other origins: hands off.
  if (!sameOrigin) return;

  // The page: network first, cache only as the offline fallback.
  if (req.mode === 'navigate' || (req.destination === 'document')) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put('./index.html', copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match('./index.html').then((hit) => hit || caches.match('./')))
    );
    return;
  }

  // Everything else of ours (icons, manifest): cache first.
  event.respondWith(
    caches.match(req).then((hit) => hit || fetch(req).then((res) => {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
      return res;
    }))
  );
});
