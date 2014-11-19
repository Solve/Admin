cmsApp.controller('ObjectsController', function ($scope, $http, $state, $stateParams, ApiService, $cacheFactory, ngTableParams) {

    $scope._moduleName = $stateParams.module;
    var cache = $cacheFactory.get('module_cache_' + $scope._moduleName) || $cacheFactory('module_cache_' + $scope._moduleName);

    ApiService.getModuleConfig($scope._moduleName)
        .then(function (config) {
            $scope.moduleConfig = config;

            $scope.tableParams = new ngTableParams(getTableSettings(), {
                getData: function ($defer, paramsObject) {
                    ApiService.getObjectsList($scope._moduleName, paramsObject.$params).then(function(data) {
                        paramsObject.total(data.paging.total);
                        paramsObject.pagesCountOptions = [10, 25, 50];

                        paramsObject.currentCount = data.paging.count;
                        paramsObject.currentPage = data.paging.page;
                        paramsObject.currentResultsCount = data.objects.length || 0;
                        if (data.sorting) paramsObject.sorting(data.sorting);

                        cache.put('params', {
                            page: data.paging.page,
                            count: data.paging.count,
                            sorting : data.sorting || paramsObject.sorting
                        });
                        $defer.resolve(data.objects);
                    });
                }
            });

        });

    $scope.sortTableBy = function (columnName) {
        var sortingConfig = {};
        sortingConfig[columnName] = $scope.tableParams.isSortBy(columnName, 'asc') ? 'desc' : 'asc';

        $scope.tableParams.sorting(sortingConfig);
    };

    $scope.addNew = function() {
        $state.go('objects.add', {module: $scope._moduleName});
    };

    function getTableSettings() {
        var config = cache.get('params') || {
                page: 1,
                count: 10,
                sorting: {
                    name: 'asc'
                }
            };
        return config;
    }

});
