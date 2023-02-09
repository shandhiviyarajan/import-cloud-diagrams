angular.module('designer.model.resources.azure.network.load_balancer.probe', ['designer.model.resource'])
  .factory('Azure_LoadBalancer_Probe', ["Resource", function (Resource) {
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
