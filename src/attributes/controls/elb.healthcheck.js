angular.module('designer.attributes.elb.healthcheck', [])
  .directive('elbHealthcheck', [function() {
    return {
      templateUrl: '/designer/attributes/controls/elb.healthcheck.html',
      replace: true,
      scope: true,
      link: function (scope, element, attrs) {
        scope.healthcheck = null;

        scope.load = function() {
          scope.healthcheck = scope.resource["health_check"] || {};
        };

        scope.$watch("resource", function(s) {
          if(scope.resource) {
            scope.load();
          }
        });
      }
    }
  }]);
