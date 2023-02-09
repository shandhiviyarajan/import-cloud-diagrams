angular.module('designer.model.resources.ibm.ec2.vpn_connection', ['designer.model.resource'])
  .factory('IBM_VpnConnection', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'VPN CONNECTION';

        resource.info = function() {
          var info = {};

          info.vpn_gateway = this.getVPNGateway();
          info.customer_gateway = this.getCustomerGateway();

          return info;
        };

        resource.getVPNGateway = function() {
          return environment.connectedTo(this, "Resources::IBM::EC2::VPNGateway")[0];
        };

        resource.getCustomerGateway = function() {
          return environment.connectedTo(this, "Resources::IBM::EC2::CustomerGateway")[0];
        };

        return resource;
      }
    }
  }]);
