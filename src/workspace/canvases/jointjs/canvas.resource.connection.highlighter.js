angular.module('designer.workspace.canvases.jointjs.resource.connections.highlighter', [])
.directive('highlightConnectedResources', ["$rootScope", function($rootScope) {
  return {
    scope: {
      resource: "=highlightConnectedResources"
    },
    link: function (scope, element, attrs) {
      scope.highlighted = [];

      scope.highlight = function() {
        $rootScope.$broadcast("connected:highlight", scope.resource);
      };

      scope.unhighlight = function() {
        $rootScope.$broadcast("connected:unhighlight");
      };

      element.on('mouseover',  scope.highlight);
      element.on('mouseleave', scope.unhighlight);
      element.on('mousedown', scope.unhighlight);
      scope.$on('$destroy', function() {
        element.off('mouseover',  scope.highlight);
        element.off('mouseleave', scope.unhighlight);
        element.off('mousedown', scope.unhighlight);
      });
    }
  }
}]);
