const { assets, buildId, staticFiles } = serviceWorkerOption;

const CACHE_PREFIX = "fighters.mynameisviii.com";
const cacheNames = {
  googleApis: `${CACHE_PREFIX}-googleApis`,
  local: `${CACHE_PREFIX}-local-${buildId}`,
  precache: `${CACHE_PREFIX}-precache-v2-${buildId}`,
};

const precacheUrls = [].concat(assets, staticFiles);

const isCacheValid = (key) => {
  for (const name in cacheNames) {
    if (cacheNames[name] === key) {
      return true;
    }
  }

  return false;
};

importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js"
);

workbox.core.setCacheNameDetails({
  prefix: CACHE_PREFIX,
  suffix: buildId,
});

workbox.core.skipWaiting();
workbox.core.clientsClaim();

if (buildId !== "development") {
  workbox.precaching.precacheAndRoute(precacheUrls, {
    cleanUrls: false,
  });

  // Local cache-first requests
  workbox.routing.registerRoute(
    (request) =>
      request.url.host === self.location.host &&
      !precacheUrls.includes(request.url.pathname),
    new workbox.strategies.CacheFirst({
      cacheName: cacheNames.local,
      plugins: [
        new workbox.cacheableResponse.Plugin({
          statuses: [0, 200],
        }),
        new workbox.expiration.Plugin({
          maxAgeSeconds: 2 * 60 * 60,
        }),
      ],
    })
  );
}

workbox.googleAnalytics.initialize({
  cacheName: cacheNames.googleApis,
});

// Static content requests from Google APIs
workbox.routing.registerRoute(
  new RegExp("https://(?:fonts).(?:googleapis|gstatic).com/(.*)"),
  new workbox.strategies.CacheFirst({
    cacheName: cacheNames.googleApis,
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
    ],
  })
);

// Dynamic content requests from Google APIs
workbox.routing.registerRoute(
  new RegExp("https://(?:maps).(?:googleapis|gstatic).com/(.*)"),
  new workbox.strategies.NetworkOnly({
    cacheName: cacheNames.googleApis,
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
    ],
  })
);

self.addEventListener("activate", (event) => {
  // Cleanup redundant caches
  event.waitUntil(
    caches.keys().then((keys) => {
      let hasDeletedCaches = false;

      keys.forEach((key) => {
        if (!isCacheValid(key)) {
          caches.delete(key);
          indexedDB.deleteDatabase(key);
          hasDeletedCaches = true;
        }
      });

      // Notify client that a new version is available, when an old version exists
      if (hasDeletedCaches) {
        self.clients.matchAll().then((clients) => {
          clients.forEach((client) => {
            client.postMessage({
              type: "serviceWorker.activate",
            });
          });
        });
      }
    })
  );
});

// Handle postMessage requests from the application
self.onmessage = (message) => {
  if (message.data.type === "changeRoute") {
    return caches
      .open(cacheNames.local)
      .then((cache) => cache.add(message.data.payload));
  }
};
