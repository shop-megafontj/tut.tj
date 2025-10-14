const CACHE_NAME = 'tut-website-cache-v2';
const urlsToCache = [
    // --- HTML Pages ---
    '/',
    'index.html',
        'home.html',
        'manifest.json',
    'jadvalidarsi.html',
    'fakultet.html',
    'teachers_tut.html',
    'app.html',
    'http://asu.tut.tj/?option=login',
    'notifications.html',
    'view.html',
    'imtihon.html',
    'zametki.html',
    'contact.html',
    'profile.html',

    // --- Styles & Scripts ---
    'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap',
    'https://cdn.jsdelivr.net/npm/alpinejs@3.13.10/dist/cdn.min.js',
    'https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js',
    'https://www.gstatic.com/firebasejs/8.10.1/firebase-auth.js',
    'https://www.gstatic.com/firebasejs/8.10.1/firebase-database.js',

    // --- Images & Icons ---
    'logo.png',
    'logo1.jpg',
    'logo2.jpg',
    'logo3.jpg',
    'TUT.jpg',
    'teacher.png',
    'time-management.png',
    'books.png',
    'testing.png',
    'information.png',
    'workplace.png',
    'exam.png',
    'diary.png',
    'studying.png',
    'time.png',
    'tajikistan.png',
    'russia.png'
];

// Install event: open cache and add all specified URLs.
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch event: respond with cached resource if available, otherwise fetch from network.
self.addEventListener('fetch', event => {
    // We only want to cache GET requests.
    if (event.request.method !== 'GET') {
        return;
    }
    
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return response from cache
                if (response) {
                    return response;
                }

                // Not in cache - fetch from network
                return fetch(event.request).then(
                    networkResponse => {
                        // Check if we received a valid response
                        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                           // For third-party assets (like CDNs), the type will be 'opaque', which is fine.
                           // We just don't want to cache errors.
                           if(networkResponse.status !== 0 && networkResponse.type !== 'opaque') {
                               return networkResponse;
                           }
                        }

                        // IMPORTANT: Clone the response. A response is a stream
                        // and because we want the browser to consume the response
                        // as well as the cache consuming the response, we need
                        // to clone it so we have two streams.
                        const responseToCache = networkResponse.clone();

                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return networkResponse;
                    }
                );
            })
            .catch(() => {
                // If both cache and network fail, we can optionally return a fallback page.
                // For now, it will just result in a standard browser error.
            })
    );
});

// Activate event: clean up old caches.
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );

});
