angular.module('designer.model.resources.aws.ec2.customer_gateway', ['designer.model.resource'])
  .factory('AWS_CustomerGateway', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'CUSTOMER GATEWAY';
        resource.status_list = {
          "available": "good",
          "pending": "warn",
          "deleting": "warn",
          "deleted": "stopped"
        };
        
        resource.info = function() {
          var info = {};

          info.vpn_connection = this.getVPNConnection();

          return info;
        };

        resource.getVPNConnection = function() {
          return environment.connectedTo(this, "Resources::AWS::EC2::VPNConnection")[0];
        };

        return resource;
      }
    }
  }]);
