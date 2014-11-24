cmsApp.controller('ObjectsController', function ($scope, $http, $state, $stateParams, ApiService, $cacheFactory, ngTableParams) {

    $scope._moduleName = $stateParams.module;
    var cache = $cacheFactory.get('module_cache_' + $scope._moduleName) || $cacheFactory('module_cache_' + $scope._moduleName);
    $scope.selectedRowsIds = [];

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
                        $scope.selectedRowsIds = [];

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

    $scope.changeSelection = function(object) {
        if (object.$selected) {
            $scope.selectedRowsIds.push(object.id);
        } else {
            var index = $scope.selectedRowsIds.indexOf(object.id);
            if (index > -1) {
                $scope.selectedRowsIds.splice(index, 1);
            }
        }
    };

    $scope.addObject = function() {
        $state.go('objects.add', {module: $scope._moduleName});
    };

    $scope.deleteObjects = function() {
        if (confirm('Are you sure (' + $scope.selectedRowsIds.join(',') + ')?')) {
            ApiService.deleteObjectsByIds($scope._moduleName, $scope.selectedRowsIds)
                .then(function(response) {
                    $scope.tableParams.reload();
                });
        }
    };

    function getTableSettings() {
        return cache.get('params') || {
                page: 1,
                count: 10,
                sorting: {
                    name: 'asc'
                }
            }
    }

});
