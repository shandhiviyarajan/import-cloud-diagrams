angular.module('designer.model.resources.gcp.compute.externalvpngateway', ['designer.model.resource'])
  .factory('GCP_ComputeExternalVpnGateway', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'EXTERNAL VPN GATEWAY';

        resource.info = function() {
          var info = {};

          info.vpn_tunnels = this.getVPNTunnels();

          return info;
        };

        resource.getVPNTunnels = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::VPNTunnel");
        };

        resource.getConnectables = function() {
          var connectables = [];

          var tunnels = this.getVPNTunnels();
          _.each(tunnels, function(tunnel) {
            connectables.push(tunnel.getTargetVPNGateway());
            connectables.push(tunnel.getVPNGateway());
            // connectables.push(tunnel.getRouter()); // TODO: do we want router to handle it's own connectables display?
          });

          return _.uniq(_.compact(connectables));
        };

        return resource;
      }
    }
  }]);
