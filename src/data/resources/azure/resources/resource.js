angular.module('designer.model.resources.azure.resources.resource', ['designer.model.resource'])
  .factory('Azure_Resource', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'RESOURCE';

        resource.info = function() {
          var info = {};

          return info;
        };

        return resource;
      }
    }
  }]);
