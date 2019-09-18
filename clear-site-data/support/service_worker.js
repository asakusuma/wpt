
self.addEventListener('install', () => {
  return self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (url.pathname.match('sw-page')) {
    e.respondWith(new Response('from-service-worker'));
  }
});