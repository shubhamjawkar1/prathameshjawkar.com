// Service Worker for Performance Optimization
const CACHE_NAME = 'prathamesh-portfolio-v1';
const STATIC_CACHE_NAME = 'static-v1';
const DYNAMIC_CACHE_NAME = 'dynamic-v1';

// Resources to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/critical.css',
  '/script.js',
  '/data/matches.json',
  '/data/banner.jpg',
  // Font files will be cached dynamically
];

// Install event - cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then(cache => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
      .catch(err => console.log('Cache install failed:', err))
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  // Handle static assets
  if (STATIC_ASSETS.includes(url.pathname)) {
    event.respondWith(
      caches.match(request)
        .then(response => {
          return response || fetch(request)
            .then(fetchResponse => {
              return caches.open(STATIC_CACHE_NAME)
                .then(cache => {
                  cache.put(request, fetchResponse.clone());
                  return fetchResponse;
                });
            });
        })
    );
    return;
  }

  // Handle images with cache-first strategy
  if (request.destination === 'image') {
    event.respondWith(
      caches.match(request)
        .then(response => {
          if (response) {
            return response;
          }
          return fetch(request)
            .then(fetchResponse => {
              // Only cache successful responses
              if (fetchResponse.status === 200) {
                const responseClone = fetchResponse.clone();
                caches.open(DYNAMIC_CACHE_NAME)
                  .then(cache => {
                    cache.put(request, responseClone);
                  });
              }
              return fetchResponse;
            });
        })
    );
    return;
  }

  // Handle fonts
  if (request.url.includes('fonts.googleapis.com') || 
      request.url.includes('fonts.gstatic.com') ||
      request.destination === 'font') {
    event.respondWith(
      caches.match(request)
        .then(response => {
          return response || fetch(request)
            .then(fetchResponse => {
              const responseClone = fetchResponse.clone();
              caches.open(DYNAMIC_CACHE_NAME)
                .then(cache => {
                  cache.put(request, responseClone);
                });
              return fetchResponse;
            });
        })
    );
    return;
  }

  // Handle API calls and external resources
  if (request.url.includes('youtube.com') || 
      request.url.includes('cdnjs.cloudflare.com')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Cache successful responses for external resources
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE_NAME)
              .then(cache => {
                cache.put(request, responseClone);
              });
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Default: try network first, then cache
  event.respondWith(
    fetch(request)
      .catch(() => caches.match(request))
  );
});

// Background sync for analytics (optional)
self.addEventListener('sync', event => {
  if (event.tag === 'analytics-sync') {
    event.waitUntil(
      // Handle offline analytics here if needed
      console.log('Background sync: analytics')
    );
  }
});

// Push notifications (optional for future use)
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'New update available!',
    icon: '/data/icon-192x192.png',
    badge: '/data/badge-72x72.png',
    actions: [
      {
        action: 'view',
        title: 'View',
        icon: '/data/view-icon.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/data/close-icon.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Prathamesh Portfolio', options)
  );
});

// Optimize cache size
const limitCacheSize = (name, size) => {
  caches.open(name)
    .then(cache => {
      cache.keys()
        .then(keys => {
          if (keys.length > size) {
            cache.delete(keys[0])
              .then(limitCacheSize(name, size));
          }
        });
    });
};

// Clean up caches periodically
setInterval(() => {
  limitCacheSize(DYNAMIC_CACHE_NAME, 50);
}, 300000); // Every 5 minutes
