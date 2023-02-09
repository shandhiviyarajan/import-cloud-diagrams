angular.module('designer.model.resources.azure.network.application_gateway.request_routing_rule', ['designer.model.resource'])
  .factory('Azure_ApplicationGateway_RequestRoutingRule', ["Resource", function (Resource) {
    return {
      load: function (resource, environment) {
        resource = Resource.load(resource, environment);

        resource.info = function () {
          var info = {};

          return info;
        };

        return resource;
      }
    }
  }]);
