// service-worker.js
const CACHE_NAME = 'koma-v3-cache-v1';
const urlsToCache = [
  './',
  './KoMA V3.html',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
      .catch(function() {
        // If both cache and network fail, maybe return a fallback
        if (event.request.url.indexOf('https://api.allorigins.win') !== -1) {
          return new Response(JSON.stringify({
            error: 'You are offline and this resource is not cached.'
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        }
      })
  );
});