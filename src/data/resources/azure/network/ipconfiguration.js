angular.module('designer.model.resources.azure.network.ip_configuration', ['designer.model.resource'])
  .factory('Azure_IpConfiguration', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'IP CONFIGURATION';

        resource.info = function() {
          var info = {};

          return info;
        };

        resource.getNetworkInterfaces = function() {
          return environment.connectedTo(this, "Resources::Azure::Network::NetworkInterface::IpConfiguration");
        };

        return resource;
      }
    }
  }]);
