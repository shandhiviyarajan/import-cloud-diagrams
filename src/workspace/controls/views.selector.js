angular.module('designer.workspace.views.selector', [
  "designer.configuration",
  "designer.state"
])
.directive('viewsSelector', ["$rootScope", "DesignerConfig", "DesignerState", function($rootScope, DesignerConfig, DesignerState) {
    return {
      templateUrl: '/designer/workspace/controls/views.selector.html',
      replace: true,
      link: {
        post: function(scope, element, attrs, ctrl) {
          scope.views = scope.Designer.environment.views;
          scope.allowable_views = DesignerConfig.get("allowableViews");

          // TODO: temp value - this should be removed in future when it's handled by the API
          if(scope.allowable_views.length > 0) {
            scope.views = _.filter(scope.views, function(v) { return _.includes(scope.allowable_views, v.type) })
          }

          scope.selectView = function(view) {
            if(view.id === scope.Designer.environment.current_view.id) return;

            // TODO: check if we want to set current view in the environment or just in the state
            scope.Designer.environment.setCurrentView(view.id);
            DesignerState.set("selectedView", view.type);

            $rootScope.$broadcast("view:selected", view);
          };

          scope.$on("environment:reloaded",  function() {
            scope.views = scope.Designer.environment.views;

            if(scope.allowable_views.length > 0) {
              scope.views = _.filter(scope.views, function(v) { return _.includes(scope.allowable_views, v.type) })
            }
          });
        }
      }
    }
  }]);
