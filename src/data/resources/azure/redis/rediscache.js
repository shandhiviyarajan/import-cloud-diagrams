angular.module('designer.model.resources.azure.redis.redis_cache', ['designer.model.resource'])
  .factory('Azure_RedisCache', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'REDIS CACHE';

        resource.info = function() {
          var info = {};

          return info;
        };

        return resource;
      }
    }
  }]);
