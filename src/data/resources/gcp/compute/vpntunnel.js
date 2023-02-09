angular.module('designer.model.resources.gcp.compute.vpntunnel', ['designer.model.resource'])
  .factory('GCP_ComputeVpnTunnel', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'VPN TUNNEL';
        resource.status_list = {
          "provisioning": "warn",
          "waiting_for_full_config": "warn",
          "first_handshake": "warn",
          "established": "good",
          "network_error": "bad",
          "authorization_error": "bad",
          "negotiation_failure": "bad",
          "deprovisioning": "warn",
          "failed": "bad",
          "no_incoming_packets": "warn",
          "rejected": "bad",
          "allocating_resources": "warn",
          "stopped": "stopped",
          "peer_identity_mismatch": "bad",
          "ts_narrowing_not_allowed": "warn"
        };

        resource.info = function() {
          var info = {};

          info.target_vpn_gateway = this.getTargetVPNGateway();
          info.vpn_gateway = this.getVPNGateway(); // TODO: technically there can be two - one is tied to peerGcpGateway, but we don't have any examples
          info.peer_external_gateway = this.getExternalVPNGateway();
          info.router = this.getRouter();

          return info;
        };

        resource.getTargetVPNGateway = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::TargetVPNGateway")[0];
        };

        resource.getVPNGateway = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::VPNGateway")[0];
        };

        resource.getExternalVPNGateway = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::ExternalVPNGateway")[0];
        };

        resource.getRouter = function() {
          return environment.connectedTo(this, "Resources::GCP::Compute::Router")[0];
        };

        return resource;
      }
    }
  }]);
