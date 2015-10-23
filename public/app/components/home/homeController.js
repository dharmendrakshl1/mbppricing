var MBPApp = angular.module('MBPApp',['ngRoute']);

MBPApp.config(
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: '/app/components/home/homeView.html',
        controller: 'financialSettingController'
      }).
      when('/about',{
        templateUrl: 'about.html',
      }).
	  otherwise({
            redirectTo: '/'
        });
      
  });

MBPApp.service('getCropDB', ['$http', function($http) {
    var corpDB = this;
    corpDB.getCorpDBHierarchy = function(url) {

        return $http.get('http://localhost:3000/api/corpdb' + url);
    };
}]);

MBPApp.controller("financialSettingController", ['$scope', 'getCropDB', function($scope, getCropDB){
            
    $scope.item = {};

    $scope.item.checked = false;
    $scope.groups = [
         {
            value: "North Tier",
            ID: "G00004"
        },
        {
            value: "South Tier",
            ID: "G00005"
        }
    ];

    
    $scope.$watch('group', function(newVal) {        
        if(newVal) { 
        $scope.quartersRecieved="";
            $scope.item.checked = false;          
            getCropDB.getCorpDBHierarchy('/group/' + $scope.group.ID + '/marketArea')
                .success(function(response) {
                    $scope.marketAreas = response;
                }).error(function(err, status) {
                    console.log(err);
                });   
        }
    });

    $scope.$watch('marketArea', function(newVal) {

        if(newVal) {
            $scope.quartersRecieved="";
            $scope.item.checked = false;
            getCropDB.getCorpDBHierarchy('/marketArea/'+ $scope.marketArea.ma_id + '/facilities') 
                .success(function(response) {
                    
                    var allFacilities = {
                        "facility_type_id" : 5,
                        "facility_type" : "All"
                    }; 
                   
                    response.push(allFacilities);       
                    
                    $scope.facilities = response;
                    $scope.facility = allFacilities.facility_type_id;
                 
                }).error(function(err, status) {
                    console.log(err);
                });   
        }
    });


    $scope.$watch('facility', function(newVal) {
        if(newVal) {
            $scope.quartersRecieved="";
            $scope.item.checked = false;
            getCropDB.getCorpDBHierarchy('/marketArea/' + $scope.marketArea.ma_id + '/facilities/'+ $scope.facility + '/businessUnit')
                .success(function(response) {
                    $scope.businessUnits = response;
                }).error(function(err, status) {
                    console.log(err);
                });  
        }
    });


    $scope.$watch('businessUnit', function(newVal) {
        if( newVal ) {
            $scope.quartersRecieved="";
            $scope.item.checked = false;
            if($scope.facility === 1){
                $scope.isRead = false;
                getCropDB.getCorpDBHierarchy('/marketArea/' + $scope.marketArea.ma_id +'/facilities/' + $scope.facility+ '/businessUnit/'+ $scope.businessUnit.bu_id + '/lobMaterialStream')
                .success(function(response) {
                    $scope.LOBs = response;
                    
                }).error(function(err, status) {
                    console.log(err);
                });
            }else {
              if($scope.facility === 2){
                $scope.isRead = true ;
                var response = [{
                        "lob4_id" : "2",
                        "lobms" : "Transfer Station"
                    }];
                  $scope.LOBs = response;
                  $scope.lob = response[0];                  
                    
                }else if($scope.facility === 3){
                    $scope.isRead = true ;
                    var response = [{
                        "lob4_id" : "3",
                        "lobms" : "Disposal"
                    }];
                  $scope.LOBs = response;
                  $scope.lob = response[0];
                    
                }else if($scope.facility === 4) {
                    $scope.isRead = true ;
                    var response = [{
                        "lob4_id" : "4",
                        "lobms" : "MRF Recycling"
                    }];
                  $scope.LOBs = response;
                  $scope.lob = response[0];
                    
                }else{
                    $scope.isRead = false;
                     getCropDB.getCorpDBHierarchy('/marketArea/' + $scope.marketArea.ma_id +'/facilities/' + $scope.facility+ '/businessUnit/'+ $scope.businessUnit.bu_id + '/lobMaterialStream')
                .success(function(response) {
                    $scope.LOBs = response;
                    
                }).error(function(err, status) {
                    console.log(err);
                });
                }
            }
        }
    });

    $scope.$watch('lob', function(newVal) {

        if( newVal ) {
            $scope.quartersRecieved="";
            $scope.item.checked = false;
            getCropDB.getCorpDBHierarchy('/businessUnit/'+ $scope.businessUnit.bu_id + '/lobMaterialStream/'+$scope.lob.lob4_id+'/quarter')
                .success(function(response) {
                $scope.quartersRecieved = response;
                
                if($scope.quartersRecieved.appliedQuarterRange === "" || $scope.quartersRecieved.appliedQuarterRange === null){
                    $scope.isQuarterNull = true;
                   
                }else{
                    $scope.isQuarterNull = false;
                }
                if($scope.quartersRecieved.availableQuarterRange === "" || $scope.quartersRecieved.availableQuarterRange === null){
                    $scope.isAvailQuarterNull = true;
                }else{
                   
                    $scope.isAvailQuarterNull = false;
                }
                if($scope.quartersRecieved.availableQuarterRange === $scope.quartersRecieved.appliedQuarterRange)
                {
                   
                    $scope.isQuarterNull = false;
                    $scope.isAvailQuarterNull = true;
                }

                }).error(function(err, status) {
                    console.log(err);
                });
            }
        });


}]);
