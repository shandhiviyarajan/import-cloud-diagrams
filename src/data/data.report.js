angular.module('designer.model.report', [])
.factory('Report', [function() {
  return {
    load: function(report) {

      report.name = report.name || "";
      report.searching = (report.state === 'pending' || report.state === 'importing');

      return report;
    }
  }
}]);
