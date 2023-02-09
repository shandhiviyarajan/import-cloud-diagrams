angular.module('designer.model.resources.aws.direct_connect.virtual_interface', ['designer.model.resource'])
  .factory('AWS_VirtualInterface', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'VIRTUAL INTERFACE';
        resource.status_list = {
          "confirming": "warn",
          "verifying": "warn",
          "pending": "warn",
          "available": "good",
          "down": "bad",
          "deleting": "warn",
          "deleted": "stopped",
          "rejected": "bad",
          "unknown":  "warn",
        };

        resource.info = function() {
          var info = {};

          info.vpn_gateways = this.getVPNGateway();
          info.connection = this.getConnection();
          info.lag = this.getLAG();

          return info;
        };

        resource.getVPNGateway = function() {
          return environment.connectedTo(this, "Resources::AWS::EC2::VPNGateway");
        };

        resource.getConnection = function() {
          return environment.connectedTo(this, "Resources::AWS::DirectConnect::Connection")[0];
        };

        resource.getLAG = function() {
          return environment.connectedTo(this, "Resources::AWS::DirectConnect::LAG")[0];
        };

        return resource;
      }
    }
  }]);
