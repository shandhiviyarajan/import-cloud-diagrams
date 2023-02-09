angular.module('designer.model.resources.gcp.compute.route', ['designer.model.resource'])
  .factory('GCP_ComputeRoute', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'ROUTE';

        resource.info = function() {
          var info = {};
          info.network_map = {};
          info.instance_map = {};

          info.networks   = this.getNetworks();
          info.instances  = this.getInstances();
          info.subnets    = this.getSubnets();
          info.vpn_tunnel = this.getVPNTunnel();

          _.each(info.networks, function(n) {
            info.network_map[n.self_link] = n;
          });

          _.each(info.instances, function(n) {
            info.instance_map[n.self_link] = n;
          });

          if(this.next_hop_gateway) info.next_hop_gateway = this.next_hop_gateway.split("/").slice(-1)[0];
          if(this.next_hop_peering) info.next_hop_peering = this.next_hop_peering.split("/").slice(-1)[0];
          if(this.next_hop_ip) info.next_hop_ip      = this.next_hop_ip.split("/").slice(-1)[0];

          return info;
        };

        resource.getNetworks = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::Network");
        };

        resource.getSubnets = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::Subnetwork");
        };

        resource.getInstances = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::Instance");
        };

        resource.getVPNTunnel = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::VPNTunnel")[0];
        };

        resource.highlightableConnections = function() {
          return this.getInstances().concat(this.getSubnets());
        };

        return resource;
      }
    }
  }]);
