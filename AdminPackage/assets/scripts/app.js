var cmsApp = angular.module('cmsApp', ['LocalStorageModule', 'ui.router', 'ui.bootstrap', 'ngTable'])
    .config(function ($httpProvider, localStorageServiceProvider, $stateProvider, $urlRouterProvider) {

        $httpProvider.interceptors.push("APIInterceptor");

        localStorageServiceProvider.setPrefix('cmsApp');

        $stateProvider.state('login', {
            url: "/login",
            templateUrl: "admin/views/login.html",
            controller: "LoginController"
        }).state("dashboard", {
            url: "/dashboard",
            templateUrl: "admin/views/dashboard.html",
            controller: "DashboardController"
        }).state("users", {
            url: "/users",
            templateUrl: "admin/views/users.html",
            controller: "UsersController"
        });
        $urlRouterProvider.otherwise("/dashboard");
    })
    .run(function ($state, $rootScope, ApiService) {

        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            if (!ApiService.isLoggedIn()) {
                $state.go("login");
            }
        });

        ApiService.init(function (data) {
            if (!data.isLoggedIn) {
                $state.go("login")
            }
        });

    });