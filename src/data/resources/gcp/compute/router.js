angular.module('designer.model.resources.gcp.compute.router', ['designer.model.resource'])
  .factory('GCP_ComputeRouter', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'ROUTER';

        resource.info = function() {
          var info = {};
          info.network = this.getNetwork();
          info.nat_gateways = this.getNATGateways();
          info.addresses = this.getAddresses().concat(this.getGlobalAddresses());
          info.subnetwork_map = {};
          info.vpn_tunnel_map = {};
          info.interconnect_attachment_map = {};

          var subnetworks = this.getSubnetworks();
          var vpn_tunnels = this.getVPNTunnels();
          var interconnect_attachments = this.getInterconnectAttachments();

          _.each(subnetworks, function(n) {
            info.subnetwork_map[n.self_link] = n;
          });

          _.each(vpn_tunnels, function(n) {
            info.vpn_tunnel_map[n.self_link] = n;
          });

          _.each(interconnect_attachments, function(n) {
            info.interconnect_attachment_map[n.self_link] = n;
          });

          return info;
        };

        resource.getAddresses = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::Address");
        };

        resource.getGlobalAddresses = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::GlobalAddress");
        };

        resource.getNetwork = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::Network")[0];
        };

        resource.getSubnetworks = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::Subnetwork");
        };

        resource.getNATGateways = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::NATGateway");
        };

        resource.getVPNTunnels = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::VPNTunnel");
        };

        resource.getInterconnectAttachments = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::InterconnectAttachment");
        };

        resource.getConnectables = function() {
          let connectables = [];

          connectables = connectables.concat(this.getNATGateways());
          _.each(this.getInterconnectAttachments(), function(a) {
            const interconnect = a.getInterconnect();
            if(interconnect)
              connectables.push(interconnect);
          });

          return connectables;
        };

        return resource;
      }
    }
  }]);
