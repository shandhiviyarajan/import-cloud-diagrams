angular.module('designer.model.resources.azure.network.load_balancer.rule', ['designer.model.resource'])
  .factory('Azure_LoadBalancer_Rule', ["Resource", function (Resource) {
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
