cmsApp.controller('UsersController', function ($scope, $http, $state, ApiService, ngTableParams) {


    ApiService.getModuleConfig('users', function (data) {
        $scope.moduleConfig = data;

        $scope.tableParams = new ngTableParams({
            page: 1,
            count: 10,
            sorting: {
                name: 'asc'
            }
        }, {
            total: 0,
            getData: function ($defer, params) {
                $http.post('/admin/users/list/', params.$params)
                    .success(function (response) {
                        params.total(response.data.paging.total);
                        params.pagesCountOptions = [10, 25, 50];

                        params.currentCount = response.data.paging.count;
                        params.currentPage = response.data.paging.page;
                        params.currentResultsCount = response.data.objects.length || 0;

                        params.sorting(response.data.sorting);
                        $defer.resolve(response.data.objects);
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
        $state.go('users.edit', {id:2});
    }

});
