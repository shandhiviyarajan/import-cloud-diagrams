angular.module('designer.workspace.view.options', [
  "designer.app-scope",
  "designer.model.resource.images",
  "designer.configuration",
  "designer.state"
])
.directive('viewOptions', ["$window", "$appScope", "$rootScope", "ResourceImages", "DesignerConfig", "DesignerState", "$sce",
  function($window, $appScope, $rootScope, ResourceImages, DesignerConfig, DesignerState, $sce) {
    return {
      templateUrl: '/designer/workspace/controls/view.options.html',
      replace: true,
      link: {
        post: function(scope, element, attrs, ctrl) {
          scope.show_options      = false;
          scope.icon_sets         = ResourceImages.getIconList(scope.Designer.environment);
          scope.show_icons        = DesignerConfig.get("showIcons") && _.keys(scope.icon_sets).length > 1;
          scope.selected_icon_set = DesignerState.get("selectedIconSet");
          scope.show_labels       = DesignerState.get("displayLabels");
          scope.show_connections  = DesignerState.get("displayConnections");
          scope.display3DView     = DesignerState.get("display3DView");
          scope.hide_all          = DesignerState.get("hideDefaultArrows");
          scope.hide_namespaces   = DesignerState.get("hideNamespaces");

          scope.selectIconSet = function(icon_set) {
            if (DesignerState.get("selectedIconSet") === icon_set) return;

            scope.selected_icon_set = icon_set;
            DesignerState.set("selectedIconSet", icon_set);

            $rootScope.$broadcast("icon:switch");
          };

          scope.defaultIconPath = function(icon_set, values) {
            return $sce.trustAsResourceUrl("#" + values['provider'] + "-" + icon_set + "-" + values['main_icon']);
          };

          scope.$watch("show_labels", function() {
            DesignerState.set("displayLabels", scope.show_labels);

            $rootScope.$broadcast("toggle:labels");
          });

          scope.$watch("show_connections", function() {
            DesignerState.set("displayConnections", scope.show_connections);

            $rootScope.$broadcast("toggle:connections");
          });

          scope.$watch("hide_namespaces", function() {
            DesignerState.set("hideNamespaces", scope.hide_namespaces);

            $rootScope.$broadcast("view:reposition");
          });

          scope.toggleArrowsAll = function () {
            scope.hide_all = !scope.hide_all;
            // Get the current option and flip it
            var value = DesignerState.get("hideDefaultArrows");
            DesignerState.set("hideDefaultArrows", !value);
            $rootScope.$broadcast("view:hide_all", !value);
          }

          scope.toggleOptions = function() {
            scope.show_options = !scope.show_options;

            scope.show_options ?
              angular.element($window).on("click", scope.handleWindowClick) :
              angular.element($window).off("click", scope.handleWindowClick);
          };

          scope.changeLayout = function(key, val, min, max) {
            var positions = DesignerState.get("layout")[scope.Designer.environment.current_view.type];
            var new_val = positions[key] + val;

            if(new_val >= min && new_val <= max) {
              positions[key] += val;
              $rootScope.$broadcast("view:reposition");
            }
          };

          scope.resetLayout = function() {
            DesignerState.reset("layout");

            $rootScope.$broadcast("view:reposition");
          };

          scope.$on("viewChanged", function () {
            scope.display3DView = DesignerState.get("display3DView");
          });

          scope.$on("reset:layout", function () {
            scope.resetLayout();
          });

          scope.handleWindowClick = function(event) {
            var target = $(event.target);

            if (!target.parents('#view-options').length) {
              $appScope.safeApply(function() {
                scope.toggleOptions();
              }, scope);
            }
          };
        }
      }
    }
  }]);
