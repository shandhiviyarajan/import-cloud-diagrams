angular.module('designer.model.resources.azure.network.route', ['designer.model.resource'])
  .factory('Azure_Route', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'ROUTE';

        resource.info = function() {
          var info = {};

          return info;
        };

        return resource;
      }
    }
  }]);
