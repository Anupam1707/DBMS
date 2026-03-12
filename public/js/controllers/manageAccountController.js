angular.module('supplyChainApp')
    .controller('ManageAccountController', ['$scope', '$rootScope', 'ApiService', 
        function($scope, $rootScope, ApiService) {
        
        $scope.currentUser = $rootScope.currentUser || {};
        $scope.successMessage = '';
        $scope.errorMessage = '';
        $scope.passwordSuccess = '';
        $scope.passwordError = '';
        
        // Initialize profile data
        $scope.profileData = {
            username: $scope.currentUser.username,
            fullName: $scope.currentUser.fullName || '',
            email: $scope.currentUser.email || ''
        };
        
        // Initialize password data
        $scope.passwordData = {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        };
        
        // Update profile
        $scope.updateProfile = function() {
            $scope.successMessage = '';
            $scope.errorMessage = '';
            
            ApiService.updateProfile($scope.profileData).then(function(response) {
                $scope.successMessage = 'Profile updated successfully!';
                $rootScope.currentUser.fullName = $scope.profileData.fullName;
                $rootScope.currentUser.email = $scope.profileData.email;
                
                // Clear success message after 3 seconds
                setTimeout(function() {
                    $scope.$apply(function() {
                        $scope.successMessage = '';
                    });
                }, 3000);
            }).catch(function(error) {
                $scope.errorMessage = error.data.error || 'Failed to update profile';
            });
        };
        
        // Change password
        $scope.changePassword = function() {
            $scope.passwordSuccess = '';
            $scope.passwordError = '';
            
            // Validate passwords match
            if ($scope.passwordData.newPassword !== $scope.passwordData.confirmPassword) {
                $scope.passwordError = 'New passwords do not match';
                return;
            }
            
            // Validate password length
            if ($scope.passwordData.newPassword.length < 6) {
                $scope.passwordError = 'Password must be at least 6 characters long';
                return;
            }
            
            ApiService.changePassword($scope.passwordData).then(function(response) {
                $scope.passwordSuccess = 'Password changed successfully!';
                
                // Clear form
                $scope.passwordData = {
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                };
                
                // Clear success message after 3 seconds
                setTimeout(function() {
                    $scope.$apply(function() {
                        $scope.passwordSuccess = '';
                    });
                }, 3000);
            }).catch(function(error) {
                $scope.passwordError = error.data.error || 'Failed to change password';
            });
        };
    }]);
