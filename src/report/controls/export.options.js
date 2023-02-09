angular.module('report.export.options', [
  "reporter.state"
])
.directive('reportExportOptions', ["$rootScope", "ReporterState", function($rootScope, ReporterState) {
  return {
    templateUrl: '/designer/report/controls/export.options.html',
    replace: true,
    link: function (scope, element, attrs) {
      scope.exporting = null;
      scope.error = "";

      scope.export_options = [
        { id: "hide", name: "Hide", description: "Hide all"},
        { id: "expand", name: "Expand", description: "Expand all"},
        { id: "preselected", name: "Pre-selected", description: "As preselected in the current report"}
      ];
      scope.export_options.selected = scope.export_options[0].id;


      scope.export_report = function(format) {
        scope.error = "";
        scope.expanded_list = ReporterState.get("expandedList");
        
        scope.exporting = {
          format: format,
          state: "pending",
          type: scope.Reporter.model.type,
          token: (new Date).getTime(),
          download_path: null
        };

        $rootScope.$broadcast("report:export", {
          format: format,
          report: scope.Reporter.model,
          token: scope.exporting.token,
          export_option: scope.export_options.selected,
          expanded_list: scope.expanded_list
        });
      };

      scope.$on("report:export:complete", function() {
        scope.exporting.state = "queued";
      });

      scope.$on("report:export:cancelled", function() {
        scope.exporting = null;
      });

      scope.$on("report:export:error", function() {
        scope.exporting = null;
        scope.error = "Failed to contact the export server, please try again soon."
      });

      // Type coercion is expected for these token comparisons, don't make strict
      scope.$on("report:export:started", function(event, data) {
        if(data["token"] == scope.exporting.token) {
          scope.exporting.state = "exporting";
        }
      });

      scope.$on("report:export:finished", function(event, data) {
        if(data["token"] == scope.exporting.token) {
          scope.exporting.state = "finished";
          scope.exporting.download_path = data["url"];
        }
      });

      scope.$on("report:export:failed", function(event, data) {
        if(data["token"] == scope.exporting.token) {
          scope.exporting = null;
          scope.error = data["message"];
        }
      });
    }
  }
}]);
