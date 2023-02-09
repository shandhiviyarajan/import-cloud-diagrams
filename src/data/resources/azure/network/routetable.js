angular.module('designer.model.resources.azure.network.route_table', ['designer.model.resource'])
  .factory('Azure_RouteTable', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'ROUTE TABLE';

        resource.info = function() {
          var info = {};
          info.subnets = resource.getSubnets()
          info.routes = resource.getRoutes()

          return info;
        };

        resource.getSubnets = function() {
          return environment.connectedTo(this, "Resources::Azure::Network::Subnet");
        };

        resource.getRoutes = function() {
          return environment.connectedTo(this, "Resources::Azure::Network::Route");
        };

        return resource;
      }
    }
  }]);
