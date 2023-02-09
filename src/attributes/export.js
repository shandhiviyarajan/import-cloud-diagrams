angular.module('designer.attributes.export', [
  "designer.configuration",
  "designer.state"
])
  .directive('exportOptions', ["$rootScope", "DesignerConfig", "DesignerState", function($rootScope, DesignerConfig, DesignerState) {
    return {
      templateUrl: '/designer/attributes/export.html',
      replace: true,
      link: function (scope, element, attrs) {
        scope.exporting = null;
        scope.error = "";
        scope.show_export = false;
        scope.formats = DesignerConfig.get("exportFormats");

        scope.export_view = function(format) {
          scope.error = "";
          
          scope.exporting = {
            format: format,
            state: "pending",
            type: scope.Designer.environment.current_view.type,
            token: (new Date).getTime(),
            download_path: null
          };

          $rootScope.$broadcast("view:export", {
            format: format,
            show_connections: DesignerState.get("displayConnections"),
            show_names: DesignerState.get("displayLabels"),
            icon_set: DesignerState.get("selectedIconSet"),
            isometric: DesignerState.get("displayIsometric"),
            hideDefaultArrows: DesignerState.get("hideDefaultArrows"),
            hide_namespaces: DesignerState.get("hideNamespaces"),
            layout: DesignerState.get("layout"),
            view: scope.Designer.environment.current_view,
            token: scope.exporting.token
          });
        };

        scope.$on("view:export:complete", function() {
          if(scope.exporting.format === 'cf') {
            scope.exporting = null;
          }
          else {
            scope.exporting.state = "queued";
          }
        });

        scope.$on("view:export:cancelled", function() {
          scope.exporting = null;
        });

        scope.$on("view:export:error", function() {
          scope.exporting = null;
          scope.error = "Failed to contact the export server, please try again soon."
        });

        // Type coercion is expected for these token comparisons, don't make strict
        scope.$on("view:export:started", function(event, data) {
          if(data["token"] == scope.exporting.token) {
            scope.exporting.state = "exporting";
          }
        });

        scope.$on("view:export:finished", function(event, data) {
          if(data["token"] == scope.exporting.token) {
            scope.exporting.state = "finished";
            scope.exporting.download_path = data["url"];
          }
        });

        scope.$on("view:export:failed", function(event, data) {
          if(data["token"] == scope.exporting.token) {
            scope.exporting = null;
            scope.error = data["message"];
          }
        });
      }
    }
  }]);
