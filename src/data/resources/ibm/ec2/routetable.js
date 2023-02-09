angular.module('designer.model.resources.ibm.ec2.route_table', ['designer.model.resource'])
  .factory('IBM_RouteTable', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'ROUTE TABLE';

        resource.route_status_list = {
          "active": "good",
          "blackhole": "bad"
        };

        resource.info = function() {
          var info = {};

          info.subnets = this.getSubnets();

          var connections = environment.connectedTo(this);
          info.connection_ids = {
            egress_only_internet_gateway_id: "egress_only_internet_gateway",
            gateway_id: "gateway",
            instance_id: "instance",
            nat_gateway_id: "nat_gateway",
            transit_gateway_id: "transit_gateway",
            network_interface_id: "network_interface",
            vpc_peering_connection_id: "vpc_peering_connection"
          };

          info.routes = _.map(this.routes, function(route) {
            _.each(info.connection_ids, function(property_value, property_id) {
              if (route[property_id]) {
                route[property_value] = _.find(connections, function(c) { return c.provider_id === route[property_id] } );
              }
            });

            return route;
          }.bind(this));

          return info;
        };

        resource.getVpc = function() {
          return environment.connectedTo(this, "Resources::IBM::EC2::VPC")[0];
        };

        resource.getSubnets = function() {
          return environment.connectedTo(this, "Resources::IBM::EC2::Subnet");
        };

        resource.highlightableConnections = function() {
          var types = [
            "Resources::IBM::EC2::NetworkInterface",
            "Resources::IBM::EC2::NATGateway",
            "Resources::IBM::EC2::Instance",
            "Resources::IBM::EC2::Subnet",
            "Resources::IBM::EC2::InternetGateway",
            "Resources::IBM::EC2::EgressOnlyInternetGateway",
            "Resources::IBM::EC2::VPCEndpoint",
            "Resources::IBM::EC2::VPCPeeringConnection",
            "Resources::IBM::EC2::VPNGateway"
          ];
          var connectables = _.map(types, function(type) { return environment.connectedTo(this, type) }.bind(this));

          return _.flatten(connectables);
        };

        return resource;
      }
    }
  }]);
