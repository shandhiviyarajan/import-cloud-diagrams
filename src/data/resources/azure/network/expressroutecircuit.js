angular.module('designer.model.resources.azure.network.express_route_circuit', ['designer.model.resource'])
  .factory('Azure_ExpressRouteCircuit', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'EXPRESS ROUTE CIRCUIT';
        resource.status = resource.provisioning_state;
        resource.status_list = {
          "deleting": "warn",
          "succeeded": "good",
          "updating": "warn",
          "failed": "bad"
        };

        resource.info = function() {
          var info = {};

          info.peerings = resource.getPeerings();

          return info;
        };

        resource.getPeerings = function() {
          return environment.connectedTo(this, "Resources::Azure::Network::ExpressRouteCircuit::Peering");
        };

        return resource;
      }
    }
  }]);
