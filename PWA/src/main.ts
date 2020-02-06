import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import { register } from 'register-service-worker';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .then(() => {
    registerServiceWorker()
  });

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    Notification.requestPermission()
      .then((result) => {
        if (result === 'denied') {
          console.log('Permission wasn\'t granted. Allow a retry.');
          return;
        }
        if (result === 'default') {
          console.log('The permission request was dismissed.');
          return;
        }

        // if granted permission => register my service worker
        navigator.serviceWorker.register('sw.js')
          .then(reg => {
            console.log('[App] Successful service worker registration', reg);
          })
          .catch(err =>
            console.error('[App] Service worker registration failed', err)
          );

      })
      .catch(console.error);
  } else {
    console.error('[App] Service Worker API is not supported in current browser');
  }
}

// function registerServiceWorker() {
//   if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.register('/sw.js')
//       .then(reg => {
//         console.log('[App] Successful service worker registration', reg);
//       })
//       .catch(err =>
//         console.error('[App] Service worker registration failed', err)
//       );
//   } else {
//     console.error('[App] Service Worker API is not supported in current browser');
//   }
// }

// platformBrowserDynamic()
//   .bootstrapModule(AppModule)
//   .then(() => {
//     register('/sw.js', {
//       registrationOptions: { scope: './' },
//       ready (registration) {
//         console.log('Service worker is active.')
//       },
//       registered (registration) {
//         console.log('Service worker has been registered.')
//       },
//       cached (registration) {
//         console.log('Content has been cached for offline use.')
//       },
//       updatefound (registration) {
//         console.log('New content is downloading.')
//       },
//       updated (registration) {
//         console.log('New content is available; please refresh.')
//       },
//       offline () {
//         console.log('No internet connection found. App is running in offline mode.')
//       },
//       error (error) {
//         console.error('Error during service worker registration:', error)
//       }
//     })
//   })