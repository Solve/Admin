var cmsApp = angular.module('cmsApp', ['LocalStorageModule', 'ui.router', 'ui.bootstrap', 'ngTable', 'ngAnimate'])
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
            template: '<ui-view/>'
        }).state("users.list", {
            url: "/users",
            templateUrl: "admin/views/list/table.html",
            controller: "UsersController"
        }).state("users.edit", {
            url: "/users/:id/",
            templateUrl: "admin/views/list/form.html",
            controller: "ObjectsInfoController"
        }).state("users.add", {
            url: "/users/add",
            templateUrl: "admin/views/list/form.html",
            controller: "ObjectsInfoController"
        });
        $urlRouterProvider.otherwise(function($injector, $location) {
            console.log('otherwise', $injector.get('ApiService').isLoggedIn());
            if ($injector.get('ApiService').isLoggedIn()) {
                $location.path('/dashboard');
            } else {
                $location.path('/login');
            }
        });
    })
    .run(function ($state, $rootScope, ApiService) {

        $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
            if (!ApiService.isLoggedIn() && toState.name !== "login") {
                event.preventDefault();
                $state.go("login");
            }
        });

        ApiService.init(function (data) {
            if (!data.isLoggedIn) {
                $state.go("login")
            }
        });

    });