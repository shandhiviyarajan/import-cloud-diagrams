angular.module('designer.model.resources.aws.direct_connect.direct_connect_gateway_association', ['designer.model.resource'])
  .factory('AWS_DirectConnectGatewayAssociation', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'DIRECT CONNECT GATEWAY ASSOCIATION';
        resource.status_list = {
          "associating": "warn",
          "associated": "good",
          "disassociating": "warn",
          "disassociated": "stopped"
        };

        resource.info = function() {
          var info = {};

          info.direct_connect_gateway = this.getDirectConnectGateway();
          info.vpn_gateway = this.getVPNGateway();

          return info;
        };

        resource.getDirectConnectGateway = function() {
          return environment.connectedTo(this, "Resources::AWS::DirectConnect::DirectConnectGateway")[0];
        };

        resource.getVPNGateway = function() {
          return environment.connectedTo(this, "Resources::AWS::EC2::VPNGateway")[0];
        };

        resource.getTransitGateway = function() {
          return environment.connectedTo(this, "Resources::AWS::EC2::TransitGateway")[0];
        };

        return resource;
      }
    }
  }]);
