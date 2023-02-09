angular.module('designer.search.controls.sidebar', [
  "designer.attributes"
])
.directive('searchSidebar', [function() {
  return {
    templateUrl: '/designer/search/controls/search.sidebar.html',
    replace: true,
    link: {
      post: function(scope, element, attrs, ctrl) {
      }
    }
  }
}]);
