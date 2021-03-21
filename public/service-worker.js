'use strict'

console.log('Service worker is ready!');

const FILES_TO_CACHE = [
  `/db.js`,
  `/index.html`,
  `/index.js`,
  `/index.css`,
  `/manifest.webmanifest`,
  `/icons/icon-192x192.png`
    `/icons/icon-512x512.png`
];

// The static cache and runtime cache... duh.
const STATIC_CACHE = `static-cache-v1`;

const RUNTIME_CACHE = `runtime-cache`;


// Install
self.addEventListener("install", function (evt) {
  evt.waitUntil(
    caches.open(STATIC_CACHE).then(cache => {
      cache.addAll(FILES_TO_CACHE);
      return console.log("Your files were pre-cached successfully!");
    })
  );

  self.skipWaiting();
});

self.addEventListener("activate", function (evt) {
  evt.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
            console.log("Removing old cache data", key);
            return caches.delete(key);
          }
        })
      );
    })
  );

  self.clients.claim();
});

// Fetch
self.addEventListener("fetch", function (evt) {
  // Cache successful requests to the API
  if (evt.request.url.includes("/api/")) {
    evt.respondWith(
      caches.open(DATA_CACHE_NAME).then(cache => {
        return fetch(evt.request)
          .then(response => {
            // If the response was good, clone it and store it in the cache.
            if (response.status === 200) {
              cache.put(evt.request.url, response.clone());
            }

            return response;
          })
          .catch(err => {
            // Network request failed, try to get it from the cache.
            return cache.match(evt.request);
          });
      }).catch(err => console.log(err))
    );

    return;
  }
  // Response
  evt.respondWith(
    caches.match(evt.request).then(function (response) {
      return response || fetch(evt.request);
    })
  );
});

