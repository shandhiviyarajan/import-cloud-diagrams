angular.module('designer.model.resources.gcp.compute.notificationendpoint', ['designer.model.resource'])
.factory('GCP_ComputeNotificationEndpoint', ["Resource", function(Resource) {
  return {
    load: function(resource, environment) {
      resource = Resource.load(resource, environment);
      resource.type_name = 'NOTIFICATION ENDPOINT';

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
