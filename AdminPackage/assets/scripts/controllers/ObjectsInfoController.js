cmsApp.controller('ObjectsInfoController', function ($scope, $state, $stateParams, ApiService, ngTableParams) {

    $scope._moduleName = $stateParams.module;
    var cache = $cacheFactory.get('module_cache_' + $scope._moduleName) || $cacheFactory('module_cache_' + $scope._moduleName);

    $scope.object = {};

    ApiService.getModuleConfig($scope._moduleName).then(function (config) {
        $scope.moduleConfig = config;
        if ($stateParams.id) {
            ApiService.getObject($scope._moduleName, {id: $stateParams.id}).then(function(object) {
                $scope.object = object;
            });
        }
    });

    $scope.doSave = function() {
        ApiService.saveObject($scope._moduleName, $scope.object).then(function (response) {
            if (response.status == 200) {
                $state.go('objects.list', {module: $scope._moduleName});
            }
        });
    }

});
