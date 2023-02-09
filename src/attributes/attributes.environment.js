angular.module('designer.attributes.environment', [
  "designer.app-scope",
  'designer.attributes.region',
  'designer.attributes.map',
  'designer.attributes.export',
  'designer.attributes.price-estimate'])
  .directive('environmentAttributes', ["$appScope", "$rootScope", function($appScope, $rootScope) {
    return {
      templateUrl: "/designer/attributes/attributes.environment.html",
      scope: true,
      link: function(scope, element, attrs) {
        scope.current_account = $rootScope.current_account;
        scope.display_name = scope.Designer.environment.name;
        scope.regions = [];

        // TODO: eventually we should probably just show the regions from the currently selected view?
        // TODO: need to move this info to a layer specific panel so we can use it for Azure too
        _.each(scope.Designer.environment.views, function(view) {
          if(view.regions) {
            scope.regions = _.uniq(scope.regions.concat(view.regions));
          }
          else if(view.locations) {
            scope.regions = _.uniq(scope.regions.concat(view.locations));
          }
        });

        if(scope.Designer.environment.name.length > 80) {
          scope.display_name = scope.Designer.environment.name.substr(0, 77) + " ...";
        }
      }
    }
  }]);
