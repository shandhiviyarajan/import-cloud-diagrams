angular.module('designer.model.resources.azure.network.firewall', ['designer.model.resource'])
  .factory('Azure_Firewall', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);

        resource.info = function() {
          var info = {};
          var subnets = resource.getSubnets();
          var public_ip_addresses = resource.getPublicIpAddresses();
          info.subnets_map = {}
          info.public_ip_map = {}
          
          _.each(subnets, function(subnet) {
            info.subnets_map[subnet.provider_id] = subnet;
          });

          _.each(public_ip_addresses, function(public_ip) {
            info.public_ip_map[public_ip.provider_id] = public_ip;
          });

          return info;
        };

        resource.getPublicIpAddresses = function() {
          return environment.connectedTo(this, "Resources::Azure::Network::PublicIpAddress");
        };

        resource.getSubnets = function() {
          return environment.connectedTo(this, "Resources::Azure::Network::Subnet");
        };


        return resource;
      }
    }
  }]);
