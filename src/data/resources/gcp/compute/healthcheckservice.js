angular.module('designer.model.resources.gcp.compute.healthcheckservice', ['designer.model.resource'])
.factory('GCP_ComputeHealthCheckService', ["Resource", function(Resource) {
  return {
    load: function(resource, environment) {
      resource = Resource.load(resource, environment);
      resource.type_name = 'HEALTH CHECK SERVICE';

      resource.info = function() {
        var info = {};

        return info;
      };

      // resource.getTargetHTTPSProxy = function() {
      //   return environment.connectedTo(this, "Resources::GCP::Compute::TargetHTTPSProxy")[0];
      // };

      return resource;
    }
  }
}]);
