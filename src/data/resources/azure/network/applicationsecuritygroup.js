angular.module('designer.model.resources.azure.network.application_security_group', ['designer.model.resource'])
  .factory('Azure_ApplicationSecurityGroup', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'APPLICATION SECURITY GROUP';
        resource.status_list = {
          "deleting": "warn",
          "succeeded": "good",
          "updating": "warn",
          "failed": "bad"
        };
        
        resource.status = resource.provisioning_state;

        resource.info = function() {
          var info = {};

          info.rule_nsgs = resource.getRulesNetworkSecurityGroups();
          
          info.ip_configurations = _.map(resource.getIpConfigurations(), function(ip_conf) {
            ip_conf.nic = ip_conf.getNetworkInterface();
            ip_conf.vm = ip_conf.getVirtualMachine();

            return ip_conf;
          });

          return info;
        };

        resource.getSecurityRules = function() {
          return environment.connectedTo(this, "Resources::Azure::Network::NetworkSecurityGroup::SecurityRule");
        };

        resource.getIpConfigurations = function() {
          return environment.connectedTo(this, "Resources::Azure::Network::NetworkInterface::IpConfiguration");
        };

        resource.getVirtualMachines = function() {
          var vms = [];
          var ip_confs = this.getIpConfigurations();

          _.each(ip_confs, function(ip_conf) {
            vms.push(ip_conf.getVirtualMachine());
          });
          return vms;
        };

        resource.getRulesNetworkSecurityGroups = function() {
          var security_rules = this.getSecurityRules();
          var rules = [];

          _.each(security_rules, function(security_rule) {
            var rule_info = security_rule.formatSecurityRule();
            rule_info.nsg = security_rule.getNetworkSecurityGroup();
            rules.push(rule_info);
          });
          return rules;
        };

        resource.highlightableConnections = function() {
          return this.getVirtualMachines();
        };

        return resource;
      }
    }
  }]);
