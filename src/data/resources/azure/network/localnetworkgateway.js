angular.module('designer.model.resources.azure.network.local_network_gateway', ['designer.model.resource'])
  .factory('Azure_LocalNetworkGateway', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'LOCAL NETWORK GATEWAY';
        resource.status = resource.provisioning_state;
        resource.status_list = {
          "deleting": "warn",
          "succeeded": "good",
          "updating": "warn",
          "failed": "bad"
        };
        
        resource.info = function() {
          var info = {};

          info.vng_connections = this.getVirtualNetworkGatewayConnections();
          
          return info;
        };

        resource.getVirtualNetworkGatewayConnections = function() {
          return environment.connectedTo(this, "Resources::Azure::Network::VirtualNetworkGatewayConnection");
        };

        return resource;
      }
    }
  }]);
