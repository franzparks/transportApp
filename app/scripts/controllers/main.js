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

  var networkCacheUrl = 'http://api.bart.gov/api/stn.aspx?cmd=stns&key=MW9S-E7SL-26DU-VV8V';//BASE_URL+GetRoutesForAgency_ENDPOINT+SECURITY_TOKEN+AGENCY_NAME;
  var agencyCacheUrl = '/stations.xml';

   $scope.stations = [];
   $scope.departure_times = [];
   $scope.start_station = [];

   GET_API_DATA.getData(agencyCacheUrl,networkCacheUrl).then(function(response){

     var x2js = new X2JS();
     var jsonOutput = x2js.xml_str2json(response.data);
      //console.log("new data : "+ jsonOutput['root']['stations']['station']);
      angular.forEach(jsonOutput['root']['stations']['station'], function(station){
         var val = [];
         val[0] = station['name'];
         val[1] =  station['abbr']; 
        $scope.stations.push(val);
        //console.log(val);
      });
     
   });
  
   $scope.get_arrival_stations = function(starting_station){

      var stopsNetUrl = BASE_URL + GetStopsForRoute_ENDPOINT + SECURITY_TOKEN + '&routeIDF=BART~' + starting_station[1];
      var stopsCacheUrl = '/getStopsForRoute.xml';

      GET_API_DATA.getData(stopsCacheUrl,stopsNetUrl).then(function(response){

          $scope.arrival_stations = [];
          $scope.departure_times = [];
          $scope.arrival_station = [];
    
          var x2js = new X2JS();
          var jsonOutput = x2js.xml_str2json(response.data);
          
          angular.forEach(jsonOutput['RTT']['AgencyList']['Agency']['RouteList']['Route'], function(eachRoute){
          
            var stops = {};
      
            if(typeof(eachRoute) === 'object' && 'StopList' in eachRoute){
              stops = eachRoute['StopList']['Stop'];
            }else{
              stops = eachRoute['Stop'];
            }
    
            angular.forEach(stops, function(eachStop){ 
              if ($scope.arrival_stations.indexOf(eachStop['_name']) == -1 ) {
                $scope.arrival_stations.push(eachStop['_name']);
            }
      
            });
         });
      });

    };

    $scope.get_schedule = function(arrival_station){

      var timesNetUrl = 'http://api.bart.gov/api/sched.aspx?cmd=stnsched&orig=12th&key=MW9S-E7SL-26DU-VV8V&l=1';
      //BASE_URL + GetNextDeparturesByStopName_ENDPOINT + SECURITY_TOKEN +AGENCY_NAME+'&stopName='+ arrival_station;

      var timesCacheUrl = '/schedules.xml';

      $scope.departure_times = [];
      
      GET_API_DATA.getData(timesCacheUrl,timesNetUrl).then(function(response){

          var x2js = new X2JS();
          var jsonOutput = x2js.xml_str2json(response.data);

          console.log("got this data : "+ jsonOutput['root']['station']['item']);
      
           angular.forEach(jsonOutput['root']['station']['item'], function(each){

             $scope.departure_times.push(each);

          });
        
            //if($scope.departure_times.length > 2){  //sort results before display
            //$scope.departure_times.sort(function(a,b){ return a - b;});
          //}
            
         });
       
      };
    //}   
    
});
 