const CACHE_NAME = 'koma-v4-cache-v1';
const STATIC_ASSETS = [
  './',
  './index.html',          // Pastikan file utama bernama index.html
  './manifest.json',
  './service-worker.js',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap'
];

// Install event: cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// Activate event: cleanup old caches if needed
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      );
    })
  );
});

// Fetch event: cache with network fallback and dynamic caching for API
self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);

  // Dynamic caching for API requests (e.g., allorigins)
  if (requestUrl.origin === 'https://api.allorigins.win') {
    event.respondWith(
      caches.open('dynamic-cache').then(cache => {
        return fetch(event.request)
          .then(response => {
            cache.put(event.request, response.clone());
            return response;
          })
          .catch(() => {
            return cache.match(event.request);
          });
      })
    );
    return;
  }

  // For other requests, try cache first, then network
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request);
    })
  );
});
