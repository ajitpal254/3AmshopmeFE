// FORCE UNREGISTER SERVICE WORKER
// This file has been updated to kill any existing service workers and clear the cache.

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    console.log('Deleting cache:', cacheName);
                    return caches.delete(cacheName);
                })
            );
        }).then(() => {
            console.log('Service Worker caches cleared.');
            return self.clients.matchAll();
        }).then((clients) => {
            clients.forEach(client => {
                client.postMessage({
                    type: 'SKIP_WAITING',
                    payload: 'Service Worker Unregistered'
                });
            });
            return self.registration.unregister();
        })
    );
});
