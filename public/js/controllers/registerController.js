angular.module('supplyChainApp')
    .controller('RegisterController', ['$scope', '$location', '$timeout', 'ApiService', 
        function($scope, $location, $timeout, ApiService) {
        
        $scope.user = {
            username: '',
            password: '',
            confirmPassword: '',
            email: '',
            fullName: '',
            agreeToTerms: false
        };
        
        $scope.errorMessage = '';
        $scope.successMessage = '';
        $scope.passwordMismatch = false;
        
        // Check if already logged in
        ApiService.checkAuth().then(function(response) {
            if (response.data.authenticated) {
                $location.path('/');
            }
        });
        
        $scope.checkPasswordMatch = function() {
            if ($scope.user.password && $scope.user.confirmPassword) {
                $scope.passwordMismatch = $scope.user.password !== $scope.user.confirmPassword;
            } else {
                $scope.passwordMismatch = false;
            }
        };
        
        $scope.register = function() {
            $scope.errorMessage = '';
            $scope.successMessage = '';
            
            // Validate passwords match
            if ($scope.user.password !== $scope.user.confirmPassword) {
                $scope.errorMessage = 'Passwords do not match';
                return;
            }
            
            // Validate password length
            if ($scope.user.password.length < 6) {
                $scope.errorMessage = 'Password must be at least 6 characters long';
                return;
            }
            
            // Validate username
            if ($scope.user.username.length < 3) {
                $scope.errorMessage = 'Username must be at least 3 characters long';
                return;
            }
            
            // Prepare registration data
            var registrationData = {
                username: $scope.user.username,
                password: $scope.user.password,
                email: $scope.user.email,
                fullName: $scope.user.fullName
            };
            
            // Call registration API
            ApiService.register(registrationData).then(function(response) {
                $scope.successMessage = 'Registration successful! Redirecting to login...';
                
                // Redirect to login after 2 seconds
                $timeout(function() {
                    $location.path('/login');
                }, 2000);
                
            }).catch(function(error) {
                $scope.errorMessage = error.data.error || 'Registration failed. Please try again.';
            });
        };
    }]);
