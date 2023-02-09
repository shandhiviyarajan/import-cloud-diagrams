angular.module('designer.model.resources.ibm.elasticache.parameter_group', ['designer.model.resource'])
  .factory('IBM_ElastiCacheParameterGroup', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);

        resource.info = function() {
          var info = {};

          return info;
        };

        return resource;
      }
    }
  }]);
