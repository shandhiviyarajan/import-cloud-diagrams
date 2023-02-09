angular.module('designer.model.resources.azure.network.network_security_group.security_rule', ['designer.model.resource'])
  .factory('Azure_NetworkSecurityGroup_SecurityRule', ["Resource", function (Resource) {
    return {
      load: function (resource, environment) {
        resource = Resource.load(resource, environment);

        resource.info = function () {
          var info = {};
          
          return info;
        };

        resource.getAppSecurityGroups = function() {
          return environment.connectedTo(this, "Resources::Azure::Network::ApplicationSecurityGroup");
        };

        resource.getNetworkSecurityGroup = function() {
          return environment.connectedTo(this, "Resources::Azure::Network::NetworkSecurityGroup")[0];
        };

        resource.formatSecurityRule = function() {
            // Compile it for display
          var rule_info = {};
          rule_info.name = this.name;
          rule_info.priority = this.priority;
          rule_info.action = this.access;
          rule_info.source = this.source_address_prefix == "*" ? "Any" : this.source_address_prefix;
          rule_info.destination = this.destination_address_prefix == "*" ? "Any" : this.destination_address_prefix;

          if(!rule_info.source || !rule_info.destination) {
            var app_sgs = this.getAppSecurityGroups();
            _.each(app_sgs, function(app_sg) {
              if (this.source_application_security_group_id && this.source_application_security_group_id.toLowerCase() === app_sg.provider_id)
                rule_info.app_sg_source = app_sg;
              if (this.destination_application_security_group_id && this.destination_application_security_group_id.toLowerCase() === app_sg.provider_id)
                rule_info.app_sg_destination = app_sg;
            }.bind(this));
          }
          if(this.direction == "Inbound") {
            var destination_port = this.destination_port_range ? this.destination_port_range : this.destination_port_ranges.join();
            rule_info.service = this.destination_port_range == "*" ? "Any" : this.protocol + "/" + destination_port;
          } else {
            var source_port = this.source_port_range ? this.source_port_range : this.source_port_ranges.join();
            rule_info.service = this.source_port_range == "*" ? "Any" : this.protocol + "/" + source_port;
          }

          return rule_info;
        }

        return resource;
      }
    }
  }]);
