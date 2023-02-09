angular.module('designer.model.resources.azure.network.virtual_network_gateway', ['designer.model.resource'])
  .factory('Azure_VirtualNetworkGateway', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'VIRTUAL NETWORK GATEWAY';

        resource.info = function() {
          var info = {};
          info.vn_gateway_ipconf = resource.getVNGatewayIpConfigurations();
          info.vng_connections = resource.getConnections();

          return info;
        };

        resource.getVNGatewayIpConfigurations = function() {
          var vn_gateway_ipconfigurations = [];

          var vngateway_ipconfs = environment.connectedTo(this, "Resources::Azure::Network::VirtualNetworkGateway::IpConfiguration");

          _.each(vngateway_ipconfs, function(vng_ip){
            var vng_ip_info = vng_ip;
            vng_ip_info.public_ip_address = vng_ip.getPublicIpAddress();

            vn_gateway_ipconfigurations.push(vng_ip_info);
          });

          return vn_gateway_ipconfigurations
        };

        resource.getConnections = function() {
          return environment.connectedTo(this, "Resources::Azure::Network::VirtualNetworkGatewayConnection");
        };

        resource.getConnectables = function() {
          return _.compact(_.map(this.getConnections(), (con) => con.getLocalNetworkGateway()));
        }

        return resource;
      }
    }
  }]);
