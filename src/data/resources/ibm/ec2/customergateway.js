angular.module('designer.model.resources.ibm.ec2.customer_gateway', ['designer.model.resource'])
  .factory('IBM_CustomerGateway', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'CUSTOMER GATEWAY';

        resource.info = function() {
          var info = {};

          info.vpn_connection = this.getVPNConnection();

          return info;
        };

        resource.getVPNConnection = function() {
          return environment.connectedTo(this, "Resources::IBM::EC2::VPNConnection")[0];
        };

        return resource;
      }
    }
  }]);
