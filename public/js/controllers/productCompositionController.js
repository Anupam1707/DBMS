angular.module('supplyChainApp')
  .controller('ProductCompositionController', ['$scope', 'ApiService', function($scope, ApiService) {
    $scope.productCompositions = [];
    $scope.products = [];
    $scope.materials = [];
    $scope.currentComposition = {};
    $scope.isEditing = false;
    $scope.message = '';
    $scope.messageType = '';

    $scope.loadProductCompositions = function() {
      ApiService.getProductCompositions()
        .then(function(response) {
          $scope.productCompositions = response.data.productCompositions;
        })
        .catch(function(error) {
          $scope.showMessage('Error loading product compositions: ' + error.data.error, 'error');
        });
    };

    $scope.loadProducts = function() {
      ApiService.getProducts()
        .then(function(response) {
          $scope.products = response.data.products;
        });
    };

    $scope.loadMaterials = function() {
      ApiService.getMaterials()
        .then(function(response) {
          $scope.materials = response.data.materials;
        });
    };

    $scope.saveProductComposition = function() {
      if ($scope.isEditing) {
        ApiService.updateProductComposition($scope.currentComposition.Composition_ID, $scope.currentComposition)
          .then(function(response) {
            $scope.showMessage('Product composition updated successfully!', 'success');
            $scope.loadProductCompositions();
            $scope.resetForm();
          })
          .catch(function(error) {
            $scope.showMessage('Error updating product composition: ' + error.data.error, 'error');
          });
      } else {
        ApiService.createProductComposition($scope.currentComposition)
          .then(function(response) {
            $scope.showMessage('Product composition created successfully!', 'success');
            $scope.loadProductCompositions();
            $scope.resetForm();
          })
          .catch(function(error) {
            $scope.showMessage('Error creating product composition: ' + error.data.error, 'error');
          });
      }
    };

    $scope.editProductComposition = function(composition) {
      $scope.currentComposition = angular.copy(composition);
      $scope.isEditing = true;
      window.scrollTo(0, 0);
    };

    $scope.deleteProductComposition = function(id) {
      if (confirm('Are you sure you want to delete this product composition?')) {
        ApiService.deleteProductComposition(id)
          .then(function(response) {
            $scope.showMessage('Product composition deleted successfully!', 'success');
            $scope.loadProductCompositions();
          })
          .catch(function(error) {
            $scope.showMessage('Error deleting product composition: ' + error.data.error, 'error');
          });
      }
    };

    $scope.resetForm = function() {
      $scope.currentComposition = {};
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

    $scope.loadProductCompositions();
    $scope.loadProducts();
    $scope.loadMaterials();
  }]);
