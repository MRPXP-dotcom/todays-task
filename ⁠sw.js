const CACHE_NAME = 'daily-mission-auto-v2';

// الملفات التي يجب حفظها وتخزينها ليعمل التطبيق وشعاره بكفاءة
const APP_FILES = [
    './',
    './index.html',
    './9368C532-D833-4080-AB32-CC3CEBB9E3B8.png'
];

// التثبيت وحفظ الأصول
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(APP_FILES);
        })
    );
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

// جلب التحديثات من الشبكة والرجوع للكاش عند انقطاعها
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    const requestURL = new URL(event.request.url);
    if (requestURL.origin !== self.location.origin) return;

    event.respondWith(
        fetch(event.request)
            .then((networkResponse) => {
                if (networkResponse && networkResponse.status === 200) {
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
