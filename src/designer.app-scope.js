angular.module("designer.app-scope", [])
.factory("$appScope", [function() {
  return {
    // The scope of page
    topScope: function() {
      return this.scope(document);
    },

    // Help us safely apply a change to a variable
    safeApply: function(fn, $scope) {
      $scope = $scope || this.topScope();
      fn = fn || function() {};
      if ($scope.$root.$$phase) {
        fn();
      } else {
        $scope.$apply(function() { fn(); });
      }
    }
  };
}]);
