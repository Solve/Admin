angular.module('cmsApp').directive('solveInputFile', function ($timeout) {
    return {
        replace: true,
        scope: {
            info: '=info',
            object: '=',
            moduleName: '='
        },
        controller: function ($scope, $timeout, $upload) {
            $scope.onFileSelect = function ($files, event) {
                for (var i = 0; i < $files.length; i++) {
                    var file = $files[i];

                    var uploadParams = {
                        url: API_ENDPOINT + $scope.moduleName + '/upload/',
                        data: {
                            id: $scope.object ? $scope.object.id : null
                        },
                        file: file,
                        fileFormDataName: $scope.name
                    };

                    $upload.upload(uploadParams).progress(function (evt) {
                        $scope.isVisibleProgress = true;
                        $scope.uploadPercent = parseInt(100.0 * evt.loaded / evt.total);
                        if ($scope.uploadPercent == 100) {
                            $timeout(function () {
                                $scope.isVisibleProgress = false;
                            }, 500);
                        }
                    }).success(function (reponse, status, headers, config) {
                        var fileInfo = reponse.data.preview[$scope.name];
                        $scope.showPreview(fileInfo);
                    });
                }
            };
        },
        template: '<div class="form-group">\n    <label for="input-{{name}}" class="col-sm-2 control-label">{{title}}</label>\n    <div class="col-sm-10">\n        <input id="input-{{name}}" name="{{name}}" type="file" class="form-control" ng-file-select="onFileSelect($files, $event)">\n        <div ng-style="{opacity: isVisibleProgress ? 1 : 0}" style="width:{{uploadPercent}}%;height:2px;background:#5b90bf;-webkit-transition: all 500ms;transition: all 500ms;"></div>\n        <p class="help-block">{{helpContent}}</p>\n    </div>\n</div>',
        link: function (scope, element) {
            scope.title = scope.info.title;
            scope.name = scope.info.name;
            scope.isVisibleProgress = false;
            scope.helpContent = 'Select file to upload';
            scope.helpElement = angular.element(element.find('p'));
            $timeout(function() {
                if (scope.object[scope.name]) scope.showPreview(scope.object[scope.name]);
            }, 500);
            scope.showPreview = function(fileInfo) {
                if (fileInfo && fileInfo.is_exists) {
                    var fileLink = BASE_URI + fileInfo['link'];

                    var linkContent = 'preview file('+ fileInfo.size +')';
                    if (fileInfo.type.indexOf('image') !== -1) {
                        linkContent = '<img style="max-width:100px;max-height:100px;" src="'+fileLink+'"/>';
                    }
                    scope.helpElement.html('<a href="' + fileLink + '" target="_blank">' + linkContent + '</a>');
                    scope.object[scope.name] = fileLink;
                }

            }
        }
    };
});