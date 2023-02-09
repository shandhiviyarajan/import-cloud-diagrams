angular.module('designer.model.resources.azure.network.network_interface.ip_configuration', ['designer.model.resource'])
  .factory('Azure_NetworkInterface_IpConfiguration', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);

        resource.info = function() {
          var info = {};
          return info;
        };

        resource.getVirtualMachine = function() {
          return this.getNetworkInterface().getVirtualMachine();
        };

        resource.getSubnet = function() {
          return environment.connectedTo(this, "Resources::Azure::Network::Subnet")[0];
        };

        resource.getNetworkInterface = function() {
          return environment.connectedTo(this, "Resources::Azure::Network::NetworkInterface")[0];
        };

        resource.getPublicIpAddress = function() {
          return environment.connectedTo(this, "Resources::Azure::Network::PublicIpAddress");
        };

        resource.getBackendAddressPools = function() {
          return environment.connectedTo(this, "Resources::Azure::Network::LoadBalancer::BackendAddressPool");
        };

        resource.getApplicationSecurityGroup = function() {
          return environment.connectedTo(this, "Resources::Azure::Network::ApplicationSecurityGroup")[0];
        };

        return resource;
      }
    }
  }]);
