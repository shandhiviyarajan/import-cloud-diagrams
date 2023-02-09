angular.module('designer.model.resources.aws.ec2.transitgatewayvpcattachment', ['designer.model.resource'])
.factory('AWS_TransitGatewayVPCAttachment', ["Resource", function(Resource) {
  return {
    load: function(resource, environment) {
      resource = Resource.load(resource, environment);
      resource.type_name = 'TRANSIT GATEWAY VPC ATTACHMENT';
      resource.status_list = {
        "initiatingRequest": "warn",
        "pendingAcceptance": "warn",
        "rollingBack": "warn",
        "pending": "warn",
        "available": "good",
        "modifying": "warn",
        "deleting": "warn",
        "deleted": "stopped",
        "failed": "bad",
        "rejected": "bad",
        "rejecting": "bad",
        "failing": "bad"
      };

      resource.info = function() {
        var info = {};

        info.transit_gateway = this.getTransitGateway();
        info.vpc = this.getVPC();
        info.subnets = this.getSubnets();

        return info;
      };

      resource.getTransitGateway = function() {
        return environment.connectedTo(this, "Resources::AWS::EC2::TransitGateway")[0];
      };

      resource.getVPC = function() {
        return environment.connectedTo(this, "Resources::AWS::EC2::VPC")[0];
      };

      resource.getSubnets = function() {
        return environment.connectedTo(this, "Resources::AWS::EC2::Subnet");
      };

      return resource;
    }
  }
}]);
