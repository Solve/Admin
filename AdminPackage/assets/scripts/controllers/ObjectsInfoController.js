cmsApp.controller('ObjectsInfoController', function ($scope, $state, ApiService, ngTableParams) {

    $scope.object = {};

    ApiService.getModuleConfig('users', function (config) {

    });

    $scope.doSave = function() {
        ApiService.saveObject('users', $scope.object, function(response) {
            if (response.status == 200) {
                $state.go('users.list');
            }
        });
    }

});
