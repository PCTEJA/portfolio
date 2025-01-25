// Define a cache name
const CACHE_NAME = 'v1-cache';

// Define assets to pre-cache
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/assets/css/style.css',
  '/assets/js/main.js',
  '/assets/vendor/bootstrap/css/bootstrap.min.css',
  '/assets/vendor/jquery/jquery.min.js',
  '/assets/img/teja-profile.png',
  '/assets/img/favicon.png',
  // Add other essential files you want to cache
];

// Install event - cache the assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching files...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Fetch event - serve cached files if available, else fetch from network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached response if available, otherwise fetch from network
      return cachedResponse || fetch(event.request).then((response) => {
        // Optionally cache new files (only for GET requests)
        if (event.request.method === 'GET') {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, response.clone());
            return response;
          });
        }
        return response;
      });
    }).catch(() => {
      // Fallback for offline use (customize as needed)
      if (event.request.headers.get('accept').includes('text/html')) {
        return caches.match('/index.html');
      }
    })
  );
});
