angular.module('cmsApp').directive('solveInput', function ($parse) {
    var config = {};

    return {
        replace: true,
        scope: {
            info: '=info',
            object: '=',
            moduleName: '='
        },
        controller: function($scope, $element, $attrs) {
        },
        link: function(scope, element, attrs) {
        },
        template: '<div class="form-group">\n    <label for="input-{{ info.name }}" class="col-sm-2 control-label">{{ info.title }}</label>\n    <div class="col-sm-10">\n        <input id="input-{{ info.name }}" type="text" class="form-control" ng-model="object[info.name]">\n        <p class="help-block">{{ info.help }}</p>\n    </div>\n</div>'
    };
});