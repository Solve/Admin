cmsApp.controller('LoginController', function($scope, $rootScope, $state, ApiService) {

    $scope.data = {
        email: '',
        password: ''
    };
    $rootScope.isFullScreen = true;

    $scope.isEmpty = function() {
        return !($scope.data.email && $scope.data.password);
    };

    $scope.doSignIn = function() {
        ApiService.login($scope.data, function(r) {
            if (r.status == 200) {
                $rootScope.isFullScreen = false;
                $state.go('dashboard');
            } else {
                $scope.data = {};
                //@todo show errors
            }
        });

        return true;
    };

});