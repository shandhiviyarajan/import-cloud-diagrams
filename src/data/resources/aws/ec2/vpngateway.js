angular.module('designer.model.resources.aws.ec2.vpn_gateway', ['designer.model.resource'])
  .factory('AWS_VpnGateway', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'VPN GATEWAY';
        resource.status_list = {
          "pending": "warn",
          "available": "good",
          "deleting": "warn",
          "deleted": "stopped"
        };

        resource.info = function() {
          var info = {};

          info.vpn_connections = this.getVPNConnections();
          info.gateway_associations = _.map(this.getDirectConnectGatewayAssociations(), function(association) {
            association.dc_gateway = association.getDirectConnectGateway();

            return association;
          }.bind(this));

          return info;
        };

        resource.getVPNConnections = function() {
          return environment.connectedTo(this, "Resources::AWS::EC2::VPNConnection");
        };

        resource.getDirectConnectGatewayAssociations = function() {
          return environment.connectedTo(this, "Resources::AWS::DirectConnect::DirectConnectGatewayAssociation");
        };
        
        return resource;
      }
    }
  }]);
