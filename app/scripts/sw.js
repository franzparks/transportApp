(global => {
  'use strict';

  // Load the sw-toolbox library.
  importScripts('/bower_components/sw-toolbox/sw-toolbox.js');
  global.toolbox.options.debug = true;
  
  // Ensure that our service worker takes control of the page as soon as possible.
  global.addEventListener('install', event => event.waitUntil(global.skipWaiting()));
  global.addEventListener('activate', event => event.waitUntil(global.clients.claim()));
})(self);