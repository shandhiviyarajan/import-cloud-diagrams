angular.module("designer.model.resources.aws.apigateway.resource.tree", [])
  .directive("apiResourceTree", ["$rootScope", function($rootScope) {
    return {
      templateUrl: "/designer/data/resources/aws/apigateway/resource.tree.html",
      scope: {
        resource: "=",
        parent: "="
      },
      link: function (scope, element, attrs, ctrl) {
        scope.selectResource = function(resource) {
          $rootScope.$broadcast("resource:select", resource);
        };
      }
    }
  }]
);
