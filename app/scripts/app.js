'use strict';

/**
 * @ngdoc overview
 * @name transportApp
 * @description
 * # transport App
 *
 * Main module of the application.
 */
angular
  .module('transportApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'chieffancypants.loadingBar'
  ])

  .config([function ($routeProvider) {
  
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);
