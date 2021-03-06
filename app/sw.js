(global => {
  'use strict';

  // Load the sw-toolbox library.
  importScripts('/bower_components/sw-toolbox/sw-toolbox.js');

   // Turn on debug logging, visible in the Developer Tools' console.
  global.toolbox.options.debug = true;
  toolbox.cache.name['my-cache'];
  toolbox.cache.maxEntries = 100;
  toolbox.cache.maxAgeSeconds = 86400;

  
  toolbox.router.get('/stations.xml', global.toolbox.cacheFirst, {
       cache: {
         name: 'my-cache'
       }

    });

   toolbox.router.get('/schedules.xml', global.toolbox.cacheFirst, {
       cache: {
         name: 'my-cache'
       }

    });

   toolbox.router.get('/sw.js', global.toolbox.cacheFirst, {
       cache: {
         name: 'my-cache'
       }

    });


  toolbox.router.get(/^https:\/\/crossorigin.me\//
  , 
  global.toolbox.cacheFirst, {
  cache: {
      name: 'my-cache'
    }
  });

  toolbox.router.get(/^http:\/\/googleapis.com\//
  , 
  global.toolbox.cacheFirst, {
    cache: {
      name: 'my-cache'
    }
  });


var myDefaultRequestHandler = function(request, values, options) {
  return toolbox.router.get('/(.*)', 
    global.toolbox.cacheFirst, {
      cache: {
       name: 'my-cache'
     }
  });
}



toolbox.router.default = myDefaultRequestHandler;

  // Ensure that our service worker takes control of the page as soon as possible.
  //global.addEventListener('install', event => event.waitUntil(global.skipWaiting()));
  global.addEventListener('install', function(event) {
    global.toolbox.options.debug = true;
  event.waitUntil(
  caches.open('my-cache').then(function(cache) {
        // Important to `return` the promise here to have `skipWaiting()`
        // fire after the cache has been updated.
        return cache.addAll([
         '/scripts/xml2json/xml2json.js','/index.html','/stations.xml',
    '/schedules.xml',
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
     '/sw.js',
     '/views/main.html',
     'https://crossorigin.me/http://maps.google.com/maps-api-v3/api/js/24/11/common.js',
     'https://crossorigin.me/http://maps.googleapis.com/maps/api/js?sensor=false',
     'https://crossorigin.me/http://maps.google.com/maps-api-v3/api/js/24/11/util.js',
     'https://crossorigin.me/http://maps.google.com/maps-api-v3/api/js/24/11/stats.js'

        ]);
    }).then(function() {
      // `skipWaiting()` forces the waiting ServiceWorker to become the
      // active ServiceWorker, triggering the `onactivate` event.
      // Together with `Clients.claim()` this allows a worker to take effect
      // immediately in the client(s).
      return self.skipWaiting();
    
    })
  );
});
  global.addEventListener('activate', event => event.waitUntil(global.clients.claim()));
  
})(self);