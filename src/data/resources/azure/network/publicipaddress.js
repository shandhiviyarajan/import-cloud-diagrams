angular.module('designer.model.resources.azure.network.public_ip_address', ['designer.model.resource'])
  .factory('Azure_PublicIpAddress', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'PUBLIC IP ADDRESS';

        resource.info = function() {
          var info = {};

          return info;
        };

        return resource;
      }
    }
  }]);
