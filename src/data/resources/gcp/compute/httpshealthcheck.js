angular.module('designer.model.resources.gcp.compute.httpshealthcheck', ['designer.model.resource'])
  .factory('GCP_ComputeHttpsHealthCheck', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'HTTPS HEALTH CHECK';

        resource.info = function() {
          var info = {};

          return info;
        };

        return resource;
      }
    }
  }]);
