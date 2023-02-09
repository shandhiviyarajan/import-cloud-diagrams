angular.module('designer.workspace.layout.infrastructure.container', [

])
.directive('infrastructureContainer',
  ["DesignerConfig", function(DesignerConfig) {
    return {
      templateUrl: '/designer/workspace/layout/infrastructure/infrastructure.container.html',
      replace: true,
      controllerAs: "InfrastructureContainer",
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
