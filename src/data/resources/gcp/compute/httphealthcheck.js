angular.module('designer.model.resources.gcp.compute.httphealthcheck', ['designer.model.resource'])
  .factory('GCP_ComputeHttpHealthCheck', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'HTTP HEALTH CHECK';

        resource.info = function() {
          var info = {};

          info.target_pool = this.getTargetPool();

          return info;
        };

        resource.getTargetPool = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::TargetPool")[0];
        };

        return resource;
      }
    }
  }]);
