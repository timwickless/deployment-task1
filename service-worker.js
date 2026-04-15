const CACHE_NAME = "bike-shop-cache-v2";

// Caching all my resources.
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        "/index.html",
        "/styles.css",
        "/images/bike_1.jpg",
        "/images/bike_2.jpg",
        "/images/bike_3.jpg",
        "/images/bike_4.jpg",
      ]);
    }),
  );
});

// Fetching my cache.
self.addEventListener("fetch", (event) => {
  // Always fetch JS files fresh from network
  if (event.request.url.endsWith(".js")) {
    event.respondWith(fetch(event.request));
    return;
  }

  // For other files, use cache first
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }),
  );
});

// Clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
});
