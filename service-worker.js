// AFSNIT 01 – Simpel cache til GitHub Pages
// Opdateret: manuel søgning + brugerens eget app-ikon
const CACHE_NAME = "tilbudsradar-dk-v1-1-icon";
const ASSETS = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "css/theme.css",
  "css/layout.css",
  "css/components.css",
  "js/app.js",
  "js/config.js",
  "js/data.js",
  "js/geo.js",
  "js/search.js",
  "js/storage.js",
  "js/theme.js",
  "js/ui.js",
  "js/pwa.js",
  "data/offers.json",
  "data/stores.json",
  "data/locations.json",
  "data/categories.json",
  "assets/icons/icon.svg",
  "assets/icons/icon-128.png",
  "assets/icons/icon-192.png",
  "assets/icons/icon-512.png",
  "assets/icons/icon-128.ico"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});
