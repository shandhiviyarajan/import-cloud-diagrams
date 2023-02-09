angular.module('designer.model.resources.gcp.compute.instancegroup', ['designer.model.resource'])
  .factory('GCP_ComputeInstanceGroup', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'INSTANCE GROUP';

        resource.info = function() {
          var info = {};

          info.network   = this.getNetwork();
          info.subnetwork = this.getSubnetwork();
          info.manager = this.getInstanceGroupManager();
          info.instances   = this.getInstances();

          return info;
        };

        resource.getNetwork = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::Network")[0];
        };

        resource.getSubnetwork = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::Subnetwork")[0];
        };

        resource.getInstanceGroupManager = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::InstanceGroupManager")[0];
        };

        resource.getInstances = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::Instance");
        };
        
        return resource;
      }
    }
  }]);
