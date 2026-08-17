self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'Daily Mission';
    const options = {
        body: data.body || 'لديك مهمة الآن!',
        icon: '9368C532-D833-4080-AB32-CC3CEBB9E3B8.png'
    };
    event.waitUntil(self.registration.showNotification(title, options));
});

// التعامل مع النقر على الإشعار لفتح التطبيق
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            if (clientList.length > 0) {
                return clientList[0].focus();
            }
            return clients.openWindow('./');
        })
    );
});
