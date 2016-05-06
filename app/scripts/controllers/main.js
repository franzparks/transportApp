'use strict';

/**
 * @ngdoc function
 * @name meetupApp.controller:MainCtrl
 * @name meetupApp.controller:CreateEventCtrl
 * @name meetupApp.controller:GetEventsCtrl
 * @description
 * # MainCtrl
 * # CreateEventCtrl
 * # GetEventsCtrl
 
 * Controller of the transportApp
 
 */

angular.module('transportApp')
.constant("SECURITY_TOKEN",'token=aa7c0359-0ffc-401d-8d37-e933604e8e38')
.constant("START_URL",'https://crossorigin.me/http://services.my511.org/Transit2.0/')
.constant("GetRoutesForAgency_ENDPOINT",'GetRoutesForAgency.aspx?')
.constant("GetStopsForRoute_ENDPOINT",'GetStopsForRoute.aspx?')
.constant("GetNextDeparturesByStopName_ENDPOINT",'GetNextDeparturesByStopName.aspx?')
.constant("AGENCY_NAME",'&agencyName=BART')

.factory("XML_SERVICE", ["$http","START_URL", "GetRoutesForAgency_ENDPOINT","AGENCY_NAME","SECURITY_TOKEN",
  function($http,START_URL,GetRoutesForAgency_ENDPOINT, AGENCY_NAME,SECURITY_TOKEN) {
    return $http({method:'GET', url : START_URL+GetRoutesForAgency_ENDPOINT+SECURITY_TOKEN+AGENCY_NAME}); //Returns a promise
  }
])

.controller('MainCtrl', function ($scope,XML_SERVICE,$location,START_URL,GetRoutesForAgency_ENDPOINT,$http,
  GetStopsForRoute_ENDPOINT,GetNextDeparturesByStopName_ENDPOINT,AGENCY_NAME,SECURITY_TOKEN) {

   $scope.start_stations = [];
   $scope.dest_stations = [];
   $scope.departure_times = [];
   $scope.start_station = [];

   $scope.dest_station = [];

   XML_SERVICE.then(function(response){

     var x2js = new X2JS();
     var jsonOutput = x2js.xml_str2json(response.data);

      angular.forEach(jsonOutput['RTT']['AgencyList']['Agency']['RouteList']['Route'], function(each){
        var val = [];
        val[0] = each['_Name'];
        val[1] =  each['_Code']; 
        $scope.start_stations.push(val);
        //console.log(val);
      });
   });
  
   $scope.get_dest = function(start){

      var uRL = START_URL + GetStopsForRoute_ENDPOINT + SECURITY_TOKEN + '&routeIDF=BART~' + start[1];
      
      $http({method: 'GET', url : uRL}).then(function(response){

          var x2js = new X2JS();
          var jsonOutput = x2js.xml_str2json(response.data);

          angular.forEach(jsonOutput['RTT']['AgencyList']['Agency']['RouteList']['Route']['StopList']['Stop'], function(each){
            var val = [];
            val[0] = each['_name'];
            val[1] =  each['_StopCode']; 
            $scope.dest_stations.push(val);
            //console.log(each);
         });
      });
    };


    $scope.get_schedule = function(stop){

      var uRL = START_URL + GetNextDeparturesByStopName_ENDPOINT + SECURITY_TOKEN +AGENCY_NAME+'&stopName='+ stop[0];
      
      
      $http({method: 'GET', url : uRL}).then(function(response){
          var x2js = new X2JS();
          var jsonOutput = x2js.xml_str2json(response.data);
          //console.log(response.data);
          angular.forEach(jsonOutput['RTT']['AgencyList']['Agency']['RouteList']['Route'], function(each){

            if (each['_Name'] === $scope.start_station[0]) {
              angular.forEach(each['StopList']['Stop']['DepartureTimeList']['DepartureTime'],function(results){

              console.log("departure times : "+results);
              var val = [];
             //val[0] = each['_name'];
            //val[1] =  each['_StopCode']; 
            $scope.departure_times.push(results);
         //console.log(each);
              });
            }
            
         });
       
      });
    }
    
    
     
    
})
  .controller('CreateEventCtrl', function ($scope,$location,$filter,UserDataService,RefArr) {

   var geocoder = new google.maps.Geocoder();

   $scope.hasAdditionalMsg = false;
   //$scope.events = []; //Now using firebase to store events
   $scope.event = {
     emailId : UserDataService.getUser()
   };
  

   $scope.getAdditionalMessage = function(){
      return $scope.hasAdditionalMsg;
   };

   $scope.createEvent = function (event) {
     
     //convert dates
        if (angular.isDefined($scope.event.start)) {
            var startDate = $scope.event.start;
            $scope.event.start = startDate.getTime();
            console.log(startDate.getTime());
        }

        if (angular.isDefined($scope.event.end)) {
            var endDate = $scope.event.end;
            $scope.event.end = endDate.getTime();
        }

        if (angular.isUndefined($scope.event.location)) {
          $scope.event.location = "None";
        }

        RefArr.push(event);
        //redirect to home page after push
        $location.path('/');
        }

      /// Geo location functions
       $scope.successFunction = function(position) {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        $scope.codeLatLng(lat, lng);
      }

      $scope.errorFunction = function(){
        console.log("Geolocation is not supported by this browser.");
      }

      $scope.codeLatLng = function(lat, lng) {

        var latlng = new google.maps.LatLng(lat, lng);

        geocoder.geocode({'latLng': latlng },  function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            //console.log("more results",results)
          if (results[1]) {
           //formatted address
          //$scope.geoLoc = results[0].formatted_address;
          $scope.event.location = results[0].formatted_address;

          //find country name
             for (var i=0; i<results[0].address_components.length; i++) {
                 for (var b=0;b<results[0].address_components[i].types.length;b++) {
                  //there are different types that might hold a city admin_area_lvl_1 usually does in come cases looking for sublocality type will be more appropriate
                    if (results[0].address_components[i].types[b] == "administrative_area_level_1") {
                      //this is the object  we are looking for
                      $scope.city = results[0].address_components[i];
                      break;
                    }
                 }
              }
          }
        } 
      });
    }

    $scope.getLocation = function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition($scope.successFunction, $scope.errorFunction);
        } else {
            $scope.error = "Geolocation is not supported by this browser.";
        }
    }

    $scope.getLocation(); //initialize location search
  
})

.controller('GetEventsCtrl', function ($scope,$filter, UserDataService,RefArr) {

   $scope.events = []; 

  // Attach an asynchronous callback to read the data at the events reference
  RefArr.on("value", function(snapshot) {
    var data =   snapshot.val();
    console.log(data);
    $scope.events = data;
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});
  
});

