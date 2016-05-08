'use strict';

/**
 * @ngdoc function
 * @name transportApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the transportApp
 */

angular.module('transportApp')
.constant("SECURITY_TOKEN",'token=aa7c0359-0ffc-401d-8d37-e933604e8e38')
.constant("BASE_URL",'https://crossorigin.me/http://services.my511.org/Transit2.0/')
.constant("GetRoutesForAgency_ENDPOINT",'GetRoutesForAgency.aspx?')
.constant("GetStopsForRoute_ENDPOINT",'GetStopsForRoute.aspx?')
.constant("GetNextDeparturesByStopName_ENDPOINT",'GetNextDeparturesByStopName.aspx?')
.constant("AGENCY_NAME",'&agencyName=BART')


.factory('GET_API_DATA', ['$http', function($http){

 return {

    getData : function(cacheUrl, networkUrl){
      
      return $http({method:'GET', url : cacheUrl}) //get from cache first
      .then(function(){ 
         return $http({method:'GET', url : networkUrl}); //then try to update cache
      })
      .catch(function(data,status,headers,config,statusText){
        //console.log("Network error : "+data +" - "+status); 
        return $http({method:'GET', url : cacheUrl}); //if there is not network connection, return from cache
      });
    }

 };

}])


.controller('MainCtrl', function ($scope,GET_API_DATA,$location,BASE_URL,GetRoutesForAgency_ENDPOINT,$http,
  GetStopsForRoute_ENDPOINT,GetNextDeparturesByStopName_ENDPOINT,AGENCY_NAME,SECURITY_TOKEN) {

  var networkCacheUrl = BASE_URL+GetRoutesForAgency_ENDPOINT+SECURITY_TOKEN+AGENCY_NAME;
  var agencyCacheUrl = '/bartRoutes.xml';

   $scope.start_stations = [];
   $scope.dest_stations = [];
   $scope.departure_times = [];
   $scope.start_station = [];

   $scope.dest_station = [];

   GET_API_DATA.getData(agencyCacheUrl,networkCacheUrl).then(function(response){

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
  
   $scope.get_dest = function(starting_station){

      var stopsNetUrl = BASE_URL + GetStopsForRoute_ENDPOINT + SECURITY_TOKEN + '&routeIDF=BART~' + starting_station[1];
      var stopsCacheUrl = '/getStopsForRoute.xml';
      
      GET_API_DATA.getData(stopsCacheUrl,stopsNetUrl).then(function(response){

          $scope.departure_times = [];
          $scope.dest_station = [];
    
          var x2js = new X2JS();
          var jsonOutput = x2js.xml_str2json(response.data);
          //console.log("we got : "+jsonOutput['RTT']['AgencyList']['Agency']['RouteList']['Route']);

          angular.forEach(jsonOutput['RTT']['AgencyList']['Agency']['RouteList']['Route'], function(eachRoute){
          
            var stops = {};
      
            if(typeof(eachRoute) === 'object' && 'StopList' in eachRoute){
              stops = eachRoute['StopList']['Stop'];
            }else{
              stops = eachRoute['Stop'];
            }
    

            angular.forEach(stops, function(eachStop){
              var val = [];
              val[0] = eachStop['_name'];
              val[1] =  eachStop['_StopCode']; 
              if ($scope.dest_stations.indexOf(val) == -1 ) {
                $scope.dest_stations.push(val);
            }
      
            });
         });
      });


    };

    $scope.get_schedule = function(stop){

      var timesNetUrl = BASE_URL + GetNextDeparturesByStopName_ENDPOINT + SECURITY_TOKEN +AGENCY_NAME+'&stopName='+ stop[0];  
      var timesCacheUrl = '/getNextDeparturesByStopName.xml';

      $scope.departure_times = [];
      
      GET_API_DATA.getData(timesCacheUrl,timesNetUrl).then(function(response){
          var x2js = new X2JS();
          var jsonOutput = x2js.xml_str2json(response.data);
      
          angular.forEach(jsonOutput['RTT']['AgencyList']['Agency']['RouteList']['Route'], function(each){

            if (each['_Name'] === $scope.start_station[0]) {
              var listOfTimes = each['StopList']['Stop']['DepartureTimeList']['DepartureTime'];
              console.log("results : "+ listOfTimes);
             if(listOfTimes){
              angular.forEach(listOfTimes,function(results){

                if ($scope.departure_times.indexOf(results) == -1 ) {
                  $scope.departure_times.push(results);
                }
    
              });
            }

            }

            if($scope.departure_times.length > 2){  //sort results before display
            $scope.departure_times.sort(function(a,b){ return a - b;});
          }
            
         });
       
      });
    }   
    
});
 