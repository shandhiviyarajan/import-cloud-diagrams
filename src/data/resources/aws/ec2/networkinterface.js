angular.module('designer.model.resources.aws.ec2.network_interface', ['designer.model.resource'])
  .factory('AWS_NetworkInterface', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'NETWORK INTERFACE';
        resource.status_list = {
          "in-use": "good",
          "available": "good",
          "attached": "good",
          "pending": "warn",
          "attaching": "warn",
          "detaching": "warn",
          "detached": "stopped",
        };

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
          return environment.connectedTo(this, "Resources::AWS::EC2::Instance")[0];
        };

        resource.getSubnet = function() {
          return environment.connectedTo(this, "Resources::AWS::EC2::Subnet")[0];
        };

        resource.getAddress = function() {
          return environment.connectedTo(this, "Resources::AWS::EC2::Address")[0];
        };

        resource.getRouteTables = function() {
          return environment.connectedTo(this, "Resources::AWS::EC2::RouteTable");
        };

        resource.getSecurityGroups = function() {
          return environment.connectedTo(this, "Resources::AWS::EC2::SecurityGroup");
        };

        resource.getNATGateway = function() {
          return environment.connectedTo(this, "Resources::AWS::EC2::NATGateway")[0];
        };

        return resource;
      }
    }
  }]);
