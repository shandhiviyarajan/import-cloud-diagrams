angular.module('designer.search.controls.header', [
  "designer.app-scope",
  "designer.search.state"
])
.directive('searchHeader', [ "$rootScope", "DesignerSearchState", function($rootScope, DesignerSearchState) {
    return {
      templateUrl: '/designer/search/controls/search.header.html',
      controllerAs: "SearchHeader",
      replace: true,
      controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs) {
        var vm = this;

        vm.error = null;
        vm.loading = false;
        vm.search_state = DesignerSearchState;

        vm.saveEnvironment = function() {
          $rootScope.$broadcast("resources:save");
        };

        // TODO: we probably don't want to toggle the error here :P
        vm.toggleLoading = function() {
          vm.loading = !vm.loading;
          vm.error = null;
        };

        vm.setError = function(e) {
          vm.error = e;
        };
      }],
      link: function(scope, element, attrs, ctrl) {
      }
    }
  }]
);
