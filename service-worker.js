// AFSNIT 01 – Service worker
const CACHE_NAME = "tilbudsradar-dk-v1-3-0";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./css/theme.css",
  "./css/layout.css",
  "./css/components.css",
  "./js/app.js",
  "./js/config.js",
  "./js/data.js",
  "./js/geo.js",
  "./js/pwa.js",
  "./js/search.js",
  "./js/storage.js",
  "./js/theme.js",
  "./js/ui.js",
  "./js/providers/demoProvider.js",
  "./js/providers/providerManager.js",
  "./js/providers/tilbudsugenProvider.js",
  "./data/offers.json",
  "./data/stores.json",
  "./data/locations.json",
  "./assets/icons/icon-128.png",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png"
];

self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;

  event.respondWith(
    fetch(request).then(response => {
      const clone = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(request, clone)).catch(() => {});
      return response;
    }).catch(() => caches.match(request))
  );
});
