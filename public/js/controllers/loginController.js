angular.module('supplyChainApp')
    .controller('LoginController', ['$scope', '$location', '$rootScope', 'ApiService', 
        function($scope, $location, $rootScope, ApiService) {
        
        $scope.credentials = {
            username: '',
            password: '',
            role: ''
        };

        $scope.loginTypes = [
            { value: 'admin', label: 'Admin' },
            { value: 'supplier', label: 'Supplier' },
            { value: 'manufacturer', label: 'Manufacturer' },
            { value: 'customer', label: 'Customer' }
        ];
        
        $scope.errorMessage = '';
        
        // Check if already logged in
        ApiService.checkAuth().then(function(response) {
            if (response.data.authenticated) {
                var role = response.data.user && response.data.user.role;
                var redirectPath = $rootScope.getDefaultPathForRole ? $rootScope.getDefaultPathForRole(role) : '/';
                $location.path(redirectPath);
            }
        });
        
        $scope.login = function() {
            $scope.errorMessage = '';
            
            ApiService.login($scope.credentials).then(function(response) {
                $rootScope.currentUser = response.data.user;
                var role = response.data.user && response.data.user.role;
                var redirectPath = $rootScope.getDefaultPathForRole ? $rootScope.getDefaultPathForRole(role) : '/';
                $location.path(redirectPath);
            }).catch(function(error) {
                $scope.errorMessage = (error.data && error.data.error) || 'Login failed. Please check your credentials.';
            });
        };
    }]);
