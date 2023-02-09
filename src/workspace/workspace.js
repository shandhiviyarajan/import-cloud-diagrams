angular.module('designer.workspace', [
  'designer.workspace.sidebar',
  'designer.workspace.canvases.jointjs.canvas',
  'designer.workspace.canvases.html.canvas',
  'designer.workspace.canvases.3dview',
  'designer.workspace.exporter',
  'designer.workspace.sharer',
  'designer.workspace.view.options',
  "designer.configuration",
  "designer.state"
])
.directive('workspace',
  ["DesignerConfig", "DesignerState", "$timeout", function(DesignerConfig, DesignerState, $timeout) {
      return {
        templateUrl: '/designer/workspace/workspace.html',
        replace: true,
        controllerAs: "Workspace",
        controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs) {
          this.view = $scope.Designer.environment.current_view || {};
          this.watermarked = DesignerConfig.get("watermark");
          this.show_controls = DesignerConfig.get("showControls");
        }],
        link: function(scope, element, attrs, ctrl) {
          scope.$on("icons:loaded", function() {
            ctrl.loading_icons = false;
          });

          scope.$on("environment:reloaded", function(e, environment) {
            ctrl.view = environment.current_view;
          });

          scope.$on("view:selected", function(e, view) {
            ctrl.view = view;
            
            $timeout(function() {
             var resource = DesignerState.get("selectedResource")
              if(resource) {
                scope.$broadcast("resource:select", resource)
              }
            }, 0, false);
          });
        
          scope.$on("resource:selected", function(e, resource) {
            DesignerState.set("selectedResource", resource);
          });

          scope.$watch(function() { return element.hasClass("apex"); }, function(hasApex) {
            if (!hasApex && ctrl.watermarked) {
              element.addClass("apex");
            }
          });

          scope.$on("icon:switch", function() {
            var resources = scope.Designer.environment.facet.resources;
            _.each(resources, function(resource) {
              if(resource) {
                resource.setImageUrl();
              }
            }.bind(this));
          });

          // TODO: so ideally we'd have the entire view loaded here with state, and switch between them as required - not just hide them behind each other, still catching events.
        }
      }
    }]);
