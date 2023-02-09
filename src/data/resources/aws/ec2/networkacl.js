angular.module('designer.model.resources.aws.ec2.network_acl', ['designer.model.resource', 'designer.model.helpers.protocols'])
.factory('AWS_NetworkACL', ["Resource", "ProtocolHelpers", function(Resource, ProtocolHelpers) {
  return {
    load: function(resource, environment) {
      resource = Resource.load(resource, environment);
      resource.type_name = 'NETWORK ACL';

      resource.info = function() {
        var info = {};

        if(this.entries.length > 0) {
          info.entries = { inbound: [], outbound: [] };

          _.each(this.entries, function(entry) {
            // Convert entry into fields we can show
            var parsed_entry = {
              rule_number: entry.rule_number === 32767 ? "*" : entry.rule_number,
              rule_action: entry.rule_action,
              cidr_block: entry.cidr_block,
              icmp_type_code: entry.icmp_type_code,
              port_range: this.formatPortRange(entry.port_range),
              protocol: ProtocolHelpers.protocolNumberToName(entry.protocol)
            };

            if(entry.egress) {
              info.entries.outbound.push(parsed_entry);
            }
            else {
              info.entries.inbound.push(parsed_entry);
            }
          }.bind(this));
        }

        info.subnets = this.getSubnets();

        return info;
      };

      resource.formatPortRange = function(range) {
        if (range) {
          if (range["from"] === range["to"]) {
            return range["from"];
          }
          else {
            return range["from"] + " to " + range["to"];
          }
        }

        return "all";
      };

      resource.getSubnets = function() {
        return environment.connectedTo(this, "Resources::AWS::EC2::Subnet");
      };

      resource.highlightableConnections = function() {
        return this.getSubnets();
      };

      return resource;
    }
  }
}]);
