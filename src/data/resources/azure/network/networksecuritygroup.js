angular.module('designer.model.resources.azure.network.network_security_group', ['designer.model.resource'])
  .factory('Azure_NetworkSecurityGroup', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'NETWORK SECURITY GROUP';

        resource.info = function() {
          var info = {};

          // Compile dem rules!
          info.subnets = resource.getSubnets();
          info.rules = resource.getRules();

          // Nics they is connected to!
          // TODO: can also connect directly to scale set vms
          var nics = [];
          _.each(this.getNetworkInterfaces(), function(nic) {
            var nic_info = nic;

            // Attach the ip address and such ...
            nic_info.vm = nic.getVirtualMachine();
            nic_info.ip_config = nic.getIpConfigurations();

            nics.push(nic_info);
          });
          info.nics = _.uniq(nics);

          return info;
        };

        resource.getRules = function() {
          var rules = { inbound: [], outbound: [] };
          var security_rules = this.getSecurityRules();

          _.each(security_rules, function(rule) {
            var rule_info = rule.formatSecurityRule();
            
            if(rule.direction == "Inbound") {
              rules.inbound.push(rule_info);
            }
            else {
              rules.outbound.push(rule_info);
            }
          });
          return rules;
        };

        resource.getSecurityRules = function() {
          return environment.connectedTo(this, "Resources::Azure::Network::NetworkSecurityGroup::SecurityRule");
        };

        resource.getSubnets = function() {
          return environment.connectedTo(this, "Resources::Azure::Network::Subnet");
        };

        resource.getNetworkInterfaces = function() {
          return environment.connectedTo(this, "Resources::Azure::Network::NetworkInterface");
        };

        return resource;
      }
    }
  }]);
