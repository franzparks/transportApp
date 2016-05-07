(global => {
  'use strict';

  // Load the sw-toolbox library.
  importScripts('/bower_components/sw-toolbox/sw-toolbox.js');

   // Turn on debug logging, visible in the Developer Tools' console.
  global.toolbox.options.debug = true;


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

  
  // Ensure that our service worker takes control of the page as soon as possible.
  global.addEventListener('install', event => event.waitUntil(global.skipWaiting()));
  global.addEventListener('activate', event => event.waitUntil(global.clients.claim()));

})(self);