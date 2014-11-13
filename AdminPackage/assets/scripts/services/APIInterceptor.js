angular.module("cmsApp").factory("APIInterceptor",
        function($rootScope, localStorageService) {
            return {
                request: function(config) {
                    var token							= localStorageService.get("sessionToken");

                    if (token) {
                        config.headers["Session-Token"]	= token;
                    }
                    config.headers['X-Requested-With'] = 'XMLHttpRequest';
                    return config;
                },

				response: function(response) {
					if (response && response.data && (response.data.status == 401)) {
						$rootScope.$broadcast("APIInterceptor_ERROR_UNAUTHORIZED");
					}

					return response;
				},

                responseError: function(response) {
                    if (response.status == 401) {
                        $rootScope.$broadcast("APIInterceptor_ERROR_UNAUTHORIZED");
                    }

                    return response;
                }
            };
        }
);
