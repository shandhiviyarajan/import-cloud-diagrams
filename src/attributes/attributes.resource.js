angular.module('designer.attributes.resource', [
  "designer.app-scope",
  'designer.attributes.header',
  'designer.attributes.info.display'])
.directive('resourceAttributes', ["$appScope", "$rootScope", function($appScope, $rootScope) {
  return {
    scope: {
      environment: '='
    },
    templateUrl: "/designer/attributes/attributes.resource.html",
    link: function(scope, element, attrs) {
      scope.selected_resource = null;
      scope.cell_watchers = [];

      scope.$on("resource:selected", function(event, resource) {
        $appScope.safeApply(function() { scope.selected_resource = resource; }, scope);
      });

      scope.selectResource = function(resource) {
        $rootScope.$broadcast("resource:select", resource);
      };
    }
  }
}]);
