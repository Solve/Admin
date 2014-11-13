cmsApp.controller('UsersController', function($scope, $http, ngTableParams, localStorageService) {

    $scope.tableParams = new ngTableParams({
        page: 1,            // show first page
        count: 20,          // count per page
        sorting: {
            name: 'asc'     // initial sorting
        }
    }, {
        total: 0,           // length of data
        getData: function($defer, params) {
            // ajax request to api
            $http.get('/admin/users/').success(function(response) {
                params.total(3);
                $defer.resolve(response.data);
            });
        }
    });

});