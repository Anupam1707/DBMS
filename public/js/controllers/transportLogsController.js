angular.module('supplyChainApp')
  .controller('TransportLogsController', ['$scope', 'ApiService', function($scope, ApiService) {
    $scope.transportLogs = [];
    $scope.suppliers = [];
    $scope.materials = [];
    $scope.currentLog = {};
    $scope.isEditing = false;
    $scope.message = '';
    $scope.messageType = '';
    $scope.transportModes = ['Air', 'Ship', 'Truck', 'Rail'];

    $scope.loadTransportLogs = function() {
      ApiService.getTransportLogs()
        .then(function(response) {
          $scope.transportLogs = response.data.transportLogs;
        })
        .catch(function(error) {
          $scope.showMessage('Error loading transport logs: ' + error.data.error, 'error');
        });
    };

    $scope.loadSuppliers = function() {
      ApiService.getSuppliers()
        .then(function(response) {
          $scope.suppliers = response.data.suppliers;
        });
    };

    $scope.loadMaterials = function() {
      ApiService.getMaterials()
        .then(function(response) {
          $scope.materials = response.data.materials;
        });
    };

    $scope.saveTransportLog = function() {
      if ($scope.isEditing) {
        ApiService.updateTransportLog($scope.currentLog.Log_ID, $scope.currentLog)
          .then(function(response) {
            $scope.showMessage('Transport log updated successfully!', 'success');
            $scope.loadTransportLogs();
            $scope.resetForm();
          })
          .catch(function(error) {
            $scope.showMessage('Error updating transport log: ' + error.data.error, 'error');
          });
      } else {
        ApiService.createTransportLog($scope.currentLog)
          .then(function(response) {
            $scope.showMessage('Transport log created successfully!', 'success');
            $scope.loadTransportLogs();
            $scope.resetForm();
          })
          .catch(function(error) {
            $scope.showMessage('Error creating transport log: ' + error.data.error, 'error');
          });
      }
    };

    $scope.editTransportLog = function(log) {
      $scope.currentLog = angular.copy(log);
      $scope.isEditing = true;
      window.scrollTo(0, 0);
    };

    $scope.deleteTransportLog = function(id) {
      if (confirm('Are you sure you want to delete this transport log?')) {
        ApiService.deleteTransportLog(id)
          .then(function(response) {
            $scope.showMessage('Transport log deleted successfully!', 'success');
            $scope.loadTransportLogs();
          })
          .catch(function(error) {
            $scope.showMessage('Error deleting transport log: ' + error.data.error, 'error');
          });
      }
    };

    $scope.resetForm = function() {
      $scope.currentLog = {};
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

    $scope.loadTransportLogs();
    $scope.loadSuppliers();
    $scope.loadMaterials();
  }]);
