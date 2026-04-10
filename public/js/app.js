angular.module('supplyChainApp', ['ngRoute'])
  .config(['$routeProvider', '$locationProvider', function($routeProvider) {
    $routeProvider
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginController'
      })
      .when('/register', {
        templateUrl: 'views/register.html',
        controller: 'RegisterController'
      })
      .when('/', {
        templateUrl: 'views/dashboard.html',
        controller: 'DashboardController',
        requireAuth: true
      })
      .when('/suppliers', {
        templateUrl: 'views/suppliers.html',
        controller: 'SuppliersController',
        requireAuth: true
      })
      .when('/materials', {
        templateUrl: 'views/materials.html',
        controller: 'MaterialsController',
        requireAuth: true
      })
      .when('/products', {
        templateUrl: 'views/products.html',
        controller: 'ProductsController',
        requireAuth: true
      })
      .when('/transport-logs', {
        templateUrl: 'views/transport-logs.html',
        controller: 'TransportLogsController',
        requireAuth: true
      })
      .when('/product-composition', {
        templateUrl: 'views/product-composition.html',
        controller: 'ProductCompositionController',
        requireAuth: true
      })
      .when('/carbon-report', {
        templateUrl: 'views/carbon-report.html',
        controller: 'CarbonReportController',
        requireAuth: true
      })
      .when('/manage-account', {
        templateUrl: 'views/manage-account.html',
        controller: 'ManageAccountController',
        requireAuth: true
      })
      .otherwise({
        redirectTo: '/login'
      });
  }])
  .run(['$rootScope', '$location', 'ApiService', function($rootScope, $location, ApiService) {
    $rootScope.$on('$routeChangeStart', function(event, next) {
      if (next.requireAuth) {
        // If already authenticated in memory, skip the HTTP round-trip
        if ($rootScope.currentUser && $rootScope.currentUser.userId) {
          return;
        }
        event.preventDefault();
        var targetPath = next.$$route ? next.$$route.originalPath : '/';
        ApiService.checkAuth().then(function(response) {
          if (!response.data.authenticated) {
            $location.path('/login');
          } else {
            $rootScope.currentUser = response.data.user;
            $location.path(targetPath);
          }
        }).catch(function() {
          $location.path('/login');
        });
      }
    });
  }]);
