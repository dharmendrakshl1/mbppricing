var MBPApp = angular.module('MBPApp',['ngRoute']);

MBPApp.config(
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: '/app/components/home/homeView.html',
        controller: 'financialSettingController'
      }).
      when('/serviceCost',{
        templateUrl: '/app/components/financial/serviceCostView.html',
        
      }).
      otherwise({
            redirectTo: '/'
        });
      
  });
