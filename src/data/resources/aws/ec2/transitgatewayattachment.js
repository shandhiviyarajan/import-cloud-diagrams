angular.module('designer.model.resources.aws.ec2.transitgatewayattachment', ['designer.model.resource'])
.factory('AWS_TransitGatewayAttachment', ["Resource", function(Resource) {
  return {
    load: function(resource, environment) {
      resource = Resource.load(resource, environment);
      resource.type_name = 'TRANSIT GATEWAY ATTACHMENT';
      resource.status_list = {
        "pendingAcceptance": "warn",
        "rollingBack": "warn",
        "pending": "warn",
        "available": "good",
        "modifying": "warn",
        "deleting": "warn",
        "deleted": "stopped",
        "failed": "bad",
        "rejected": "bad",
        "rejecting": "warn",
        "failing": "bad",
        "initiatingRequest": "warn"
      };

      resource.tgw_association_status_list = {
        "associating": "warn",
        "associated": "good",
        "disassociating": "warn",
        "disassociated": "bad"
      };

      resource.info = function() {
        var info = {};

        info.attached_to = this.getVPNConnection() || this.getDirectConnectGateway();
        info.transit_gateway = this.getTransitGateway();
        info.associated_route_table = this.getAssociatedTransitGatewayRouteTable();

        return info;
      };

      resource.getAssociatedTransitGatewayRouteTable = function() {
        return environment.connectedTo(this, "Resources::AWS::EC2::TransitGatewayRouteTable")[0];
      };

      resource.getDirectConnectGateway = function() {
        return environment.connectedTo(this, "Resources::AWS::DirectConnect::DirectConnectGateway")[0];
      };

      resource.getVPNConnection = function() {
        return environment.connectedTo(this, "Resources::AWS::EC2::VPNConnection")[0];
      };

      resource.getTransitGateway = function() {
        return environment.connectedTo(this, "Resources::AWS::EC2::TransitGateway")[0];
      };

      return resource;
    }
  }
}]);
