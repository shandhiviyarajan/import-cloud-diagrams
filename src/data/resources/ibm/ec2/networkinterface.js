angular.module('designer.model.resources.ibm.ec2.network_interface', ['designer.model.resource'])
  .factory('IBM_NetworkInterface', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'NETWORK INTERFACE';

        resource.info = function() {
          var info = {};

          info.instance = this.getInstance();
          info.subnet = this.getSubnet();
          info.address = this.getAddress();
          info.route_tables = this.getRouteTables();
          info.security_groups = this.getSecurityGroups();
          info.nat_gateway = this.getNATGateway();
          info.primary_ip_address = this.getPrimaryPrivateIP();
          info.secondary_ip_addresses = this.getSecondaryPrivateIPs();

          return info;
        };

        resource.getPrimaryPrivateIP = function() {
          return _.find(this.private_ip_addresses, function(ip) { return ip["primary"] });
        };

        resource.getSecondaryPrivateIPs = function() {
          return _.filter(this.private_ip_addresses, function(ip) { return !ip["primary"] });
        };

        resource.getInstance = function() {
          return environment.connectedTo(this, "Resources::IBM::EC2::Instance")[0];
        };

        resource.getSubnet = function() {
          return environment.connectedTo(this, "Resources::IBM::EC2::Subnet")[0];
        };

        resource.getAddress = function() {
          return environment.connectedTo(this, "Resources::IBM::EC2::Address")[0];
        };

        resource.getRouteTables = function() {
          return environment.connectedTo(this, "Resources::IBM::EC2::RouteTable");
        };

        resource.getSecurityGroups = function() {
          return environment.connectedTo(this, "Resources::IBM::EC2::SecurityGroup");
        };

        resource.getNATGateway = function() {
          return environment.connectedTo(this, "Resources::IBM::EC2::NATGateway")[0];
        };

        return resource;
      }
    }
  }]);
