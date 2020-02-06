// Importing Workbox itself from Google CDN
importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

// Precaching and setting up the routing
workbox.precaching.precacheAndRoute([]);


self.addEventListener('push', event => {
    const body = event.data.text() || 'A little push';
    console.log(`Push received and had this data: "${event.data.text()}"`);

    const title = 'Notification';
    const options = {
        body: body,
    };

    self.registration.showNotification(title, options);

});

self.addEventListener('notificationclick', event => {
    console.log('Notification click Received.');

    event.notification.close();

    // We are calling event.waitUntil() again
    // to ensure the browser doesn't terminate
    // our service worker before our new window has been displayed.
});
