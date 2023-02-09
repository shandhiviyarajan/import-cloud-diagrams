// Fix: http://jointjs.com/blog/get-transform-to-element-polyfill.html
SVGElement.prototype.getTransformToElement = SVGElement.prototype.getTransformToElement || function(toElement) {
  return toElement.getScreenCTM().inverse().multiply(this.getScreenCTM());
};

angular.module("designer", [
  "designer.configuration",
  "designer.state",
  "designer.workspace",
  "designer.model.environment",
  "designer.app-scope",
  'designer.workspace.layout'
])
.directive("designer", ["Environment", "$appScope", "DesignerConfig", "DesignerState",
  function (Environment, $appScope, DesignerConfig, DesignerState) {
  return {
    templateUrl: "/designer/designer.html",
    scope: {
      model: "="
    },
    controllerAs: 'Designer',
    bindToController: true,
    controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs) {
      this.$onInit = function() {
        DesignerState.loadFromConfig(DesignerConfig);
        this.show_controls = DesignerConfig.get("showControls");
        this.show_export = DesignerConfig.get("showExport");
        this.show_sidebar = DesignerConfig.get("showAttributes");
        this.watermarked = DesignerConfig.get("watermark");

        // Select a default view
        if(!DesignerConfig.get("defaultView")) {
          DesignerState.selectDefaultView(this.model["views"]);
        }

        this.environment = Environment.load(this.model, DesignerState.get("selectedView"));
      };

      this.iconsLoaded = function() {
        $scope.$broadcast("icons:loaded");
      };
    }],
    link: function(scope, element, attrs, ctrl) {
      scope.$on("environment:reload", function(evt, environment, params) {
        $appScope.safeApply(function() {
          // If we have no selected view, or it doesn't exist, make sure we reselect it
          let reselect_view = !DesignerState.get("selectedView") || !_.find(environment.views, (v) => v.type === DesignerState.get("selectedView"))

          // Make sure we select an appropriate view from the new environment
          if(reselect_view)
            DesignerState.selectDefaultView(environment["views"]);

          // Handle import events - either alert them, or auto refresh
          ctrl.model       = environment;
          ctrl.environment = Environment.load(ctrl.model, DesignerState.get("selectedView"));

          scope.$broadcast("environment:reloaded", environment, params);
        }, scope);

        scope.$watch(function() { return element.hasClass("apogee"); }, function(hasApogee) {
          if (!hasApogee && ctrl.watermarked) {
            element.addClass("apogee");
          }
        });
      });

      scope.$on("view:positioned", function(e, view_type, positions) {
        if (ctrl.environment.current_view.type !== view_type) return;

        if (ctrl.environment.current_view.positioned) {
          ctrl.environment.current_view.reposition(ctrl.environment, positions);
          scope.$broadcast("view:repositioned");
        }
        else {
          ctrl.environment.current_view.load_with_positions(ctrl.environment, positions);
          scope.$broadcast("view:ready");
        }
      });
    }
  };
}]);
