cmsApp.controller('ApplicationController', function($scope, $state, ApiService) {

    $scope.doLogOut = function() {
        ApiService.logout(function() {
            $state.go('login');
        });
    }

});