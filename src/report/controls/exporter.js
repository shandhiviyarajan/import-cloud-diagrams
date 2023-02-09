angular.module('report.exporter', [
  "designer.app-scope",
  "report.export.options"
])
.directive('reportExporter', ["$window", "$appScope", function($window, $appScope) {
return {
  templateUrl: '/designer/report/controls/exporter.html',
  replace: true,
  link: {
    post: function(scope, element, attrs, ctrl) {
      scope.show_export = false;

      scope.toggleExports = function() {
        scope.show_export = !scope.show_export;

        scope.show_export ?
          angular.element($window).on("click", scope.handleWindowClick) :
          angular.element($window).off("click", scope.handleWindowClick);
      };

      scope.upgradeAccount = function() {
        scope.$emit("trial:upgrade");
      };

      scope.handleWindowClick = function(event) {
        var target = $(event.target);

        if (!target.parents('#export-options').length) {
          $appScope.safeApply(function() {
            scope.toggleExports();
          }, scope);
        }
      }
    }
  }
}
}]);
