(global => {
  'use strict';

  // Load the sw-toolbox library.
  importScripts('/bower_components/sw-toolbox/sw-toolbox.js');

   // Turn on debug logging, visible in the Developer Tools' console.
  global.toolbox.options.debug = true;

//pre install static files for better service offline (this is called during service worker install)
  toolbox.precache([ '/scripts/xml2json/xml2json.js','/index.html','/bartRoutes.xml',
    '/getStopsForRoute.xml', '/getNextDeparturesByStopName.xml',
     '/bower_components/bootstrap/dist/css/bootstrap.css',
     '/styles/main.css', '/styles/styles.css',
     '/bower_components/jquery/dist/jquery.js',
     '/bower_components/angular/angular.js',
     '/bower_components/angular-loading-bar/build/loading-bar.css',
     '/bower_components/bootstrap/dist/js/bootstrap.js',
     '/bower_components/angular-animate/angular-animate.js',
     '/bower_components/angular-aria/angular-aria.js',
     '/bower_components/angular-cookies/angular-cookies.js',
     '/bower_components/angular-messages/angular-messages.js',
     '/bower_components/angular-resource/angular-resource.js',
     '/bower_components/angular-route/angular-route.js',
     '/bower_components/angular-sanitize/angular-sanitize.js',
     '/bower_components/angular-touch/angular-touch.js',
     '/bower_components/angular-loading-bar/build/loading-bar.js',
     '/scripts/app.js',
     '/scripts/controllers/main.js',
     'https://crossorigin.me/https://cdn.rawgit.com/abdmob/x2js/master/xml2json.js'
    
     ]);
 
//'https://crossorigin.me/http://maps.googleapis.com/maps/api/js?sensor=false',
  
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

var myDefaultRequestHandler = function(request, values, options) {
  return toolbox.router.get('/', global.toolbox.cacheFirst);
}

toolbox.router.default = myDefaultRequestHandler;
  
  // Ensure that our service worker takes control of the page as soon as possible.
  global.addEventListener('install', event => event.waitUntil(global.skipWaiting()));
  global.addEventListener('activate', event => event.waitUntil(global.clients.claim()));

})(self);