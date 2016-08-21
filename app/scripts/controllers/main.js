'use strict';

/**
 * @ngdoc function
 * @name transportApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the transportApp
 */

angular.module('transportApp')
.constant('SECURITY_TOKEN','&key=MW9S-E7SL-26DU-VV8V&l=1')
.constant('BASE_URL','https://crossorigin.me/')

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


.controller('MainCtrl',['$scope','GET_API_DATA','$location','BASE_URL','SECURITY_TOKEN', function ($scope,GET_API_DATA,$location,BASE_URL,SECURITY_TOKEN) {

  var networkCacheUrl = 'http://api.bart.gov/api/stn.aspx?cmd=stns&key=MW9S-E7SL-26DU-VV8V';//BASE_URL+GetRoutesForAgency_ENDPOINT+SECURITY_TOKEN+AGENCY_NAME;
  var agencyCacheUrl = '/stations.xml';

   $scope.stations = [];
   $scope.departure_times = [];
   $scope.starting_station = [];

   GET_API_DATA.getData(agencyCacheUrl,networkCacheUrl).then(function(response){

     var x2js = new X2JS();
     var jsonOutput = x2js.xml_str2json(response.data);
      //console.log("new data : "+ jsonOutput['root']['stations']['station']);
      angular.forEach(jsonOutput['root']['stations']['station'], function(station){
         var val = [];
         val[0] = station['name'];
         val[1] =  station['abbr']; 
        $scope.stations.push(station);
        //console.log(val);
      });
     
   });
  
   

    $scope.get_schedule = function(arrival_station){

      //'http://api.bart.gov/api/sched.aspx?cmd=arrive&orig=ASHB&dest=CIVC&date=now&key=MW9S-E7SL-26DU-VV8V&b=2&a=2&l=1'

      var timesNetUrl = BASE_URL+'http://api.bart.gov/api/sched.aspx?cmd=arrive&orig='+
      $scope.starting_station['abbr']+'&dest='+arrival_station['abbr']+'&date=now'+SECURITY_TOKEN;
      
      var timesCacheUrl = '/schedules.xml';

      $scope.departure_times = [];
      
      GET_API_DATA.getData(timesCacheUrl,timesNetUrl).then(function(response){
          //console.log("got this data : "+ response.data);
          var x2js = new X2JS();
          var jsonOutput = x2js.xml_str2json(response.data);

          // console.log("got this data : "+ Object.keys(jsonOutput['root']['station']['item']));
          var keys = Object.keys(jsonOutput['root']);
          //console.log("keys are : "+keys);

           if (keys.indexOf('schedule') !== -1) {
              angular.forEach(jsonOutput['root']['schedule']['request']['trip'], function(item){
             //console.log("arrival_station : "+arrival_station[1] + " and current station : "+item['_trainHeadStation']);
               $scope.departure_times.push(item);
            });

           }else if (keys.indexOf('station') !== -1) {
              angular.forEach(jsonOutput['root']['station']['item'], function(item){
               //console.log("arrival_station : "+arrival_station[1] + " and current station : "+item['_trainHeadStation']);
              $scope.departure_times.push(item);
              });
           }
        
            
         });
       
      };
    //}   
    
}]);
 