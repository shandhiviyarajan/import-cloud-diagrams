angular.module('designer.model.resources.gcp.compute.backendbucket', ['designer.model.resource'])
  .factory('GCP_ComputeBackendBucket', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'BACKEND BUCKET';

        resource.info = function() {
          var info = {};

          info.bucket = this.getBucket();

          return info;
        };

        resource.getBucket = function() {
          return environment.connectedTo(this, "Resources::GCP::Storage::Bucket")[0];
        };

        return resource;
      }
    }
  }]);
