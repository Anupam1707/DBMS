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
        requireAuth: true,
        allowedRoles: ['admin']
      })
      .when('/suppliers', {
        templateUrl: 'views/suppliers.html',
        controller: 'SuppliersController',
        requireAuth: true,
        allowedRoles: ['admin', 'supplier']
      })
      .when('/materials', {
        templateUrl: 'views/materials.html',
        controller: 'MaterialsController',
        requireAuth: true,
        allowedRoles: ['admin', 'supplier']
      })
      .when('/products', {
        templateUrl: 'views/products.html',
        controller: 'ProductsController',
        requireAuth: true,
        allowedRoles: ['admin', 'manufacturer']
      })
      .when('/transport-logs', {
        templateUrl: 'views/transport-logs.html',
        controller: 'TransportLogsController',
        requireAuth: true,
        allowedRoles: ['admin', 'supplier']
      })
      .when('/product-composition', {
        templateUrl: 'views/product-composition.html',
        controller: 'ProductCompositionController',
        requireAuth: true,
        allowedRoles: ['admin', 'manufacturer']
      })
      .when('/carbon-report', {
        templateUrl: 'views/carbon-report.html',
        controller: 'CarbonReportController',
        requireAuth: true,
        allowedRoles: ['admin', 'customer']
      })
      .when('/orders', {
        templateUrl: 'views/orders.html',
        controller: 'OrdersController',
        requireAuth: true,
        allowedRoles: ['admin', 'customer']
      })
      .when('/customers', {
        templateUrl: 'views/customers.html',
        controller: 'CustomersController',
        requireAuth: true,
        allowedRoles: ['admin']
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
    function getDefaultPathForRole(role) {
      if (role === 'supplier') return '/suppliers';
      if (role === 'manufacturer') return '/products';
      if (role === 'customer') return '/orders';
      return '/';
    }

    function isRoleAllowed(next, role) {
      if (!next || !next.allowedRoles || next.allowedRoles.length === 0) {
        return true;
      }
      return next.allowedRoles.indexOf(role) !== -1;
    }

    $rootScope.getDefaultPathForRole = getDefaultPathForRole;

    $rootScope.$on('$routeChangeStart', function(event, next) {
      if (next.requireAuth) {
        function redirectByRole(role) {
          $location.path(getDefaultPathForRole(role));
        }

        // If already authenticated in memory, skip the HTTP round-trip
        if ($rootScope.currentUser && $rootScope.currentUser.userId) {
          if (!isRoleAllowed(next, $rootScope.currentUser.role)) {
            event.preventDefault();
            redirectByRole($rootScope.currentUser.role);
          }
          return;
        }

        event.preventDefault();
        var targetPath = next.$$route ? next.$$route.originalPath : '/';
        ApiService.checkAuth().then(function(response) {
          if (!response.data.authenticated) {
            $location.path('/login');
          } else {
            $rootScope.currentUser = response.data.user;
            if (!isRoleAllowed(next, response.data.user.role)) {
              redirectByRole(response.data.user.role);
            } else {
              $location.path(targetPath);
            }
          }
        }).catch(function() {
          $location.path('/login');
        });
      }
    });
  }]);
