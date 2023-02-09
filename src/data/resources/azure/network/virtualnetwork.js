angular.module('designer.model.resources.azure.network.virtual_network', ['designer.model.resource'])
  .factory('Azure_VirtualNetwork', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'VIRTUAL NETWORK';

        resource.info = function() {
          var info = {};

          info.subnets = this.getSubnets();
          info.application_security_groups = this.getApplicationSecurityGroups();

          return info;
        };

        resource.getSubnets = function() {
          return environment.connectedTo(this, "Resources::Azure::Network::Subnet");
        };

        resource.getApplicationSecurityGroups = function() {
          var app_security_groups = [];

          _.each(this.getSubnets(), function(subnet){
              app_security_groups.push(subnet.getApplicationSecurityGroups());
          });

          return _.uniq(_.flatten(app_security_groups));
        };

        resource.getVirtualNetworkGateways = function() {
          return environment.connectedTo(this, "Resources::Azure::Network::VirtualNetworkGateway");
        };

        resource.getLocalNetworkGateways = function() {
          return environment.connectedTo(this, "Resources::Azure::Network::LocalNetworkGateway");
        };

        resource.getFirewalls = function() {
          return environment.connectedTo(this, "Resources::Azure::Network::Firewall");
        };

        resource.getVirtualNetworkPeeringConnections = function() {
          return _.uniq(environment.connectedTo(this, "Resources::Azure::Network::VirtualNetworkPeering"));
        };

        resource.hasIPMatch = function(ip) {
          var matched = false;

          _.each(this.address_space_prefix, function(address) {
            if(address.lastIndexOf(ip, 0) === 0) {
              this.matched_search = true;
            }
          });

          return matched;
        };

        return resource;
      }
    }
  }]);
