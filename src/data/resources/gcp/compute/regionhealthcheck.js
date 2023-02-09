angular.module('designer.model.resources.gcp.compute.regionhealthcheck', ['designer.model.resource'])
  .factory('GCP_ComputeRegionHealthCheck', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'REGION HEALTH CHECK';

        resource.info = function() {
          var info = {};

          info.network = this.getNetwork();
          info.backend_services = this.getBackendServices().concat(this.getRegionBackendServices());
          info.instance_group_managers = this.getInstanceGroupManagers().concat(this.getRegionInstanceGroupManagers());
          info.network_endpoint_groups = this.getNetworkEndpointGroups();
          info.target_pools = this.getTargetPools();

          return info;
        };

        resource.getNetwork = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::Network")[0];
        };

        resource.getBackendServices = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::BackendService");
        };

        resource.getRegionBackendServices = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::RegionBackendService");
        };

        resource.getInstanceGroupManagers = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::InstanceGroupManager");
        };

        resource.getRegionInstanceGroupManagers = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::RegionInstanceGroupManager");
        };

        resource.getNetworkEndpointGroups = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::NetworkEndpointGroup");
        };

        resource.getTargetPools = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::TargetPool");
        };

        return resource;
      }
    }
  }]);
