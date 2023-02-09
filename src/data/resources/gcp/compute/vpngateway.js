angular.module('designer.model.resources.gcp.compute.vpngateway', ['designer.model.resource'])
  .factory('GCP_ComputeVpnGateway', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'VPN GATEWAY';
        
        resource.info = function() {
          var info = {};

          info.vpn_tunnel = this.getVPNTunnel();

          return info;
        };

        resource.getVPNTunnel = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::VPNTunnel")[0];
        };

        return resource;
      }
    }
  }]);
