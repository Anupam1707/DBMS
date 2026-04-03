angular.module('supplyChainApp')
  .controller('MaterialsController', ['$scope', 'ApiService', function($scope, ApiService) {
    $scope.materials = [];
    $scope.currentMaterial = {};
    $scope.isEditing = false;
    $scope.confirmingDelete = null;
    $scope.message = '';
    $scope.messageType = '';

    $scope.loadMaterials = function() {
      ApiService.getMaterials()
        .then(function(response) {
          $scope.materials = response.data.materials;
        })
        .catch(function(error) {
          $scope.showMessage('Error loading materials: ' + (error.data && error.data.error), 'error');
        });
    };

    $scope.saveMaterial = function() {
      if ($scope.isEditing) {
        ApiService.updateMaterial($scope.currentMaterial.Material_ID, $scope.currentMaterial)
          .then(function() {
            $scope.showMessage('Material updated successfully!', 'success');
            $scope.loadMaterials();
            $scope.resetForm();
          })
          .catch(function(error) {
            $scope.showMessage('Error updating material: ' + (error.data && error.data.error), 'error');
          });
      } else {
        ApiService.createMaterial($scope.currentMaterial)
          .then(function() {
            $scope.showMessage('Material created successfully!', 'success');
            $scope.loadMaterials();
            $scope.resetForm();
          })
          .catch(function(error) {
            $scope.showMessage('Error creating material: ' + (error.data && error.data.error), 'error');
          });
      }
    };

    $scope.editMaterial = function(material) {
      $scope.currentMaterial = angular.copy(material);
      $scope.isEditing = true;
      window.scrollTo(0, 0);
    };

    $scope.deleteMaterial = function(id) {
      $scope.confirmingDelete = id;
    };

    $scope.confirmDelete = function() {
      if (!$scope.confirmingDelete) return;
      var id = $scope.confirmingDelete;
      ApiService.deleteMaterial(id)
        .then(function() {
          $scope.showMessage('Material deleted successfully!', 'success');
          $scope.confirmingDelete = null;
          $scope.loadMaterials();
        })
        .catch(function(error) {
          $scope.showMessage('Error deleting material: ' + (error.data && error.data.error), 'error');
          $scope.confirmingDelete = null;
        });
    };

    $scope.cancelDelete = function() {
      $scope.confirmingDelete = null;
    };

    $scope.resetForm = function() {
      $scope.currentMaterial = {};
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

    $scope.loadMaterials();
  }]);
