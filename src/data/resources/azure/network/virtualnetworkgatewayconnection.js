angular.module('designer.model.resources.azure.network.virtual_network_gateway_connection', ['designer.model.resource'])
  .factory('Azure_VirtualNetworkGatewayConnection', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'VIRTUAL NETWORK GATEWAY CONNECTION';

        resource.info = function() {
          var info = {};

          info.local_network_gateway = resource.getLocalNetworkGateway();
          info.virtual_network_gateways = resource.getVirtualNetworkGateways();

          return info;
        };

        resource.getLocalNetworkGateway = function() {
          return environment.connectedTo(this, "Resources::Azure::Network::LocalNetworkGateway")[0];
        };

        resource.getVirtualNetworkGateways = function() {
          return environment.connectedTo(this, "Resources::Azure::Network::VirtualNetworkGateway");
        };

        return resource;
      }
    }
  }]);
