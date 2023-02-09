angular.module('designer.model.resources.ibm.ec2.transitgatewayroutetable', ['designer.model.resource'])
.factory('IBM_TransitGatewayRouteTable', ["Resource", function(Resource) {
  return {
    load: function(resource, environment) {
      resource = Resource.load(resource, environment);
      resource.status_list = {
        "pending": "warn",
        "available": "good",
        "deleting": "warn",
        "deleted": "stopped"
      };

      resource.type_name = 'TRANSIT GATEWAY ROUTE TABLE';
      
      resource.info = function() {
        var info = {};

        info.transit_gateway = this.getTransitGateway();

        return info;
      };

      resource.getTransitGateway = function() {
        return environment.connectedTo(this, "Resources::IBM::EC2::TransitGateway")[0];
      };

      return resource;
    }
  }
}]);
