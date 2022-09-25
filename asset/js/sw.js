const BASE = location.protocol + '//' + location.host;
const PREFIX = 'V1';
const CACHED_FILES = [
    'https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css',
    BASE + '/public/css/accueil.css',
    BASE + '/public/images/favicon.ico',
];
self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil((async() => {
        const cache = await caches.open(PREFIX);
        await cache.addAll(['/offline', ...CACHED_FILES]);
    })());
    console.log(`${PREFIX}: Service Worker installed`);
});
self.addEventListener('activate', (event) => {
    clients.claim();
    event.waitUntil((async() => {
        const keys = await caches.keys();
        await Promise.all(
            keys.map((key) => {
                if (!key.includes(PREFIX)) {
                    return caches.delete(key);
                }
            })
        );
    })());
    console.log(`${PREFIX}: Service Worker activated`);
});

self.addEventListener('fetch', (event) => {
    //console.log(`${PREFIX} Fetching ${event.request.url}, Mode = ${event.request.mode}`);
    if (event.request.mode == 'navigate') {
        event.respondWith((async() => {
            try {
                const preloadResponse = await event.preloadResponse;
                if (preloadResponse) {
                    return preloadResponse;
                }
                return await fetch(event.request);
            } catch (e) {
                const cache = await caches.open(PREFIX);
                return await cache.match('/offline');
            }
        })());
    } else if (CACHED_FILES.includes(event.request.url)) {
        event.respondWith(caches.match(event.request));
    }
});