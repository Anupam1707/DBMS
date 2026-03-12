angular.module('supplyChainApp')
  .controller('SuppliersController', ['$scope', 'ApiService', function($scope, ApiService) {
    $scope.suppliers = [];
    $scope.currentSupplier = {};
    $scope.isEditing = false;
    $scope.confirmingDelete = null;
    $scope.message = '';
    $scope.messageType = '';

    // Load all suppliers
    $scope.loadSuppliers = function() {
      ApiService.getSuppliers()
        .then(function(response) {
          $scope.suppliers = response.data.suppliers;
        })
        .catch(function(error) {
          $scope.showMessage('Error loading suppliers: ' + error.data.error, 'error');
        });
    };

    // Create or update supplier
    $scope.saveSupplier = function() {
      if ($scope.isEditing) {
        ApiService.updateSupplier($scope.currentSupplier.Supplier_ID, $scope.currentSupplier)
          .then(function(response) {
            $scope.showMessage('Supplier updated successfully!', 'success');
            $scope.loadSuppliers();
            $scope.resetForm();
          })
          .catch(function(error) {
            $scope.showMessage('Error updating supplier: ' + error.data.error, 'error');
          });
      } else {
        ApiService.createSupplier($scope.currentSupplier)
          .then(function(response) {
            $scope.showMessage('Supplier created successfully!', 'success');
            $scope.loadSuppliers();
            $scope.resetForm();
          })
          .catch(function(error) {
            $scope.showMessage('Error creating supplier: ' + error.data.error, 'error');
          });
      }
    };

    // Edit supplier
    $scope.editSupplier = function(supplier) {
      $scope.currentSupplier = angular.copy(supplier);
      $scope.isEditing = true;
      window.scrollTo(0, 0);
    };

    // Delete supplier
    $scope.deleteSupplier = function(id) {
      $scope.confirmingDelete = id;
    };

    $scope.confirmDelete = function() {
      if (!$scope.confirmingDelete) return;
      
      const id = $scope.confirmingDelete;
      ApiService.deleteSupplier(id)
        .then(function(response) {
          $scope.showMessage('Supplier deleted successfully!', 'success');
          $scope.confirmingDelete = null;
          $scope.loadSuppliers();
        })
        .catch(function(error) {
          $scope.showMessage('Error deleting supplier: ' + error.data.error, 'error');
          $scope.confirmingDelete = null;
        });
    };

    $scope.cancelDelete = function() {
      $scope.confirmingDelete = null;
    };

    // Reset form
    $scope.resetForm = function() {
      $scope.currentSupplier = {};
      $scope.isEditing = false;
    };

    // Show message
    $scope.showMessage = function(msg, type) {
      $scope.message = msg;
      $scope.messageType = type;
      setTimeout(function() {
        $scope.$apply(function() {
          $scope.message = '';
        });
      }, 3000);
    };

    // Initialize
    $scope.loadSuppliers();
  }]);
