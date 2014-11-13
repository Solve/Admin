angular.module("cmsApp").factory("ApiService",
    function ($http, $rootScope, $filter, localStorageService) {
        var _sessionToken = localStorageService.get("sessionToken") || undefined;
        var _isLoggedIn = localStorageService.get("isLoggedIn") || false;

        function isLoggedIn() {
            return _isLoggedIn;
        }

        function init(callback) {
            var data = {};
            if (_sessionToken) {
                data.sessionToken = _sessionToken;
            }

            $http({
                method: "POST",
                url: API_ENDPOINT + "init/",
                data: data
            }).success(function (response) {
                _sessionToken = response.data["Session-Token"];
                _isLoggedIn = response.data.isLoggedIn;
                localStorageService.add("sessionToken", _sessionToken);
                localStorageService.add("isLoggedIn", _isLoggedIn);

                if (callback) callback(response.data);
            }).error(function (response) {
                if (callback) callback(response.data);
            });
        }

        function login(params, callback) {
            $http({
                method: "POST",
                url: API_ENDPOINT + "login/",
                data: {data: params}
            }).success(function (response) {
                localStorageService.add('user', response.data.user);
                _isLoggedIn = true;

                if (callback) callback(response);
            }).error(function (response) {
                if (callback) callback(response);
            });
        }

        function logout(callback) {
            $http({
                method: "POST",
                url: API_ENDPOINT + "logout/",
                callback: callback
            }).success(function (response) {
                localStorageService.remove('user');
                _isLoggedIn = false;

                if (callback) callback(response);
            }).error(function (response) {
                if (callback) callback(response);
            });
        }

        return {
            isLoggedIn: isLoggedIn,
            init: init,
            login: login,
            logout: logout
        }
    }
);
