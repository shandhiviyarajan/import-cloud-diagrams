angular.module('designer.workspace.layout.infrastructure.parent', [

])
.directive('infrastructureParent',
  ["DesignerConfig", function(DesignerConfig) {
    return {
      templateUrl: '/designer/workspace/layout/infrastructure/infrastructure.parent.html',
      replace: true,
      controllerAs: "InfrastructureParent",
      scope: {
        container: "=",
        view: "="
      },
      controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs) {
        $scope.generic = function (item) { 
          return item.startsWith("generic"); 
        };

        $scope.regular = function (item) { 
          return !item.startsWith("generic"); 
        };
      }],
      link: function(scope, element, attrs, ctrl) {

      }
    }
  }]);
