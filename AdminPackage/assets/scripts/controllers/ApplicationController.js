cmsApp.controller('ApplicationController', function($scope, $state, ApiService, localStorageService) {
    $scope.isFullScreen = true;

    if (ApiService.isLoggedIn()) {
        $scope.isFullScreen = false;
    } else {
        $state.go('login');
    }


    $scope.doLogOut = function() {
        ApiService.logout(function() {
            $scope.isFullScreen = true;
            $state.go('login');
        });
    };

    $scope.$on('USER_LOGGED_IN', function() {
        $scope.isFullScreen = false;
    });

    $scope.doSearch = function(event) {
        if (event.keyCode == 13) {
            if ($scope.tableParams) {
                $scope.tableParams.filter({'query': $scope.searchKeywords});
            }
            $scope.searchKeywords = '';
        }
    };

});