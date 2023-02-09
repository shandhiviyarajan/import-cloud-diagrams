angular.module('designer.model.resources.gcp.compute.forwardingrule', ['designer.model.resource'])
  .factory('GCP_ComputeForwardingRule', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'FORWARDING RULE';

        resource.info = function() {
          var info = {};

          var subnetwork      = this.getSubnetwork();
          var network         = this.getNetwork();
          var backend_service = this.getBackendService();
          var ip_address      = this.getAddress();
          var target          = this.getTarget();


          if(network)         info.network = network;
          if(subnetwork)      info.subnetwork = subnetwork;
          if(backend_service) info.backend_service = backend_service;
          if(ip_address)      info.ip_address = ip_address;
          if(target)          info.target = target;

          return info;
        };

        resource.getNetwork = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::Network")[0];
        };

        resource.getSubnetwork = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::Subnetwork")[0];
        };

        resource.getBackendService = function() {
          var types = [
            "Resources::GCP::Compute::BackendService",
            "Resources::GCP::Compute::RegionBackendService"];
          return environment.findConnectedTo(this, types)[0];
        };

        resource.getAddress = function() {
          var types = [
            "Resources::GCP::Compute::Address",
            "Resources::GCP::Compute::GlobalAddress"];
          return environment.findConnectedTo(this, types)[0];
        };

        resource.getTarget = function() {
          var types = [
            "Resources::GCP::Compute::TargetHTTPProxy", 
            "Resources::GCP::Compute::TargetHTTPSProxy",
            "Resources::GCP::Compute::TargetInstance",
            "Resources::GCP::Compute::TargetPool",
            "Resources::GCP::Compute::TargetSSLProxy",
            "Resources::GCP::Compute::TargetTCPProxy",
            "Resources::GCP::Compute::TargetVPNGateway",
            "Resources::GCP::Compute::RegionTargetHTTPProxy",
            "Resources::GCP::Compute::RegionTargetHTTPSProxy"
          ];
          return environment.findConnectedTo(this, types)[0];
        };

        return resource;
      }
    }
  }]);
