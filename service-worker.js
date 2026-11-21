/* JOS STAGING PWA Service Worker — isolated from production */
self.addEventListener("install", (event) => { self.skipWaiting(); });
self.addEventListener("activate", (event) => { event.waitUntil(self.clients.claim()); });
self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET" || request.mode !== "navigate") return;
  const requestUrl = new URL(request.url);
  if (requestUrl.origin !== self.location.origin) return;
  const appRoot = new URL("./", self.registration.scope);
  const appPath = appRoot.pathname;
  if (requestUrl.pathname !== appPath && requestUrl.pathname !== new URL("index.html", appRoot).pathname) return;
  event.respondWith((async () => {
    const maintenanceUrl = new URL("maintenance.html", appRoot);
    try {
      const response = await fetch(request);
      if (response.ok) return response;
      if (response.status === 404 || response.status >= 500) {
        try { const fallback = await fetch(maintenanceUrl, { cache: "no-store" }); if (fallback.ok) return fallback; } catch (_) {}
      }
      return response;
    } catch (_) {
      try { const fallback = await fetch(maintenanceUrl, { cache: "no-store" }); if (fallback.ok) return fallback; } catch (_) {}
      return new Response("JOS STAGING sedang tidak dapat diakses. Periksa koneksi internet.", {status:503,headers:{"Content-Type":"text/plain; charset=utf-8"}});
    }
  })());
});
