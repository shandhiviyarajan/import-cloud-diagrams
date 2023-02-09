angular.module('designer.model.resources.gcp.compute.securitypolicy', ['designer.model.resource'])
.factory('GCP_ComputeSecurityPolicy', ["Resource", function(Resource) {
  return {
    load: function(resource, environment) {
      resource = Resource.load(resource, environment);
      resource.type_name = 'SECURITY POLICY';

      resource.info = function() {
        var info = {};

        info.backends = this.getBackendServices();

        return info;
      };

      resource.getBackendServices = function() {
        return environment.connectedTo(this, "Resources::GCP::Compute::BackendService");
      };

      return resource;
    }
  }
}]);
