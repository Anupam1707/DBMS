angular.module('supplyChainApp')
  .controller('ProductsController', ['$scope', 'ApiService', function($scope, ApiService) {
    $scope.products = [];
    $scope.currentProduct = {};
    $scope.isEditing = false;
    $scope.message = '';
    $scope.messageType = '';

    $scope.loadProducts = function() {
      ApiService.getProducts()
        .then(function(response) {
          $scope.products = response.data.products;
        })
        .catch(function(error) {
          $scope.showMessage('Error loading products: ' + error.data.error, 'error');
        });
    };

    $scope.saveProduct = function() {
      if ($scope.isEditing) {
        ApiService.updateProduct($scope.currentProduct.Product_ID, $scope.currentProduct)
          .then(function(response) {
            $scope.showMessage('Product updated successfully!', 'success');
            $scope.loadProducts();
            $scope.resetForm();
          })
          .catch(function(error) {
            $scope.showMessage('Error updating product: ' + error.data.error, 'error');
          });
      } else {
        ApiService.createProduct($scope.currentProduct)
          .then(function(response) {
            $scope.showMessage('Product created successfully!', 'success');
            $scope.loadProducts();
            $scope.resetForm();
          })
          .catch(function(error) {
            $scope.showMessage('Error creating product: ' + error.data.error, 'error');
          });
      }
    };

    $scope.editProduct = function(product) {
      $scope.currentProduct = angular.copy(product);
      $scope.isEditing = true;
      window.scrollTo(0, 0);
    };

    $scope.deleteProduct = function(id) {
      if (confirm('Are you sure you want to delete this product?')) {
        ApiService.deleteProduct(id)
          .then(function(response) {
            $scope.showMessage('Product deleted successfully!', 'success');
            $scope.loadProducts();
          })
          .catch(function(error) {
            $scope.showMessage('Error deleting product: ' + error.data.error, 'error');
          });
      }
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
