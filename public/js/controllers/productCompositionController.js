angular.module('supplyChainApp')
  .controller('ProductCompositionController', ['$scope', 'ApiService', function($scope, ApiService) {
    $scope.productCompositions = [];
    $scope.products = [];
    $scope.materials = [];
    $scope.currentComposition = {};
    $scope.isEditing = false;
    $scope.confirmingDelete = null;
    $scope.message = '';
    $scope.messageType = '';

    $scope.loadProductCompositions = function() {
      ApiService.getProductCompositions()
        .then(function(response) {
          $scope.productCompositions = response.data.productCompositions;
        })
        .catch(function(error) {
          $scope.showMessage('Error loading product compositions: ' + (error.data && error.data.error), 'error');
        });
    };

    $scope.loadProducts = function() {
      ApiService.getProducts()
        .then(function(response) {
          $scope.products = response.data.products;
        })
        .catch(function(error) {
          $scope.showMessage('Error loading products: ' + (error.data && error.data.error), 'error');
        });
    };

    $scope.loadMaterials = function() {
      ApiService.getMaterials()
        .then(function(response) {
          $scope.materials = response.data.materials;
        })
        .catch(function(error) {
          $scope.showMessage('Error loading materials: ' + (error.data && error.data.error), 'error');
        });
    };

    $scope.saveProductComposition = function() {
      if ($scope.isEditing) {
        ApiService.updateProductComposition($scope.currentComposition.Composition_ID, $scope.currentComposition)
          .then(function() {
            $scope.showMessage('Product composition updated successfully!', 'success');
            $scope.loadProductCompositions();
            $scope.resetForm();
          })
          .catch(function(error) {
            $scope.showMessage('Error updating product composition: ' + (error.data && error.data.error), 'error');
          });
      } else {
        ApiService.createProductComposition($scope.currentComposition)
          .then(function() {
            $scope.showMessage('Product composition created successfully!', 'success');
            $scope.loadProductCompositions();
            $scope.resetForm();
          })
          .catch(function(error) {
            $scope.showMessage('Error creating product composition: ' + (error.data && error.data.error), 'error');
          });
      }
    };

    $scope.editProductComposition = function(composition) {
      $scope.currentComposition = angular.copy(composition);
      $scope.isEditing = true;
      window.scrollTo(0, 0);
    };

    $scope.deleteProductComposition = function(id) {
      $scope.confirmingDelete = id;
    };

    $scope.confirmDelete = function() {
      if (!$scope.confirmingDelete) return;
      var id = $scope.confirmingDelete;
      ApiService.deleteProductComposition(id)
        .then(function() {
          $scope.showMessage('Product composition deleted successfully!', 'success');
          $scope.confirmingDelete = null;
          $scope.loadProductCompositions();
        })
        .catch(function(error) {
          $scope.showMessage('Error deleting product composition: ' + (error.data && error.data.error), 'error');
          $scope.confirmingDelete = null;
        });
    };

    $scope.cancelDelete = function() {
      $scope.confirmingDelete = null;
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
