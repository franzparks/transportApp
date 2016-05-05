'use strict';

/**
 * @ngdoc function
 * @name meetupApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the meetupApp
 */
angular.module('transportApp')

.factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) {
    var ref = new Firebase("https://franzmeetapp.firebaseio.com");
    return $firebaseAuth(ref);
  }
])

.service('UserDataService', function( Auth,$location) { //for passing user info between controllers
    var user = '';
    
    return {

        getUser : function() {
            return user;
        },
        setUser: function(value) {
            user = value;
        },

        logoutUser: function(){
            Auth.$unauth();
            user = ''; //to make sure views get empty value for user
            console.log('Successfully logged out!');
            $location.path('/loggedout');
        }
    };
})
  .controller('LoginCtrl', function ($scope,$location, Auth, UserDataService) {
   
    $scope.loginError = false;

    $scope.getLoginError = function(){
     return $scope.loginError;
    };
 
    $scope.login = function() {

        Auth.$authWithPassword({
            email: $scope.user.email,
            password: $scope.user.password

        }).then(function(authData) {
    
            console.log("Successfully logged in!", authData)
            UserDataService.setUser(authData.password.email);
            $location.path('#/');
        }, function(err) {
            $scope.loginError = true;
            $scope.message = err.message;
        });
    } // login 

    

  })

  .controller('RegisterCtrl', function ($scope,$location, Auth) {
    
    $scope.regError = false; //for filtering on view

    $scope.auth = Auth;

    $scope.moreInfo = false;

    $scope.getRegError = function(){
     return $scope.regError;
    };

    $scope.getMoreInfo = function(){
     return $scope.moreInfo;
    };

    // any time auth status updates, add the user data to scope
    $scope.auth.$onAuth(function(authData) {
      $scope.authData = authData;
    });
    

    $scope.signUp = function() {
      if (!$scope.regForm.$invalid) {

            var name = $scope.user.name;
            var email = $scope.user.email;
            var password = $scope.user.password;
            var employer = $scope.user.employer;
            var title = $scope.user.title;

            $scope.oldEmail = ''; //for comparing new email entered by user after reg failure
            $scope.getOldEmail = function(){
                return $scope.oldEmail;
            };

            if (email && password) {
                $scope.oldEmail = email;
                $scope.auth.$createUser({
                    name : name,
                    email : email, 
                    password: password,
                    employer : employer,
                    title : title

                }).then(function() { 
                        console.log('User creation successful');
                        $location.path('#/login');
                    }, function(error) {
                        console.log(error);
                        $scope.regError = true;

                        $scope.regErrorMessage = error.message;
                    });
            }
        }
   }; //sign up
    
  });

