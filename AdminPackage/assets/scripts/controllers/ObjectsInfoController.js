cmsApp.controller('ObjectsInfoController', function ($scope, $state, $stateParams, ApiService, ngTableParams) {

    $scope._moduleName = $stateParams.module;

    $scope.object = {};

    ApiService.getModuleConfig($scope._moduleName, function (config) {
        $scope.moduleConfig = config;
        if ($stateParams.id) {
            ApiService.getObject($scope._moduleName, {id: $stateParams.id}, function(object) {
                $scope.object = object;
            });
        }
    });

    $scope.doSave = function() {
        ApiService.saveObject($scope._moduleName, $scope.object, function(response) {
            if (response.status == 200) {
                $state.go('objects.list', {module: $scope._moduleName});
            }
        });
    }

});
