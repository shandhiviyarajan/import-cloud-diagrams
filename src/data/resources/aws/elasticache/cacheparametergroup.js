angular.module('designer.model.resources.aws.elasticache.parameter_group', ['designer.model.resource'])
  .factory('AWS_ElastiCacheParameterGroup', ["Resource", function(Resource) {
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
