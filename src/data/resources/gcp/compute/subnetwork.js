angular.module('designer.model.resources.gcp.compute.subnetwork', ['designer.model.resource'])
  .factory('GCP_ComputeSubnetwork', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'SUBNETWORK';

        resource.info = function() {
          var info = {};

          info.network = this.getNetwork();

          return info;
        };

        resource.getNetwork = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::Network")[0];
        };

        resource.getInstances = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::Instance");
        };

        resource.getNATGateways = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::NATGateway");
        };

        return resource;
      }
    }
  }]);
