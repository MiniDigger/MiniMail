import { clientsClaim } from "workbox-core";
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from "workbox-precaching";
import { NavigationRoute, registerRoute } from "workbox-routing";

declare let self: ServiceWorkerGlobalScope;

console.log("hello sw.ts");

// self.__WB_MANIFEST is default injection point
precacheAndRoute(self.__WB_MANIFEST);

// clean old assets
cleanupOutdatedCaches();

let allowlist: undefined | RegExp[];
if (import.meta.env.DEV) allowlist = [/^\/$/];

// to allow work offline
// registerRoute(new NavigationRoute(createHandlerBoundToURL("/pwatest"), { allowlist }));

self.skipWaiting();
clientsClaim();

self.addEventListener("push", (event) => {
  console.log("push notification received", event);
  let data = { title: "Test", content: "Fallback message" };
  if (event.data) {
    data = JSON.parse(event.data.text());
  }

  let options = {
    body: data.content,
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});
