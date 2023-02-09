angular.module('designer.model.resources.azure.network.subnet', ['designer.model.resource'])
  .factory('Azure_Subnet', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'SUBNET';

        resource.info = function() {
          var info = {};
          info.security_groups = resource.getSecurityGroups();
          info.application_security_groups = resource.getApplicationSecurityGroups();
          info.route_tables = resource.getRouteTables();

          return info;
        };

        resource.getIpConfigurations = function() {
          return environment.connectedTo(this, "Resources::Azure::Network::NetworkInterface::IpConfiguration");
        };

        resource.getApplicationSecurityGroups = function() {
          return environment.connectedTo(this, "Resources::Azure::Network::ApplicationSecurityGroup");
        };

        resource.getSecurityGroups = function() {
          var security_groups = environment.connectedTo(this, "Resources::Azure::Network::NetworkSecurityGroup");

          _.each(this.getIpConfigurations(), function(ip_conf){
            var network_interface = ip_conf.getNetworkInterface();
            if(network_interface) {
              security_groups.push(network_interface.getSecurityGroups());
            }
          });

          return _.uniq(_.flatten(security_groups));
        };

        resource.getRouteTables = function() {
          return environment.connectedTo(this, "Resources::Azure::Network::RouteTable");
        };

        resource.getVirtualMachines = function() {
          return _.uniq(environment.connectedTo(this, "Resources::Azure::Compute::VirtualMachine"));
        };

        resource.getLoadBalancers = function() {
          return environment.connectedTo(this, "Resources::Azure::Network::LoadBalancer").concat(
            environment.connectedTo(this, "Resources::Azure::Network::ApplicationGateway")
          );
        };

        resource.getBatchPools = function() {
          return environment.connectedTo(this, "Resources::Azure::Batch::Pool");
        };

        resource.getPrivateEndpoints = function() {
          return environment.connectedTo(this, "Resources::Azure::Network::PrivateEndpoint");
        };

        return resource;
      }
    }
  }]);
