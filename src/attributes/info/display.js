angular.module('designer.attributes.info.display', [])
  .directive('infoDisplay', ["$rootScope", function($rootScope) {
    return {
      templateUrl: '/designer/attributes/info/display.html',
      replace: true,
      link: function (scope, element, attrs, ctrl) {
        scope.resource = null;
        scope.template = "";

        // TODO: I don't wanna have to add one for each of them, but right now it's just VPC anyways
        scope.extended = {
          rt: false,
          sg: false
        };

        scope.$watch("selected_resource", function(s) {
          scope.resource = s;
          scope.info     = (s) ? s.info() : null;
          // TODO: determine if the file exists and load a default otherwise?
          scope.template = (s) ? "/designer/data/" + scope.resource.simple_name.replace(/\./g, "/") + ".html" : "";
        });

        scope.selectResource = function(resource) {
          $rootScope.$broadcast("resource:select", resource);
        };

        scope.$on("toggle_control", function(evt, k, val) {
          scope.extended = { rt: false, sg: false };
          scope.extended[k] = val;
        });
      }
    }
  }]);
