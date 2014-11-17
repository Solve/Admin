angular.module("cmsApp").factory("ApiService",
    function ($http, $rootScope, $filter, localStorageService) {

        var _sessionToken = localStorageService.get("sessionToken") || undefined;
        var _isLoggedIn = localStorageService.get("isLoggedIn");

        if (_isLoggedIn == null || _isLoggedIn == "false") {
            _isLoggedIn = false;
        } else {
            _isLoggedIn = true;
        }
        var _moduleConfigs = {};


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
                _sessionToken = response.data["session-token"];
                _isLoggedIn = response.data.isLoggedIn == true;
                localStorageService.set("sessionToken", _sessionToken);
                localStorageService.set("isLoggedIn", _isLoggedIn);

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
                localStorageService.set('user', response.data.user);
                localStorageService.set('isLoggedIn', true);
                _isLoggedIn = true;

                if (callback) callback(response);
            }).error(function (response) {
                if (callback) callback(response);
            });
        }

        function logout(callback) {
            $http({
                method: "POST",
                url: API_ENDPOINT + "logout/"
            }).success(function (response) {
                localStorageService.remove('user');
                localStorageService.set('isLoggedIn', false);
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
            logout: logout,


            getModuleConfig: function(moduleName, callback) {
                if (_moduleConfigs[moduleName]) {
                    callback(_moduleConfigs[moduleName]);
                    return true;
                }
                $http({
                    method: "POST",
                    url: API_ENDPOINT + moduleName + "/get-config/"
                }).success(function (response) {
                    _moduleConfigs[moduleName] = response.data;
                    if (callback) callback(response);
                }).error(function (response) {
                    if (callback) callback(response);
                });
            },

            saveObject: function(moduleName, data, callback) {
                $http({
                    method: "POST",
                    url: API_ENDPOINT + moduleName + "/save/",
                    data: {
                        data: data
                    }
                }).success(function(response) {
                    callback(response);
                });
            }
        }
    }
);
