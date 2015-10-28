// home services

MBPApp.service('corpDB', ['$http', function($http) {
    var corpDB = this;
    corpDB.corpDBHierarchy = function(url) {

        return $http.get('api/corpdb' + url);
    };
}]);