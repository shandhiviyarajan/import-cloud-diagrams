angular.module('designer.workspace.views.picker', [
    "designer.configuration",
    "designer.state"
  ])
  .directive('viewsPicker', ["$rootScope", "$timeout", "DesignerConfig", "DesignerState", function($rootScope, $timeout, DesignerConfig, DesignerState) {
      return {
        templateUrl: '/designer/workspace/controls/views.picker.html',
        replace: true,
        link: {
          post: function(scope, element, attrs, ctrl) {
            scope.views = scope.Designer.environment.views;
            scope.allowable_views = DesignerConfig.get("allowableViews");
            $rootScope.expandedPicker = JSON.parse(localStorage.getItem('expanded_picker'));
  
            // TODO: temp value - this should be removed in future when it's handled by the API
            if(scope.allowable_views.length > 0) {
              scope.views = _.filter(scope.views, function(v) { return _.includes(scope.allowable_views, v.type) })
            }

            scope.toggle = function () {
              $timeout(function () {
                $rootScope.expandedPicker = !$rootScope.expandedPicker;
                localStorage.setItem('expanded_picker', $rootScope.expandedPicker);
              })
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
            });

            scope.viewIcons = {
              'AWS Infrastructure': 'computer',
              'Infrastructure': 'computer',
              'Extended Infrastructure': 'dashboard',
              'List': 'list',
              'Security Group': 'security',
              'Container': 'dashboard'
            }
          }
        }
      }
    }]);
  