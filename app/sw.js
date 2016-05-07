(global => {
  'use strict';

  // Load the sw-toolbox library.
  importScripts('/bower_components/sw-toolbox/sw-toolbox.js');

   // Turn on debug logging, visible in the Developer Tools' console.
  global.toolbox.options.debug = true;

   // The route for the images
  /*toolbox.router.get('/my511/(.*)', global.toolbox.cacheFirst, {
    cache: {
          name: 'svg',
          maxEntries: 10,
          maxAgeSeconds: 86400 // cache for a day
        }
  });*/

  // The route for any requests from the googleapis origin
  toolbox.router.get('/(.*)', global.toolbox.cacheFirst, {
    cache: {
      name: 'trans-apis',
      maxEntries: 10,
      maxAgeSeconds: 86400 // cache for a day
    },
    origin: /\.crossorigin\.*$/,
    // Set a timeout threshold of 2 seconds
    networkTimeoutSeconds: 2
  });

  // By default, all requests that don't match our custom handler will use the toolbox.networkFirst
  // cache strategy, and their responses will be stored in the default cache.
  //global.toolbox.router.default = global.toolbox.networkFirst;
  
  // Ensure that our service worker takes control of the page as soon as possible.
  global.addEventListener('install', event => event.waitUntil(global.skipWaiting()));
  global.addEventListener('activate', event => event.waitUntil(global.clients.claim()));

  
  // The route for any requests from the googleapis origin
  /*toolbox.router.get('https://crossorigin.me/http://services.my511.org/Transit2.0/GetRoutesForAgency.aspx?token=aa7c0359-0ffc-401d-8d37-e933604e8e38&agencyName=BART'
    , toolbox.cacheFirst, {
    cache: {
      name: '511apis',
      maxEntries: 80,
      maxAgeSeconds: 86400
    },
    origin: 'http://localhost:9000/'
  }); */


})(self);