angular.module('designer.model.resources.azure.network.load_balancer.backend_addresspool', ['designer.model.resource'])
  .factory('Azure_LoadBalancer_BackendAddressPool', ["Resource", function (Resource) {
    return {
      load: function (resource, environment) {
        resource = Resource.load(resource, environment);

        resource.info = function () {
          var info = {};

          return info;
        };

        resource.getNetworkInterfaceIpConfiguration = function () {
          return environment.connectedTo(this, "Resources::Azure::Network::NetworkInterface::IpConfiguration");
        };
        
        resource.getLoadBalancer = function () {
          return environment.connectedTo(this, "Resources::Azure::Network::LoadBalancer")[0];
        };

        resource.getVirtualMachines = function () {
          return environment.connectedTo(this, "Resources::Azure::Compute::VirtualMachine");
        };

        return resource;
      }
    }
  }]);
