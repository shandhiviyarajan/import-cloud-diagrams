angular.module('designer.model.resources.gcp.compute.targetvpngateway', ['designer.model.resource'])
  .factory('GCP_ComputeTargetVpnGateway', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'TARGET VPN GATEWAY';
        resource.status_list = {
          "creating": "warn",
          "ready": "good",
          "deleting": "warn",
          "failed": "bad"
        };
        
        resource.info = function() {
          var info = {};

          info.forwarding_rules = this.getForwardingRules();
          info.vpn_tunnels = this.getVPNTunnels();

          return info;
        };

        resource.getVPNTunnels = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::VPNTunnel");
        };

        resource.getForwardingRules = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::ForwardingRule").concat(
            environment.connectedTo(this, "Resources::GCP::Compute::GlobalForwardingRule"));
        };

        resource.getConnectables = function() {
          var connectables = [];

          var tunnels = this.getVPNTunnels();
          _.each(tunnels, function(tunnel) {
            connectables.push(tunnel.getVPNGateway());
            connectables.push(tunnel.getExternalVPNGateway());
          });

          return _.uniq(_.compact(connectables));
        };

        return resource;
      }
    }
  }]);
