angular.module('designer.model.resources.ibm.ec2.transitgateway', ['designer.model.resource'])
.factory('IBM_TransitGateway', ["Resource", function(Resource) {
  return {
    load: function(resource, environment) {
      resource = Resource.load(resource, environment);
      resource.type_name = 'TRANSIT GATEWAY';

      resource.status_list = {
        "pending": "warn",
        "available": "good",
        "modifying": "warn",
        "deleting": "warn",
        "deleted": "stopped"
      };

      resource.info = function() {
        var info = {};

        info.attachments = this.getTransitGatewayAttachments();

        // We'll reference route tables using values from resource.options
        info.route_tables = {};
        _.each(this.getTransitGatewayRouteTables(), function(rt) {
          info.route_tables[rt.provider_id] = rt;
        });

        return info;
      };

      resource.getTransitGatewayRouteTables = function() {
        return environment.connectedTo(this, "Resources::IBM::EC2::TransitGatewayRouteTable");
      };

      resource.getTransitGatewayAttachments = function() {
        return environment.connectedTo(this, "Resources::IBM::EC2::TransitGatewayAttachment").
          concat(environment.connectedTo(this, "Resources::IBM::EC2::TransitGatewayVPCAttachment"));
      };

      resource.getConnectables = function() {
        var connected = [];

        _.each(environment.connectedTo(this, "Resources::IBM::EC2::TransitGatewayAttachment"), function(attachment) {
          var c = attachment.getVPNConnection();
          if(c) {
            var gateway = c.getCustomerGateway();
            if (gateway)
              connected.push(gateway);
          }
        });

        return connected;
      };

      return resource;
    }
  }
}]);
