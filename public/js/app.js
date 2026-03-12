angular.module('supplyChainApp', ['ngRoute'])
  .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
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
    // Check authentication on route change
    $rootScope.$on('$routeChangeStart', function(event, next) {
      if (next.requireAuth) {
        ApiService.checkAuth().then(function(response) {
          if (!response.data.authenticated) {
            $location.path('/login');
          } else {
            $rootScope.currentUser = response.data.user;
          }
        }).catch(function() {
          $location.path('/login');
        });
      }
    });
  }]);
