angular.module('designer.model.resources.azure.network.network_interface', ['designer.model.resource'])
  .factory('Azure_NetworkInterface', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'NETWORK INTERFACE';

        resource.info = function() {
          var info = {};
          info.security_groups = resource.getSecurityGroups();
          info.virtual_machine = resource.getVirtualMachine();
          info.subnets = resource.getSubnets();
          info.ip_configurations = resource.getIpConfigurations();
          info.private_endpoints = resource.getPrivateEndpoints();
          info.app_security_groups = [];

          var public_ip_addresses = [];
          _.each(info.ip_configurations, function(ip_conf){
            public_ip_addresses.push(ip_conf.getPublicIpAddress());
            var app_sg = ip_conf.getApplicationSecurityGroup();
            if (app_sg) info.app_security_groups.push(app_sg);
          });

          info.public_ip_addresses = _.uniq(_.flatten(public_ip_addresses));

          return info;
        };

        resource.getSecurityGroups = function() {
          return environment.connectedTo(this, "Resources::Azure::Network::NetworkSecurityGroup");
        };

        resource.getVirtualMachine = function() {
          return environment.connectedTo(this, "Resources::Azure::Compute::VirtualMachine")[0];
        };
        
        resource.getIpConfigurations = function() {
          return environment.connectedTo(this, "Resources::Azure::Network::NetworkInterface::IpConfiguration");
        };

        resource.getSubnets = function() {
          return environment.connectedTo(this, "Resources::Azure::Network::Subnet");
        };

        resource.getPrivateEndpoints = function() {
          return environment.connectedTo(this, "Resources::Azure::Network::PrivateEndpoint");
        };

        resource.hasIPMatch = function(ip) {
          var matched = false;

          _.each(this.getIpConfigurations(), function(ip_config) {
            if(ip_config.private_ipaddress.lastIndexOf(ip, 0) === 0) {
              matched = true;
            }

            _.each(ip_config.public_ip_address, function(public_ip) {
              if(public_ip.ip_address.lastIndexOf(ip, 0) === 0) {
                matched = true;
              }
            }.bind(this));
          });

          return matched;
        };

        return resource;
      }
    }
  }]);
