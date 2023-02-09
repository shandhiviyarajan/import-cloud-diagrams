angular.module('designer.model.resources.gcp.compute.network', ['designer.model.resource'])
  .factory('GCP_ComputeNetwork', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'NETWORK';

        resource.info = function() {
          var info = {};
          info.network_map = {};

          var networks    = this.getNetworks();
          var firewalls = this.getFirewalls();
          var routes    = this.getRoutes();

          info.subnetworks = this.getSubnetworks();
          info.mirrors = this.getPacketMirroring();
          info.firewalls = _.sortBy(firewalls, function(resource) { return resource.name; });
          info.routes    = _.sortBy(routes, function(resource) { return resource.name; });

          _.each(networks, function(n) {
            info.network_map[n.self_link] = n;
          });

          return info;
        };

        resource.getFirewalls = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::Firewall");
        };

        resource.getRoutes = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::Route");
        };

        resource.getNetworks = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::Network");
        };

        resource.getSubnetworks = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::Subnetwork");
        };

        resource.getBuckets = function() {
          return environment.connectedTo(this, "Resources::GCP::Storage::Bucket");
        };

        resource.getManagedZones = function() {
          return environment.connectedTo(this, "Resources::GCP::DNS::ManagedZone");
        };

        resource.getRouters = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::Router");
        };

        resource.getVPNGateways = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::VPNGateway");
        };

        resource.getPacketMirroring = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::PacketMirroring");
        };

        resource.getExternalVPNGateways = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::ExternalVPNGateway");
        };

        resource.getTargetVPNGateways = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::TargetVPNGateway");
        };

        resource.getInterconnects = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::Interconnect");
        };

        resource.getSQLInstances = function() {
          return environment.connectedTo(this, "Resources::GCP::SQL::Instance");
        };

        resource.getMemoryStoreInstances = function() {
          return environment.connectedTo(this, "Resources::GCP::MemoryStore::Instance");
        };

        return resource;
      }
    }
  }]);
