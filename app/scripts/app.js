'use strict';

/**
 * @ngdoc overview
 * @name meetupApp
 * @description
 * # meetupApp
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
    'firebase',
    'chieffancypants.loadingBar'
  ])

.run(["$rootScope", "$location", function($rootScope, $location) {
  $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
  // We can catch the error thrown when the $requireAuth promise is rejected
  // and redirect the user back to the login page
  if (error === "AUTH_REQUIRED") {
    $location.path("/login");
  }
});
}])

  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        resolve: {
       // controller will not be loaded until $waitForAuth resolves
       // Auth refers to our $firebaseAuth wrapper in the example above
       "currentAuth": ["Auth", function(Auth) {
       // $waitForAuth returns a promise so the resolve waits for it to complete
         return Auth.$waitForAuth();
       }]
       } 

      })
      .when('/create', {
        templateUrl: 'views/createEvent.html',
        controller: 'CreateEventCtrl',
        resolve: {
         // controller will not be loaded until $requireAuth resolves
          "currentAuth": ["Auth", function(Auth) {
          // $requireAuth returns a promise so the resolve waits for it to complete
         // If the promise is rejected, it will throw a $stateChangeError 
          return Auth.$requireAuth();
         }]
       }

      })
      .when('/register', {
        templateUrl: 'views/register.html',
        controller: 'RegisterCtrl'
    
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/loggedout', {
        templateUrl: 'views/loggedOut.html',
        controller: 'LoginCtrl',
        resolve: {
         // controller will not be loaded until $requireAuth resolves
          "currentAuth": ["Auth", function(Auth) {
          // $requireAuth returns a promise so the resolve waits for it to complete
         // If the promise is rejected, it will throw a $stateChangeError 
          return Auth.$requireAuth();
         }]
       }
      })
      .otherwise({
        redirectTo: '/'
      });
  });
