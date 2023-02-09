angular.module('designer.workspace.layout.container.cell', [])
.directive('containerCell',
  ["DesignerConfig", function(DesignerConfig) {
    return {
      templateUrl: '/designer/workspace/layout/container/container.cell.html',
      replace: true,
      controllerAs: "ContainerCell",
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
