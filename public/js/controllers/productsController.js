angular.module('supplyChainApp')
  .controller('ProductsController', ['$scope', 'ApiService', function($scope, ApiService) {
    $scope.products = [];
    $scope.currentProduct = {};
    $scope.isEditing = false;
    $scope.confirmingDelete = null;
    $scope.message = '';
    $scope.messageType = '';

    $scope.loadProducts = function() {
      ApiService.getProducts()
        .then(function(response) {
          $scope.products = response.data.products;
        })
        .catch(function(error) {
          $scope.showMessage('Error loading products: ' + (error.data && error.data.error), 'error');
        });
    };

    $scope.saveProduct = function() {
      if ($scope.isEditing) {
        ApiService.updateProduct($scope.currentProduct.Product_ID, $scope.currentProduct)
          .then(function() {
            $scope.showMessage('Product updated successfully!', 'success');
            $scope.loadProducts();
            $scope.resetForm();
          })
          .catch(function(error) {
            $scope.showMessage('Error updating product: ' + (error.data && error.data.error), 'error');
          });
      } else {
        ApiService.createProduct($scope.currentProduct)
          .then(function() {
            $scope.showMessage('Product created successfully!', 'success');
            $scope.loadProducts();
            $scope.resetForm();
          })
          .catch(function(error) {
            $scope.showMessage('Error creating product: ' + (error.data && error.data.error), 'error');
          });
      }
    };

    $scope.editProduct = function(product) {
      $scope.currentProduct = angular.copy(product);
      $scope.isEditing = true;
      window.scrollTo(0, 0);
    };

    $scope.deleteProduct = function(id) {
      $scope.confirmingDelete = id;
    };

    $scope.confirmDelete = function() {
      if (!$scope.confirmingDelete) return;
      var id = $scope.confirmingDelete;
      ApiService.deleteProduct(id)
        .then(function() {
          $scope.showMessage('Product deleted successfully!', 'success');
          $scope.confirmingDelete = null;
          $scope.loadProducts();
        })
        .catch(function(error) {
          $scope.showMessage('Error deleting product: ' + (error.data && error.data.error), 'error');
          $scope.confirmingDelete = null;
        });
    };

    $scope.cancelDelete = function() {
      $scope.confirmingDelete = null;
    };

    $scope.resetForm = function() {
      $scope.currentProduct = {};
      $scope.isEditing = false;
    };

    $scope.showMessage = function(msg, type) {
      $scope.message = msg;
      $scope.messageType = type;
      setTimeout(function() {
        $scope.$apply(function() {
          $scope.message = '';
        });
      }, 3000);
    };

    $scope.loadProducts();
  }]);
