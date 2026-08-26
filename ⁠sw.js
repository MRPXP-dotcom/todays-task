const CACHE_NAME = 'daily-mission-auto-v1';

const APP_FILES = [
    './',
    './index.html',
    './9368C532-D833-4080-AB32-CC3CEBB9E3B8.png'
];

// التثبيت
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

// التفعيل وتنظيف الإصدارات القديمة
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((cache) => cache !== CACHE_NAME)
                    .map((cache) => caches.delete(cache))
            );
        })
    );

    self.clients.claim();
});

// تحديث من الإنترنت، والرجوع للكاش عند انقطاعه
self.addEventListener('fetch', (event) => {

    if (event.request.method !== 'GET') {
        return;
    }

    const requestURL = new URL(event.request.url);

    // نتعامل فقط مع ملفات نفس موقع Daily Mission
    if (requestURL.origin !== self.location.origin) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then((networkResponse) => {

                if (
                    networkResponse &&
                    networkResponse.status === 200
                ) {
                    const responseClone = networkResponse.clone();

                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }

                return networkResponse;
            })
            .catch(() => {
                return caches.match(event.request);
            })
    );
});
