(global => {
  'use strict';

  // Load the sw-toolbox library.
  importScripts('/bower_components/sw-toolbox/sw-toolbox.js');

   // Turn on debug logging, visible in the Developer Tools' console.
  global.toolbox.options.debug = true;

  toolbox.precache([ 'scripts/xml2json/xml2json.js','/index.html','/bartRoutes.xml',
    '/getStopsForRoute.xml', '/getNextDeparturesByStopName.xml']);
 

  
  toolbox.router.get('/bartRoutes.xml', global.toolbox.cacheFirst, {
       cache: {
         name: 'bart',
         maxEntries: 50,
         maxAgeSeconds: 86400 // cache for a day
       }

    });

   toolbox.router.get('/getStopsForRoute.xml', global.toolbox.cacheFirst, {
       cache: {
         name: 'bart',
         maxEntries: 50,
         maxAgeSeconds: 86400 // cache for a day
       }

    });

   toolbox.router.get('/getNextDeparturesByStopName.xml', global.toolbox.cacheFirst, {
       cache: {
         name: 'bart',
         maxEntries: 50,
         maxAgeSeconds: 86400 // cache for a day
       }

    });

  toolbox.router.get(/^https:\/\/crossorigin.me\//
  , 
  global.toolbox.cacheFirst, {
  cache: {
      name: 'bart',
      maxEntries: 50,
      maxAgeSeconds: 86400 // cache for a day
    }
  });

  
  // Ensure that our service worker takes control of the page as soon as possible.
  global.addEventListener('install', event => event.waitUntil(global.skipWaiting()));
  global.addEventListener('activate', event => event.waitUntil(global.clients.claim()));

})(self);