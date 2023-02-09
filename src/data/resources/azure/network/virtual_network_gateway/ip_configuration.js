angular.module('designer.model.resources.azure.network.virtual_network_gateway.ip_configuration', ['designer.model.resource'])
  .factory('Azure_VirtualNetworkGateway_IpConfiguration', ["Resource", function (Resource) {
    return {
      load: function (resource, environment) {
        resource = Resource.load(resource, environment);

        resource.info = function () {
          var info = {};

          return info;
        };

        resource.getPublicIpAddress = function () {
          return environment.connectedTo(this, "Resources::Azure::Network::PublicIpAddress");
        };

        return resource;
      }
    }
  }]);
