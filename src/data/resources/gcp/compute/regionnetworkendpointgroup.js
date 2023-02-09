angular.module('designer.model.resources.gcp.compute.regionnetworkendpointgroup', ['designer.model.resource'])
.factory('GCP_ComputeRegionNetworkEndpointGroup', ["Resource", function(Resource) {
  return {
    load: function(resource, environment) {
      resource = Resource.load(resource, environment);
      resource.type_name = 'REGION NETWORK ENDPOINT GROUP';

      resource.info = function() {
        var info = {};

        info.backend_service = this.getBackendService();

        return info;
      };

      resource.getBackendService = function() {
        return environment.connectedTo(this, "Resources::GCP::Compute::BackendService")[0];
      };

      return resource;
    }
  }
}]);
