angular.module('designer.workspace.canvases.jointjs.resource.highlighter', [])
.directive('highlightResources', ["$rootScope", function($rootScope) {
  return {
    scope: {
      resource: "=highlightResources"
    },
    link: function (scope, element, attrs) {
      scope.highlighted = [];

      scope.highlight = function() {
        $rootScope.$broadcast("resource:highlight", scope.resource);
      };

      scope.unhighlight = function() {
        $rootScope.$broadcast("resource:unhighlight");
      };

      element.on('mouseover',  scope.highlight);
      element.on('mouseleave', scope.unhighlight);
      scope.$on('$destroy', function() {
        element.off('mouseover',  scope.highlight);
        element.off('mouseleave', scope.unhighlight);
      });
    }
  }
}]);
