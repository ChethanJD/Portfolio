const V = "site-v9";
const SHELL = ["/", "/browse.html", "/about.html", "/css/base.css"];
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(V).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== V).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin) return;
  if (e.request.headers.get("range")) return; // media streaming: never cache partial content
  if (/\.(mp4|webm|mp3)$/i.test(u.pathname)) return; // media files always go straight to network
  const isHTML = e.request.mode === "navigate" || /(\.html|\.json|\.xml|\/)$/.test(u.pathname) || !/\.[a-z0-9]+$/i.test(u.pathname);
  e.respondWith(isHTML
    ? fetch(e.request).then((r) => { const c = r.clone(); caches.open(V).then((cc) => cc.put(e.request, c)); return r; }).catch(() => caches.match(e.request))
    : caches.match(e.request).then((hit) => { const net = fetch(e.request).then((r) => { const c = r.clone(); caches.open(V).then((cc) => cc.put(e.request, c)); return r; }).catch(() => hit); return hit || net; }));
});
