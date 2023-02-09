angular.module('designer.model.resources.gcp.storage.bucket', ['designer.model.resource'])
  .factory('GCP_StorageBucket', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'BUCKET';

        resource.info = function() {
          var info = {};

          info.backend_bucket = this.getBackendBucket();

          return info;
        };

        resource.getBackendBucket = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::BackendBucket");
        };

        return resource;
      }
    }
  }]);
