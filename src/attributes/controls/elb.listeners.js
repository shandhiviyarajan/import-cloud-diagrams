angular.module('designer.attributes.elb.listeners', [])
  .directive('elbListeners', [function() {
    return {
      templateUrl: '/designer/attributes/controls/elb.listeners.html',
      replace: true,
      scope: true,
      link: function (scope, element, attrs) {
        scope.listeners = [];

        scope.loadResource = function() {
          scope.listeners = scope.resource.listeners;
        };

        scope.$watch("resource", function(s) {
          if(scope.resource) {
            scope.loadResource();
          }
        });
      }
    }
  }]);
