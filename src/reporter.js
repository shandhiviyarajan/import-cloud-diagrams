angular.module("reporter", [
  "designer.model.report",
  "designer.app-scope",
  "report.report",
])
.directive("reporter", [
  function () {
  return {
    templateUrl: "/designer/reporter.html",
    scope: {
      model: "=",
      mode: "=",
      formats: "=",
      path: "="
    },
    controllerAs: 'Reporter',
    bindToController: true,
    controller: ["$scope", "$rootScope", "$element", "$attrs", function($scope, $rootScope, $element, $attrs) {
      this.$onInit = function() {
      };
    }],
    link: function(scope, element, attrs, ctrl) {
    }
  };
}]);
