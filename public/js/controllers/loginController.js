angular.module('supplyChainApp')
    .controller('LoginController', ['$scope', '$location', '$rootScope', 'ApiService', 
        function($scope, $location, $rootScope, ApiService) {
        
        $scope.credentials = {
            username: '',
            password: ''
        };
        
        $scope.errorMessage = '';
        
        // Check if already logged in
        ApiService.checkAuth().then(function(response) {
            if (response.data.authenticated) {
                $location.path('/');
            }
        });
        
        $scope.login = function() {
            $scope.errorMessage = '';
            
            ApiService.login($scope.credentials).then(function(response) {
                $rootScope.currentUser = response.data.user;
                $location.path('/');
            }).catch(function(error) {
                $scope.errorMessage = error.data.error || 'Login failed';
            });
        };
    }]);
