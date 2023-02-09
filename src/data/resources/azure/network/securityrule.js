angular.module('designer.model.resources.azure.network.security_rule', ['designer.model.resource'])
  .factory('Azure_SecurityRule', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'SECURITY RULE';

        resource.info = function() {
          var info = {};

          return info;
        };

        return resource;
      }
    }
  }]);
