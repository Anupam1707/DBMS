angular.module('supplyChainApp')
  .controller('OrdersController', ['$scope', '$rootScope', '$location', 'ApiService', function($scope, $rootScope, $location, ApiService) {
    $scope.orders = [];
    $scope.loading = false;
    $scope.errorMessage = '';
    $scope.currentUser = $rootScope.currentUser || {};

    $scope.loadOrders = function() {
      $scope.loading = true;
      $scope.errorMessage = '';

      ApiService.getOrders()
        .then(function(response) {
          $scope.orders = response.data.orders || [];
          $scope.loading = false;
        })
        .catch(function(error) {
          $scope.errorMessage = (error.data && error.data.error) || 'Failed to load orders';
          $scope.loading = false;
        });
    };

    $scope.viewCarbonReport = function(productId) {
      $location.path('/carbon-report').search({ productId: productId });
    };

    $scope.loadOrders();
  }]);
