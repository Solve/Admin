cmsApp.controller('LoginController', function($scope, $rootScope, $state, ApiService) {
    if (ApiService.isLoggedIn()) $state.go('dashboard');

    $scope.data = {
        email: '',
        password: ''
    };

    $scope.isEmpty = function() {
        return !($scope.data.email && $scope.data.password);
    };

    $scope.doSignIn = function() {
        ApiService.login($scope.data, function(r) {
            if (r.status == 200) {
                $scope.$emit('USER_LOGGED_IN');
                $state.go('dashboard');
            } else {
                $scope.data = {};
                //@todo show errors
            }
        });

        return true;
    };

});