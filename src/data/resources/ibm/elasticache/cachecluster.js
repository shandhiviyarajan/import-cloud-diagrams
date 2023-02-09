angular.module('designer.model.resources.ibm.elasticache.cache_cluster', ['designer.model.resource'])
  .factory('IBM_ElastiCacheCacheCluster', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'ELASTIC CACHE';
        resource.status = resource.cache_cluster_status;

        resource.info = function() {
          var info = {};

          info.nodes = this.getNodes();

          return info;
        };

        resource.getNodes = function() {
          return environment.connectedTo(this, "Resources::IBM::ElastiCache::CacheNode");
        };

        resource.highlightableConnections = function() {
          return this.getNodes();
        };

        return resource;
      }
    }
  }]);
