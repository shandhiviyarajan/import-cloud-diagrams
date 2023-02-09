angular.module('designer.attributes', [
  'designer.attributes.tags',
  'designer.attributes.vpc.control',
  'designer.attributes.elb.listeners',
  'designer.attributes.elb.healthcheck',
  'designer.attributes.resource',
  'designer.attributes.environment',
  'designer.attributes.json_formatter'
])
.directive('attributes', [function() {
  return {
    templateUrl: "/designer/attributes/attributes.html",
    link: function(scope, element, attrs, ctrl) {
      scope.resourceSelected = false;

      if(scope.Designer && scope.Designer.autohide) element.hide();

      scope.$on("resource:selected", function(event, val) {
        scope.resourceSelected = !!val;

        if(scope.Designer && scope.Designer.autohide) {
          if(scope.resourceSelected) { element.show(); }
          else                       { element.hide(); }
        }
      });
    }
  }
}]);
