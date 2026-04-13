angular.module('supplyChainApp')
    .controller('MainController', ['$scope', '$rootScope', '$location', 'ApiService', 
        function($scope, $rootScope, $location, ApiService) {
        
        $scope.isAuthenticated = false;
        $scope.currentUser = {};
        $scope.showDropdown = false;
        $scope.$location = $location;

        $scope.hasRole = function(allowedRoles) {
            if (!$scope.currentUser || !Array.isArray(allowedRoles)) {
                return false;
            }
            return allowedRoles.indexOf($scope.currentUser.role) !== -1;
        };

        $scope.getRoleLabel = function(role) {
            var labels = {
                admin: 'Administrator',
                supplier: 'Supplier',
                manufacturer: 'Manufacturer',
                customer: 'Customer'
            };
            return labels[role] || 'User';
        };
        
        // Toggle dropdown
        $scope.toggleDropdown = function() {
            $scope.showDropdown = !$scope.showDropdown;
        };
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(event) {
            const dropdown = document.querySelector('.user-profile');
            if (dropdown && !dropdown.contains(event.target)) {
                $scope.$apply(function() {
                    $scope.showDropdown = false;
                });
            }
        });
        
        // Check authentication status
        $scope.checkAuth = function() {
            ApiService.checkAuth().then(function(response) {
                $scope.isAuthenticated = response.data.authenticated;
                if (response.data.authenticated) {
                    $scope.currentUser = response.data.user;
                    $rootScope.currentUser = response.data.user;
                } else {
                    $scope.currentUser = {};
                    $rootScope.currentUser = {};
                }
            });
        };
        
        $scope.logout = function() {
            ApiService.logout().then(function() {
                $scope.isAuthenticated = false;
                $scope.currentUser = {};
                $rootScope.currentUser = {};
                $location.path('/login');
            });
        };
        
        // Watch for authentication changes
        $rootScope.$on('$routeChangeSuccess', function() {
            $scope.checkAuth();
        });
        
        $scope.checkAuth();
    }]);
