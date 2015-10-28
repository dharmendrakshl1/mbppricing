MBPApp.service('financials', ['$http', function($http) {
    var finance = this;
    finance.financialAdjustment = function(url) {

        return $http.get('http://adcvdij7009:3001/api/financialAdjustmentService' + url);
    };
}]);


MBPApp.controller("financialAdjustmentController", ['$scope', 'financials', function($scope, financials)
{
    
  $scope.financialAdjustmentValues = function() {
    //financials.financialAdjustment('/businessUnit/'+$scope.businessUnit.bu_id+'/lobMaterialStream/'+$scope.lob.lobms_id)
    financials.financialAdjustment('/businessUnit/B01161/lobMaterialStream/1')
    .success(function(response) {
                //console.log("Hi: "+$scope.businessUnit.bu_id+" "+$scope.lob.lobms_id);
                $scope.financialValues=response;
                }).error(function(err, status) {
                    console.log(err);
                });
  };
    
}]);
