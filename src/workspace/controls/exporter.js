angular.module('designer.workspace.exporter', [
  "designer.app-scope",
  "designer.configuration"
])
.directive('exporter', ["$window", "$appScope", "DesignerConfig", function($window, $appScope, DesignerConfig) {
    return {
      templateUrl: '/designer/workspace/controls/exporter.html',
      replace: true,
      link: {
        post: function(scope, element, attrs, ctrl) {
          scope.show_export = false;
          scope.formats = DesignerConfig.get("exportFormats");

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
