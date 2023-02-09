angular.module('designer.workspace.layout', [
  'designer.workspace.layout.container',
  'designer.workspace.layout.infrastructure',
  'designer.workspace.layout.security',
])
.directive('designerLayout',
  [function() {
    return {
      templateUrl: '/designer/workspace/layout/layout.html',
      controllerAs: "DesignerLayout",
      controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs) {
        this.environment = $scope.Designer.environment;
      }],
      link: function(scope, element, attrs, ctrl) {
        scope.$on("view:positioned", function(e, view_id, positions) {
          ctrl.environment = null;
        });

        scope.$on("environment:reloaded", function() {
          ctrl.environment = scope.Designer.environment;
        });

        scope.$on("view:selected", function() {
          if(!scope.Designer.environment.current_view.positioned)
            ctrl.environment = scope.Designer.environment;
        });

        scope.$on("view:reposition", function() {
          ctrl.environment = scope.Designer.environment;
        });
      }
    }
  }]);
