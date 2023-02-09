angular.module('designer.workspace.layout.container.hexgrid', [])
.directive('containerHexgrid',
  ["DesignerConfig", function(DesignerConfig) {
    return {
      templateUrl: '/designer/workspace/layout/container/container.hexgrid.html',
      replace: true,
      controllerAs: "ContainerHexgrid",
      scope: {
        container: "=",
        view: "="
      },
      controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs) {

      }],
      link: function(scope, element, attrs, ctrl) {

      }
    }
  }]);
