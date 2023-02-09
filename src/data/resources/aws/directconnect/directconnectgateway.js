angular.module('designer.model.resources.aws.direct_connect.direct_connect_gateway', ['designer.model.resource'])
  .factory('AWS_DirectConnectGateway', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'DIRECT CONNECT GATEWAY';
        resource.status_list = {
          "available": "good",
          "associated": "good"
        };

        resource.info = function() {
          var info = {};

          info.virtual_interface = this.getVirtualInterface();
          info.gateway_associations = _.map(this.getDirectConnectGatewayAssociations(), function(association) {
            association.associated_resource = association.getVPNGateway() || association.getTransitGateway();

            return association;
          }.bind(this));

          return info;
        };

        resource.getVirtualInterface = function() {
          return environment.connectedTo(this, "Resources::AWS::DirectConnect::VirtualInterface")[0];
        };

        resource.getDirectConnectGatewayAssociations = function() {
          return environment.connectedTo(this, "Resources::AWS::DirectConnect::DirectConnectGatewayAssociation");
        };

        resource.getConnectables = function() {
          var connectables = [];

          _.each(this.getDirectConnectGatewayAssociations(), function(association) {
            var connectable = association.getVPNGateway() || association.getTransitGateway();
            if (connectable) {
              connectables.push(connectable);
            }
          });

          return connectables;
        };

        return resource;
      }
    }
  }]);
