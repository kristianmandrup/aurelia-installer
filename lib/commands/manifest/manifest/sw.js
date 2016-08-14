// Use a cacheName for cache versioning
var cacheName = 'v1:static';

// During the installation phase, you'll usually want to cache static assets.
self.addEventListener('install', function(e) {
    // Once the service worker is installed, go ahead and fetch the resources to make this work offline.
    e.waitUntil(
        caches.open(cacheName).then(function(cache) {
            return cache.addAll([
                './scripts/vendor-bundle.js',
                './offline.html'
            ]).then(function() {
                self.skipWaiting();
            });
        })
    );
});

// when the browser fetches a URL…
self.addEventListener('fetch', function(event) {
    // … either respond with the cached object or go ahead and fetch the actual URL
    event.respondWith(
        caches.match(event.request).then(function(response) {
            if (response) {
                // retrieve from local cache

                return response;
            }
            // fetch as normal
            return fetch(event.request);
        })
    );
});

// Background Sync
// - https://dbwriteups.wordpress.com/2015/11/16/service-workers-part-4-background-sync/
// Android support: http://www.androidbeat.com/2016/03/chrome-49-for-android-goes-live-with-improved-background-sync-support-for-smart-beacons/

// event handler that will be invoked when the one time sync event fires.
self.addEventListener('sync', function(event) {

    if (event.tag == "oneTimeSync") {
        console.log('One Time Sync event fired: ', self.registration);
    }
});

// function that will be invoked on periodic sync
self.addEventListener('periodicsync', function(event) {
    if (event.registration.tag == "periodicSync") {
        console.log("Periodic sync event occurred: ", event);
    }
});

