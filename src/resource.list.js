angular.module("resource.list", [
  "designer.search",
  "designer.search.controls.sidebar",
  "designer.search.controls.header",
  "designer.search.data.results",
  'designer.model.resource.images',
])
.directive("resourceList", ["SearchResults", "ResourceImages", "$rootScope",
  function (SearchResults, ResourceImages, $rootScope) {
    return {
      templateUrl: "/designer/resource.list.html",
      scope: {},
      controllerAs: 'ResourceList',
      bindToController: true,
      controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs) {
        this.$onInit = function() {
          this.search_results = SearchResults.load();
        };

        this.iconsLoaded = function() {
          $scope.$broadcast("icons:loaded");
        };
      }],
      link: function(scope, element, attrs, ctrl) {
        scope.$on("resource:select", function(evt, resource) {
          $rootScope.$broadcast("resource:selected", resource);
        });
      }
    };
  }]);
