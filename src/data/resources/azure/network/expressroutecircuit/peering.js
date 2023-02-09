angular.module('designer.model.resources.azure.network.express_route_circuit.peering', ['designer.model.resource'])
  .factory('Azure_ExpressRouteCircuit_Peering', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'EXPRESS ROUTE CIRCUIT PEERING';
        resource.status_list = {
          "disabled": "stopped",
          "enabled": "good"
        };
        
        resource.info = function() {
          var info = {};

          info.express_route = resource.getExpressRoute();

          return info;
        };

        resource.getExpressRoute = function() {
          return environment.connectedTo(this, "Resources::Azure::Network::ExpressRouteCircuit")[0];
        };

        return resource;
      }
    }
  }]);
