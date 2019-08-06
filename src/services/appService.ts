// @ts-ignore
const g: any = global;
const s: any = self;
const { assets, buildId, staticFiles } = g.serviceWorkerOption;

g.CACHE_PREFIX = "fighters.mynameisviii.com";
g.cacheNames = {
  googleApis: `${g.CACHE_PREFIX}-googleApis`,
  local: `${g.CACHE_PREFIX}-local-${buildId}`,
  precache: `${g.CACHE_PREFIX}-precache-v2-${buildId}`
};

g.precacheUrls = [...assets, ...staticFiles];

const isCacheValid = (key: string) => Object.values(g.cacheNames).includes(key);

g.importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js"
);

g.workbox.core.setCacheNameDetails({
  prefix: g.CACHE_PREFIX,
  suffix: buildId
});

g.workbox.core.skipWaiting();
g.workbox.core.clientsClaim();

if (buildId !== "development") {
  g.workbox.precaching.precacheAndRoute(g.precacheUrls, {
    cleanUrls: false
  });

  // Local cache-first requests
  g.workbox.routing.registerRoute(
    ({ url }: any) =>
      url.host === self.location.host && !g.precacheUrls.includes(url.pathname),
    new g.workbox.strategies.CacheFirst({
      cacheName: g.cacheNames.local,
      plugins: [
        new g.workbox.cacheableResponse.Plugin({
          statuses: [0, 200]
        }),
        new g.workbox.expiration.Plugin({
          maxAgeSeconds: 2 * 60 * 60
        })
      ]
    })
  );
}

g.workbox.googleAnalytics.initialize({
  cacheName: g.cacheNames.googleApis
});

// Static content requests from Google APIs
g.workbox.routing.registerRoute(
  new RegExp("https://(?:fonts).(?:googleapis|gstatic).com/(.*)"),
  new g.workbox.strategies.CacheFirst({
    cacheName: g.cacheNames.googleApis,
    plugins: [
      new g.workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      })
    ]
  })
);

// Dynamic content requests from Google APIs
g.workbox.routing.registerRoute(
  new RegExp("https://(?:maps).(?:googleapis|gstatic).com/(.*)"),
  new g.workbox.strategies.NetworkOnly({
    cacheName: g.cacheNames.googleApis,
    plugins: [
      new g.workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      })
    ]
  })
);

self.addEventListener("activate", async (event: any) => {
  // Cleanup redundant caches
  event.waitUntil(
    caches.keys().then(async keys => {
      let hasDeletedCaches = false;
      keys.forEach(key => {
        if (!isCacheValid(key)) {
          caches.delete(key);
          indexedDB.deleteDatabase(key);
          hasDeletedCaches = true;
        }
      });

      // Notify client that a new version is available, when an old version exists
      if (hasDeletedCaches) {
        const clients = await s.clients.matchAll();
        clients.forEach((client: any) => {
          client.postMessage({
            type: "serviceWorker.activate"
          });
        });
      }
    })
  );
});

// Handle postMessage requests from the application
self.onmessage = message => {
  switch (message.data.type) {
    case "changeRoute":
      return caches
        .open(g.cacheNames.local)
        .then(cache => cache.add(message.data.payload));
  }
};
