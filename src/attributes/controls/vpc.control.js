angular.module('designer.attributes.vpc.control', ['designer.workspace.canvases.jointjs.resource.connections.highlighter','designer.workspace.canvases.jointjs.resource.highlighter'])
  .directive('vpcControl', ["$appScope", "$rootScope", function($appScope, $rootScope) {
    return {
      templateUrl: "/designer/attributes/controls/vpc.control.html",
      replace: true,
      scope: {
        environment: '=',
        resources: '='
      },
      link: function(scope, element, attrs) {
        scope.display = false;
        scope.cellView = {};
        scope.connected_resources = [];
        scope.resource_type = null;
        scope.title = null;

        scope.$on("attributes:control", function(event, params, cellView) {
          $appScope.safeApply(function() {
            if (!cellView || (cellView.id === scope.cellView.id && scope.resource_type === params.type)) {
              scope.display = false;
              scope.cellView = {};
              scope.connected_resources = [];
              scope.selected = null;
              scope.resource_type = null;
              scope.title = null;
              scope.deleting = null;
            }
            else {
              scope.display = true;
              scope.selected = null;
              scope.cellView = cellView;
              scope.resource_type = params.type;
              scope.title = params.title;
              scope.connected_resources = scope.environment.connectedTo(cellView.model.get("resource"), params.type);
            }
          }, scope);
        });

        scope.select = function(resource) {
          scope.selected = resource;
          $rootScope.$broadcast("resource:selected", resource);
        };
      }
    }
  }]);
