const CACHE_NAME = "site-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/mytheme.js", // ඔබ භාවිතා කරන CSS/JS ගොනු මෙහි එකතු කරන්න
];

// Install: ගොනු Caching කිරීම
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)),
  );
});

// Fetch: වෙබ් පිටු පෙන්වීම
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request)),
  );
});
