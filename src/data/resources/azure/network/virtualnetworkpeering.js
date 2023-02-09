angular.module('designer.model.resources.azure.network.virtual_network_peering', ['designer.model.resource'])
  .factory('Azure_VirtualNetworkPeering', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'VIRTUAL NETWORK PEERING';

        resource.info = function() {
          var info = {};

          const vnets = this.getVirtualNetworks();

          info.virtual_network = vnets.find((vnet) => vnet.provider_id.toLowerCase() === resource.virtual_network_id.toLowerCase());
          info.remote_virtual_network = vnets.find((vnet) => vnet.provider_id.toLowerCase() === resource.remote_virtual_network_id.toLowerCase());
          info.resource_group = resource.getResourceGroup();

          return info;
        };

        resource.getVirtualNetworks = function() {
          return environment.connectedTo(this, "Resources::Azure::Network::VirtualNetwork");
        };

        resource.getResourceGroup = function() {
          return environment.connectedTo(this, "Resources::Azure::Resources::ResourceGroup")[0];
        };

        return resource;
      }
    }
  }]);
