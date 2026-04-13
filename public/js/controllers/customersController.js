angular.module('supplyChainApp')
  .controller('CustomersController', ['$scope', 'ApiService', function($scope, ApiService) {
    $scope.customers = [];
    $scope.currentCustomer = {};
    $scope.isEditing = false;
    $scope.confirmingDelete = null;
    $scope.loading = false;
    $scope.errorMessage = '';
    $scope.message = '';
    $scope.messageType = '';

    $scope.loadCustomers = function() {
      $scope.loading = true;
      $scope.errorMessage = '';

      ApiService.getCustomers()
        .then(function(response) {
          $scope.customers = response.data.customers || [];
          $scope.loading = false;
        })
        .catch(function(error) {
          $scope.errorMessage = (error.data && error.data.error) || 'Failed to load customers';
          $scope.loading = false;
        });
    };

    $scope.buildPayload = function() {
      var payload = {
        username: $scope.currentCustomer.username,
        fullName: $scope.currentCustomer.fullName,
        email: $scope.currentCustomer.email,
        contactNumber: $scope.currentCustomer.contactNumber,
        address: $scope.currentCustomer.address,
        password: $scope.currentCustomer.password
      };

      if (!payload.password) {
        delete payload.password;
      }

      return payload;
    };

    $scope.saveCustomer = function() {
      var payload = $scope.buildPayload();

      if ($scope.isEditing) {
        ApiService.updateCustomer($scope.currentCustomer.customerId, payload)
          .then(function() {
            $scope.showMessage('Customer updated successfully!', 'success');
            $scope.loadCustomers();
            $scope.resetForm();
          })
          .catch(function(error) {
            $scope.showMessage('Error updating customer: ' + (error.data && error.data.error), 'error');
          });
      } else {
        ApiService.createCustomer(payload)
          .then(function() {
            $scope.showMessage('Customer created successfully!', 'success');
            $scope.loadCustomers();
            $scope.resetForm();
          })
          .catch(function(error) {
            $scope.showMessage('Error creating customer: ' + (error.data && error.data.error), 'error');
          });
      }
    };

    $scope.editCustomer = function(customer) {
      $scope.currentCustomer = {
        customerId: customer.customerId,
        username: customer.username,
        fullName: customer.fullName,
        email: customer.email,
        contactNumber: customer.contactNumber,
        address: customer.address,
        password: ''
      };
      $scope.isEditing = true;
      window.scrollTo(0, 0);
    };

    $scope.toggleOrders = function(customer) {
      customer.showOrders = !customer.showOrders;
    };

    $scope.getOrderCount = function(customer) {
      return (customer.orders && customer.orders.length) || 0;
    };

    $scope.deleteCustomer = function(id) {
      $scope.confirmingDelete = id;
    };

    $scope.confirmDelete = function() {
      if (!$scope.confirmingDelete) return;
      var id = $scope.confirmingDelete;

      ApiService.deleteCustomer(id)
        .then(function() {
          $scope.showMessage('Customer deleted successfully!', 'success');
          $scope.confirmingDelete = null;
          $scope.loadCustomers();
        })
        .catch(function(error) {
          $scope.showMessage('Error deleting customer: ' + (error.data && error.data.error), 'error');
          $scope.confirmingDelete = null;
        });
    };

    $scope.cancelDelete = function() {
      $scope.confirmingDelete = null;
    };

    $scope.resetForm = function() {
      $scope.currentCustomer = {};
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

    $scope.loadCustomers();
  }]);
