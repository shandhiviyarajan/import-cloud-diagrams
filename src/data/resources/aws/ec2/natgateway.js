angular.module('designer.model.resources.aws.ec2.nat_gateway', ['designer.model.resource'])
  .factory('AWS_NATGateway', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'NAT GATEWAY';
        resource.status_list = {
          "available": "good",
          "pending": "warn",
          "deleting": "warn",
          "failed": "bad",
          "deleted": "stopped"
        };

        resource.info = function() {
          var info = {};

          info.address = this.getAddress();
          info.network_interfaces = _.map(this.getNetworkInterfaces(), function(nic) {
            nic.instance = nic.getInstance();

            return nic;
          });

          return info;
        };

        resource.getExtendedInformation = function() {
          var address = this.getAddress();
          var info = {
            info1: this.provider_id,
            info2: null,
            info3: null
          };

          if (address) {
            info.info2 = address.private_ip_address;
            info.info3 = address.public_ip;
          }

          return info;
        };

        resource.getNetworkInterfaces = function() {
          return environment.connectedTo(this, "Resources::AWS::EC2::NetworkInterface");
        };

        resource.getAddress = function() {
          return environment.connectedTo(this, "Resources::AWS::EC2::Address")[0];
        };

        // We can match on address ip for nat gateway
        resource.hasIPMatch = function(ip) {
          var address = this.getAddress();
          var matched = false;

          if(address) {
            if(address.public_ip.lastIndexOf(ip, 0) === 0)          matched = true;
            if(address.private_ip_address.lastIndexOf(ip, 0) === 0) matched = true;
          }

          return matched;
        };

        return resource;
      }
    }
  }]);
