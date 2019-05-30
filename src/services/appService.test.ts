import createServiceWorkerEnv from "service-worker-mock";
// tslint:disable-next-line:no-submodule-imports

const g: any = global;
const s: any = self;

const createWorkboxMock = () => ({
  cacheableResponse: {
    Plugin: jest.fn()
  },
  core: {
    clientsClaim: jest.fn(),
    setCacheNameDetails: jest.fn(),
    skipWaiting: jest.fn()
  },
  expiration: {
    Plugin: jest.fn()
  },
  googleAnalytics: {
    initialize: jest.fn()
  },
  precaching: {
    precacheAndRoute: jest.fn()
  },
  routing: {
    registerRoute: jest.fn()
  },
  strategies: {
    CacheFirst: jest.fn(() => ({ strategy: "cacheFirst" })),
    NetworkFirst: jest.fn(() => ({ strategy: "networkFirst" })),
    NetworkOnly: jest.fn(() => ({ strategy: "networkOnly" }))
  }
});

describe("[service] App service worker", () => {
  const setup = (buildId: string) => {
    jest.resetAllMocks();

    g.importScripts = jest.fn();
    g.workbox = createWorkboxMock();
    g.serviceWorkerOption = {
      assets: ["/assets/file.jpg"],
      buildId,
      staticFiles: ["/static/file.js"]
    };
    g.indexedDB = {
      deleteDatabase: jest.fn()
    };
    g.fetch = () => Promise.resolve("success");

    Object.assign(global, createServiceWorkerEnv());
    jest.resetModules();

    require("./appService");
  };

  const getRegisterRouteParams = (name: string) => {
    const { calls } = g.workbox.routing.registerRoute.mock;
    const { buildId } = g.serviceWorkerOption;

    switch (name) {
      case "localNonPrecached":
        return buildId !== "development" ? calls[0] : undefined;

      case "staticGoogleApi":
        return buildId !== "development" ? calls[1] : calls[0];

      case "dynamicGoogleApi":
        return buildId !== "development" ? calls[2] : calls[1];
    }
  };

  describe("when in the development environment", () => {
    beforeEach(() => {
      setup("development");
    });

    it("configures WorkBox correctly", () => {
      expect(g.workbox.core.setCacheNameDetails).toHaveBeenCalledWith({
        prefix: "fighters.mynameisviii.com",
        suffix: "development"
      });
    });

    it("doesn't set up precaching", () => {
      expect(g.workbox.precaching.precacheAndRoute).toHaveBeenCalledTimes(0);
    });

    it("sets up Google Analytics caching", () => {
      expect(g.workbox.googleAnalytics.initialize).toHaveBeenCalledWith({
        cacheName: "fighters.mynameisviii.com-googleApis"
      });
    });

    it("registers the correct number of route handlers", () => {
      expect(g.workbox.routing.registerRoute).toHaveBeenCalledTimes(2);
    });

    it("sets up static Google API route handler correctly", () => {
      const params = getRegisterRouteParams("staticGoogleApi");

      expect(params[0].test("https://fonts.googleapis.com/test")).toBe(true);
      expect(params[1].strategy).toBe("cacheFirst");
    });

    it("sets up dynamic Google API route handler correctly", () => {
      const params = getRegisterRouteParams("dynamicGoogleApi");

      expect(params[0].test("https://maps.googleapis.com/test")).toBe(true);
      expect(params[1].strategy).toBe("networkOnly");
    });

    describe("when the service worker has activated", () => {
      it("deletes stale caches and notifies the application when a new version is available and an old version exists", async () => {
        const staleCaches = [
          "fighters.mynameisviii.com-precache-v2-stale",
          "fighters.mynameisviii.com-local-stale"
        ];
        const validCaches: string[] = Object.values(g.cacheNames);
        for (const cache of [...staleCaches, ...validCaches]) {
          await s.caches.open(cache);
        }

        const client = await s.clients.openWindow("/");
        client.postMessage = jest.fn();
        await s.trigger("activate");

        expect(Object.keys(s.caches.caches)).toEqual(validCaches);
        expect(client.postMessage).toHaveBeenCalledWith({
          type: "serviceWorker.activate"
        });
      });

      it("doesn't notify the application when a new version is available and an old version doesn't exist", async () => {
        const validCaches: string[] = Object.values(g.cacheNames);
        for (const cache of validCaches) {
          await s.caches.open(cache);
        }

        const client = await s.clients.openWindow("/");
        client.postMessage = jest.fn();
        await s.trigger("activate");

        expect(client.postMessage).not.toHaveBeenCalled();
      });
    });

    describe("when receiving messages from the application", () => {
      it("adds internal routes to the local cache on changeRoute", async () => {
        const payload = "/test";

        await s.onmessage(
          new MessageEvent("worker", {
            data: {
              payload,
              type: "changeRoute"
            }
          } as any)
        );

        const cache = s.snapshot().caches[g.cacheNames.local];

        expect(cache[payload]).toBe("success");
      });
    });
  });

  describe("when in the production environment", () => {
    beforeEach(() => {
      setup("production");
    });

    it("configures WorkBox correctly", () => {
      expect(g.workbox.core.setCacheNameDetails).toHaveBeenCalledWith({
        prefix: "fighters.mynameisviii.com",
        suffix: "production"
      });
    });

    it("sets up precaching correctly", () => {
      expect(g.workbox.precaching.precacheAndRoute).toHaveBeenCalledWith(
        [...g.serviceWorkerOption.assets, ...g.serviceWorkerOption.staticFiles],
        {
          cleanUrls: false
        }
      );
    });

    it("sets up local non-precached route handler correctly", () => {
      const request = {
        url: {
          host: self.location.host,
          pathname: "/not-precached"
        }
      };
      const params = getRegisterRouteParams("localNonPrecached");

      expect(params[0](request)).toBe(true);
      expect(params[1].strategy).toBe("cacheFirst");
    });

    it("sets up Google Analytics caching", () => {
      expect(g.workbox.googleAnalytics.initialize).toHaveBeenCalledWith({
        cacheName: "fighters.mynameisviii.com-googleApis"
      });
    });

    it("registers the correct number of route handlers", () => {
      expect(g.workbox.routing.registerRoute).toHaveBeenCalledTimes(3);
    });

    it("sets up static Google API route handler correctly", () => {
      const params = getRegisterRouteParams("staticGoogleApi");

      expect(params[0].test("https://fonts.googleapis.com/test")).toBe(true);
      expect(params[1].strategy).toBe("cacheFirst");
    });

    it("sets up dynamic Google API route handler correctly", () => {
      const params = getRegisterRouteParams("dynamicGoogleApi");

      expect(params[0].test("https://maps.googleapis.com/test")).toBe(true);
      expect(params[1].strategy).toBe("networkOnly");
    });

    describe("when the service worker has activated", () => {
      it("deletes stale caches and notifies the application when a new version is available and an old version exists", async () => {
        const staleCaches = [
          "fighters.mynameisviii.com-precache-v2-stale",
          "fighters.mynameisviii.com-local-stale"
        ];
        const validCaches: string[] = Object.values(g.cacheNames);
        for (const cache of [...staleCaches, ...validCaches]) {
          await s.caches.open(cache);
        }

        const client = await s.clients.openWindow("/");
        client.postMessage = jest.fn();
        await s.trigger("activate");

        expect(Object.keys(s.caches.caches)).toEqual(validCaches);
        expect(client.postMessage).toHaveBeenCalledWith({
          type: "serviceWorker.activate"
        });
      });

      it("doesn't notify the application when a new version is available and an old version doesn't exist", async () => {
        const validCaches: string[] = Object.values(g.cacheNames);
        for (const cache of validCaches) {
          await s.caches.open(cache);
        }

        const client = await s.clients.openWindow("/");
        client.postMessage = jest.fn();
        await s.trigger("activate");

        expect(client.postMessage).not.toHaveBeenCalled();
      });
    });

    describe("when receiving messages from the application", () => {
      it("adds internal routes to the local cache on changeRoute", async () => {
        const payload = "/test";

        await s.onmessage(
          new MessageEvent("worker", {
            data: {
              payload,
              type: "changeRoute"
            }
          } as any)
        );

        const cache = s.snapshot().caches[g.cacheNames.local];

        expect(cache[payload]).toBe("success");
      });
    });
  });
});
