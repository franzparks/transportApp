(global => {
  'use strict';

  // Load the sw-toolbox library.
  importScripts('/bower_components/sw-toolbox/sw-toolbox.js');
  
  // Ensure that our service worker takes control of the page as soon as possible.
  global.addEventListener('install', event => event.waitUntil(global.skipWaiting()));
  global.addEventListener('activate', event => event.waitUntil(global.clients.claim()));
  // The route for any requests from the googleapis origin
  toolbox.router.get('/(.*)', global.toolbox.cacheFirst, {
    cache: {
      name: '511apis',
      maxEntries: 10,
      maxAgeSeconds: 86400
    },
    origin: /\.crossorigin\.me$/
  });
  global.toolbox.options.debug = true;
})(self);