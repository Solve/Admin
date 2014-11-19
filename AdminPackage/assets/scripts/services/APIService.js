angular.module("cmsApp").factory("ApiService", function ($http, $rootScope, $filter, $q, localStorageService) {

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
            $http.post(API_ENDPOINT + "logout/")
                .success(function (response) {
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


            getModuleConfig: function (moduleName) {
                var q = $q.defer();
                if (_moduleConfigs[moduleName]) {
                    q.resolve(_moduleConfigs[moduleName]);
                    return q.promise;
                }
                $http.post(API_ENDPOINT + moduleName + "/get-config/")
                    .success(function (r) {
                        _moduleConfigs[moduleName] = r.data;
                        q.resolve(_moduleConfigs[moduleName]);
                    }).error(function (r) {
                        q.reject(r);
                    });
                return q.promise;
            },

            getObjectsList: function (moduleName, params) {
                var q = $q.defer();
                $http.post('/admin/' + moduleName + '/list/', params)
                    .success(function (response) {
                        q.resolve(response.data);
                    }).error(function (r) {
                        q.reject(r);
                    });
                return q.promise;
            },

            getObject: function (moduleName, params) {
                var q = $q.defer();
                $http.post('/admin/' + moduleName + '/info/', params)
                    .success(function (response) {
                        q.resolve(response.data.object);
                    }).error(function (r) {
                        q.reject(r);
                    });
                return q.promise;
            },

            saveObject: function (moduleName, data, callback) {
                var q = $q.defer();
                $http.post(API_ENDPOINT + moduleName + "/save/", {data: data})
                    .success(function (response) {
                        q.resolve(response.data.object);
                    }).error(function (r) {
                        q.reject(r);
                    });
                return q.promise;
            }
        }
    }
);
