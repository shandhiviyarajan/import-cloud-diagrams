angular.module('designer.model.resources.ibm.ec2.vpn_gateway', ['designer.model.resource'])
  .factory('IBM_VpnGateway', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'VPN GATEWAY';

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
          return environment.connectedTo(this, "Resources::IBM::EC2::VPNConnection");
        };

        resource.getDirectConnectGatewayAssociations = function() {
          return environment.connectedTo(this, "Resources::IBM::DirectConnect::DirectConnectGatewayAssociation");
        };
        
        return resource;
      }
    }
  }]);
